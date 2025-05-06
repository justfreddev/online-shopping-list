import sqlite3
from flask import Flask  # type: ignore
from flask_cors import CORS  # type: ignore
from secrets import token_hex

from blueprints.auth import auth_bp
from blueprints.shopping import shopping_bp

# Initialise the Flask app
app = Flask(__name__)
app.debug = True

# Configure CORS
CORS(app, resources={r"/*": {"origins": "localhost"}}, supports_credentials=True)
app.config["CORS_HEADERS"] = "Content-Type"
app.config["SECRET_KEY"] = token_hex(24)

# Adds the blueprints
app.register_blueprint(auth_bp, url_prefix="/auth")
app.register_blueprint(shopping_bp, url_prefix="/shopping")

# Runs the Flask app
if __name__ == "__main__":
    with sqlite3.connect("shopping.db") as conn:
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
                checked_items JSON,
                FOREIGN KEY (user_id) REFERENCES users (google_id)
            )
            """
        )

        conn.commit()

    app.run(host="127.0.0.1", port=8080, debug=True)
