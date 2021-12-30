import React from "react";
import { KotoEn } from "./papago.js";
import * as type from "../../../type";
import { store } from "../../../firebase";
import * as lecture from "../../../utils/Lecture";
type Prop = {
  changeIsShare: (value?: boolean) => boolean;
  userInfo: type.UserInfo;
  onExit: () => void;
  lectureInfo: type.LectureInfo;
};
const VideoButton = (prop: Prop) => {
  const { webkitSpeechRecognition } = window as any;

  const recognition = new webkitSpeechRecognition();
  const language = "ko-KR";
  const btnSubref = React.useRef<HTMLButtonElement>(null);
  const btnTransref = React.useRef<HTMLButtonElement>(null);
  const finalRef = React.useRef<HTMLSpanElement>(null);
  const translateRef = React.useRef<HTMLSpanElement>(null);
  const [visibleSub, setVisibleSub] = React.useState(false);
  const [visibleTrans, setVisibleTrans] = React.useState(false);
  const isProf = prop.userInfo.isProfessor === "on";
  const btnShareRef = React.useRef<HTMLButtonElement>(null);
  const btnShareClick = () => {
    const cur = prop.changeIsShare();
    if (cur) {
      // 컴퓨터 화면 공유중
      if (btnShareRef.current) {
        btnShareRef.current.innerHTML = "화면 공유";
        prop.changeIsShare(false);
      }
    } else {
      // 캡 화면 공유
      if (btnShareRef.current) {
        btnShareRef.current.innerHTML = "공유 중지";
        prop.changeIsShare(true);
      }
    }
  };

  const TWO_LINE = /\n\n/g;
  const ONE_LINE = /\n/g;

  let isRecognizing = false;
  let ignoreEndProcess = false;
  let finalTranscript = "";
  let firstText = "";
  let secondText = "";
  let tempText = "";
  let fireTime;
  let changeFirst;

  let startTime = 0;
  let curTime = 0;

  recognition.continuous = true;
  recognition.interimResults = true;

  /**
   * 음성 인식 시작 처리
   */
  recognition.onstart = function () {
    startTime = new Date().getTime();
    isRecognizing = true;
  };

  /**
   * 음성 인식 종료 처리
   */
  recognition.onend = function () {
    isRecognizing = false;

    if (ignoreEndProcess) {
      return false;
    }

    if (!finalTranscript) {
      return false;
    }
  };

  /**
   * 음성 인식 결과 처리
   */
  recognition.onresult = function (event) {
    let interimTranscript = "";
    let finalSub = "";

    if (typeof event.results === "undefined") {
      recognition.onend = null;
      recognition.stop();
      return;
    }

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        finalTranscript += transcript + "\n";
        secondText = transcript;
        tempText = secondText;
        fireTime = curTime;
        curTime = 0;
        changeFirst = false;
      } else {
        interimTranscript += transcript;
        firstText = tempText;
        changeFirst = true;
        secondText = interimTranscript;
        if (curTime === 0) {
          curTime = Math.round((new Date().getTime() - startTime) / 1000);
        }
      }
    }

    finalSub = linebreak(firstText + "\n" + secondText);
    store.collection("Lecture").doc(prop.lectureInfo.Name).update({ tempSub: finalSub });

    // 번역기능 오프
    store.collection("Lecture").doc(prop.lectureInfo.Name).update({ tempTrans: finalSub });
    // 번역기능 온

    /*
     KotoEn(finalSub).then(resultText => {
       store.collection("Lecture").doc(prop.lectureInfo.Name).update({ tempTrans: resultText });
    });
     */
    if (fireTime !== 0 && fireTime !== undefined && firstText !== "" && changeFirst) {
      if (fireTime !== 0) {
        fireTime = fireTime - 1;
      }
      lecture.stackSubtitle(
        prop.lectureInfo.Name,
        prop.lectureInfo.cnt,
        fireTime,
        linebreak(firstText)
      );
      let sfireTime = fireTime;
      // 번역기능 오프
      lecture.stackTranslation(prop.lectureInfo.Name, prop.lectureInfo.cnt, sfireTime, firstText);
      // 번역기능 온
      // KotoEn(firstText).then(resultText => {
      //   lecture.stackTranslation(
      //     prop.lectureInfo.Name,
      //     prop.lectureInfo.cnt,
      //     sfireTime,
      //     resultText
      //   );
      // });
      fireTime = 0;
      changeFirst = false;
    }
  };

  /**
   * 음성 인식 에러 처리
   */
  recognition.onerror = function (event) {
    console.log("onerror", event);

    if (event.error.match(/no-speech|audio-capture|not-allowed/)) {
      ignoreEndProcess = true;
    }
  };

  /**
   * 개행 처리
   */
  const linebreak = s => {
    return s.replace(TWO_LINE, "<p></p>").replace(ONE_LINE, "<br>");
  };

  /**
   * 음성 인식 트리거
   */
  const start = () => {
    if (isRecognizing) {
      recognition.stop();
      return;
    }
    recognition.lang = language;
    recognition.start();
    ignoreEndProcess = false;

    if (finalRef.current) {
      finalRef.current.innerHTML = "";
    }
    if (translateRef.current) {
      translateRef.current.innerHTML = "";
    }
  };

  const useSub = () => {
    if (btnSubref.current) {
      if (visibleSub) {
        btnSubref.current.innerHTML = "자막 활성화";
        setVisibleSub(false);
      } else {
        btnSubref.current.innerHTML = "자막 비활성화";
        setVisibleSub(true);
      }
    }
  };

  const useTrans = () => {
    if (btnTransref.current) {
      if (visibleTrans) {
        btnTransref.current.innerHTML = "번역 활성화";
        setVisibleTrans(false);
      } else {
        btnTransref.current.innerHTML = "번역 비활성화";
        setVisibleTrans(true);
      }
    }
  };
  React.useEffect(() => {
    if (prop.userInfo.isProfessor === "on") {
      start();
    } else {
      store
        .collection("Lecture")
        .doc(prop.lectureInfo.Name)
        .onSnapshot(snap => {
          const data = snap.data();
          if (data !== undefined) {
            if (finalRef.current) {
              finalRef.current.innerHTML = data.tempSub;
            }
            if (translateRef.current) {
              translateRef.current.innerHTML = data.tempTrans;
            }
          }
        });
    }
    return () => {
      if (prop.userInfo.isProfessor === "on") {
        recognition.stop();
      }
    };
  }, []);
  return (
    <div style={{ textAlign: "center", position: "absolute" }}>
      <div style={{ position: "absolute", top: -60, width: "62vw" }}>
        <div
          className="result overflow-auto"
          style={{
            textAlign: "center",
            display: visibleSub ? "block" : "none",
            background: "black",
          }}
        >
          <span
    className="final"
    style={{
      color: "white",
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
    }}
    ref={finalRef}
    />
        </div>
        <div
          className="result overflow-auto"
          style={{
            textAlign: "center",
            display: visibleTrans ? "block" : "none",
            background: "black",
          }}
        >
          <span
    className="translate"
    style={{
      color: "white",
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
    }}
    ref={translateRef}
    />
        </div>
      </div>
      <div
        className="content"
        style={{
          textAlign: "center",
          backgroundColor: "#eeeee4",
          height: "120px",
          paddingTop: "0px",
          marginLeft: -4,
          width: "61vw",
          position: "absolute",
          top: 0,
        }}
      >
        {isProf ? (
          /*
          교수 Button
           */
          <div>
            <div
              className="share_btn"
              style={{
                marginLeft: "20px",
                float: "left",
                width: "56%",
                marginTop: "28px",
              }}
            >
              <button
                className="btnShare "
                ref={btnShareRef}
                onClick={btnShareClick}
                style={{
                  width: "12vw",
                  height: "3vw",
                  fontSize: "25px",
                  borderRadius: 15,
                  color: "white",
                  fontWeight: "bold",
                  backgroundColor: "gray",
                  border: "solid",
                  borderColor: "black",
                }}
              >
                {/*<i className="fas fa-share-square" style={{ marginRight: "20px" }} />*/}
                화면 공유
              </button>
            </div>
            <div
              className="exit_btn"
              style={{
                marginLeft: "20px",
                float: "left",
                width: "22%",
                marginTop: "28px",
              }}
            >
              <button
                onClick={prop.onExit}
                style={{
                  width: "12vw",
                  height: "3vw",
                  fontSize: "25px",
                  borderRadius: 15,
                  backgroundColor: "#D65E2A",
                  color: "white",
                  fontWeight: "bold",
                  border: "solid",
                  borderColor: "black",
                }}
              >
                나가기
              </button>
            </div>
          </div>
        ) : (
          /*
          학생기준 Button
           */
          <div style={{ position: "relative", top: "0px" }}>
            <div
              className="subtitle_btn"
              style={{
                marginLeft: "20px",
                float: "left",
                width: "33%",
                marginTop: "28px",
              }}
            >
              <button
                className="btnSub "
                ref={btnSubref}
                onClick={useSub}
                style={{
                  width: "12vw",
                  height: "3vw",
                  backgroundColor: "gray",
                  boxShadow: "3px",
                  fontSize: "25px",
                  color: "white",
                  borderRadius: 15,
                  fontWeight: "bold",
                  border: "solid",
                  borderColor: "black",
                }}
              >
                {/*<i className="far fa-closed-captioning" style={{marginRight: "20px"}}/>*/}
                자막 활성화
              </button>
            </div>
            <div
              className="translate_btn"
              style={{
                marginLeft: "20px",
                float: "left",
                width: "22%",
                marginTop: "28px",
              }}
            >
              <button
                className="btnTrans "
                ref={btnTransref}
                onClick={useTrans}
                style={{
                  width: "12vw",
                  height: "3vw",
                  fontSize: "25px",
                  borderRadius: 15,
                  color: "white",
                  fontWeight: "bold",
                  backgroundColor: "gray",
                  border: "solid",
                  borderColor: "black",
                }}
              >
                {/*<i className="fas fa-sign-language" style={{ marginRight: "20px" }} />*/}
                번역 활성화
              </button>
            </div>

            <div
              className="exit_btn"
              style={{
                marginLeft: "20px",
                float: "left",
                width: "33%",
                marginTop: "28px",
              }}
            >
              <button
                onClick={prop.onExit}
                style={{
                  width: "12vw",
                  height: "3vw",
                  fontSize: "25px",
                  borderRadius: 15,
                  backgroundColor: "#D65E2A",
                  color: "white",
                  fontWeight: "bold",
                  border: "solid",
                  borderColor: "black",
                }}
              >
                나가기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoButton;
