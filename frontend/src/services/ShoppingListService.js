import axios from "axios";

const API_URL = "http://localhost:8080/shopping";

export const ShoppingListService = {
  getShoppingList: async (userId, name) => {
    try {
      const response = await axios.post(
        `${API_URL}/getlist`,
        {
          "userId": userId,
          "name": name,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.status === 400) {
        throw new Error(response.data.message);
      }

      return response.data.items;
    } catch (e) {
      console.error("Error getting shopping list:", e);
      throw e;
    }
  },

  deleteItem: async (userId, index) => {
    try {
      const response = await axios.post(
        `${API_URL}/deleteitem`,
        {
          "userId": userId,
          "index": index,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.status === 400) {
        throw new Error(response.data.message);
      }

      return response.data.items;
    } catch (e) {
      console.error("Error deleting item:", e);
      throw e;
    }
  },

  addItem: async (userId, item) => {
    try {
      const response = await axios.post(
        `${API_URL}/additem`,
        {
          "userId": userId,
          "item": item,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.status === 400) {
        throw new Error(response.data.message);
      }

      return response.data.items;
    } catch (e) {
      console.error("Error adding item:", e);
      throw e;
    }
  },

  deleteAllItems: async (userId) => {
    try {
      const response = await axios.post(
        `${API_URL}/deleteall`,
        {
          "userId": userId,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.status === 400) {
        throw new Error(response.data.message);
      }

      return;
    } catch (e) {
      console.error("Error deleting all items:", e);
      throw e;
    }
  },
};