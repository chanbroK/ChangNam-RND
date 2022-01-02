import React from "react";
import {getUserInfo, getCurrentUserUid} from "../utils/Auth";
import {auth, store} from "../firebase";

const AuthContext = React.createContext();

export function UseAuth() {
    return React.useContext(AuthContext);
}

export function AuthProvider({children}) {
    const [isLogIn, setIsLogIn] = React.useState(false);
    const [v, setv] = React.useState(false);
    const [uid, setUid] = React.useState(getCurrentUserUid());
    const [userInfo, setUserInfo] = React.useState();
    let flag = 1;
    const reload = () => {
        if (flag === 1) {
            setTimeout(() => {
                setUid(getCurrentUserUid());
                if (uid === "not login") {
                    setIsLogIn(false);
                    setv(!v);
                } else {
                    if (!userInfo) {
                        setIsLogIn(true);
                        getUserInfo(uid).then((info) => {
                            setUserInfo(info);
                        });
                    }
                }
            }, 1000);
            console.log("[getUserInfo in AuthContext]...");
        }
    };
    React.useEffect(() => {
        reload();
    }, [isLogIn, v]);
    const signUp = async (email, password, isProfessor, name, id) => {
        const idRes = await auth.createUserWithEmailAndPassword(email, password);
        if (idRes.user) {
            const Ref = store.collection("User").doc(idRes.user.uid);
            Ref.set({
                Dept: "Software",
                Name: name,
                isProfessor: isProfessor,
                email: email,
                password: password,
                id: id,
                lectureList: [],
                infoList: [],
            });
        }
    };
    const logIn = async (email, password) => {
        const uid = await auth.signInWithEmailAndPassword(email, password);
        const info = await getUserInfo(uid.user.uid);
        setUserInfo(info);
        setUid(uid.user.uid);
        flag = 1;
    };
    const logOut = async () => {
        setUserInfo(null);
        setUid("not login");
        flag = 0;
    };
    const value = {
        userInfo,
        signUp,
        logIn,
        logOut,
        uid,
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
