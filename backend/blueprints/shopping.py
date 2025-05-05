from typing import Tuple
from flask import Blueprint, jsonify, request  # type: ignore
import json
import sqlite3

shopping_bp = Blueprint("shopping", __name__)


def get_user_items(
    cursor: sqlite3.Cursor, user_id: int
) -> Tuple[list[str], list[int], list[int], bool]:
    """
    Helper function to get a user's shopping list
    """

    cursor.execute(
        "SELECT items, quantities, checked_items FROM shopping WHERE user_id = ?",
        (user_id,),
    )

    try:
        items_json, quantities_json, checked_items_json = cursor.fetchone()
    except sqlite3.Error:
        return [], [], [], False

    items = json.loads(items_json) if items_json else []
    quantities = json.loads(quantities_json) if quantities_json else []
    checked_items = json.loads(checked_items_json) if checked_items_json else []

    return items, quantities, checked_items, True


@shopping_bp.route("/getlist", methods=["POST"])
def get_shopping_list():
    """
    Returns the shopping list of a user as an array/list

    Request:
        - userId: int - Google ID of the user
        - name: str - Name of the user

    returns:
        - status: 200/400
        - items: Updated shopping list
        - quantities: Updated quantities
        - checked_items: Which items are checked off
        - message: Error message
    """

    user_id: int = request.json.get("userId")
    name: str = request.json.get("name")

    if user_id is None:
        return jsonify(
            {
                "status": 400,
                "items": [],
                "quantities": [],
                "checked_items": [],
                "message": "User ID not provided",
            }
        )

    if name is None:
        return jsonify(
            {
                "status": 400,
                "items": [],
                "quantities": [],
                "checked_items": [],
                "message": "Name not provided",
            }
        )

    with sqlite3.connect("shopping.db") as conn:
        c = conn.cursor()

        items, quantities, checked_items, success = get_user_items(c, user_id)

        if not success:
            conn = sqlite3.connect("shopping.db")
            c = conn.cursor()

            c.execute(
                "INSERT INTO shopping VALUES (?, ?, ?, ?)",
                (user_id, json.dumps([]), json.dumps([]), json.dumps([])),
            )
            conn.commit()
            conn.close()

            return jsonify(
                {
                    "status": 200,
                    "items": [],
                    "quantities": [],
                    "checked_items": [],
                    "message": "",
                }
            )

        conn.commit()

    return jsonify(
        {
            "status": 200,
            "items": items,
            "quantities": quantities,
            "checked_items": checked_items,
            "message": "",
        }
    )


@shopping_bp.route("/additem", methods=["POST"])
def add_item():
    """
    Adds an item to the user's shopping list

    Request:
        - userId: int - Google ID of the user
        - item: str - Item being added to the list
        - quantity: int - Quantity of the item

    returns:
        - status: 200/400
        - message: Error message
    """
    user_id: int = request.json.get("userId")
    item: str = request.json.get("item")
    quantity: int = request.json.get("quantity")

    if user_id is None:
        return jsonify({"status": 400, "message": "User ID not provided"})

    if item is None:
        return jsonify({"status": 400, "message": "Item not provided"})

    if quantity is None or type(quantity) == str:
        return jsonify({"status": 400, "message": "Quantity not provided"})

    with sqlite3.connect("shopping.db") as conn:
        c = conn.cursor()

        items, quantities, checked_items, success = get_user_items(c, user_id)

        if not success:
            return jsonify(
                {
                    "status": 400,
                    "message": "Failed to get user's shopping list",
                }
            )

        items.append(item)
        quantities.append(quantity)
        checked_items.append(0)

        c.execute(
            "UPDATE shopping SET items = ?, quantities = ?, checked_items = ? WHERE user_id = ?",
            (
                json.dumps(items),
                json.dumps(quantities),
                json.dumps(checked_items),
                user_id,
            ),
        )

        conn.commit()

    return jsonify({"status": 200, "message": ""})


