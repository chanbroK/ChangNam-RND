import { auth, store } from "../firebase";
import * as type from "../type";
export const getUserInfo = async (uid: string): Promise<type.UserInfo> => {
  const user = await store.collection("User").doc(uid).get();
  return user.data() as type.UserInfo;
};

export const getCurrentUserUid = (): string => {
  if (auth.currentUser) {
    const user = auth.currentUser.uid;
    return user;
  }
  return "not login";
};
