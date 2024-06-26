import "./App.css";
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Nav";
import Home from "./components/Home";
import About from "./components/About";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Alert from "./components/Alert";
import Notestate from "./Context/Notestate";

function App() {
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [noteKey, setNoteKey] = useState(0);

  const showAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);

    // Automatically hide the alert after 3 seconds
    setTimeout(() => {
      setAlertMessage('');
    }, 1000); // 3000 milliseconds = 3 seconds
  };

  const handleNoteAdded = () => {
    setNoteKey(prevKey => prevKey + 1);
  };

  try {
    return (
      <div className="App">
        <Router>
          <Notestate showAlert={showAlert} key={noteKey}>
            <Navbar showAlert={showAlert}/>
            {alertMessage && <Alert message={alertMessage} type={alertType} />}
            <div>
              <Routes>
                <Route
                  exact
                  path="/"
                  element={
                    <Home showAlert={showAlert} onNoteAdded={handleNoteAdded}/>
                  }
                />
                <Route
                  exact
                  path="/about"
                  element={
                    <About showAlert={showAlert}/>
                  }
                />
                <Route
                  exact
                  path="/login"
                  element={
                    <Login showAlert={showAlert}/>
                  }
                />
                <Route
                  exact
                  path="/signup"
                  element={
                    <Signup showAlert={showAlert}/>
                  }
                />
              </Routes>
            </div>
          </Notestate>
        </Router>
      </div>
    );
  } catch (error) {
    console.error("Error in rendering App:", error);
    return (
      <div className="error">
        <h1>Error</h1>
        <p>Oops! Something went wrong.</p>
      </div>
    );
  }
}

export default App;
