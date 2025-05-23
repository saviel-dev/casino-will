import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const db = await open({
  filename: './database.sqlite',
  driver: sqlite3.Database
});

// Create table if it doesn't exist
await db.exec(`
  CREATE TABLE IF NOT EXISTS reference_numbers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    input_number TEXT NOT NULL,
    output_number1 TEXT NOT NULL,
    output_number2 TEXT NOT NULL,
    output_number3 TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
