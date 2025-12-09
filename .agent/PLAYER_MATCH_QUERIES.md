# How to Identify Which Matches a Player Has Played In

## 🎯 The Question
**"How can I identify which matches a player has played in?"**

---

## ✅ Solution: Multiple Query Approaches

### Method 1: Get All Matches for a Player (Basic)

```typescript
import { AppDataSource } from '../config/db';
import { MatchPlayer } from '../entities/MatchPlayer';

async function getPlayerMatches(playerId: number) {
  const matchPlayerRepo = AppDataSource.getRepository(MatchPlayer);
  
  const playerMatches = await matchPlayerRepo.find({
    where: { player_id: playerId },
    relations: ['match', 'team'],
    order: { match: { match_date: 'DESC' } }
  });

  console.log(`Player ${playerId} has played in ${playerMatches.length} matches:`);
  playerMatches.forEach((mp, index) => {
    console.log(`${index + 1}. Match #${mp.match_id} - ${mp.match.venue} (${mp.match.match_date})`);
    console.log(`   Team: ${mp.team.name}`);
    console.log(`   Status: ${mp.is_playing11 ? 'Playing 11' : 'Substitute'}`);
    console.log(`   Role: ${mp.role}`);
  });

  return playerMatches;
}
```

**Output:**
```
Player 5 has played in 23 matches:
1. Match #45 - Wankhede Stadium (2024-03-15)
   Team: Mumbai Indians
   Status: Playing 11
   Role: all-rounder
2. Match #42 - Eden Gardens (2024-03-10)
   Team: Mumbai Indians
   Status: Substitute
   Role: substitute fielder
...
```

---

### Method 2: Get Only Matches Where Player Was in Playing 11

```typescript
async function getPlayerPlaying11Matches(playerId: number) {
  const matchPlayerRepo = AppDataSource.getRepository(MatchPlayer);
  
  const playing11Matches = await matchPlayerRepo.find({
    where: { 
      player_id: playerId,
      is_playing11: true  // ← Only playing 11
    },
    relations: ['match', 'team'],
    order: { match: { match_date: 'DESC' } }
  });

  console.log(`Player ${playerId} was in Playing 11 for ${playing11Matches.length} matches`);
  
  return playing11Matches;
}
```

---

### Method 3: Get Matches with Performance Stats

```typescript
async function getPlayerMatchesWithStats(playerId: number) {
  const matchPlayerRepo = AppDataSource.getRepository(MatchPlayer);
  
  const matches = await matchPlayerRepo
    .createQueryBuilder('mp')
    .leftJoinAndSelect('mp.match', 'match')
    .leftJoinAndSelect('mp.team', 'team')
    .leftJoinAndSelect('mp.player', 'player')
    .leftJoin('player_stats', 'ps', 'ps.match_id = mp.match_id AND ps.player_id = mp.player_id')
    .addSelect([
      'ps.runs',
      'ps.balls_faced',
      'ps.wickets',
      'ps.overs_bowled',
      'ps.catches'
    ])
    .where('mp.player_id = :playerId', { playerId })
    .orderBy('match.match_date', 'DESC')
    .getMany();

  console.log(`\nPlayer's Match History with Stats:`);
  matches.forEach((mp, i) => {
    console.log(`\n${i + 1}. ${mp.match.venue} - ${mp.match.format}`);
    console.log(`   Date: ${mp.match.match_date}`);
    console.log(`   Team: ${mp.team.name}`);
    console.log(`   Status: ${mp.is_playing11 ? '🏏 Playing 11' : '🪑 Substitute'}`);
    // Stats would be in the joined data
  });

  return matches;
}
```

---

### Method 4: Get Matches by Format (T20, ODI, TEST)

```typescript
import { MatchFormat } from '../entities/Matches';

