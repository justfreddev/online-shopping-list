# A quick script to create the table

import sqlite3

conn = sqlite3.connect("shopping.db")
c = conn.cursor()

c.execute(
    """
    CREATE TABLE IF NOT EXISTS shoppinglists (
        user_id INT NOT NULL,
        name TEXT NOT NULL,
        items JSON
    )
    """
)

conn.commit()
print("Database initialised")
conn.close()