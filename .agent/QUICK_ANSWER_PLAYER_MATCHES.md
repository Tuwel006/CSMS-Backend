# 🔍 Quick Answer: How to Identify Player's Matches

## The Simple Answer

**Use the `match_players` table!** It's a junction table that links players to matches.

```
┌─────────────────────────────────────────────────────────────┐
│                    MATCH_PLAYERS TABLE                       │
│                  (Junction/Link Table)                       │
├──────────┬───────────┬─────────┬──────────────┬─────────────┤
│ match_id │ player_id │ team_id │ is_playing11 │    role     │
├──────────┼───────────┼─────────┼──────────────┼─────────────┤
│    1     │     5     │    1    │     true     │  all-rounder│ ◄─ Player 5 in Match 1
│    2     │     5     │    1    │     true     │  all-rounder│ ◄─ Player 5 in Match 2
│    3     │     5     │    1    │    false     │  substitute │ ◄─ Player 5 in Match 3
│    5     │     5     │    2    │     true     │  all-rounder│ ◄─ Player 5 in Match 5
│    7     │     5     │    1    │     true     │  all-rounder│ ◄─ Player 5 in Match 7
└──────────┴───────────┴─────────┴──────────────┴─────────────┘
                 ▲
                 │
        Filter by player_id = 5
                 │
                 ▼
    Player 5 has played in 5 matches!
```

---

## 🎯 One-Line Query

```typescript
// Get all matches for player ID 5
const playerMatches = await matchPlayerRepository.find({
  where: { player_id: 5 },
  relations: ['match', 'team']
});

console.log(`Player 5 has played in ${playerMatches.length} matches`);
```

**That's it!** ✅

---

## 📊 Real Example

### Database State:
```
PLAYERS table:
┌────┬─────────────┬─────────────┐
│ id │  full_name  │    role     │
├────┼─────────────┼─────────────┤
│ 5  │ Virat Kohli │ batsman     │
└────┴─────────────┴─────────────┘

MATCHES table:
┌────┬────────────────┬────────┬────────────┐
│ id │     venue      │ format │   status   │
├────┼────────────────┼────────┼────────────┤
│ 1  │ Wankhede       │  T20   │ COMPLETED  │
│ 2  │ Eden Gardens   │  T20   │ COMPLETED  │
│ 3  │ Chinnaswamy    │  ODI   │ COMPLETED  │
│ 5  │ Lord's         │  TEST  │ ONGOING    │
│ 7  │ MCG            │  T20   │ SCHEDULED  │
└────┴────────────────┴────────┴────────────┘

MATCH_PLAYERS table (Links):
┌──────────┬───────────┬─────────┬──────────────┐
│ match_id │ player_id │ team_id │ is_playing11 │
├──────────┼───────────┼─────────┼──────────────┤
│    1     │     5     │    1    │     true     │ ◄─┐
│    2     │     5     │    1    │     true     │ ◄─┤
│    3     │     5     │    1    │    false     │ ◄─┼─ Player 5's matches
│    5     │     5     │    2    │     true     │ ◄─┤
│    7     │     5     │    1    │     true     │ ◄─┘
└──────────┴───────────┴─────────┴──────────────┘
```

### Query Result:
```typescript
const matches = await matchPlayerRepository.find({
  where: { player_id: 5 },
  relations: ['match', 'team']
});

// Result:
[
  {
    match_id: 1,
    player_id: 5,
    team_id: 1,
    is_playing11: true,
    match: { id: 1, venue: 'Wankhede', format: 'T20', status: 'COMPLETED' }
  },
  {
    match_id: 2,
    player_id: 5,
    team_id: 1,
    is_playing11: true,
    match: { id: 2, venue: 'Eden Gardens', format: 'T20', status: 'COMPLETED' }
  },
  {
    match_id: 3,
    player_id: 5,
    team_id: 1,
    is_playing11: false,
    match: { id: 3, venue: 'Chinnaswamy', format: 'ODI', status: 'COMPLETED' }
  },
  {
    match_id: 5,
    player_id: 5,
    team_id: 2,
    is_playing11: true,
    match: { id: 5, venue: 'Lord\'s', format: 'TEST', status: 'ONGOING' }
  },
  {
    match_id: 7,
    player_id: 5,
    team_id: 1,
    is_playing11: true,
    match: { id: 7, venue: 'MCG', format: 'T20', status: 'SCHEDULED' }
  }
]
```

