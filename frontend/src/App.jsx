import axios from "axios";
import { useState } from "react";
import "./App.css";

function App() {
  const [helloWorld, setHelloWorld] = useState("");

  async function fetchHelloWorld() {
    await axios
      .get("http://localhost:8080/hello")
      .then((response) => {
        setHelloWorld(response.data.message);
      })
      .catch((e) => console.error("Error fetching data:", e));
  }

  return (
    <div>
      <button onClick={fetchHelloWorld}>Say hello world</button>
      <h1>{helloWorld}</h1>
    </div>
  );
}

export default App;
