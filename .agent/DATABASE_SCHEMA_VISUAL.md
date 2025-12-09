# Database Schema - Visual Representation

## Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CRICKET MANAGEMENT SYSTEM                            │
└─────────────────────────────────────────────────────────────────────────────┘

                    ┌──────────────────────────┐
                    │       PLAYERS            │ ◄─── Master Data
                    │  (Primary Entity)        │
                    ├──────────────────────────┤
                    │ • id (PK)                │
                    │ • user_id (FK)           │
                    │ • full_name              │
                    │ • role                   │
                    │ • createdAt              │
                    │ • updatedAt              │
                    └────────┬─────────────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
┌───────────────────────────┐   ┌─────────────────────────┐
│  PLAYER_CAREER_STATS      │   │   MATCH_PLAYERS         │ ◄─── Squad Management
│  (Aggregated Stats)       │   │   (Junction Table)      │
├───────────────────────────┤   ├─────────────────────────┤
│ • id (PK)                 │   │ • match_id (PK, FK)     │
│ • player_id (FK)          │   │ • player_id (PK, FK)    │
│ • format (TEST/ODI/T20)   │   │ • team_id (FK)          │
│ • total_matches           │   │ • is_playing11 ◄────────┼─── Playing 11 vs Bench
│ • total_innings           │   │ • role                  │
│ • total_runs              │   │ • createdAt             │
│ • centuries               │   └──────────┬──────────────┘
│ • half_centuries          │              │
│ • highest_score           │              │
│ • batting_average         │              ▼
│ • strike_rate             │   ┌─────────────────────────┐
│ • total_wickets           │   │   PLAYER_STATS          │ ◄─── Match Performance
│ • total_overs             │   │   (Per Match)           │
│ • bowling_average         │   ├─────────────────────────┤
│ • economy_rate            │   │ • id (PK)               │
│ • five_wicket_hauls       │   │ • match_id (FK)         │
│ • total_catches           │   │ • player_id (FK)        │
│ • total_run_outs          │   │ • runs                  │
│ • total_stumpings         │   │ • balls_faced           │
│ • createdAt               │   │ • fours                 │
│ • updatedAt               │   │ • sixes                 │
└───────────────────────────┘   │ • is_out                │
                                │ • wickets               │
                                │ • overs_bowled          │
                                │ • runs_conceded         │
                                │ • catches               │
                                │ • run_outs              │
                                │ • stumpings             │
                                │ • createdAt             │
                                │ • updatedAt             │
                                └──────────┬──────────────┘
                                           │
                                           ▼
                                ┌─────────────────────────┐
                                │      MATCHES            │
                                ├─────────────────────────┤
                                │ • id (PK)               │
                                │ • format                │
                                │ • venue                 │
                                │ • status                │
                                │ • match_date            │
                                │ • tenant_id (FK)        │
                                │ • created_at            │
                                │ • updated_at            │
                                └─────────────────────────┘
                                           │
                                           │ ManyToMany
                                           ▼
                                ┌─────────────────────────┐
                                │       TEAMS             │
                                ├─────────────────────────┤
                                │ • id (PK)               │
                                │ • name                  │
                                │ • short_name            │
                                │ • logo_url              │
                                │ • location              │
                                │ • createdAt             │
                                │ • updatedAt             │
                                └─────────────────────────┘
