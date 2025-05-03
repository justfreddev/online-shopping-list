import { useState } from "react";

import ShoppingList from "./ShoppingList";

import "./Shopping.css";

const Shopping = (props) => {
  const [tempShoppingList, setTempShoppingList] = useState([
    "Apples",
    "Bananas",
    "Cherries",
  ]);

  function handleDelete(item) {
    const updatedList = tempShoppingList.filter((v) => item !== v);
    setTempShoppingList(updatedList);
  }

  return (
    <div className="shopping-container">
      <h1>Welcome back {props.name}!</h1>
      <ShoppingList list={tempShoppingList} handleDelete={handleDelete} />
    </div>
  );
};

export default Shopping;