async function getPlayerMatchesByFormat(playerId: number, format: MatchFormat) {
  const matchPlayerRepo = AppDataSource.getRepository(MatchPlayer);
  
  const matches = await matchPlayerRepo
    .createQueryBuilder('mp')
    .leftJoinAndSelect('mp.match', 'match')
    .leftJoinAndSelect('mp.team', 'team')
    .where('mp.player_id = :playerId', { playerId })
    .andWhere('match.format = :format', { format })
    .orderBy('match.match_date', 'DESC')
    .getMany();

  console.log(`Player ${playerId} - ${format} matches: ${matches.length}`);
  
  return matches;
}

// Usage:
await getPlayerMatchesByFormat(5, MatchFormat.T20);
await getPlayerMatchesByFormat(5, MatchFormat.ODI);
await getPlayerMatchesByFormat(5, MatchFormat.TEST);
```

---

### Method 5: Get Match Count Summary

```typescript
async function getPlayerMatchSummary(playerId: number) {
  const matchPlayerRepo = AppDataSource.getRepository(MatchPlayer);
  
  // Total matches
  const totalMatches = await matchPlayerRepo.count({
    where: { player_id: playerId }
  });

  // Playing 11 matches
  const playing11Matches = await matchPlayerRepo.count({
    where: { player_id: playerId, is_playing11: true }
  });

  // Substitute appearances
  const substituteMatches = totalMatches - playing11Matches;

  // Matches by format
  const t20Matches = await matchPlayerRepo
    .createQueryBuilder('mp')
    .leftJoin('mp.match', 'match')
    .where('mp.player_id = :playerId', { playerId })
    .andWhere('match.format = :format', { format: MatchFormat.T20 })
    .getCount();

  const odiMatches = await matchPlayerRepo
    .createQueryBuilder('mp')
    .leftJoin('mp.match', 'match')
    .where('mp.player_id = :playerId', { playerId })
    .andWhere('match.format = :format', { format: MatchFormat.ODI })
    .getCount();

  const testMatches = await matchPlayerRepo
    .createQueryBuilder('mp')
    .leftJoin('mp.match', 'match')
    .where('mp.player_id = :playerId', { playerId })
    .andWhere('match.format = :format', { format: MatchFormat.TEST })
    .getCount();

  const summary = {
    player_id: playerId,
    total_matches: totalMatches,
    playing_11_matches: playing11Matches,
    substitute_appearances: substituteMatches,
    by_format: {
      T20: t20Matches,
      ODI: odiMatches,
      TEST: testMatches
    }
  };

  console.log('\n📊 Player Match Summary:');
  console.log(JSON.stringify(summary, null, 2));

  return summary;
}
```

**Output:**
```json
📊 Player Match Summary:
{
  "player_id": 5,
  "total_matches": 67,
  "playing_11_matches": 58,
  "substitute_appearances": 9,
  "by_format": {
    "T20": 45,
    "ODI": 18,
    "TEST": 4
  }
}
```

---

### Method 6: Get Recent Matches (Last N Matches)

```typescript
async function getPlayerRecentMatches(playerId: number, limit: number = 10) {
  const matchPlayerRepo = AppDataSource.getRepository(MatchPlayer);
  
  const recentMatches = await matchPlayerRepo
    .createQueryBuilder('mp')
    .leftJoinAndSelect('mp.match', 'match')
    .leftJoinAndSelect('mp.team', 'team')
    .where('mp.player_id = :playerId', { playerId })
    .orderBy('match.match_date', 'DESC')
    .limit(limit)
    .getMany();

  console.log(`\n🕐 Last ${limit} matches for Player ${playerId}:`);
  recentMatches.forEach((mp, i) => {
    console.log(`${i + 1}. ${mp.match.venue} - ${mp.match.status}`);
  });

  return recentMatches;
}
```

---

### Method 7: Get Matches Between Date Range

```typescript
async function getPlayerMatchesByDateRange(
  playerId: number,
  startDate: Date,
  endDate: Date
) {
  const matchPlayerRepo = AppDataSource.getRepository(MatchPlayer);
  
  const matches = await matchPlayerRepo
    .createQueryBuilder('mp')
    .leftJoinAndSelect('mp.match', 'match')
    .leftJoinAndSelect('mp.team', 'team')
    .where('mp.player_id = :playerId', { playerId })
    .andWhere('match.match_date BETWEEN :startDate AND :endDate', {
      startDate,
      endDate
    })
    .orderBy('match.match_date', 'ASC')
    .getMany();

  console.log(`Matches between ${startDate} and ${endDate}: ${matches.length}`);
  
  return matches;
}

