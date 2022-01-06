import React from "react";
import * as type from "../../type";
import {getAttendanceById} from "../../utils/Lecture";
import {UseAuth} from "../../AuthContext";

type Prop = {
    lectureId: string;
};

export const AttendanceTable = (prop: Prop) => {
    const userInfo = UseAuth().userInfo;
    const [stuInfo, setStuInfo] = React.useState<type.AttendanceInfo>();
    if (stuInfo === undefined) {
        getAttendanceById(prop.lectureId, userInfo.id).then((doc) => {
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
                            {" "}
                            <span style={{fontWeight: "bold"}}>{student.Round}회차</span>
                            <div
                                className="d-flex flex-column align-items-center"
                                style={{width: "100px"}}
                            >
                                {" "}
                                {"출석" === student.Attend ? (
                                    <span
                                        className="badge badge-success"
                                        style={{fontSize: "1rem"}}
                                    >출석</span>
                                ) : (
                                    <span style={{fontSize: "1rem", fontWeight: "bold"}}>출석</span>
                                )}
                            </div>
                            <div
                                className="d-flex flex-column align-items-center"
                                style={{width: "100px"}}
                            >
                                {" "}
                                {"지각" === student.Attend ? (
                                    <span
                                        className="badge badge-warning"
                                        style={{fontSize: "1rem"}}
                                    >지각</span>
                                ) : (
                                    <span style={{fontSize: "1rem", fontWeight: "bold"}}>지각</span>
                                )}{" "}
                            </div>
                            <div
                                className="d-flex flex-column align-items-center"
                                style={{width: "100px"}}
                            >
                                {" "}
                                {"결석" === student.Attend ? (
                                    <span
                                        className="badge badge-danger"
                                        style={{fontSize: "1rem"}}
                                    >결석</span>
                                ) : (
                                    <span style={{fontSize: "1rem", fontWeight: "bold"}}>결석</span>
                                )}{" "}
                            </div>
                        </div>
                    </div>
                </div>
            ));
        }

        return <div>{attendanceList}</div>;
    };
    return (
        <div>
            <div
                className="container overflow-auto align-items-center"
                style={{height: "500px", width: "600px"}}
            >
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
                        width: "130px",
                        height: "30px",
                        display: "block",
                        fontSize: "1rem",
                        justifyContent: "center",
                        paddingTop: "8px",
                    }}
                >
                  {userInfo.id} {userInfo.Name}
                </span>
                            </div>
                            <ShowList/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceTable;
