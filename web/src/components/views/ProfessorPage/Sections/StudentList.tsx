import React, { useState } from "react";
import "./Lecturelist.css";
import { faCheckSquare, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { MDBIcon } from "mdbreact";
import { getAttendanceByEducatee } from "../../../utils/Lecture";
import * as type from "../../../type";
import { getLectureInfo } from "../../../utils/Lecture";
import firebase from "firebase/app";
type Prop = {
  changeOpen: () => void;
  lectureId: string;
  changeId: (val?: type.StudentInfo) => type.StudentInfo;
};
function StudentList(prop: Prop) {
  const [lecInfo, setLecInfo] = React.useState<type.LectureInfo>();
  const [stuInfo, setStuInfo] =
    React.useState<firebase.firestore.DocumentData[]>();
  if (lecInfo === undefined) {
    getLectureInfo(prop.lectureId).then((info) => {
      setLecInfo(info);
    });
  }
  if (stuInfo === undefined) {
    getAttendanceByEducatee(prop.lectureId).then((doc) => {
      setStuInfo(doc.docs);
    });
  }
  const ShowList = () => {
    let stuList;
    if (stuInfo !== undefined) {
      stuList = stuInfo.map((student) => (
        <div className="mt-3">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex flex-row align-items-center">
              {" "}
              <span className="star">
                <MDBIcon icon="user-circle" />
              </span>
              <div className="d-flex flex-column">
                {" "}
                <span>
                  {student.id} {student.data().Name}
                </span>
              </div>
            </div>{" "}
            <div className="d-flex flex-row">
              {" "}
              <button
                className="btn btn-success mr-2 font-weight-bold"
                style={{ fontSize: "1rem" }}
                onClick={() => {
                  prop.changeOpen();
                  prop.changeId({ id: student.id, Name: student.data().Name });
                }}
              >
                출석확인
              </button>{" "}
            </div>
          </div>
        </div>
      ));
    }
    return <div>{stuList}</div>;
  };

  return (
    <div className="container overflow-auto" style={{ height: "500px" }}>
      <div className="row d-flex mt-4 ">
        <div className="col" style={{ marginLeft: "-15px" }}>
          <div className="card">
            <div className="d-flex justify-content-between align-items-center">
              {" "}
              <h4 className="font-weight-bold">
                {" "}
                수강학생목록 ({lecInfo?.cnt}명)
              </h4>
            </div>
            {stuInfo && <ShowList />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentList;
