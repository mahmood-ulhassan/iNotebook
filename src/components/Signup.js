import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

function Signup({ showAlert }) {
  const [credentials, setCredentials] = useState({name:"", email: "", password: "" }); // State variable for login credentials
  let navigate = useNavigate(); // Access history object for navigation

  const signup = (e) => {
    e.preventDefault();
    fetch("https://i-notebook-api-three-iota.vercel.app/api/auth/signup", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: credentials.name,
    email: credentials.email,
    password: credentials.password,
  }),
})
  .then((response) => {
    if (response.status === 409) {
      throw new Error("User with this email already exists");
    }
    if (!response.ok) {
      throw new Error("Signup failed");
    }
    showAlert("User Signedup Successfully", "success");
    navigate("/login");
  })
  .catch((error) => {
    console.error("Error signing up the user", error);
    showAlert("Signup Failed: " + error.message, "danger");
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
    <div className="container" style={{ marginTop: "90px" }}>
      <h2>SIGNUP TO INOTEBOOK</h2>
      <form onSubmit={signup}>
      <div className="form-group ">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            id="name"
            aria-describedby="emailHelp"
            placeholder="Enter name"
            value={credentials.name}
            onChange={handleInputChange}
            required
          />
        </div>
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
            required
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
            required
            onChange={handleInputChange}
            minLength="5"
            pattern="(?=.*[a-zA-Z])(?=.*\d).{5,}"
            title="Password must be at least 5 characters long and contain both numbers and alphabets."

          />
        </div>

        <button type="submit" className="btn btn-primary">
          Signup
        </button>
      </form>
    </div>
  );
}

export default Signup;
