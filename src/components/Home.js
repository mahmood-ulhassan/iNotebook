import React, { useState, useEffect, useContext } from "react";
import Notes from "./Notes";
import { useNavigate } from "react-router-dom";
import Notecontext from "../Context/Notecontext";

const Home = ({ showAlert}) => {
  const navigate = useNavigate();
  const { user } = useContext(Notecontext);

  useEffect(() => {
    const authToken = sessionStorage.getItem("authToken");
    if (authToken === null || authToken === undefined) {
      // If authentication token is not found, redirect to login page
      showAlert("Please Login","warning")
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <h1 style={{ marginTop: "7rem" }}>
        {user
          ? `Welcome to iNotebook ${
              user.name.charAt(0).toUpperCase() + user.name.slice(1)
            }`
          : "Loading..."}
      </h1>
      <Notes showAlert={showAlert} />
    </div>
  );
};

export default Home;
