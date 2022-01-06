import {UserOutlined} from "@ant-design/icons";
import {UseAuth} from "../../AuthContext";
import {MDBIcon} from "mdbreact";
import {Link} from "react-router-dom";
import Attendance from "../../utils/Attendance";


function StudentPage() {
    const userInfo = UseAuth().userInfo;

    const applyAttendance = async (lecture) => {
        if (userInfo) {
            await Attendance(lecture, userInfo.id, userInfo.Name);
        }
    };

    // 강의목록에서 각 강의를 컴포넌트 하나로 생성
    const ShowList = () => {
        const lecList = userInfo?.infoList.map((lecture) => (
            <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex flex-row align-items-center">
                        {" "}
                        <Link to={`/livelecture/${lecture.Name}`}>
              <span
                  className="star"
                  onClick={() => {
                      applyAttendance(lecture.Name);
                  }}
              >
                <MDBIcon icon="play"/>
                  {/* <MDBIcon icon="stop" /> */}
              </span>
                        </Link>
                        <div className="d-flex flex-column">
                            {" "}
                            <span>{lecture.Name}</span>
                            <div className="d-flex flex-row align-items-center time-text">
                                {" "}
                                <span className="dots"/>{" "}
                                <small>
                                    {lecture.Time} [{lecture.Day}] {lecture.profName}
                                </small>{" "}
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-row">
                        <Link to={`/studentpage/checkattendence/${lecture.Name}`}>
                            <button
                                className="btn btn-success mr-2 font-weight-bold"
                                style={{fontSize: "1rem"}}
                            >
                                출석확인
                            </button>
                        </Link>
                        <Link to={`/studentpage/recordlecturelist/${lecture.Name}`}>
                            <button
                                className="btn btn-warning mr-2 font-weight-bold"
                                style={{fontSize: "1rem"}}
                            >
                                {" "}
                                녹화강의
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        ));

        return <div>{lecList}</div>;
    };


    return (
        <div>
            {userInfo ? (
                <div style={{width: "75%", margin: "6rem auto"}}>
                    <div style={{marginBottom: "50px", textAlign: "center"}}>
                        <h2 style={{fontWeight: "bold"}}>
                            {" "}
                            <UserOutlined
                                style={{verticalAlign: "bottom", marginRight: "10px"}}
                            />{" "}
                            {userInfo && userInfo.Name} 님{" "}
                        </h2>
                    </div>
                    <div style={{textAlign: "center"}}>
                        <div className="container">
                            <div className="row d-flex justify-content-center mt-5 ">
                                <div className="col-md-8">
                                    <div className="card">
                                        <div className="d-flex justify-content-between align-items-center">
                                            {" "}
                                            <h4 className="font-weight-bold"> 강의목록</h4>
                                            <h6 className="font-weight-bold">2022학년도 1학기</h6>
                                        </div>
                                        {userInfo ? <ShowList/> : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <h1>Loading...</h1>
            )}
        </div>
    );
}

export default StudentPage;
