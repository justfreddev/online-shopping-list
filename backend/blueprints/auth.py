import datetime
from flask import Blueprint, current_app, jsonify, make_response, request  # type: ignore
import jwt  # type: ignore
import sqlite3

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Logs a user in the database and gives them a cookie to stay logged in

    Request:
        - userId: int - Google ID of the user
        - name: str - Name of the user

    returns:
        - status: 200/400
        - message: Error message
    """
    google_id: int = request.json.get("userId")
    name: str = request.json.get("name")

    if google_id is None:
        return jsonify({"status": 400, "message": "Google ID not provided"})

    if name is None:
        return jsonify({"status": 400, "message": "Name not provided"})

    with sqlite3.connect("shopping.db") as conn:
        c = conn.cursor()

        c.execute("SELECT * FROM users WHERE google_id = ?", (google_id,))
        user = c.fetchone()

        if not user:
            c.execute(
                "INSERT INTO users (google_id, name) VALUES (?, ?)", (google_id, name)
            )

        conn.commit()

    token = jwt.encode(
        {
            "userId": google_id,
            "name": name,
            "exp": datetime.datetime.now(datetime.timezone.utc)
            + datetime.timedelta(days=14),
        },
        current_app.config["SECRET_KEY"],
        algorithm="HS256",
    )

    response = make_response({"status": 200, "message": ""})

    response.set_cookie(
        "session",
        token,
        max_age=14 * 24 * 60 * 60,
        httponly=True,
        secure=False,
        samesite="Lax",
    )

    return response


@auth_bp.route("/logout", methods=["POST"])
def logout():
    """
    Deletes a user's session cookie
    returns:
        - status: 200/400
        - message: Error message
    """
    response = jsonify({"status": 200, "message": "Logged out successfully"})
    response.delete_cookie("session")
    return response


@auth_bp.route("/checksession", methods=["POST"])
def check_session():
    """
    Checks if a user has a valid session

    returns:
        - status: 200/400
        - authenticated: Whether the user is authenticated or not
        - userId: The Google ID of the user
        - name: The name of the user
        - message: Error message
    """
    session_cookie = request.cookies.get("session")

    if not session_cookie:
        return jsonify(
            {
                "status": 200,
                "authenticated": False,
                "message": "Session cookie not found",
            }
        )

    try:
        data = jwt.decode(
            session_cookie, current_app.config["SECRET_KEY"], algorithms=["HS256"]
        )
        google_id = data["userId"]

        with sqlite3.connect("shopping.db") as conn:
            c = conn.cursor()

            c.execute("SELECT name FROM users WHERE google_id = ?", (google_id,))
            user = c.fetchone()

        if not user:
            raise Exception

        return jsonify(
            {
                "status": 200,
                "authenticated": True,
                "userId": google_id,
                "name": data["name"],
                "message": "",
            }
        )
    except Exception:
        response = make_response(
            jsonify(
                {
                    "status": 400,
                    "authenticated": False,
                    "message": "Error when authenticating",
                }
            )
        )
        response.delete_cookie("session")
        return response
