import React from "react";
import {auth, store} from "../../firebase";
import backgroundImage from "../../resource/LoginPageImage1.png";
import logoImage from "../../resource/LoginPageLogo1.png"
import {Form, Card} from "react-bootstrap";
import {useHistory} from "react-router-dom";
import {UseAuth} from "../../AuthContext";

const LoginPage = () => {
    const emailRef = React.useRef<HTMLInputElement>(null);
    const passwordRef = React.useRef<HTMLInputElement>(null);
    const history = useHistory();
    const {logIn} = UseAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        if (emailRef.current && passwordRef.current) {
            await logIn(emailRef.current.value, passwordRef.current.value);

        }
        if (auth.currentUser) {
            const ref = store.collection("User").doc(auth.currentUser.uid);
            ref.get().then((item) => {
                // @ts-ignore
                auth.currentUser.isProfessor = item.data().isProfessor;
                // @ts-ignore
                if (auth.currentUser.isProfessor === "on") {
                    history.push("/professorpage");
                } else {
                    history.push("/studentpage");
                }
            });
        }
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
                }}
                alt="backgroundImage"/>
            <img
                src={logoImage}
                style={{
                    position: "absolute",
                    top: "25%",
                    left: "45%",
                    transform: "translate(-50%)",
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
                            style={{
                                position: "relative",
                                left: "4.5vw",
                                margin: "2px",
                                width: "10vw",
                                backgroundColor: "#D65E2A",
                                color: "white",
                                fontSize: 20,
                                border: "solid",
                                borderColor: "#c4c4c4",
                                borderRadius: 10,
                            }}
                            type="submit"
                        >
                            로그인
                        </button>
                        <button style={{
                            position: "relative",
                            left: "4.5vw",
                            top: "1vh",
                            margin: "2px",
                            width: "10vw",
                            backgroundColor: "#D65E2A",
                            color: "white",
                            fontSize: 20,
                            border: "solid",
                            borderColor: "#c4c4c4",
                            borderRadius: 10,
                        }} onClick={(e) => {
                            e.preventDefault();
                            history.push("/signup");
                        }}>회원가입
                        </button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};
export default LoginPage;