**Answer: Player 5 (Virat Kohli) has played in 5 matches!**

---

## 🚀 Common Use Cases

### 1. Get all matches
```typescript
const allMatches = await matchPlayerRepository.find({
  where: { player_id: 5 }
});
// Returns: All 5 matches
```

### 2. Get only playing 11 matches
```typescript
const playing11 = await matchPlayerRepository.find({
  where: { player_id: 5, is_playing11: true }
});
// Returns: 4 matches (excluding match 3 where he was substitute)
```

### 3. Get only T20 matches
```typescript
const t20Matches = await matchPlayerRepository
  .createQueryBuilder('mp')
  .leftJoinAndSelect('mp.match', 'match')
  .where('mp.player_id = :playerId', { playerId: 5 })
  .andWhere('match.format = :format', { format: 'T20' })
  .getMany();
// Returns: 3 matches (1, 2, 7)
```

### 4. Count total matches
```typescript
const count = await matchPlayerRepository.count({
  where: { player_id: 5 }
});
// Returns: 5
```

---

## 📱 API Endpoint Example

```typescript
// GET /api/v1/players/5/matches

router.get('/players/:playerId/matches', async (req, res) => {
  const { playerId } = req.params;
  
  const matches = await matchPlayerRepository.find({
    where: { player_id: Number(playerId) },
    relations: ['match', 'team'],
    order: { match: { match_date: 'DESC' } }
  });

  res.json({
    status: 200,
    message: 'Player matches retrieved successfully',
    data: {
      player_id: playerId,
      total_matches: matches.length,
      matches: matches.map(mp => ({
        match_id: mp.match_id,
        venue: mp.match.venue,
        format: mp.match.format,
        date: mp.match.match_date,
        team: mp.team.name,
        status: mp.is_playing11 ? 'Playing 11' : 'Substitute',
        role: mp.role
      }))
    }
  });
});
```

**Response:**
```json
{
  "status": 200,
  "message": "Player matches retrieved successfully",
  "data": {
    "player_id": "5",
    "total_matches": 5,
    "matches": [
      {
        "match_id": 7,
        "venue": "MCG",
        "format": "T20",
        "date": "2024-03-20",
        "team": "Mumbai Indians",
        "status": "Playing 11",
        "role": "all-rounder"
      },
      {
        "match_id": 5,
        "venue": "Lord's",
        "format": "TEST",
        "date": "2024-03-15",
        "team": "India",
        "status": "Playing 11",
        "role": "all-rounder"
      },
      // ... more matches
    ]
  }
}
```

---

## 🎯 Summary

### To identify which matches a player has played in:

1. **Query the `match_players` table**
2. **Filter by `player_id`**
3. **Join with `matches` table** to get match details

### The relationship:
```
player_id → match_players → match_id → matches
```

### Key insight:
**Every row in `match_players` where `player_id = X` represents a match that player X has played in!**

---

## 💡 Pro Tip

Use the provided `PlayerMatchService` class:

```typescript
import { PlayerMatchService } from './player-match.service';

const service = new PlayerMatchService();

// Get all matches for player 5
const matches = await service.getPlayerMatches(5);

// Get summary
const summary = await service.getPlayerMatchSummary(5);

// Get recent 10 matches with stats
const recent = await service.getPlayerRecentMatchesWithStats(5, 10);
```

**It's that simple!** 🎉
