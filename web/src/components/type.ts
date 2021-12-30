export type UserInfo = {
  Dept: string;
  Name: string;
  email: string;
  isProfessor: string;
  password: string;
  id: string;
  lectureList: string[];
  infoList: [
    {
      Name: string;
      profName: string;
      Time: string;
      Day: string;
    }
  ];
};

export type LectureInfo = {
  Name: string;
  DayofWeek: string;
  StartTime: string;
  TardyTime: string;
  AbsentTime: string;
  cnt: number;
  profId: string;
  profName: string;
};

export type Bookmark = {
  time: number;
  chat: string;
};

export type AttendanceInfo = {
  Name: string;
  id: string;
  Attendance: [
    {
      Round: number;
      Attend: string;
    }
  ];
};

export type StudentInfo = {
  Name: string;
  id: string;
} | null;
