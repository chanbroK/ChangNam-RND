import React from "react";
import "./Lecturelist.css";
import {faCheckSquare, faSpinner} from "@fortawesome/free-solid-svg-icons";
import {faSquare} from "@fortawesome/free-regular-svg-icons";
import {MDBIcon} from "mdbreact";
import {Link, useHistory} from "react-router-dom";
import * as type from "../../../type";
import {store} from "../../../firebase";
import {getLectureInfo} from "../../../utils/Lecture";
import {UseAuth} from "../../../AuthContext";

function Lecturelist() {
    const userInfo = UseAuth().userInfo;
    const history = useHistory();
    const lecStart = async lecture => {
        const lecRef = await store.collection(`Lecture`).doc(lecture);
        const lecInfo: type.LectureInfo = await getLectureInfo(lecture);

        if (lecInfo) {
            lecRef.set(
                {
                    cnt: Number(lecInfo.cnt) + 1,
                },
                {merge: true}
            );
        }
    };

    const ShowList = () => {
        const lecList = userInfo?.infoList.map(lecture => (
            <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex flex-row align-items-center">
                        {" "}
                        <span className="star">
              <MDBIcon icon="fas fa-stop"/>
            </span>
                        <div className="d-flex flex-column">
                            {" "}
                            <span>{lecture.Name}</span>
                            <div className="d-flex flex-row align-items-center time-text">
                                {" "}
                                <span className="dots"></span>{" "}
                                <small>
                                    {lecture.Time} [{lecture.Day}]
                                </small>{" "}
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-row">
                        <button
                            className="btn btn-success mr-2 font-weight-bold"
                            style={{fontSize: "1rem"}}
                            onClick={() => {
                                lecStart(lecture.Name);
                                const close = store
                                    .collection("Lecture")
                                    .where("Name", "==", lecture.Name)
                                    .onSnapshot(snap => {
                                        snap.docChanges().map(change => {
                                            if (change.type === "modified") {
                                                history.push(`/livelecture/${lecture.Name}`);
                                                close();
                                            }
                                        });
                                    });
                            }}
                        >
                            강의시작
                        </button>

                        <Link to={`/professorpage/adminlecture/${lecture.Name}`}>
                            <button className="btn btn-danger mr-2 font-weight-bold" style={{fontSize: "1rem"}}>
                                {" "}
                                강의관리
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        ));

        return <div>{lecList}</div>;
    };

    return (
        <div className="container">
            <div className="row d-flex justify-content-center mt-5 ">
                <div className="col-md-8">
                    <div className="card">
                        <div className="d-flex justify-content-between align-items-center">
                            {" "}
                            <h4 className="font-weight-bold"> 강의목록</h4>
                            <Link to="/professorpage/addlecture">
                                <h6 className="font-weight-bold">
                                    <MDBIcon far icon="plus-square" style={{marginRight: "5px"}}/>
                                    강의추가
                                </h6>
                            </Link>
                        </div>
                        {userInfo ? <ShowList/> : null}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Lecturelist;
