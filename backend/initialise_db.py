# A quick script to create the table

import sqlite3

conn = sqlite3.connect("shopping.db")
c = conn.cursor()

c.execute(
    """
    CREATE TABLE IF NOT EXISTS users (
        google_id TEXT PRIMARY KEY,
        name TEXT NOT NULL
    )
    """
)

c.execute(
    """
    CREATE TABLE IF NOT EXISTS shopping (
        user_id TEXT NOT NULL,
        items JSON,
        quantities JSON,
        FOREIGN KEY (user_id) REFERENCES users (google_id)
    )
    """
)

conn.commit()
print("Database initialised")
conn.close()
