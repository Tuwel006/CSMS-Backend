# Cricket Management System - Database Design

## 🎯 Problem Statement

You need to manage:
1. **Player personal information** (master data)
2. **Player career statistics** (aggregated across all matches)
3. **Match information** (teams, venue, status, etc.)
4. **Match squads** (11-15 players per team, playing 11 + substitutes)
5. **Player performance per match** (runs, wickets, etc.)

---

## ✅ Recommended Solution: Multi-Table Design

### **Current Schema (Good Foundation)**

You already have these tables:

#### 1. **`players`** - Player Master Data
```typescript
- id (PK)
- user_id (FK to users, nullable)
- full_name
- role (batsman/bowler/allrounder/wicketkeeper)
- createdAt
- updatedAt
```
**Purpose**: Store basic player information (one record per player)

---

#### 2. **`match_players`** - Match Squad Junction Table ✅
```typescript
- match_id (PK, FK)
- player_id (PK, FK)
- team_id (FK)
- is_playing11 (boolean) ← Distinguishes playing 11 from bench
- role (string, nullable) ← Match-specific role
- createdAt
```
**Purpose**: Links players to matches and teams
- **Solves your problem**: `is_playing11` flag separates playing 11 from substitutes
- Each match can have 11-15 players per team
- Composite PK ensures a player can only be in a match once

---

#### 3. **`player_stats`** - Match Performance Data ✅
```typescript
- id (PK)
- match_id (FK)
- player_id (FK)
- runs, balls_faced, fours, sixes, is_out
- wickets, overs_bowled, runs_conceded, maidens
- catches, run_outs, stumpings
- createdAt, updatedAt
```
**Purpose**: Store individual player performance for each match
- **Unique constraint** on (match_id, player_id)
- One record per player per match

---

#### 4. **`matches`** - Match Information
```typescript
- id (PK)
- format (TEST/ODI/T20)
- venue
- status (SCHEDULED/ONGOING/COMPLETED/CANCELLED)
- match_date
- tenant_id (FK)
- teams (ManyToMany via match_teams)
- created_at, updated_at
```

---

## 🔧 Recommended Improvements

### **Add: Player Career Statistics Table**

Create a new table to store **aggregated career stats** (separate from match-specific stats):

```typescript
// src/modules/v1/shared/entities/PlayerCareerStats.ts

@Entity('player_career_stats')
@Index(['player_id', 'format'], { unique: true })
export class PlayerCareerStats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  player_id: number;

  @Column({ type: 'enum', enum: MatchFormat })
  format: MatchFormat; // TEST, ODI, T20

  // Batting career stats
  @Column({ default: 0 })
  total_matches: number;

  @Column({ default: 0 })
  total_innings: number;

  @Column({ default: 0 })
  total_runs: number;

  @Column({ default: 0 })
  total_balls_faced: number;

  @Column({ default: 0 })
  centuries: number; // 100+ runs

  @Column({ default: 0 })
  half_centuries: number; // 50-99 runs

  @Column({ default: 0 })
  highest_score: number;

  @Column('decimal', { precision: 6, scale: 2, default: 0.00 })
  batting_average: number;

  @Column('decimal', { precision: 6, scale: 2, default: 0.00 })
  strike_rate: number;

  // Bowling career stats
  @Column({ default: 0 })
  total_wickets: number;

  @Column('decimal', { precision: 6, scale: 1, default: 0.0 })
  total_overs: number;

  @Column({ default: 0 })
  total_runs_conceded: number;

  @Column('decimal', { precision: 6, scale: 2, default: 0.00 })
  bowling_average: number;

  @Column('decimal', { precision: 6, scale: 2, default: 0.00 })
  economy_rate: number;

  @Column({ default: 0 })
  five_wicket_hauls: number; // 5+ wickets in an innings

  // Fielding career stats
  @Column({ default: 0 })
  total_catches: number;

  @Column({ default: 0 })
  total_run_outs: number;

  @Column({ default: 0 })
  total_stumpings: number;

  @ManyToOne(() => Player)
  @JoinColumn({ name: 'player_id' })
  player: Player;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

**Why separate career stats?**
- **Performance**: Faster queries for career statistics
- **Data integrity**: Aggregated data is calculated, not duplicated
- **Format-specific**: Different stats for TEST, ODI, T20
- **Scalability**: Easy to update after each match

---

## 📊 Complete Table Relationships

```
┌─────────────┐
│   players   │ (Master data)
└──────┬──────┘
       │
       ├──────────────────────────────────┐
       │                                  │
       ▼                                  ▼
┌──────────────────┐            ┌─────────────────────┐
│ player_career_   │            │  match_players      │ (Squad)
│ stats            │            │  - is_playing11     │
│ (Aggregated)     │            │  - role             │
└──────────────────┘            └──────┬──────────────┘
                                       │
                                       ▼
                                ┌─────────────────┐
                                │  player_stats   │ (Performance)
                                │  (Per match)    │
                                └─────────────────┘
                                       │
                                       ▼
                                ┌─────────────┐
                                │   matches   │
                                └─────────────┘