// Usage:
const start = new Date('2024-01-01');
const end = new Date('2024-12-31');
await getPlayerMatchesByDateRange(5, start, end);
```

---

### Method 8: Get Matches with Team Information

```typescript
async function getPlayerMatchesByTeam(playerId: number, teamId?: number) {
  const matchPlayerRepo = AppDataSource.getRepository(MatchPlayer);
  
  const where: any = { player_id: playerId };
  if (teamId) {
    where.team_id = teamId;
  }

  const matches = await matchPlayerRepo.find({
    where,
    relations: ['match', 'team'],
    order: { match: { match_date: 'DESC' } }
  });

  // Group by team
  const matchesByTeam = matches.reduce((acc, mp) => {
    const teamName = mp.team.name;
    if (!acc[teamName]) {
      acc[teamName] = [];
    }
    acc[teamName].push(mp);
    return acc;
  }, {} as Record<string, typeof matches>);

  console.log(`\n🏏 Player ${playerId} - Matches by Team:`);
  Object.entries(matchesByTeam).forEach(([teamName, teamMatches]) => {
    console.log(`\n${teamName}: ${teamMatches.length} matches`);
  });

  return matchesByTeam;
}
```

---

## 🎯 API Controller Examples

### GET /api/v1/players/:playerId/matches

```typescript
// src/modules/v1/players/players.controller.ts

export class PlayersController {
  
  async getPlayerMatches(req: Request, res: Response) {
    try {
      const { playerId } = req.params;
      const { 
        format,        // T20, ODI, TEST
        status,        // playing11, substitute, all
        limit,         // number of matches
        teamId,        // filter by team
        startDate,     // date range start
        endDate        // date range end
      } = req.query;

      const matchPlayerRepo = AppDataSource.getRepository(MatchPlayer);
      
      let query = matchPlayerRepo
        .createQueryBuilder('mp')
        .leftJoinAndSelect('mp.match', 'match')
        .leftJoinAndSelect('mp.team', 'team')
        .leftJoinAndSelect('mp.player', 'player')
        .where('mp.player_id = :playerId', { playerId: Number(playerId) });

      // Filter by format
      if (format) {
        query = query.andWhere('match.format = :format', { format });
      }

      // Filter by playing status
      if (status === 'playing11') {
        query = query.andWhere('mp.is_playing11 = :isPlaying11', { isPlaying11: true });
      } else if (status === 'substitute') {
        query = query.andWhere('mp.is_playing11 = :isPlaying11', { isPlaying11: false });
      }

      // Filter by team
      if (teamId) {
        query = query.andWhere('mp.team_id = :teamId', { teamId: Number(teamId) });
      }

      // Filter by date range
      if (startDate && endDate) {
        query = query.andWhere('match.match_date BETWEEN :startDate AND :endDate', {
          startDate: new Date(startDate as string),
          endDate: new Date(endDate as string)
        });
      }

      // Order and limit
      query = query.orderBy('match.match_date', 'DESC');
      
      if (limit) {
        query = query.limit(Number(limit));
      }

      const matches = await query.getMany();

      res.status(200).json({
        status: 200,
        message: 'Player matches retrieved successfully',
        data: {
          player_id: playerId,
          total_matches: matches.length,
          matches: matches.map(mp => ({
            match_id: mp.match_id,
            match_date: mp.match.match_date,
            format: mp.match.format,
            venue: mp.match.venue,
            status: mp.match.status,
            team: {
              id: mp.team.id,
              name: mp.team.name,
              short_name: mp.team.short_name
            },
            player_status: mp.is_playing11 ? 'Playing 11' : 'Substitute',
            role: mp.role
          }))
        }
      });
    } catch (error) {
      console.error('Error fetching player matches:', error);
      res.status(500).json({
        status: 500,
        message: 'Failed to fetch player matches',
        error: error.message
      });
    }
  }

