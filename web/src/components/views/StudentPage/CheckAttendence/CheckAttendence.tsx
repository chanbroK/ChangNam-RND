import React from "react";
import AttendanceTable from "./AttendenceTable/AttendanceTable";
import {Link} from "react-router-dom";

export const CheckAttendence = ({match}) => {
    return (
        <div style={{textAlign: "center"}}>
            <AttendanceTable lectureId={match.params.lecture}/>
            <Link to="/studentpage">
                <button
                    className="btn mr-5 font-weight-bold "
                    style={{
                        marginLeft: "450px",
                        fontSize: "1rem",
                        marginTop: "30px",
                        backgroundColor: "#D65E2A",
                        color: "white",
                    }}
                >
                    목록으로
                </button>
            </Link>
        </div>
    );
};

export default CheckAttendence;
