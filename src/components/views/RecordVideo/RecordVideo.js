import React, { useState, useRef } from "react";
import ReactPlayer from "react-player/lazy";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Playercontrol from "./Playcontrol/Playcontrol";
import screenfull from "screenfull";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import { getBookmark, addBookmark, removeBookmark } from "../../utils/Lecture";
import { UseAuth } from "../../hoc/AuthContext";
import { storage, store } from "../../firebase";
import { MDBIcon } from "mdbreact";

const useStyles = makeStyles({
  playerWrapper: {
    width: "100%",
    position: "relative",
    height: "400px",
  },
});

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

export default function RecordVideo({ match }) {
  const [timeDisplayFormat, setTimeDisplayFormat] = useState("normal");
  const [Bookmarks, setBookmarks] = useState([]);
  const [firstPlay, setFirstPlay] = useState(true);

  const classes = useStyles();
  const [state, setState] = useState({
    playing: false,
    muted: true,
    volume: 0.5,
    playbackRate: 1.0,
    played: 0,
    seeking: false,
    comments: [],
  });
  const handlePlayPause = () => {
    if (firstPlay) {
      playerRef.current.seekTo(0);
      signRef.current.currentTime = 0;
      setFirstPlay(false);
    }
    setState({ ...state, playing: !state.playing });
  };
  const { playing, muted, volume, playbackRate, played, seeking, comments } = state;

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const signRef = useRef(null);
  const signContainerRef = useRef(null);

  //경원
  const [video, loadVideo] = useState();
  if (video === undefined) {
    storage
      .ref()
      .child(`testtest2.mp4`)
      .getDownloadURL()
      .then(url => {
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = function (event) {
          var blob = xhr.response;
        };
        xhr.open("GET", url);
        xhr.send();
        loadVideo(url);
      })
      .catch(error => {
        console.log(error);
      });
  }

  const [signVideo, loadSignVideo] = useState();
  if (signVideo === undefined) {
    storage
      .ref()
      .child(`testtest2.mp4`)
      .getDownloadURL()
      .then(url => {
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = function (event) {
          var blob = xhr.response;
        };
        xhr.open("GET", url);
        xhr.send();
        loadSignVideo(url);
      })
      .catch(error => {
        console.log(error);
      });
  }

  const subtitle_spanref = React.useRef(null);
  const translation_spanref = React.useRef(null);
  const btnSubref = React.useRef(null);
  const btnTransref = React.useRef(null);
  const btnSignref = React.useRef(null);
  const [visibleSub, setVisibleSub] = React.useState(false);
  const [visibleTrans, setVisibleTrans] = React.useState(false);
  const [visibleSign, setVisibleSign] = React.useState(false);
  const subRef = store
    .collection(`Lecture/${match.params.lecture}/Subtitle`)

    .doc(match.params.round);
  const [subData, setSubData] = React.useState();
  const transRef = store
    .collection(`Lecture/${match.params.lecture}/Translation`)
    .doc(match.params.round);

  const [transData, setTransData] = React.useState();
  const [preload, setPreload] = React.useState(false);

  if (subData === undefined) {
    subRef
      .get()
      .then(doc => {
        setSubData(doc.data());
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  }

  if (transData === undefined) {
    transRef
      .get()
      .then(doc => {
        setTransData(doc.data());
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  }

  const getTime = () => {
    if (playerRef.current) {
      return playerRef.current.getCurrentTime();
    }
  };
  React.useEffect(() => {
    let curtime;
    curtime = Math.round(getTime());
    if (subData !== undefined) {
      if (subData[curtime] !== undefined) {
        if (subtitle_spanref.current) {
          subtitle_spanref.current.innerHTML = subData[curtime];
        }
      }
    }
    if (transData !== undefined) {
      if (transData[curtime] !== undefined) {
        if (translation_spanref.current) {
          translation_spanref.current.innerHTML = transData[curtime];
        }
      }
    }
    if (!preload) {
      if (playerRef.current) {
        seekToEnd();
        setPreload(true);
      }
    }
  }, [Math.round(getTime()), playerRef.current]);
  //
  //형찬
  const userInfo = UseAuth().userInfo;
  const lectureId = match.params.lecture;
  const round = match.params.round;

  React.useEffect(() => {
    if (userInfo) {
      getBookmark(lectureId, round, userInfo.id).then(data => {
        setBookmarks(data);
      });
    }
  }, [userInfo]);

  //
  const handleRewind = () => {
    subtitle_spanref.current.innerHTML = "";
    translation_spanref.current.innerHTML = "";
    playerRef.current.seekTo(playerRef.current.getCurrentTime() - 10);
    signRef.current.currentTime = signRef.current.currentTime - 10;
  };
  const handleFastForward = () => {
    subtitle_spanref.current.innerHTML = "";
    translation_spanref.current.innerHTML = "";
    playerRef.current.seekTo(playerRef.current.getCurrentTime() + 10);
    signRef.current.currentTime = signRef.current.currentTime + 10;
  };

  const handleMute = () => {
    setState({ ...state, muted: !state.muted });
  };

  const handleVolumeChange = (e, newValue) => {
    setState({
      ...state,
      volume: parseFloat(newValue / 100),
      muted: newValue === 0 ? true : false,
    });
  };

  const handleonVolumeSeekUp = (e, newValue) => {
    setState({
      ...state,
      volume: parseFloat(newValue / 100),
      muted: newValue === 0 ? true : false,
    });
  };

  const handlePlaybackRateChange = rate => {
    setState({ ...state, playbackRate: rate });
  };

  const ToggleFullScreen = () => {
    screenfull.toggle(playerContainerRef.current);
  };

  const handleProgress = changeState => {
    if (!state.seeking) {
      setState({ ...state, ...changeState });
    }
  };

  const handleSeekchange = (e, newValue) => {
    setState({ ...state, played: parseFloat(newValue / 100) });
  };
  const handleSeekMouseDown = e => {
    setState({ ...state, seeking: true });
  };
  const handleSeekMouseUp = (e, newValue) => {
    subtitle_spanref.current.innerHTML = "";
    translation_spanref.current.innerHTML = "";
    setState({ ...state, seeking: false });
    playerRef.current.seekTo(Number(newValue / 100));
    signRef.current.currentTime = Number(newValue / 100);
  };

  const currentTime = playerRef.current ? playerRef.current.getCurrentTime() : "00:00";
  const duration = playerRef.current ? playerRef.current.getDuration() : "00:00";

  const elapsedTime =
    timeDisplayFormat === "normal" ? format(currentTime) : `-${format(duration - currentTime)}`;
  const totalDuration = format(duration);

  const handleChangeDisplayFormat = () => {
    setTimeDisplayFormat(timeDisplayFormat === "normal" ? "remaining" : "normal");
  };

  let messages = "";
  const inputRef = useRef(null);
  const messagesend = e => {
    e.preventDefault();
    const newBookmark = {
      time: playerRef.current.getCurrentTime(),
      chat: inputRef.current.value,
    };
    setBookmarks([...Bookmarks, newBookmark]);
    if (inputRef.current) {
      messages = inputRef.current.value;
    }
    addBookmark(lectureId, round, userInfo.id, newBookmark.time, newBookmark.chat);
    inputRef.current.value = "";
    messages = "";
  };
  const onDelBookmark = e => {
    const removeTime = Number(e.target.id);
    const newBookmarks = Bookmarks.filter(bookmark => {
      if (bookmark.time === removeTime) {
        return false;
      }
      return true;
    });
    setBookmarks(newBookmarks);
    removeBookmark(lectureId, round, userInfo.id, removeTime);
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

  const useSign = () => {
    if (btnSignref.current) {
      if (visibleSign) {
        btnSignref.current.innerHTML = "수어 활성화";
        setVisibleSign(false);
        document.exitPictureInPicture();
      } else {
        btnSignref.current.innerHTML = "수어 비활성화";
        setVisibleSign(true);
        // signRef.current.seekTo(playerRef.current.getCurrentTime());
        signRef.current.currentTime = playerRef.current.getCurrentTime();
        signRef.current.requestPictureInPicture();
      }
    }
  };

  const seekToEnd = () => {
    playerRef.current.seekTo(3600);
  };

  return (
    <>
      {userInfo && video && (
        <div className="row">
          {/* Top control */}

          <Container
            maxWidth="md"
            display="flex"
            style={{
              flexDirection: "row",
              float: "left",
              marginTop: "40px",
              marginLeft: 15,
            }}
            className="col-md-6"
          >
            <Card
              style={{
                border: "solid",
                borderRadius: 10,
                borderColor: "#c4c4c4",
              }}
            >
              <div
                ref={playerContainerRef}
                className={classes.playerWrapper}
                style={{
                  left: "50",
                  marginTop: 50,
                  backgroundColor: "black",
                }}
              >
                <ReactPlayer
                  ref={playerRef}
                  width={"100%"}
                  height={"100%"}
                  url={video}
                  muted={muted}
                  playing={playing}
                  volume={volume}
                  playbackRate={playbackRate}
                  onProgress={handleProgress}
                />
                <Playercontrol
                  onPlayPause={handlePlayPause}
                  playing={playing}
                  onRewind={handleRewind}
                  onFastForward={handleFastForward}
                  muted={muted}
                  onMute={handleMute}
                  onVolumeChange={handleVolumeChange}
                  onVolumeSeekUp={handleonVolumeSeekUp}
                  volume={volume}
                  playbackRate={playbackRate}
                  onPlaybackRateChange={handlePlaybackRateChange}
                  onToggleFullScreen={ToggleFullScreen}
                  played={played}
                  onSeek={handleSeekchange}
                  onSeekMouseDown={handleSeekMouseDown}
                  onSeekMouseUp={handleSeekMouseUp}
                  elapsedTime={elapsedTime}
                  totalDuration={totalDuration}
                  onChangeDisplayFormat={handleChangeDisplayFormat}
                />
              </div>
              <div
                ref={signContainerRef}
                className={classes.playerWrapper}
                style={{
                  left: "50",
                  marginTop: 50,
                  backgroundColor: "black",
                  display: "none",
                }}
              >
                <video src={signVideo} ref={signRef} autoPlay muted></video>
              </div>
              {/* 자막 */}
              <div
                className="content"
                style={{
                  textAlign: "center",
                  display: visibleSub ? "block" : "none",
                  background: "black",
                }}
              >
                <span
                  className="subtitle"
                  style={{ color: "white", fontSize: 20, fontWeight: "bold", textAlign: "center" }}
                  ref={subtitle_spanref}
                ></span>
              </div>
              {/* 수어 */}
              <div
                className="content"
                style={{
                  textAlign: "center",
                  background: "black",
                  display: visibleTrans ? "block" : "none",
                }}
              >
                <span
                  className="subtitle"
                  style={{ color: "white", fontSize: 20, fontWeight: "bold", textAlign: "center" }}
                  ref={translation_spanref}
                ></span>
              </div>
              <div>
                <div
                  className="subtitle_btn"
                  style={{
                    marginLeft: "3vw",
                    float: "left",
                    width: "29%",
                    marginTop: "29px",
                  }}
                >
                  <button
                    className="btnSub "
                    ref={btnSubref}
                    onClick={useSub}
                    style={{
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
                    <i className="far fa-closed-captioning" style={{ marginRight: "20px" }}></i>
                    자막 활성화
                  </button>
                </div>
                <div
                  className="translate_btn"
                  style={{
                    marginLeft: "20px",
                    float: "left",
                    width: "29%",
                    marginTop: "29px",
                  }}
                >
                  <button
                    className="btnTrans "
                    ref={btnTransref}
                    onClick={useTrans}
                    style={{
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
                    <i className="fas fa-sign-language" style={{ marginRight: "20px" }} />
                    번역 활성화
                  </button>
                </div>
                <div
                  className="translate_btn"
                  style={{
                    marginLeft: "20px",
                    float: "left",
                    width: "29%",
                    marginTop: "29px",
                  }}
                >
                  <button
                    className="btnTrans "
                    ref={btnSignref}
                    onClick={useSign}
                    style={{
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
                    <i className="fas fa-sign-language" style={{ marginRight: "20px" }} />
                    수어 활성화
                  </button>
                </div>
              </div>
            </Card>
            <Link to={`/studentpage/recordlecturelist/${match.params.lecture}`}>
              <span
                className="badge  mt-4"
                style={{
                  width: "150px",
                  display: "block",
                  marginBottom: "20px",
                  fontSize: "1rem",
                  backgroundColor: "#D65E2A",
                  color: "white",
                }}
              >
                나가기
              </span>
            </Link>
          </Container>
          <div
            style={{
              paddingTop: "30px",
              paddingLeft: "30px",
            }}
            className="col-md-6"
          >
            <Card
              style={{
                height: "62vh",
                border: "solid",
                borderRadius: 10,
                borderColor: "#c4c4c4",
              }}
              className="col-md-8"
            >
              <h6
                style={{
                  fontWeight: "bold",
                  fontSize: 30,
                }}
              >
                BookMark
              </h6>
              <div className="overflow-auto">
                {Bookmarks.map((bookmark, index) => (
                  <div
                    style={{
                      marginTop: 10,
                      paddingLeft: 15,
                    }}
                  >
                    <span
                      onClick={() => {
                        subtitle_spanref.current.innerHTML = "";
                        translation_spanref.current.innerHTML = "";
                        playerRef.current.seekTo(bookmark.time);
                        signRef.current.currentTime = bookmark.time;
                      }}
                      style={{ fontWeight: "bold" }}
                    >
                      {format(bookmark.time)} : {bookmark.chat}
                    </span>
                    <span style={{ paddingTop: 10 }}>
                      <MDBIcon
                        icon="fas fa-minus-circle"
                        id={bookmark.time}
                        onClick={onDelBookmark}
                        style={{
                          marginLeft: 15,
                          fontSize: 13,
                          fontWeight: "bold",
                          color: "#D65E2A",
                          fontSize: 20,
                        }}
                      />
                    </span>
                  </div>
                ))}
              </div>
              <div>
                <form
                  style={{
                    top: "65vh",
                    float: "right",
                    position: "fixed",
                    alignItems: "center",
                  }}
                >
                  <input
                    ref={inputRef}
                    style={{
                      width: "28vw",
                      border: "solid",
                      borderRadius: 10,
                      borderColor: "#807E7E",
                    }}
                  />
                  <button
                    type="submit"
                    onClick={e => {
                      messagesend(e);
                    }}
                    style={{
                      backgroundColor: "#D65E2A",
                      color: "white",
                      fontWeight: "bold",
                      border: "solid",
                      borderColor: "#807E7E",
                      borderRadius: 10,
                    }}
                  >
                    입력
                  </button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
