import React, {useRef, useState} from "react";
import {auth, store} from "../../firebase";
import backgroundImage from "../../resource/LoginPageImage1.png";
import logoImage from "../../resource/LoginPageLogo1.png"
import {Form, Card, Alert} from "react-bootstrap";
import {Link, useHistory} from "react-router-dom";
import {UseAuth} from "../../hoc/AuthContext";
import "../ProfessorPage/Sections/AdminLecture.css";

const LoginPage = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const history = useHistory();
    const {logIn} = UseAuth();

    async function handleSubmit(e) {
        e.preventDefault();

        // try {
        //   setError("");
        //   setLoading(true);
        //   await login(emailRef.current.value, passwordRef.current.value);
        //   if (currentUser.isProfessor === "on") {
        //     history.push("/professorpage");
        //   } else {
        //     history.push("/studentpage");
        //   }
        // } catch {
        //   setError("Failed to sign in");
        // }
        setError("");
        setLoading(true);
        await logIn(emailRef.current.value, passwordRef.current.value);

        const ref = store.collection("User").doc(auth.currentUser.uid);
        ref.get().then((item) => {
            auth.currentUser.isProfessor = item.data().isProfessor;
            if (auth.currentUser.isProfessor === "on") {
                history.push("/professorpage");
            } else {
                history.push("/studentpage");
            }
        });
    }

    return (
        <div style={{backgroundColor: "blue"}}>
            <img
                src={backgroundImage}
                style={{
                    position: "absolute",
                    top: "30%",
                    left: "15%",
                    transform: "translate(-50%)",
                    alignItems: "center",
                }}
                alt="backgroundImage"/>
            <img
                src={logoImage}
                style={{
                    position: "absolute",
                    top: "25%",
                    left: "45%",
                    transform: "translate(-50%)",
                    alignItems: "center",
                }}
                alt="logoImage"/>
            <Card
                style={{
                    position: "absolute",
                    top: "30%",
                    left: "80%",
                    transform: "translate(-50%)",
                    width: "28rem",
                    alignItems: "center",
                    border: "solid",
                    borderColor: "#c4c4c4",
                    borderRadius: 15,
                }}
            >
                <Card.Body>
                    <h2 className="text-center mb4" style={{color: "#807E7E"}}>
                        로그인
                    </h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                style={{borderRadius: 10}}
                                type="email"
                                ref={emailRef}
                                required
                            />
                        </Form.Group>
                        <Form.Group id="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                style={{borderRadius: 10}}
                                type="password"
                                ref={passwordRef}
                                required
                            />
                        </Form.Group>
                        <button
                            className="w-100"
                            style={{
                                backgroundColor: "#D65E2A",
                                color: "white",
                                fontSize: 20,
                                border: "solid",
                                borderColor: "#c4c4c4",
                                borderRadius: 10,
                            }}
                            type="submit"
                            disabled={loading}
                        >
                            로그인
                        </button>
                    </Form>
                    <div className="w-100 text-center mt-2">
                        <Link to="/signup">계정이 필요하신가요?</Link>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};
export default LoginPage;
