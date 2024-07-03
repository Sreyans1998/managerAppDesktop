import React, { useState } from "react";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import Home from "./components/home";
import { CircularProgress } from "@mui/material";
import { ToastContainer } from "react-toastify";

function App() {
  const [loader, setLoader] = useState(false);
  const [operations, setOperations] = useState([]);
  return (
    <div className="App bg-dark">
      {loader && (
        <div className="loader">
          <CircularProgress />
        </div>
      )}
      <Home setLoader={setLoader} setOperations={setOperations} operations={operations} />
      <ToastContainer
        theme="colored"
        position="bottom-right"
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        autoClose={2000}
      />
    </div>
  );
}

export default App;