```

---

## Data Flow

### 1️⃣ **Before Match** (Squad Selection)
```
MATCH_PLAYERS table
┌──────────┬───────────┬─────────┬──────────────┬──────────┐
│ match_id │ player_id │ team_id │ is_playing11 │   role   │
├──────────┼───────────┼─────────┼──────────────┼──────────┤
│    1     │     1     │    1    │     true     │  opener  │
│    1     │     2     │    1    │     true     │  opener  │
│    1     │     3     │    1    │     true     │  middle  │
│   ...    │    ...    │   ...   │     ...      │   ...    │
│    1     │    11     │    1    │     true     │  bowler  │
│    1     │    12     │    1    │    false     │substitute│ ◄── Bench
│    1     │    13     │    1    │    false     │substitute│ ◄── Bench
│    1     │    14     │    1    │    false     │substitute│ ◄── Bench
│    1     │    15     │    1    │    false     │substitute│ ◄── Bench
└──────────┴───────────┴─────────┴──────────────┴──────────┘
```

### 2️⃣ **During/After Match** (Performance Recording)
```
PLAYER_STATS table
┌──────────┬───────────┬──────┬────────────┬───────┬──────┬─────────┐
│ match_id │ player_id │ runs │balls_faced │wickets│overs │ catches │
├──────────┼───────────┼──────┼────────────┼───────┼──────┼─────────┤
│    1     │     1     │  75  │     50     │   0   │ 0.0  │    1    │
│    1     │     2     │  42  │     38     │   0   │ 0.0  │    0    │
│    1     │     3     │ 103  │     65     │   0   │ 0.0  │    2    │ ◄── Century!
│    1     │     4     │  28  │     22     │   2   │ 4.0  │    0    │
│   ...    │    ...    │ ...  │    ...     │  ...  │ ...  │   ...   │
└──────────┴───────────┴──────┴────────────┴───────┴──────┴─────────┘
```

### 3️⃣ **After Match** (Career Stats Update)
```
PLAYER_CAREER_STATS table
┌───────────┬────────┬───────────────┬─────────────┬───────────┬───────────────┐
│ player_id │ format │ total_matches │ total_runs  │ centuries │half_centuries │
├───────────┼────────┼───────────────┼─────────────┼───────────┼───────────────┤
│     1     │  T20   │      45       │    1,250    │     2     │      8        │
│     1     │  ODI   │      32       │    1,580    │     3     │     11        │
│     2     │  T20   │      38       │      890    │     0     │      5        │
│     3     │  T20   │      52       │    2,340    │     5     │     15        │ ◄── Updated
│   ...     │  ...   │      ...      │     ...     │    ...    │     ...       │
└───────────┴────────┴───────────────┴─────────────┴───────────┴───────────────┘
```

---

## Key Design Decisions

### ✅ **1. Separation of Concerns**
- **`players`** → Who they are (identity)
- **`match_players`** → Who's in the match (squad)
- **`player_stats`** → What they did (performance)
- **`player_career_stats`** → Overall achievements (aggregated)

### ✅ **2. The `is_playing11` Flag**
**Solves your main problem!**
- `true` → Playing 11 (on field)
- `false` → Bench/Substitute (not playing initially)

This allows:
- 11-15 players per team per match
- Easy queries to distinguish playing vs bench
- Flexibility for substitutions

### ✅ **3. Composite Primary Key in `match_players`**
```typescript
@PrimaryColumn() match_id
@PrimaryColumn() player_id
```
**Ensures**: A player can only appear once per match (no duplicates)

### ✅ **4. Unique Constraint in `player_stats`**
```typescript
@Index(['match_id', 'player_id'], { unique: true })
```
**Ensures**: One performance record per player per match

### ✅ **5. Format-Specific Career Stats**
```typescript
@Index(['player_id', 'format'], { unique: true })
```
**Allows**: Separate stats for TEST, ODI, T20

---

## Common Queries

### Get Playing 11 for a Match
```typescript
const playing11 = await matchPlayerRepository.find({
  where: { 
    match_id: matchId, 
    team_id: teamId, 
    is_playing11: true 
  },
  relations: ['player']
});
```

### Get All Squad Members (Including Bench)
```typescript
const fullSquad = await matchPlayerRepository.find({
  where: { match_id: matchId, team_id: teamId },
  relations: ['player']
});
```

### Get Player Performance in a Match
```typescript
const performance = await playerStatsRepository.findOne({
  where: { match_id: matchId, player_id: playerId },
  relations: ['player', 'match']
});
```

### Get Player Career Stats for T20
```typescript
const careerStats = await careerStatsRepository.findOne({
  where: { player_id: playerId, format: MatchFormat.T20 },
  relations: ['player']
});
```

---

## Benefits of This Design

✅ **Scalability**: Can handle millions of matches and players  
✅ **Flexibility**: Supports all cricket formats and variations  
✅ **Performance**: Indexed queries for fast retrieval  
✅ **Data Integrity**: Foreign keys prevent orphaned records  
✅ **Maintainability**: Clear separation of concerns  
✅ **Extensibility**: Easy to add new features (innings, substitutions, etc.)  

---

## Summary

**Your current schema is already 90% there!** You have:
- ✅ `players` (master data)
- ✅ `match_players` (squad with `is_playing11` flag) ← **This solves your problem!**
- ✅ `player_stats` (match performance)
- ✅ `matches` (match info)

**What I added:**
- ✅ `player_career_stats` (aggregated statistics)
- ✅ Documentation and best practices

**The `is_playing11` boolean in `match_players` is the key to managing 11-15 players per match!**
