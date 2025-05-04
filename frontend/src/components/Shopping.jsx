import { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { ShoppingListService } from "../services/ShoppingListService";
import ShoppingList from "./ShoppingList";

import "./Shopping.css";

const Shopping = (props) => {
  const itemTextRef = useRef(null);
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    async function fetchShoppingList() {
      try {
        const items = await ShoppingListService.getShoppingList(
          props.userId,
          props.name
        );
        setShoppingList(items);
      } catch (error) {
        console.error("Error fetching shopping list:", error);
        setShoppingList([]);
      }
    }
    fetchShoppingList();
  }, [props.userId, props.name]);

  async function handleDeleteItem(index) {
    try {
      const updatedItems = await ShoppingListService.deleteItem(
        props.userId,
        index
      );
      setShoppingList(updatedItems);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }

  async function addItem() {
    const item = itemTextRef.current.value.trim();
    if (item === "") {
      return;
    }

    try {
      const updatedList = await ShoppingListService.addItem(props.userId, item);
      setShoppingList(updatedList);
      itemTextRef.current.value = "";
    } catch (error) {
      console.error("Error adding item:", error);
    }
  }

  async function deleteAllItems() {
    try {
      await ShoppingListService.deleteAllItems(props.userId);
      setShoppingList([]);
    } catch (error) {
      console.error("Error deleting all items:", error);
    }
  }

  return (
    <div className="shopping-container">
      <h1>Shopping List</h1>
      <h4>Welcome back {props.name}! Here is your shopping list</h4>
      <div className="shopping-content-container">
        <div className="delete-button-container">
          <Button
            onClick={deleteAllItems}
            variant="outlined"
            color="error"
            sx={{
              height: 50,
              borderRadius: "24px",
              px: 3,
            }}
          >
            Delete all items
          </Button>
        </div>

        <div className="shopping-list-container">
          <ShoppingList list={shoppingList} handleDelete={handleDeleteItem} />
        </div>

        <div className="additem-container">
          <TextField
            label="Enter item here"
            variant="outlined"
            fullWidth
            inputRef={itemTextRef}
            sx={{ mb: 2 }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addItem();
              }
            }}
          />
          <Button
            onClick={addItem}
            variant="contained"
            color="primary"
            sx={{
              borderRadius: "24px",
              px: 3,
              width: "100%",
              textTransform: "none",
            }}
          >
            Add Item
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Shopping;
