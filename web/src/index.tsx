import ReactDOM from "react-dom";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import {AuthProvider} from "./components/AuthContext";
import NavBar from "./components/views/Navbar/NavBar";
import LoginPage from "./components/views/LoginPage/LoginPage";
import SignUp from "./components/views/SignUp/SignUp";
import StudentPage from "./components/views/StudentPage/StudentPage";
import ProfessorPage from "./components/views/ProfessorPage/ProfessorPage";
import AdminLecture from "./components/views/AdminLecture/AdminLecture";
import CheckAttendance from "./components/views/CheckAttendance/CheckAttendance";
import RecordLectureList from "./components/views/RecordLectureList/RecordLectureList";
import RegisterLecture from "./components/views/ProfessorPage/RegisterLecture";
import LiveLecture from "./components/views/LiveLecture/LiveLecture";
import RecordVideo from "./components/views/RecordVideo/RecordVideo";
import React, {Suspense} from "react";

ReactDOM.render(
    <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
            <AuthProvider>
                <NavBar/>
                <div style={{paddingTop: "75px"}}>
                    <Switch>
                        <Route exact path="/" component={LoginPage}/>
                        <Route path="/signup" component={SignUp}/>
                        <Route exact path="/studentpage" component={StudentPage}/>
                        <Route exact path="/professorpage" component={ProfessorPage}/>
                        <Route
                            exact
                            path="/professorpage/adminlecture/:lecture"
                            component={AdminLecture}
                        />
                        <Route
                            exact
                            path="/studentpage/checkattendance/:lecture"
                            component={CheckAttendance}
                        />
                        <Route
                            path="/studentpage/recordlecturelist/:lecture"
                            component={RecordLectureList}
                        />
                        <Route
                            exact
                            path="/professorpage/addlecture"
                            component={RegisterLecture}
                        />
                        <Route exact path="/livelecture/:lecture" component={LiveLecture}/>
                        <Route
                            path="/recordvideo/:lecture/:round"
                            component={RecordVideo}
                        />
                    </Switch>
                </div>
            </AuthProvider>
        </Suspense>
    </BrowserRouter>
    ,

    document.getElementById("root")
);