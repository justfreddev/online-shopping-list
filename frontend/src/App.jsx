import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Landing from "./components/Landing";
import Shopping from "./components/Shopping";

import "./App.css";

function App() {
  const [userId, setUserId] = useState(0);
  const [name, setName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Landing
              setIsAuthenticated={setIsAuthenticated}
              setName={setName}
              setUserId={setUserId}
            />
          }
        />
        <Route
          path="/shopping"
          element={
            isAuthenticated ? (
              <Shopping name={name} userId={userId} />
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
