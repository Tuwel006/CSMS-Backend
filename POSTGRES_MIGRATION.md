# PostgreSQL Migration Guide

This project has been successfully converted from MySQL to PostgreSQL.

## Changes Made

### 1. Dependencies
- Replaced `mysql2` with `pg` and `@types/pg`
- Updated package.json with PostgreSQL driver

### 2. Database Configuration
- Updated `src/config/db.ts` to use PostgreSQL
- Changed database type from 'mysql' to 'postgres'
- Enabled password authentication

### 3. Environment Variables
- Updated `.env` file:
  - `DB_PORT`: Changed from 3306 to 5432
  - `DB_USER`: Changed from 'root' to 'postgres'

### 4. Entity Updates
- Changed `datetime` column type to `timestamp` in Match entity
- All other column types are already PostgreSQL compatible

## Setup Instructions

### 1. Install PostgreSQL
Download and install PostgreSQL from https://www.postgresql.org/download/

### 2. Create Database
```sql
CREATE DATABASE cricket_db;
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Update Environment Variables
Ensure your `.env` file has the correct PostgreSQL credentials:
```
DB_NAME=cricket_db
DB_USER=postgres
DB_PASS=your_password
DB_HOST=localhost
DB_PORT=5432
```

### 5. Run the Application
```bash
npm run dev
```

The application will automatically create all tables using TypeORM synchronization.

## Notes
- All existing functionality remains the same
- TypeORM handles the database abstraction, so no service layer changes were needed
- PostgreSQL provides better performance and more advanced features compared to MySQL