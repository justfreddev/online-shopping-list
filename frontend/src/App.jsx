import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

import Landing from "./components/Landing";
import Shopping from "./components/Shopping";

import "./App.css";

function App() {
  const [userId, setUserId] = useState(0);
  const [name, setName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function validateSession() {
      try {
        const response = await axios.post(
          `http://localhost:8080/auth/checksession`,
          {},
          {
            headers: { "Content-Type": "application/json"},
            withCredentials: true
          }
        );

        if (response.data.authenticated === false) {
          return;
        }
        setUserId(response.data.userId)
        setName(response.data.name)
        setIsAuthenticated(true)
      } catch (e) {
        console.error("Session validation error:", e);
      }
    }
    validateSession();
  }, []);

  async function handleLogout() {
    try {
      const response = await axios.post(
        `http://localhost:8080/auth/logout`,
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true
        }
      );

      if (response.data.status === 400) {
        throw new Error(response.data.message);
      }

      setIsAuthenticated(false)
      setUserId(0)
      setName("")
    } catch (e) {
      console.error("Error logging out:", e);
    }
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/shopping" replace />
            ) : (
            <Landing
              setIsAuthenticated={setIsAuthenticated}
              setName={setName}
              setUserId={setUserId}
              userId={userId}
              name={name}
            />
            )
          }
        />
        <Route
          path="/shopping"
          element={
            isAuthenticated ? (
              <Shopping handleLogout={handleLogout} name={name} userId={userId} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
