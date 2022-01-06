import React from "react";
import {Card} from "react-bootstrap";
import {UseAuth} from "../../../AuthContext";
import * as type from "../../../type";
import * as lecture from "../../../utils/Lecture";

type Prop = {
    lectureInfo: type.LectureInfo;
    startTime?: number;
};

const format = seconds => {
    if (isNaN(seconds)) {
        return "00:00";
    }
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");
    if (hh) {
        return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
    }
    return `${mm}:${ss}`;
};

const Bookmark = (prop: Prop) => {
    const [bookmarks, setBookmarks] = React.useState<type.Bookmark[]>([]);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const userInfo = UseAuth().userInfo;
    console.log(prop.lectureInfo);
    React.useEffect(() => {
        if (userInfo) {
            // 북마크 회차 별 저장
            lecture
                .getBookmark(prop.lectureInfo.Name, `${prop.lectureInfo.cnt}회차`, userInfo.id)
                .then(data => {
                    setBookmarks(data);
                    console.log("bookmark", data);
                });
            // 북마크 1회차만 저장
            // lecture.getBookmark(prop.lectureInfo.Name, `1회차`, userInfo.id).then(data => {
            //   setBookmarks(data);
            // });
        }
    }, [userInfo]);

    const sendMessage = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (prop.startTime && userInfo && inputRef.current) {
            const newBookmark = {
                time: (new Date().getTime() - prop.startTime) / 1000,
                chat: inputRef.current.value,
            };

            setBookmarks([...bookmarks, newBookmark]);
            //북마크 회차 별 저장
            lecture.addBookmark(
                prop.lectureInfo.Name,
                `${prop.lectureInfo.cnt}회차`,
                userInfo.id,
                newBookmark.time,
                newBookmark.chat
            );
            //북마크 1회차만 저장
            // lecture.addBookmark(
            //   prop.lectureInfo.Name,
            //   `1회차`,
            //   userInfo.id,
            //   newBookmark.time,
            //   newBookmark.chat
            // );
            inputRef.current.value = "";
        }
    };
    const onDelBookmark = e => {
        const removeTime = Number(e.target.id);
        const newBookmarks = bookmarks.filter(bookmark => {
            if (bookmark.time === removeTime) {
                return false;
            }
            return true;
        });
        setBookmarks(newBookmarks);
        //북마크 회차 별 저장
        lecture.removeBookmark(
            prop.lectureInfo.Name,
            `${prop.lectureInfo.cnt}회차`,
            userInfo.id,
            removeTime
        );
        //북마크 1회차만 저장
        // lecture.removeBookmark(prop.lectureInfo.Name, `1회차`, userInfo.id, removeTime);
    };
    return (
        <Card
            style={{
                height: "61vh",
                width: "680px",
                border: "solid",
                marginLeft: "20px",
                borderRadius: 10,
            }}
        >
            <div
                className="chatting_logo"
                style={{alignContent: "center", fontWeight: "bold", fontSize: 20}}
            >
                BOOKMARK
            </div>
            <div className="overflow-auto">
                {bookmarks.map(bookmark => (
                    <div
                        style={{
                            marginTop: 10,
                            paddingLeft: 15,
                        }}
                    >
            <span style={{fontWeight: "bold"}}>
              {format(bookmark.time)} : {bookmark.chat}
            </span>
                        <button
                            style={{
                                backgroundColor: "#D65E2A",
                                color: "white",
                                marginLeft: 15,
                            }}
                            id={String(bookmark.time)}
                            onClick={onDelBookmark}
                        >
                            삭제
                        </button>
                    </div>
                ))}
            </div>
            <form
                style={{
                    marginLeft: -23,
                    paddingLeft: 5,
                    top: "60.3vh",
                    width: "35.4vw",
                    position: "absolute",
                    border: "solid",
                    backgroundColor: "#C4C4C4",
                    textAlign: "center",
                }}
            >
                <input
                    style={{
                        width: "29vw",
                        height: "80px",
                        borderRadius: 15,
                        marginTop: "10px",
                        marginBottom: "15px",
                        border: "solid",
                    }}
                    ref={inputRef}
                    placeholder=" 메세지를 입력하세요"
                />
                <button
                    type="submit"
                    style={{
                        height: "85px",
                        borderRadius: 15,
                        width: "3vw",
                        backgroundColor: "#D65E2A",
                        color: "black",
                        border: "solid",
                    }}
                    onClick={e => {
                        sendMessage(e);
                    }}
                >
                    전송
                </button>
            </form>
        </Card>
    );
};

export default Bookmark;
