import navLogo from "../../resource/NavLogo.png";
import {Link} from "react-router-dom";
import {UseAuth} from "../../AuthContext";
import {useHistory} from "react-router-dom";
import {UserOutlined} from "@ant-design/icons";

export default function NavBar() {
    const history = useHistory();
    const logOut = UseAuth().logOut;

    async function handleLogout() {
        try {
            await logOut();
            history.push("/");
        } catch (e) {
            console.log(e);
            console.log("Logout Error");
        }

    }

    return (
        <nav
            className="menu"
            style={{
                zIndex: 5,
                width: "100%",
                height: "80px",
                justifyContent: "center",
                padding: "0 20px",
                borderBottom: "solid 1px #e8e8e8",
                overflow: "auto",
                boxShadow: "0 0 30px #f3f1f1",
                backgroundColor: "white"
            }}
        >
            <div className="menu__logo" style={{width: "150px", float: "left"}}>
                <Link to="/" style={{
                    display: "inline-block",
                    fontSize: "20px",
                    padding: "19px 20px"
                }}>
                    <img
                        src={navLogo}
                        style={{
                            width: "100px",
                            height: "40px",

                        }}
                        onClick={logOut}
                        alt="NavLogo"/>
                </Link>
            </div>

            <div style={{float: "right", marginTop: "20px"}}>
                {UseAuth().userInfo && <button
                    onClick={handleLogout}
                    style={{backgroundColor: "white", color: "black"}}
                >
                    로그아웃
                </button>}
            </div>

            <div style={{float: "right", marginTop: "25px", marginRight: "30px"}}>
                {UseAuth().userInfo ? (
                    <h6 style={{fontWeight: "bold"}}>
                        <UserOutlined style={{verticalAlign: "top", marginRight: "5px"}}/>
                        {UseAuth().userInfo && UseAuth().userInfo.Name} 님
                    </h6>
                ) : null}
            </div>
        </nav>
    );
}

