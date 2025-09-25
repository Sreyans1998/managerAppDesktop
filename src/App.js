import React, { useState } from "react";

import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import "./App.css";
import { CircularProgress } from "@mui/material";
import { ToastContainer } from "react-toastify";
import Home from "./components/Home";

function App() {
  const [loader, setLoader] = useState(false);
  const [operations, setOperations] = useState([]);

  const darkTheme = createTheme({
    palette: {
      mode: "dark", // handle the dark mode state on toggle
      primary: {
        main: "#0d1b2a",
      },
      secondary: {
        main: "#fff",
      },
    },
  });
  
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App bg-dark">
        {loader && (
          <div className="loader">
            <CircularProgress />
          </div>
        )}
        {/* <Home setLoader={setLoader} setOperations={setOperations} operations={operations} /> */}
        <Home
          setLoader={setLoader}
          setOperations={setOperations}
          operations={operations}
        />
        <ToastContainer
          theme="colored"
          position="bottom-right"
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          autoClose={2000}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
