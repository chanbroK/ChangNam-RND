import "./Sections/Navbar.css";
import logo from "./Sections/onTact.png";
import {Link} from "react-router-dom";
import Logout from "../Logout/Logout";
import {UseAuth} from "../../hoc/AuthContext";

function NavBar() {
    const userInfo = UseAuth().userInfo;
    return (
        <nav
            className="menu"
            style={{
                zIndex: 5,
                width: "100%",
                height: "80px",
                justifyContent: "center",
            }}
        >
            <div className="menu__logo">
                <Link to="/">
                    <img
                        src={logo}
                        style={{
                            width: "100px",
                            height: "30px",
                        }}
                        alt="logo"/>
                </Link>
            </div>

            <div style={{float: "right", marginTop: "20px"}}>
                {userInfo && <Logout/>}
            </div>

            {/*<div style={{ float: "right", marginTop: "20px" }}>
        {isLogIn ? (
          <h6 style={{ marginRight: "50px", fontWeight: "bold" }}>
            <UserOutlined style={{ verticalAlign: "top", marginRight: "5px" }} />
            {userInfo && userInfo.Name} 님
          </h6>
        ) : null}
        </div>*/}
        </nav>
    );
}

export default NavBar;
