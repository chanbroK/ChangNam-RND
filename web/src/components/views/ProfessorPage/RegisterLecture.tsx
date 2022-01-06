import React from "react";
import AddLecture from "../AddLecture/AddLecture";
import {makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import {Link} from "react-router-dom";
import {Row, Form} from "react-bootstrap";
import {store} from "../../firebase";
import {getCurrentUserUid} from "../../utils/Auth";
import {UseAuth} from "../../AuthContext";

const useStyles = makeStyles((theme) => ({
    root: {
        "& > *": {
            margin: theme.spacing(1),
            width: "25ch",
        },
    },
}));

type Student = {
    key: number;
    id: string;
    name: string;
};

const RegisterLecture = () => {
    const userInfo = UseAuth().userInfo;
    const lectureNameRef = React.useRef<HTMLInputElement>(null);
    const startTimeRef = React.useRef<HTMLInputElement>(null);
    const tardyTimeRef = React.useRef<HTMLInputElement>(null);
    const absentTimeRef = React.useRef<HTMLInputElement>(null);
    const classes = useStyles();
    const [day, setDay] = React.useState("0");
    const [studentList, setStudentList] = React.useState<Student[]>([]);

    const monday = () => {
        setDay("월");
    };
    const tuesday = () => {
        setDay("화");
    };
    const wednesday = () => {
        setDay("수");
    };
    const thursday = () => {
        setDay("목");
    };
    const friday = () => {
        setDay("금");
    };

    const useSave = async () => {
        let n, s, t, a;

        if (
            lectureNameRef.current &&
            startTimeRef.current &&
            absentTimeRef.current &&
            tardyTimeRef.current
        ) {
            lectureNameRef.current.focus();
            startTimeRef.current.focus();
            absentTimeRef.current.focus();
            tardyTimeRef.current.focus();

            n = lectureNameRef.current.value;
            s = startTimeRef.current.value;
            t = tardyTimeRef.current.value;
            a = absentTimeRef.current.value;

            const lectureRef = await store.collection(`Lecture`).doc(n);
            lectureRef.set(
                {
                    Name: n,
                    DayofWeek: day,
                    StartTime: s,
                    TardyTime: t,
                    AbsentTime: a,
                    cnt: "0",
                    profId: userInfo.id,
                    profName: userInfo.Name,
                },
                {merge: true}
            );
        }

        const studentCol = await store.collection(`User`);
        const snapshot = await studentCol.get();
        snapshot.forEach(async (doc) => {
            const stuRef = await studentCol.doc(doc.id);
            const stuDoc = await stuRef.get();
            const stuData = stuDoc.data();
            const lecList: Array<string> = stuDoc.data()?.lectureList;
            let inList: Array<string> = stuDoc.data()?.infoList;
            if (inList === undefined) {
                inList = [];
            }

            const lecInfo = {
                Name: n,
                profName: userInfo.Name,
                Time: s,
                Day: day,
            };

            if (stuData) {
                studentList.forEach((data) => {
                    if (stuData.id === data.id) {
                        stuRef.set(
                            {
                                lectureList: [...lecList, n],
                                infoList: [...inList, lecInfo],
                            },
                            {merge: true}
                        );
                    }
                });
            }
        });

        const profRef = await store.collection(`User`).doc(getCurrentUserUid());
        const profDoc = await profRef.get();
        const lecList: Array<string> = profDoc.data()?.lectureList;
        let inList: Array<string> = profDoc.data()?.infoList;
        if (inList === undefined) {
            inList = [];
        }

        const lecInfo = {
            Name: n,
            profName: userInfo.Name,
            Time: s,
            Day: day,
        };

        profRef.set(
            {
                lectureList: [...lecList, n],
                infoList: [...inList, lecInfo],
            },
            {merge: true}
        );
    };

    const setList = (value?: Student) => {
        if (value !== undefined) {
            const newSL = studentList.concat(value);
            setStudentList(newSL);
            return newSL;
        }
        return studentList;
    };
    return (
        <div style={{width: "80%", paddingLeft: "100px"}}>
            <Form
                className={classes.root}
                style={{float: "left"}}
                noValidate
                autoComplete="off"
            >
                <div className="col-md-6">
          <span
              className="badge "
              style={{
                  width: "150px",
                  display: "block",
                  fontSize: "1rem",
                  backgroundColor: "#D65E2A",
                  color: "white",
              }}
          >
            강의명 입력
          </span>
                </div>
                <div className="col-md-6">
                    <TextField
                        id="강의명 입력"
                        label="강의명 입력"
                        inputRef={lectureNameRef}
                    />
                </div>
                <div className="col-md-6">
          <span
              className="badge "
              style={{
                  width: "150px",
                  display: "block",
                  fontSize: "1rem",
                  backgroundColor: "#D65E2A",
                  color: "white",
                  marginTop: "20px",
              }}
          >
            강의시간 입력
          </span>
                </div>

                <div
                    style={{paddingLeft: "15px"}}
                    className="  align-items-center col-md-24"
                >
                    <div className="flex-row">
                        <div
                            className="d-flex flex-column"
                            style={{paddingRight: "30px"}}
                        >
                            <Form.Group as={Row}>
                                <Form.Label as="legend" sm={2}>
                                    강의 요일
                                </Form.Label>

                                <Form.Check
                                    type="radio"
                                    label="월요일"
                                    name="formHorizontalRadios"
                                    id="formHorizontalRadios1"
                                    onClick={monday}
                                />
                                <Form.Check
                                    type="radio"
                                    label="화요일"
                                    name="formHorizontalRadios"
                                    id="formHorizontalRadios2"
                                    style={{paddingLeft: 30}}
                                    onClick={tuesday}
                                />
                                <Form.Check
                                    type="radio"
                                    label="수요일"
                                    name="formHorizontalRadios"
                                    id="formHorizontalRadios3"
                                    style={{paddingLeft: 30}}
                                    onClick={wednesday}
                                />
                                <Form.Check
                                    type="radio"
                                    label="목요일"
                                    name="formHorizontalRadios"
                                    id="formHorizontalRadios3"
                                    onClick={thursday}
                                />
                                <Form.Check
                                    type="radio"
                                    label="금요일"
                                    name="formHorizontalRadios"
                                    id="formHorizontalRadios3"
                                    style={{paddingLeft: 30}}
                                    onClick={friday}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>시작시간</Form.Label>
                                <Form.Control type="text" ref={startTimeRef} required/>
                                <Form.Label>지각시간</Form.Label>
                                <Form.Control type="text" ref={tardyTimeRef} required/>
                                <Form.Label>결석시간</Form.Label>
                                <Form.Control type="text" ref={absentTimeRef} required/>
                            </Form.Group>
                        </div>
                    </div>
                </div>
            </Form>
            <div className="student_list">
                <AddLecture setStudentList={setList}/>
            </div>
            <Link onClick={useSave} to="/professorpage">
        <span
            className="badge  mt-4"
            style={{
                width: "100px",
                display: "block",
                marginBottom: "20px",
                fontSize: "1rem",
                backgroundColor: "#D65E2A",
                color: "white",
                marginLeft: "20px",
            }}
        >
          저장하기
        </span>
            </Link>
        </div>
    );
};

export default RegisterLecture;
