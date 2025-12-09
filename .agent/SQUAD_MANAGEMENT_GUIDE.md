# Quick Reference: Managing Match Squads (11-15 Players)

## 🎯 The Solution: `match_players` Table with `is_playing11` Flag

Your existing `MatchPlayer` entity already solves your problem!

```typescript
@Entity('match_players')
export class MatchPlayer {
  @PrimaryColumn()
  match_id: number;

  @PrimaryColumn()
  player_id: number;

  @Column()
  team_id: number;

  @Column({ default: false })
  is_playing11: boolean;  // ← THIS IS THE KEY!

  @Column({ length: 50, nullable: true })
  role: string;

  @CreateDateColumn()
  createdAt: Date;
}
```

---

## 📝 Code Examples

### 1. Add Squad to a Match (11 Playing + 4 Substitutes)

```typescript
import { AppDataSource } from '../config/db';
import { MatchPlayer } from '../entities/MatchPlayer';

const matchPlayerRepository = AppDataSource.getRepository(MatchPlayer);

async function addSquadToMatch(matchId: number, teamId: number) {
  const squad = [
    // Playing 11
    { player_id: 1, is_playing11: true, role: 'opener' },
    { player_id: 2, is_playing11: true, role: 'opener' },
    { player_id: 3, is_playing11: true, role: 'middle order' },
    { player_id: 4, is_playing11: true, role: 'middle order' },
    { player_id: 5, is_playing11: true, role: 'middle order' },
    { player_id: 6, is_playing11: true, role: 'all-rounder' },
    { player_id: 7, is_playing11: true, role: 'wicketkeeper' },
    { player_id: 8, is_playing11: true, role: 'bowler' },
    { player_id: 9, is_playing11: true, role: 'bowler' },
    { player_id: 10, is_playing11: true, role: 'bowler' },
    { player_id: 11, is_playing11: true, role: 'bowler' },
    
    // Substitutes (Bench)
    { player_id: 12, is_playing11: false, role: 'substitute batsman' },
    { player_id: 13, is_playing11: false, role: 'substitute bowler' },
    { player_id: 14, is_playing11: false, role: 'substitute all-rounder' },
    { player_id: 15, is_playing11: false, role: 'substitute fielder' },
  ];

  const matchPlayers = squad.map(player => ({
    match_id: matchId,
    team_id: teamId,
    ...player
  }));

  await matchPlayerRepository.save(matchPlayers);
  
  console.log(`✅ Added ${matchPlayers.length} players to match ${matchId}`);
  console.log(`   - Playing 11: ${squad.filter(p => p.is_playing11).length}`);
  console.log(`   - Substitutes: ${squad.filter(p => !p.is_playing11).length}`);
}
```

---

### 2. Get Playing 11 for a Team

```typescript
async function getPlaying11(matchId: number, teamId: number) {
  const playing11 = await matchPlayerRepository.find({
    where: { 
      match_id: matchId, 
      team_id: teamId, 
      is_playing11: true 
    },
    relations: ['player'],
    order: { role: 'ASC' }
  });

  console.log(`Playing 11 for Team ${teamId}:`);
  playing11.forEach((mp, index) => {
    console.log(`${index + 1}. ${mp.player.full_name} (${mp.role})`);
  });

  return playing11;
}
```

---

### 3. Get Substitutes (Bench Players)

```typescript
async function getSubstitutes(matchId: number, teamId: number) {
  const substitutes = await matchPlayerRepository.find({
    where: { 
      match_id: matchId, 
      team_id: teamId, 
      is_playing11: false 
    },
    relations: ['player']
  });

  console.log(`Substitutes for Team ${teamId}:`);
  substitutes.forEach((mp, index) => {
    console.log(`${index + 1}. ${mp.player.full_name} (${mp.role})`);
  });

  return substitutes;
}
```

---

### 4. Get Full Squad (All Players)

```typescript
async function getFullSquad(matchId: number, teamId: number) {
  const allPlayers = await matchPlayerRepository.find({
    where: { match_id: matchId, team_id: teamId },
    relations: ['player'],
    order: { is_playing11: 'DESC' } // Playing 11 first
  });

  console.log(`\n📋 Full Squad for Team ${teamId} in Match ${matchId}:`);
  console.log(`\n🏏 Playing 11:`);
  allPlayers
    .filter(mp => mp.is_playing11)
    .forEach((mp, i) => console.log(`   ${i + 1}. ${mp.player.full_name} - ${mp.role}`));

  console.log(`\n🪑 Substitutes:`);
  allPlayers
    .filter(mp => !mp.is_playing11)
    .forEach((mp, i) => console.log(`   ${i + 1}. ${mp.player.full_name} - ${mp.role}`));

  return allPlayers;
}
```

---

### 5. Substitute a Player During Match

```typescript
async function substitutePlayer(
  matchId: number,
  teamId: number,
  playerOutId: number,
  playerInId: number
) {
  // Remove player from playing 11
  await matchPlayerRepository.update(
    { match_id: matchId, player_id: playerOutId },
    { is_playing11: false, role: 'substituted out' }
  );

  // Add substitute to playing 11
  await matchPlayerRepository.update(
    { match_id: matchId, player_id: playerInId },
    { is_playing11: true, role: 'substitute fielder' }
  );

  console.log(`✅ Substitution completed:`);
  console.log(`   OUT: Player ${playerOutId}`);
  console.log(`   IN:  Player ${playerInId}`);
}
```