  async getPlayerMatchSummary(req: Request, res: Response) {
    try {
      const { playerId } = req.params;
      const matchPlayerRepo = AppDataSource.getRepository(MatchPlayer);

      // Get all matches
      const allMatches = await matchPlayerRepo.find({
        where: { player_id: Number(playerId) },
        relations: ['match']
      });

      // Calculate summary
      const summary = {
        player_id: playerId,
        total_matches: allMatches.length,
        playing_11: allMatches.filter(mp => mp.is_playing11).length,
        substitute: allMatches.filter(mp => !mp.is_playing11).length,
        by_format: {
          T20: allMatches.filter(mp => mp.match.format === MatchFormat.T20).length,
          ODI: allMatches.filter(mp => mp.match.format === MatchFormat.ODI).length,
          TEST: allMatches.filter(mp => mp.match.format === MatchFormat.TEST).length
        },
        by_status: {
          SCHEDULED: allMatches.filter(mp => mp.match.status === 'SCHEDULED').length,
          ONGOING: allMatches.filter(mp => mp.match.status === 'ONGOING').length,
          COMPLETED: allMatches.filter(mp => mp.match.status === 'COMPLETED').length,
          CANCELLED: allMatches.filter(mp => mp.match.status === 'CANCELLED').length
        }
      };

      res.status(200).json({
        status: 200,
        message: 'Player match summary retrieved successfully',
        data: summary
      });
    } catch (error) {
      console.error('Error fetching player match summary:', error);
      res.status(500).json({
        status: 500,
        message: 'Failed to fetch player match summary',
        error: error.message
      });
    }
  }
}
```

---

## 🔍 SQL Equivalent Queries

### Get all matches for a player:
```sql
SELECT 
  mp.match_id,
  mp.player_id,
  mp.team_id,
  mp.is_playing11,
  mp.role,
  m.venue,
  m.format,
  m.match_date,
  m.status,
  t.name as team_name
FROM match_players mp
JOIN matches m ON mp.match_id = m.id
JOIN teams t ON mp.team_id = t.id
WHERE mp.player_id = 5
ORDER BY m.match_date DESC;
```

### Get only playing 11 matches:
```sql
SELECT * 
FROM match_players mp
JOIN matches m ON mp.match_id = m.id
WHERE mp.player_id = 5 
  AND mp.is_playing11 = true
ORDER BY m.match_date DESC;
```

### Get match count by format:
```sql
SELECT 
  m.format,
  COUNT(*) as match_count,
  SUM(CASE WHEN mp.is_playing11 = true THEN 1 ELSE 0 END) as playing_11_count,
  SUM(CASE WHEN mp.is_playing11 = false THEN 1 ELSE 0 END) as substitute_count
FROM match_players mp
JOIN matches m ON mp.match_id = m.id
WHERE mp.player_id = 5
GROUP BY m.format;
```

---

## 📊 Summary

### To identify which matches a player has played in, use:

1. **`match_players` table** - Primary source
   - Filter by `player_id`
   - Join with `matches` table for match details
   - Join with `teams` table for team information

2. **Key Fields for Identification:**
   - `match_id` - Which match
   - `player_id` - Which player
   - `team_id` - Which team they played for
   - `is_playing11` - Were they playing or substitute
   - `role` - What role they had

3. **Common Filters:**
   - By format (T20, ODI, TEST)
   - By status (playing 11 vs substitute)
   - By team
   - By date range
   - By match status (completed, ongoing, etc.)

---

**The `match_players` table is your source of truth for player-match relationships!** 🎯
