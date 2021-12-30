import logo from "./onTact.png";
export const makeAlarm = (text: string, lecture: string) => {
  new Notification(text, { body: `강의 : ${lecture}`, icon: logo, requireInteraction: false });
};