```

---

## 🎯 How to Use This Design

### **Scenario 1: Adding Players to a Match Squad**

```typescript
// Add 15 players to a match (11 playing + 4 substitutes)
const squad = [
  { player_id: 1, team_id: 1, is_playing11: true, role: 'opener' },
  { player_id: 2, team_id: 1, is_playing11: true, role: 'opener' },
  // ... 9 more playing 11
  { player_id: 12, team_id: 1, is_playing11: false, role: 'substitute' },
  { player_id: 13, team_id: 1, is_playing11: false, role: 'substitute' },
  // ... more substitutes
];

await matchPlayerRepository.save(squad.map(p => ({
  match_id: matchId,
  ...p
})));
```

### **Scenario 2: Recording Match Performance**

```typescript
// After match, record each player's performance
await playerStatsRepository.save({
  match_id: matchId,
  player_id: playerId,
  runs: 75,
  balls_faced: 50,
  fours: 8,
  sixes: 2,
  is_out: true,
  wickets: 2,
  overs_bowled: 4.0,
  runs_conceded: 28,
  catches: 1
});
```

### **Scenario 3: Updating Career Statistics**

```typescript
// After match completion, update career stats
const playerStats = await playerStatsRepository.findOne({
  where: { match_id: matchId, player_id: playerId }
});

const careerStats = await careerStatsRepository.findOne({
  where: { player_id: playerId, format: match.format }
});

// Update aggregated stats
careerStats.total_matches += 1;
careerStats.total_runs += playerStats.runs;
careerStats.total_wickets += playerStats.wickets;
if (playerStats.runs >= 100) careerStats.centuries += 1;
if (playerStats.runs >= 50 && playerStats.runs < 100) careerStats.half_centuries += 1;

// Recalculate averages
careerStats.batting_average = careerStats.total_runs / careerStats.total_innings;
careerStats.strike_rate = (careerStats.total_runs / careerStats.total_balls_faced) * 100;

await careerStatsRepository.save(careerStats);
```

### **Scenario 4: Querying Match Squad**

```typescript
// Get all players in a match (playing 11 + substitutes)
const allPlayers = await matchPlayerRepository.find({
  where: { match_id: matchId, team_id: teamId },
  relations: ['player']
});

// Get only playing 11
const playing11 = await matchPlayerRepository.find({
  where: { match_id: matchId, team_id: teamId, is_playing11: true },
  relations: ['player']
});

// Get substitutes
const substitutes = await matchPlayerRepository.find({
  where: { match_id: matchId, team_id: teamId, is_playing11: false },
  relations: ['player']
});
```

---

## 🚀 Additional Enhancements

### **1. Add Match Status Tracking**
You already have `MatchStatus.ts` - use it to track:
- Live score updates
- Current over
- Required run rate
- Winner

### **2. Add Innings Support**
For formats with multiple innings (TEST), consider:
```typescript
@Entity('innings')
export class Innings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  match_id: number;

  @Column()
  team_id: number;

  @Column()
  innings_number: number; // 1st, 2nd, 3rd, 4th

  @Column({ default: 0 })
  total_runs: number;

  @Column({ default: 0 })
  wickets: number;

  @Column('decimal', { precision: 4, scale: 1, default: 0.0 })
  overs: number;
}
```

### **3. Add Player Substitution Tracking**
```typescript
@Entity('player_substitutions')
export class PlayerSubstitution {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  match_id: number;

  @Column()
  player_out_id: number; // Player leaving

  @Column()
  player_in_id: number; // Substitute entering

  @Column()
  team_id: number;

  @Column()
  substitution_time: Date;

  @Column({ nullable: true })
  reason: string; // injury, tactical, etc.
}
```

---

## ✅ Summary: Best Practices

1. **`players`** → Master data (one record per player)
2. **`match_players`** → Squad management (who's in the match, playing 11 vs bench)
3. **`player_stats`** → Match-specific performance (one record per player per match)
4. **`player_career_stats`** → Aggregated career statistics (updated after each match)
5. **`matches`** → Match metadata (venue, date, status, teams)

### **Key Design Principles**
✅ **Normalization**: No duplicate data  
✅ **Scalability**: Can handle millions of matches  
✅ **Flexibility**: Supports all cricket formats  
✅ **Performance**: Indexed queries for fast retrieval  
✅ **Data Integrity**: Foreign keys and unique constraints  

---

## 🔥 Next Steps

1. Create `PlayerCareerStats` entity
2. Create service methods to update career stats after each match
3. Add API endpoints to fetch:
   - Player career stats by format
   - Match squad (playing 11 + substitutes)
   - Player performance in a specific match
4. Consider adding background jobs to recalculate stats periodically

---

**This design solves your problem of managing 11-15 players per match while maintaining clean separation between squad selection, match performance, and career statistics!** 🎉
