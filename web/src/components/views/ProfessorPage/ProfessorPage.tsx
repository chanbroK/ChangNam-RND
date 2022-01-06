import React from "react";
import {UserOutlined} from "@ant-design/icons";
import Lecturelist from "./Sections/Lecturelist";
import {UseAuth} from "../../AuthContext";
import {MDBIcon} from "mdbreact";

//import Lecturelist from './Sections/Lecturelist';
function ProfessorPage() {
    const userInfo = UseAuth().userInfo;

    return (
        <div>
            {userInfo ? (
                <div style={{width: "75%", margin: "6rem auto"}}>
                    <div style={{marginBottom: "50px", textAlign: "center"}}>
                        <h2 style={{fontWeight: "bold"}}>
                            {" "}
                            <MDBIcon
                                icon="fas fa-user-graduate"
                                style={{marginRight: 10}}
                            />
                            {userInfo && userInfo.Name} 님{" "}
                        </h2>
                    </div>
                    <div style={{textAlign: "center"}}>
                        <Lecturelist/>
                    </div>
                </div>
            ) : (
                <h1>Loading...</h1>
            )}
        </div>
    );
}

export default ProfessorPage;
