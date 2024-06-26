import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import Notecontext from "./Notecontext";
import Alert from "../components/Alert"

const Notestate = ({ children, showAlert}) => {
  const [state, setState] = useState([]);
  const [user, setUser] = useState(null); // Initialize user state with null
  const [pageload, setpageload] = useState(false);
  const [keychange, setkeychange] = useState(0);
  const navigate = useNavigate(); // Initialize navigate hook

  useEffect(() => {
    //Fetch all notes
    const authToken = sessionStorage.getItem("authToken");
    if (authToken === null || authToken === undefined) {
      // If authentication token is not found, redirect to login page
      navigate("/login");
      return; // Return early to prevent further execution of useEffect
    }

    // Fetch User Data
    fetch("http://localhost:5000/api/auth/getuser", {
      method: "POST",
      headers: {
        authtoken: authToken,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch user data");
          showAlert("Failed to fetch user data","danger")

        }
      })
      .then((data) => {
        setUser(data); // Update user state with fetched user data
      })
      .catch((error) => {
        showAlert("Failed to fetch user data","danger")
      });

    // Fetch notes only if authentication token is present
    fetch("http://localhost:5000/api/note/fetchallnotes", {
      headers: {
        authtoken: authToken,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch notes");
        }
      })
      .then((data) => {
        setState(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [pageload, keychange]); // Pass navigate as a dependency to useEffect

  const updateState = (newState) => {
    setState(newState);
  };
  const setpagestate = (page) => {
    setpageload(page);

  };
  const resetStates = () => {
    // Reset all states to their initial values
    setState([]);
    setUser(null);
    setpagestate(false)
    // Add more states to reset here if needed
  };

  const resetkeychange = () => {
    // Reset all states to their initial values
   setkeychange(keychange+1)
    // Add more states to reset here if needed
  };

  const deleteNote = (note) => {
    console.log(note)
    fetch(`http://localhost:5000/api/note/deletenote/${note._id}`, {
      method: "DELETE",
      headers: {
        authtoken: sessionStorage.getItem("authToken"),
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Note deleted from database", data);
        const updatedState = state.filter((item) => item._id !== note._id);
        updateState(updatedState);
        showAlert("Note successfully deleted","success")
      })
      .catch((error) => {
        console.error("Error deleting note from database:", error);
      });
  };

  return (
    <Notecontext.Provider value={{ state, user, updateState, deleteNote, resetStates, setpagestate, resetkeychange }}>
      {children}
    </Notecontext.Provider>
  );
};

export default Notestate;
