import React, {useEffect, useState} from "react";
import "../ProfessorPage/Lecturelist.css";
import Editattand from "./Editattand";
import * as type from "../../type";
import {getAttendanceById} from "../../utils/Lecture";

type Prop = {
    lectureId: string;
    changeId: (val?: type.StudentInfo) => type.StudentInfo;
};

function AttendBoard(prop: Prop) {
    const [userInfo, setUserId] = React.useState<type.StudentInfo>();
    if (userInfo === undefined) {
        setUserId(prop.changeId());
    }
    const [stuInfo, setStuInfo] = React.useState<type.AttendanceInfo>();
    if (stuInfo === undefined) {
        getAttendanceById(prop.lectureId, userInfo?.id as string).then((doc) => {
            setStuInfo(doc);
        });
    }

    const ShowList = () => {
        let attendanceList;
        if (stuInfo !== undefined) {
            attendanceList = stuInfo.Attendance.map((student) => (
                <div className="mt-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex flex-row align-items-center">
                            <span style={{fontWeight: "bold"}}>{student.Round}</span>
                            <Editattand
                                lectureId={prop.lectureId}
                                studentId={stuInfo.id}
                                round={student.Round}
                                Attendance={student.Attend}
                                stuInfo={stuInfo}
                            />
                        </div>
                    </div>
                </div>
            ));
        }

        return <div>{attendanceList}</div>;
    };
    return (
        <div className="container overflow-auto" style={{height: "500px"}}>
            <div className="row d-flex mt-4 ">
                <div className="col" style={{marginLeft: "-15px"}}>
                    <div className="card">
                        <div className="d-flex justify-content-between align-items-center">
                            {" "}
                            <h4 className="font-weight-bold"> 출석확인</h4>
                        </div>
                        <div>
              <span
                  className="badge badge-light"
                  style={{
                      width: "140px",
                      height: "30px",
                      display: "block",
                      fontSize: "1rem",
                      justifyContent: "center",
                      paddingTop: "8px",
                  }}
              >
                {userInfo?.id} {userInfo?.Name}
              </span>
                        </div>
                        <ShowList/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AttendBoard;
