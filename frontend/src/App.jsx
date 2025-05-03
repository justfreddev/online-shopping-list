import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Landing from "./components/Landing";
import Shopping from "./components/Shopping";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/shopping" element={<Shopping />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
