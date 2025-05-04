from typing import Tuple
from flask import Flask, jsonify, request  # type: ignore
from flask_cors import CORS  # type: ignore
import json
import sqlite3

# Initialise the Flask app
app = Flask(__name__)
app.debug = True

# Configure CORS
CORS(app, resources={r"/*": {"origins": "localhost"}})
app.config["CORS_HEADERS"] = "Content-Type"


def get_user_items(cursor: sqlite3.Cursor, user_id: int) -> Tuple[list[str], bool]:
    """
    Helper function to get a user's shopping list
    """

    cursor.execute("SELECT items FROM shoppinglists WHERE user_id = ?", (user_id,))

    try:
        items_json = cursor.fetchone()[0]
    except:
        return [], False

    items = json.loads(items_json) if items_json else []

    return items, True


@app.route("/shopping/getlist", methods=["POST"])
def get_shopping_list():
    """
    Returns the shopping list of a user as an array/list

    Request:
        - userId: int - Google ID of the user
        - name: str - Name of the user

    returns:
        - status: 200/400
        - items: Updated shopping list
        - message: Error message
    """

    user_id: int = request.json.get("userId")
    name: str = request.json.get("name")

    if user_id is None:
        return jsonify({"status": 400, "items": [], "message": "User ID not provided"})

    if name is None:
        return jsonify({"status": 400, "items": [], "message": "Name not provided"})

    conn = sqlite3.connect("shopping.db")
    c = conn.cursor()

    items, success = get_user_items(c, user_id)

    if not success:
        conn = sqlite3.connect("shopping.db")
        c = conn.cursor()

        c.execute(
            "INSERT INTO shoppinglists VALUES (?, ?, ?)",
            (user_id, name, json.dumps([])),
        )
        conn.commit()
        conn.close()

        return jsonify({"status": 200, "items": [], "message": ""})

    return jsonify({"status": 200, "items": items, "message": ""})


@app.route("/shopping/additem", methods=["POST"])
def add_item():
    """
    Adds an item to the user's shopping list

    Request:
        - userId: int - Google ID of the user
        - item: str - Item being added to the list

    returns:
        - status: 200/400
        - items: Result items list
        - message: Error message
    """
    user_id: int = request.json.get("userId")
    item: str = request.json.get("item")

    if user_id is None:
        return jsonify({"status": 400, "items": [], "message": "User ID not provided"})

    if item is None:
        return jsonify({"status": 400, "items": [], "message": "Item not provided"})

    conn = sqlite3.connect("shopping.db")
    c = conn.cursor()

    items, success = get_user_items(c, user_id)

    if not success:
        return jsonify(
            {
                "status": 400,
                "items": [],
                "message": "Failed to get user's shopping list",
            }
        )

    items.append(item)

    c.execute(
        "UPDATE shoppinglists SET items = ? WHERE user_id = ?",
        (json.dumps(items), user_id),
    )

    conn.commit()
    conn.close()

    return jsonify({"status": 200, "items": items, "message": ""})


@app.route("/shopping/deleteitem", methods=["POST"])
def delete_item():
    """
    Deletes a single given item from a user's shopping list

    Request:
        - userId: int - Google ID of the user
        - index: str - Index of the item being added to the list

    returns:
        - status: 200/400
        - items: Updated shopping list
        - message: Error message
    """
    user_id: int = request.json.get("userId")
    index: int = request.json.get("index")

    if user_id is None:
        return jsonify({"status": 400, "items": [], "message": "User ID not provided"})

    if index is None:
        return jsonify({"status": 400, "items": [], "message": "Index not provided"})

    conn = sqlite3.connect("shopping.db")
    c = conn.cursor()

    items, success = get_user_items(c, user_id)

    if not success:
        return jsonify(
            {
                "status": 400,
                "items": [],
                "message": "Failed to get user's shopping list",
            }
        )

    items.pop(index)

    c.execute(
        "UPDATE shoppinglists SET items = ? WHERE user_id = ?",
        (
            json.dumps(items),
            user_id,
        ),
    )

    conn.commit()
    conn.close()

    return jsonify({"status": 200, "items": items})


@app.route("/shopping/deleteall", methods=["POST"])
def delete_all():
    """
    Deletes all of the items in a user's shopping list

    Request:
        - userId: int - Google ID of the user

    returns:
        - status: 200/400
        - message: Error message
    """

    user_id: int = request.json.get("userId")

    if user_id is None:
        return jsonify({"status": 400, "items": [], "message": "User ID not provided"})

    conn = sqlite3.connect("shopping.db")
    c = conn.cursor()

    c.execute(
        "UPDATE shoppinglists SET items = ? WHERE user_id = ?",
        (
            json.dumps([]),
            user_id,
        ),
    )

    conn.commit()
    conn.close()

    return jsonify({"status": 200, "message": ""})


# Runs the Flask app
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080, debug=True)
