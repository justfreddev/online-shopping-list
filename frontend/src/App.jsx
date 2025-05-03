import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./components/Landing";
import Shopping from "./components/Shopping";

import "./App.css";

function App() {
  const [userId, setUserId] = useState(0);
  const [name, setName] = useState("");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Landing setName={setName} setUserId={setUserId} />}
        />
        <Route
          path="/shopping"
          element={<Shopping name={name} userId={userId} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
