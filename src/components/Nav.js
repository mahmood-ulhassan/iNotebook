import React, { useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Notecontext from "../Context/Notecontext";

function Nav({ showAlert }) {
  const navigate = useNavigate();
  const authToken = sessionStorage.getItem("authToken");
  const { resetStates } = useContext(Notecontext);

  const logout = () => {
    // Remove authToken from session storage
    sessionStorage.removeItem("authToken");
    showAlert("User logged out successfully","secondary")
    navigate("/login");
    resetStates();
    // Programmatically click the login link to redirect
  };

  return (
    <div>
      <nav
        className="navbar bg-dark fixed-top border-bottom border-body navbar-expand-lg"
        data-bs-theme="dark"
      >
        <div className="container-fluid">
          <Link className="navbar-brand text-white" to="/">
            iNotebook
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/about">
                  About
                </Link>
              </li>
            </ul>
          </div>
          {authToken ? (
            // Render logout button if user is logged in
            <button onClick={logout} className="btn btn-outline-danger">
              Logout
            </button>
          ) : (
            // Render login and signup buttons if user is not logged in
            <div className="d-flex">
              <Link to="/signup" className="btn btn-outline-success mr-2">
                Signup
              </Link>
              <Link to="/login" className="btn btn-outline-success">
                Login
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Nav;
