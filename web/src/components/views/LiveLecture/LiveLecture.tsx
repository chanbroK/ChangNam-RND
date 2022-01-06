import React from "react";
import Chatting from "./Chat/Chatting";
import Video from "./Video/Video";
import {useHistory} from "react-router-dom";
import {UseAuth} from "../../AuthContext";
import {clearChat, getLectureInfo} from "../../utils/Lecture";
import Bookmark from "./Bookmark/Bookmark";
import * as type from "../../type";

const LiveLecture = ({match}) => {
    //계정 확인
    const lectureId = match.params.lecture as string;
    const userInfo = UseAuth().userInfo;
    const history = useHistory();
    const [lectureInfo, setLectureInfo] = React.useState<type.LectureInfo>();
    const [isChat, setIsChat] = React.useState(true);
    const startTime = React.useRef<number>();
    React.useEffect(() => {
        startTime.current = new Date().getTime();
        if (lectureInfo === undefined) {
            getLectureInfo(lectureId).then(info => {
                setLectureInfo(info);
                console.log("[lectureInfo in livelecture]", info);
            });
        }
    }, [lectureInfo]);
    const onExit = () => {
        if (userInfo?.isProfessor === "on") {
            history.push("/professorpage");
            // 채팅 초기화
            clearChat(lectureId);
        } else {
            history.push("/studentpage");
        }
    };
    return (
        <div>
            {userInfo && lectureInfo ? (
                <div style={{paddingTop: "50px", minHeight: "calc(100vh - 80px"}}>
                    <div className="row d-flex ">
                        <div
                            style={{
                                width: "60%",
                                height: "60vh",
                                border: "solid",
                                backgroundColor: "black",
                                float: "left",
                                marginLeft: "50px",
                            }}
                        >
                            {userInfo ? (
                                <Video userInfo={userInfo} lectureInfo={lectureInfo} onExit={onExit}/>
                            ) : null}
                        </div>

                        <div style={{marginTop: -30}}>
                            <button
                                onClick={E => {
                                    E.preventDefault();
                                    setIsChat(!isChat);
                                }}
                                style={{
                                    marginLeft: 30,
                                    fontWeight: "bold",
                                    border: "solid",
                                }}
                            >
                                모드 변경
                            </button>
                            {isChat ? (
                                <Chatting lectureId={lectureInfo.Name}/>
                            ) : (
                                <Bookmark lectureInfo={lectureInfo} startTime={startTime.current}/>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default LiveLecture;
