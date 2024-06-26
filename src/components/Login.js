import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Notecontext from "../Context/Notecontext";
import Alert from "./Alert";

function Login({ showAlert }) {
  const { setpagestate } = useContext(Notecontext);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  let navigate = useNavigate();

  const login = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Login failed");
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.authtoken) {
          const authToken = data.authtoken;
          sessionStorage.setItem("authToken", authToken);
          setpagestate(true);
          showAlert("Login Successfull", "success");
          navigate("/");
        } else {
          throw new Error("Auth token not found in response");
        }
      })
      .catch((error) => {
        console.error("Error logging in the user", error);
        showAlert("Login failed: " + error.message, "danger");
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  return (
    <div className="container" style={{ marginTop: "120px" }}>
      <h2>LOGIN TO INOTEBOOK</h2>
      <form onSubmit={login}>
        <div className="form-group ">
          <label htmlFor="exampleInputEmail1">Email address</label>
          <input
            type="email"
            className="form-control"
            name="email"
            id="email"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            value={credentials.email}
            onChange={handleInputChange}
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="exampleInputPassword1">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            id="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
