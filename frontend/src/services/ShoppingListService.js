import axios from "axios";

const API_URL = "http://localhost:8080/shopping";

export const ShoppingListService = {
  getShoppingList: async (userId, name) => {
    try {
      const response = await axios.post(
        `${API_URL}/getlist`,
        {
          userId: userId,
          name: name,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.status === 400) {
        throw new Error(response.data.message);
      }

      return [
        response.data.items,
        response.data.quantities,
        response.data.checked_items,
      ];
    } catch (e) {
      console.error("Error getting shopping list:", e);
      throw e;
    }
  },

  addItem: async (userId, item, quantity) => {
    try {
      const response = await axios.post(
        `${API_URL}/additem`,
        {
          userId: userId,
          item: item,
          quantity: quantity,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.status === 400) {
        throw new Error(response.data.message);
      }

      return [
        response.data.items,
        response.data.quantities,
        response.data.checked_items,
      ];
    } catch (e) {
      console.error("Error adding item:", e);
      throw e;
    }
  },

  updateQuantity: async (userId, index, value) => {
    try {
      const response = await axios.post(
        `${API_URL}/updatequantity`,
        {
          userId: userId,
          index: index,
          value: value,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.status === 400) {
        throw new Error(response.data.message);
      }

      return response.data.quantities;
    } catch (e) {
      console.error("Error deleting item:", e);
      throw e;
    }
  },

  deleteItem: async (userId, index) => {
    try {
      const response = await axios.post(
        `${API_URL}/deleteitem`,
        {
          userId: userId,
          index: index,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.status === 400) {
        throw new Error(response.data.message);
      }

      return [
        response.data.items,
        response.data.quantities,
        response.data.checked_items,
      ];
    } catch (e) {
      console.error("Error deleting item:", e);
      throw e;
    }
  },

  deleteAllItems: async (userId) => {
    try {
      const response = await axios.post(
        `${API_URL}/deleteall`,
        {
          userId: userId,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
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

  toggleItemChecked: async (userId, index) => {
    try {
      const response = await axios.post(
        `${API_URL}/toggleitemcheck`,
        {
          userId: userId,
          index: index,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.status === 400) {
        throw new Error(response.data.message);
      }

      return;
    } catch (e) {
      console.error("Error checking item off list:", e);
      throw e;
    }
  },
};
