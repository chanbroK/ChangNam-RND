import React, { useState } from "react";
import { store } from "../../../firebase";
export default function LectureStore() {
  // const [Name, setName] = useState()
  // const [startTime, setStartTime] = useState()
  // const [tardyTime, settardyTime] = useState()
  // const [absentTime, setAbsentTime] = useState()
  async function addLecture(name, absentTime, startTime, tardyTime) {
    const Ref = store.collection("Lecture");
    await Ref.doc("C programing").set({
      Name: "C",
      startTime: "13:00",
      tardyTime: "13:15",
      absentTime: "13:30",
    });
  }
  return;
}
