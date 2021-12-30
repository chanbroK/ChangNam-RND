import React from "react";
import { UserOutlined } from "@ant-design/icons";
import Lecturelist from "./Sections/Lecturelist";
import { UseAuth } from "../../hoc/AuthContext";

//import Lecturelist from './Sections/Lecturelist';
function StudentPage() {
  const userInfo = UseAuth().userInfo;

  return (
    <div>
      {userInfo ? (
        <div style={{ width: "75%", margin: "6rem auto" }}>
          <div style={{ marginBottom: "50px", textAlign: "center" }}>
            <h2 style={{ fontWeight: "bold" }}>
              {" "}
              <UserOutlined
                style={{ verticalAlign: "bottom", marginRight: "10px" }}
              />{" "}
              {userInfo && userInfo.Name} 님{" "}
            </h2>
          </div>
          <div style={{ textAlign: "center" }}>
            <Lecturelist />
          </div>
        </div>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
}

export default StudentPage;