@shopping_bp.route("/updatequantity", methods=["POST"])
def update_quantity():
    """
    Updates the quantity for an item in the shopping list

    Request:
        - userId: int - Google ID of the user
        - index: int - Index of the quantity being updated to the list
        - value: int - The new quantity value

    returns:
        - status: 200/400
        - quantities: Updated quantities
        - message: Error message
    """

    user_id: int = request.json.get("userId")
    index: int = request.json.get("index")
    value: int = request.json.get("value")

    if user_id is None:
        return jsonify(
            {
                "status": 400,
                "quantities": [],
                "message": "User ID not provided",
            }
        )

    if index is None:
        return jsonify(
            {
                "status": 400,
                "quantities": [],
                "message": "Index not provided",
            }
        )

    with sqlite3.connect("shopping.db") as conn:
        c = conn.cursor()

        _, quantities, _, success = get_user_items(c, user_id)

        if not success:
            return jsonify(
                {
                    "status": 400,
                    "quantities": [],
                    "message": "Failed to get user's shopping list",
                }
            )

        quantities[index] = value

        c.execute(
            "UPDATE shopping SET quantities = ? WHERE user_id = ?",
            (
                json.dumps(quantities),
                user_id,
            ),
        )

        conn.commit()

    return jsonify({"status": 200, "quantities": quantities, "message": ""})


@shopping_bp.route("/deleteitem", methods=["POST"])
def delete_item():
    """
    Deletes a single given item from a user's shopping list

    Request:
        - userId: int - Google ID of the user
        - index: str - Index of the item being added to the list

    returns:
        - status: 200/400
        - items: Updated shopping list
        - quantities: Updated quantities
        - checked_items: Which items are checked off
        - message: Error message
    """
    user_id: int = request.json.get("userId")
    index: int = request.json.get("index")

    if user_id is None:
        return jsonify(
            {
                "status": 400,
                "items": [],
                "quantities": [],
                "checked_items": [],
                "message": "User ID not provided",
            }
        )

    if index is None:
        return jsonify(
            {
                "status": 400,
                "items": [],
                "quantities": [],
                "checked_items": [],
                "message": "Index not provided",
            }
        )

    with sqlite3.connect("shopping.db") as conn:
        c = conn.cursor()

        items, quantities, checked_items, success = get_user_items(c, user_id)

        if not success:
            return jsonify(
                {
                    "status": 400,
                    "items": [],
                    "quantities": [],
                    "checked_items": [],
                    "message": "Failed to get user's shopping list",
                }
            )

        items.pop(index)
        quantities.pop(index)
        checked_items.pop(index)

        c.execute(
            "UPDATE shopping SET items = ?, quantities = ?, checked_items = ? WHERE user_id = ?",
            (
                json.dumps(items),
                json.dumps(quantities),
                json.dumps(checked_items),
                user_id,
            ),
        )

        conn.commit()

    return jsonify(
        {
            "status": 200,
            "items": items,
            "quantities": quantities,
            "checked_items": checked_items,
            "message": "",
        }
    )


@shopping_bp.route("/deleteall", methods=["POST"])
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
        return jsonify({"status": 400, "message": "User ID not provided"})

    with sqlite3.connect("shopping.db") as conn:
        c = conn.cursor()

        c.execute(
            "UPDATE shopping SET items = ?, quantities = ?, checked_items = ? WHERE user_id = ?",
            (
                json.dumps([]),
                json.dumps([]),
                json.dumps([]),
                user_id,
            ),
        )

        conn.commit()

    return jsonify({"status": 200, "message": ""})


@shopping_bp.route("/toggleitemcheck", methods=["POST"])
def toggle_item_check():
    """
    Toggles an item being checked

    Request:
        - userId: int - Google ID of the user
        - index: int - The index of the item

    returns:
        - status: 200/400
        - message: Error message
    """

    user_id: int = request.json.get("userId")
    index: int = request.json.get("index")

    if user_id is None:
        return jsonify({"status": 400, "message": "User ID not provided"})

    if index is None:
        return jsonify({"status": 400, "message": "Index not provided"})

    with sqlite3.connect("shopping.db") as conn:
        c = conn.cursor()

        c.execute(
            "SELECT checked_items FROM shopping WHERE user_id = ?",
            (user_id,),
        )

        result = c.fetchone()
        if result is None:
            return jsonify({"status": 400, "message": "User not found"})

        checked_items = json.loads(result[0]) if result[0] else []

        if index < 0 or index >= len(checked_items):
            return jsonify({"status": 400, "message": "Invalid item index"})

        checked_items[index] = 0 if checked_items[index] == 1 else 1

        c.execute(
            "UPDATE shopping SET checked_items = ? WHERE user_id = ?",
            (
                json.dumps(checked_items),
                user_id,
            ),
        )

        conn.commit()

    return jsonify({"status": 200, "message": ""})
