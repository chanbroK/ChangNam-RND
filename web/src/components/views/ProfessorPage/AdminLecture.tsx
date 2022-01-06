import React from "react";
import "./Sections/AdminLecture.css";
import StudentList from "./Sections/StudentList";
import {Link} from "react-router-dom";
import AttendBoard from "./Sections/AttendBoard";
import * as type from "../../type";

const AdminLecture = ({match}) => {
    const [Open, setOpen] = React.useState(false);
    const [id, setId] = React.useState<type.StudentInfo>(null);
    const changeOpen = () => {
        setOpen((o) => !o);
    };
    const changeId = (val?: type.StudentInfo) => {
        if (val !== undefined) {
            setId(val);
        }
        return id;
    };
    return (
        <div className="row" style={{width: "75%", margin: "6rem auto"}}>
            <div className="col-md-6">
        <span
            className="badge "
            style={{
                width: "100px",
                display: "block",
                marginBottom: "20px",
                fontSize: "1rem",
                backgroundColor: "#D65E2A",
                color: "white",
            }}
        >
          강의명
        </span>
                <span
                    className="badge "
                    style={{
                        width: "300px",
                        display: "block",
                        fontSize: "1rem",
                        backgroundColor: "#D65E2A",
                        color: "white",
                    }}
                >
          {match.params.lecture}
        </span>
                <div>
                    <StudentList
                        changeOpen={changeOpen}
                        lectureId={match.params.lecture}
                        changeId={changeId}
                    />
                </div>
            </div>
            <div className="col-md-6 ">
        <span
            className="badge "
            style={{
                width: "100px",
                display: "block",
                marginBottom: "20px",
                fontSize: "1rem",
                backgroundColor: "#D65E2A",
                color: "white",
            }}
        >
          강의시간
        </span>
                <span
                    className="badge "
                    style={{
                        width: "300px",
                        display: "block",
                        fontSize: "1rem",
                        backgroundColor: "#D65E2A",
                        color: "white",
                    }}
                >
          금요일 13:30 ~ 19:00
        </span>
                {Open ? (
                    <div>
                        <AttendBoard lectureId={match.params.lecture} changeId={changeId}/>
                    </div>
                ) : null}

                <Link to="/professorpage">
          <span
              className="badge  mt-4"
              style={{
                  width: "100px",
                  display: "block",
                  marginBottom: "20px",
                  fontSize: "1rem",
                  backgroundColor: "#D65E2A",
                  color: "white",
                  top: "70vh",
                  position: "absolute",
              }}
          >
            저장하기
          </span>
                </Link>
            </div>
        </div>
    );
};

export default AdminLecture;
