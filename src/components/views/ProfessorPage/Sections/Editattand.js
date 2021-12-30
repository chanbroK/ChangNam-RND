import React from "react";
import { store } from "../../../firebase";
import useToggle from "../../../utils/Toggle";

export default function Editattand({
  lectureId,
  studentId,
  round,
  Attendance,
  stuInfo,
}) {
  const [isOn, toggleIsOn] = useToggle();
  const [lateOn, lateToggleOn] = useToggle();
  const [abOn, abToggleOn] = useToggle();
  const [isStart, setIsStart] = React.useState(false);

  if (!isStart) {
    setIsStart(true);
    if (Attendance === "출석") {
      toggleIsOn(true);
    } else if (Attendance === "지각") {
      lateToggleOn(true);
    } else {
      abToggleOn(true);
    }
  }

  const changeAttend = async (attend) => {
    const lecRef = await store
      .collection(`Lecture/${lectureId}/AttendanceByEducatee`)
      .doc(studentId);

    let attendList = stuInfo.Attendance;

    attendList.forEach((val) => {
      if (val.Round === round) {
        val.Attend = attend;
      }
    });

    lecRef.update({
      Attendance: attendList,
    });
  };

  return (
    <>
      <div
        className="d-flex flex-column align-items-center"
        style={{ width: "100px" }}
      >
        <span
          className={isOn ? "badge badge-success" : ""}
          onClick={() => {
            toggleIsOn(true);
            lateToggleOn(false);
            abToggleOn(false);
            changeAttend("출석");
          }}
          style={{ fontSize: "1rem" }}
        >
          출석
        </span>
      </div>
      <div
        className="d-flex flex-column align-items-center"
        style={{ width: "100px" }}
      >
        <span
          className={lateOn ? "badge badge-warning" : ""}
          onClick={() => {
            toggleIsOn(false);
            lateToggleOn(true);
            abToggleOn(false);
            changeAttend("지각");
          }}
          style={{ fontSize: "1rem", fontWeight: "bold" }}
        >
          지각
        </span>{" "}
      </div>
      <div
        className="d-flex flex-column align-items-center"
        style={{ width: "100px" }}
      >
        <span
          className={abOn ? "badge badge-danger" : ""}
          onClick={() => {
            toggleIsOn(false);
            lateToggleOn(false);
            abToggleOn(true);
            changeAttend("결석");
          }}
          style={{ fontSize: "1rem", fontWeight: "bold" }}
        >
          결석
        </span>{" "}
      </div>
    </>
  );
}