---

### 6. Count Players in Squad

```typescript
async function getSquadCounts(matchId: number, teamId: number) {
  const [playing11Count, substituteCount] = await Promise.all([
    matchPlayerRepository.count({
      where: { match_id: matchId, team_id: teamId, is_playing11: true }
    }),
    matchPlayerRepository.count({
      where: { match_id: matchId, team_id: teamId, is_playing11: false }
    })
  ]);

  const totalSquad = playing11Count + substituteCount;

  console.log(`Squad Statistics for Match ${matchId}, Team ${teamId}:`);
  console.log(`  Playing 11: ${playing11Count}`);
  console.log(`  Substitutes: ${substituteCount}`);
  console.log(`  Total Squad: ${totalSquad}`);

  return { playing11Count, substituteCount, totalSquad };
}
```

---

### 7. Validate Squad Size

```typescript
async function validateSquad(matchId: number, teamId: number): Promise<boolean> {
  const counts = await getSquadCounts(matchId, teamId);

  const errors: string[] = [];

  if (counts.playing11Count !== 11) {
    errors.push(`❌ Playing 11 must be exactly 11 players (found: ${counts.playing11Count})`);
  }

  if (counts.totalSquad < 11 || counts.totalSquad > 15) {
    errors.push(`❌ Total squad must be 11-15 players (found: ${counts.totalSquad})`);
  }

  if (errors.length > 0) {
    console.error('Squad Validation Failed:');
    errors.forEach(err => console.error(err));
    return false;
  }

  console.log('✅ Squad validation passed!');
  return true;
}
```

---

### 8. API Controller Example

```typescript
// src/modules/v1/matches/matches.controller.ts

import { Request, Response } from 'express';
import { AppDataSource } from '../../../config/db';
import { MatchPlayer } from '../shared/entities/MatchPlayer';

export class MatchesController {
  
  // POST /api/v1/matches/:matchId/teams/:teamId/squad
  async addSquad(req: Request, res: Response) {
    try {
      const { matchId, teamId } = req.params;
      const { players } = req.body; // Array of { player_id, is_playing11, role }

      const matchPlayerRepo = AppDataSource.getRepository(MatchPlayer);

      // Validate squad size
      const playing11 = players.filter((p: any) => p.is_playing11);
      if (playing11.length !== 11) {
        return res.status(400).json({
          status: 400,
          message: 'Playing 11 must contain exactly 11 players',
          data: null
        });
      }

      if (players.length < 11 || players.length > 15) {
        return res.status(400).json({
          status: 400,
          message: 'Total squad must be between 11-15 players',
          data: null
        });
      }

      // Save squad
      const matchPlayers = players.map((p: any) => ({
        match_id: Number(matchId),
        team_id: Number(teamId),
        player_id: p.player_id,
        is_playing11: p.is_playing11,
        role: p.role
      }));

      await matchPlayerRepo.save(matchPlayers);

      res.status(201).json({
        status: 201,
        message: 'Squad added successfully',
        data: {
          match_id: matchId,
          team_id: teamId,
          total_players: matchPlayers.length,
          playing_11: playing11.length,
          substitutes: matchPlayers.length - playing11.length
        }
      });
    } catch (error) {
      console.error('Error adding squad:', error);
      res.status(500).json({
        status: 500,
        message: 'Failed to add squad',
        error: error.message
      });
    }
  }

  // GET /api/v1/matches/:matchId/teams/:teamId/squad
  async getSquad(req: Request, res: Response) {
    try {
      const { matchId, teamId } = req.params;
      const { type } = req.query; // 'playing11', 'substitutes', or 'all'

      const matchPlayerRepo = AppDataSource.getRepository(MatchPlayer);

      let where: any = { 
        match_id: Number(matchId), 
        team_id: Number(teamId) 
      };

      if (type === 'playing11') {
        where.is_playing11 = true;
      } else if (type === 'substitutes') {
        where.is_playing11 = false;
      }

      const squad = await matchPlayerRepo.find({
        where,
        relations: ['player'],
        order: { is_playing11: 'DESC' }
      });

      res.status(200).json({
        status: 200,
        message: 'Squad retrieved successfully',
        data: squad
      });
    } catch (error) {
      console.error('Error fetching squad:', error);
      res.status(500).json({
        status: 500,
        message: 'Failed to fetch squad',
        error: error.message
      });
    }
  }
}
```

---

## 🎯 Summary

### The Key Concept:
```
is_playing11 = true  → Player is in the playing 11 (on field)
is_playing11 = false → Player is a substitute (on bench)
```

### Typical Squad Composition:
```
Total Squad: 11-15 players
├── Playing 11: 11 players (is_playing11 = true)
└── Substitutes: 0-4 players (is_playing11 = false)
```

### Database Constraints:
- ✅ Composite PK (match_id, player_id) prevents duplicate entries
- ✅ Each player can only be in a match once
- ✅ Can belong to only one team per match
- ✅ Can be either playing or substitute

---

**This design is simple, efficient, and solves your exact problem!** 🎉
