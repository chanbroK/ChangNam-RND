import React, { useState } from "react";
import { UseAuth } from "../../hoc/AuthContext";
import { useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";

export default function Logout() {
  const [error, setError] = useState("");
  const { logOut } = UseAuth();
  const history = useHistory();

  async function handleLogout() {
    setError("");
    try {
      await logOut();
      history.push("/");
    } catch {
      setError("Failed to log out");
    }
  }

  return (
    <>
      <button
        onClick={handleLogout}
        varient="link"
        style={{ backgroundColor: "white", color: "black" }}
      >
        logout
      </button>
    </>
  );
}
