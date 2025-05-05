import { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { ShoppingListService } from "../services/ShoppingListService";
import ShoppingList from "./ShoppingList";

import "./Shopping.css";

const Shopping = (props) => {
  const itemTextRef = useRef(null);
  const quantityTextRef = useRef(null);
  const [isValidItem, setIsValidItem] = useState(true);
  const [isValidQuantity, setIsValidQuantity] = useState(true);
  const [shoppingList, setShoppingList] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [quantityErrors, setQuantityErrors] = useState({});
  const [checkedItems, setCheckedItems] = useState([]);

  // Validates if a quantity number is valid
  function validateQuantity(itemQuantity) {
    const numValue = parseInt(itemQuantity);
    return !(
      itemQuantity === "" ||
      isNaN(numValue) ||
      numValue < 1 ||
      !Number.isInteger(parseFloat(itemQuantity))
    );
  }

  // Fetches the shopping list as soon as the Shopping component loads (when page loads)
  useEffect(() => {
    async function fetchShoppingList() {
      try {
        const [items, quantities_, checkedItems_] =
          await ShoppingListService.getShoppingList(props.userId, props.name);
        setShoppingList(items);
        setQuantities(quantities_);
        setCheckedItems(checkedItems_);
      } catch {
        alert("Failed to fetch shopping list. Please try again.");
        setShoppingList([]);
        setQuantities([]);
      }
    }
    fetchShoppingList();
  }, [props.userId, props.name]);

  async function addItem() {
    // Gets item and quantity values
    const item = itemTextRef.current.value.trim();
    const itemQuantity = quantityTextRef.current.value.trim();

    // Validates the values
    const quantityValid = validateQuantity(itemQuantity);
    const itemValid = item !== "";

    setIsValidQuantity(quantityValid);
    setIsValidItem(itemValid);

    if (!quantityValid || !itemValid) {
      return;
    }

    try {
      await ShoppingListService.addItem(
        props.userId,
        item,
        parseInt(itemQuantity)
      );
      setShoppingList([...shoppingList, item]);
      setQuantities([...quantities, itemQuantity]);

      // Resets the inputs for item and quantity
      itemTextRef.current.value = "";
      quantityTextRef.current.value = "1";
    } catch {
      alert("Failed to add item. Please try again.");
    }
  }

  async function updateQuantity(index, value) {
    try {
      const updatedQuantities = await ShoppingListService.updateQuantity(
        props.userId,
        index,
        value
      );
      setQuantities(updatedQuantities);
    } catch {
      alert("Failed to update quantity. Please try again.");
    }
  }

  async function handleDeleteItem(index) {
    try {
      const [updatedItems, updatedQuantities, updatedCheckedItems] =
        await ShoppingListService.deleteItem(props.userId, index);
      setShoppingList(updatedItems);
      setQuantities(updatedQuantities);
      setCheckedItems(updatedCheckedItems);
    } catch {
      alert("Failed to delete item. Please try again.");
    }
  }

  async function deleteAllItems() {
    try {
      await ShoppingListService.deleteAllItems(props.userId);
      setShoppingList([]);
      setQuantities([]);
      setQuantityErrors({});
    } catch {
      alert("Failed to delete items. Please try again.");
    }
  }

  async function toggleItemChecked(index) {
    try {
      const newCheckedItems = [...checkedItems];
      newCheckedItems[index] = !newCheckedItems[index];
      
      setCheckedItems(newCheckedItems);
      
      await ShoppingListService.toggleItemChecked(
        props.userId,
        index,
      );
    } catch (error) {
      console.error("Failed to update item checked status:", error);

      const revertedCheckedItems = [...checkedItems];
      setCheckedItems(revertedCheckedItems);
    }
  }

  return (
    <div className="shopping-container">
      <Button
        variant="text"
        onClick={props.handleLogout}
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          textTransform: "none",
          color: "#5f6368",
          fontWeight: 500,
        }}
      >
        Log out
      </Button>
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
          <ShoppingList
            list={shoppingList}
            quantities={quantities}
            handleDelete={handleDeleteItem}
            updateQuantity={updateQuantity}
            quantityErrors={quantityErrors}
            setQuantityErrors={setQuantityErrors}
            validateQuantity={validateQuantity}
            checkedItems={checkedItems}
            toggleItemChecked={toggleItemChecked}
          />
        </div>

        <div className="additem-container">
          <TextField
            label="Item"
            helperText={!isValidItem ? "Item invalid" : ""}
            error={!isValidItem}
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
            onChange={(e) => {
              if (e.target.value.trim() !== "") {
                setIsValidItem(true);
              }
            }}
            onBlur={(e) => {
              if (e.target.value.trim() !== "") {
                setIsValidItem(true);
              }
            }}
          />
          <TextField
            label="Quantity"
            defaultValue={1}
            helperText={!isValidQuantity ? "Quantity invalid" : ""}
            error={!isValidQuantity}
            variant="outlined"
            inputRef={quantityTextRef}
            type="number"
            sx={{ mb: 2, width: "125px" }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addItem();
              }
            }}
            onChange={(e) => {
              setIsValidQuantity(validateQuantity(e.target.value));
            }}
            onBlur={(e) => {
              setIsValidQuantity(validateQuantity(e.target.value));
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
