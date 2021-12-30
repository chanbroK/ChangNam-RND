import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { UseAuth } from "../../hoc/AuthContext";
export default function SignUp() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const isprofessor = useRef();
  const idRef = useRef();
  const name = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [isProf, setIsProf] = useState("off");
  const { signUp } = UseAuth();
  async function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }

    setError("");
    setLoading(true);
    await signUp(
      emailRef.current.value,
      passwordRef.current.value,
      isProf,
      name.current.value,
      idRef.current.value
    );

    if (isProf === "on") {
      history.push("/professorpage");
    } else {
      history.push("/studentpage");
    }
  }

  return (
    <div>
      <div classNmae="w-100" style={{ alignContent: "center" }}>
        <Card style={{ justifyContent: "center", alignItems: "center" }}>
          <Card.Body>
            <h2 className="text-center mb4">Sign Up</h2>

            {error && <Alert variant="danger">{error}</Alert>}
            <Form style={{ alignItems: "center", maxWidth: "400px" }} onSubmit={handleSubmit}>
              <Form.Group id="email">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" ref={emailRef} required />
              </Form.Group>
              <Form.Group id="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" ref={passwordRef} required />
              </Form.Group>
              <Form.Group id="password-confirm">
                <Form.Label>Password Confirmation</Form.Label>
                <Form.Control type="password" ref={passwordConfirmRef} required />
              </Form.Group>
              <Form.Group id="id">
                <Form.Label>학번/교번</Form.Label>
                <Form.Control type="text" ref={idRef} required />
              </Form.Group>
              <Form.Group id="name">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" ref={name} required />
              </Form.Group>
              <Form.Group id="isprofessor">
                <Form.Label>교수님이신가요?</Form.Label>
                <Form.Control type="hidden" ref={isprofessor} name="checkbox1" />
                <Form.Control
                  type="checkbox"
                  ref={isprofessor}
                  name="on"
                  onChange={e => {
                    if (isProf === "off") {
                      setIsProf("on");
                    } else {
                      setIsProf("off");
                    }
                  }}
                />
              </Form.Group>
              <Button className="w-100" type="submit" disabled={loading}>
                Sign Up
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </div>
      <div className="w-100 text-center mt-2">
        Already have an account? <Link to="/">Log In</Link>
      </div>
    </div>
  );
}
