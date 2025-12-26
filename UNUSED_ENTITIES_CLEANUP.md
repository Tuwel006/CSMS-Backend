# Unused Entities Cleanup Summary

## Removed Entities

The following unused entities have been removed from the project:

### 1. MatchStatus.ts
- **Purpose**: Was designed to track match status with innings details
- **Reason for removal**: Not imported or used anywhere in the codebase
- **Functionality**: Covered by existing Match and MatchInnings entities

### 2. PlayerCareerStats.ts  
- **Purpose**: Was intended for tracking player career statistics
- **Reason for removal**: Not imported or used anywhere in the codebase
- **Note**: PlayerStats.ts entity still exists and is used

### 3. Score.ts
- **Purpose**: Alternative scoring system with ball-by-ball tracking
- **Reason for removal**: Not imported or used anywhere in the codebase
- **Functionality**: Covered by existing BallByBall entity

### 4. test.ts (Score entity)
- **Purpose**: Test implementation of Score entity with auto-incrementing ball numbers
- **Reason for removal**: Test file not used in production code
- **Impact**: Updated testData.ts to remove references

### 5. TeamPlayer.ts
- **Purpose**: Junction table for team-player relationships
- **Reason for removal**: Not imported or used anywhere in the codebase
- **Functionality**: Covered by existing MatchPlayer entity for match-specific team assignments

## Remaining Active Entities

The following entities are actively used in the codebase:
- BallByBall.ts ✓
- BallHistory.ts ✓
- InningsBatting.ts ✓
- InningsBowling.ts ✓
- Match.ts ✓
- MatchInnings.ts ✓
- MatchPlayer.ts ✓
- Permission.ts ✓
- Plan.ts ✓
- PlanPermission.ts ✓
- Player.ts ✓
- PlayerStats.ts ✓
- Role.ts ✓
- RolePermission.ts ✓
- Team.ts ✓
- Tenant.ts ✓
- User.ts ✓
- UserPlan.ts ✓
- UserRole.ts ✓

## Benefits

- **Reduced codebase size**: Removed 5 unused entity files
- **Cleaner architecture**: Eliminated redundant entities
- **Better maintainability**: Fewer files to manage and understand
- **No functional impact**: All removed entities were unused