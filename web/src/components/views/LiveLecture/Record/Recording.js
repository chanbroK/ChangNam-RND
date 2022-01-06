import React from "react";
import {useReactMediaRecorder} from "./ReactMediaRecorder";

const Recording = ({userInfo}) => {
    const {
        startRecording,
        stopRecording,
        pauseRecording,
        resumeRecording,
        mediaBlobUrl,
    } = useReactMediaRecorder({video: true, screen: false});

    const recordButton = React.useRef(null);
    const pauseButton = React.useRef(null);
    const [visibleVideo, setVisibleVideo] = React.useState(false);
    const [visiblePause, setVisiblePause] = React.useState(false);

    const [isProf, setIsProf] = React.useState(false);
    React.useEffect(() => {
        if (userInfo) {
            if (userInfo.isProfessor === "on") {
                setIsProf(true);
            } else {
                setIsProf(false);
            }
        }
    }, [isProf]);
    const useRecord = () => {
        if (recordButton.current) {
            if (recordButton.current.innerHTML === "녹화 종료") {
                recordButton.current.innerHTML = "녹화 시작";
                setVisiblePause(false);
                stopRecording();
            } else {
                recordButton.current.innerHTML = "녹화 종료";
                setVisiblePause(true);
                startRecording();
            }
        }
    };

    const usePause = () => {
        if (pauseButton.current) {
            if (pauseButton.current.innerHTML === "녹화 중지") {
                pauseButton.current.innerHTML = "녹화 재개";
                pauseRecording();
            } else {
                pauseButton.current.innerHTML = "녹화 중지";
                resumeRecording();
            }
        }
    };

    const visible = () => {
        setVisibleVideo((o) => !o);
    };

    return (
        <>
            {isProf ? (
                <>
                    <button
                        ref={recordButton}
                        className="btn-danger"
                        onClick={useRecord}
                        style={{width: "8vw"}}
                    >
                        녹화 시작
                    </button>
                    {visiblePause ? (
                        <button
                            ref={pauseButton}
                            className="btn-danger"
                            onClick={usePause}
                            style={{width: "8vw"}}
                        >
                            녹화 중지
                        </button>
                    ) : null}
                    <button
                        onClick={visible}
                        className="btn-dark"
                        style={{width: "8vw"}}
                    >
                        영상
                    </button>
                    {visibleVideo ? (
                        <video src={mediaBlobUrl} controls autoPlay loop/>
                    ) : null}
                </>
            ) : null}
        </>
    );
};

export default React.memo(Recording);
