import React from "react";
import {MDBIcon} from "mdbreact";
import {Button, Form} from "react-bootstrap";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

type Prop = {
    setStudentList: (value?: Student) => Student[];
};

type Student = {
    key: number;
    id: string;
    name: string;
};

export default function AddLecture(prop: Prop) {
    const [addStu, setAddStu] = React.useState(false);
    const idRef = React.useRef<HTMLInputElement>(null);
    const nameRef = React.useRef<HTMLInputElement>(null);

    const [students, setStudents] = React.useState<Student[]>([]);
    const [key, setKey] = React.useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (idRef.current && nameRef.current) {
            const id = idRef.current.value;
            const name = nameRef.current.value;
            setKey(key + 1);
            const student = {
                key,
                id,
                name,
            };
            setStudents(prop.setStudentList(student));
        }
    };

    const ShowList = () => {
        const stuList = students.map((student) => (
            <div key={student.key} className="mt-3">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="d-flex flex-row align-items-center">
                        {" "}
                        <span className="star">
              <MDBIcon icon="user-circle"/>
            </span>
                        <div className="d-flex flex-column">
                            {" "}
                            <span>
                {student.id} {student.name}
              </span>
                        </div>
                    </div>
                </div>
            </div>
        ));

        return <div>{stuList}</div>;
    };

    return (
        <div>
            <div className="container overflow-auto" style={{height: "500px"}}>
                <div className="row d-flex mt-4 ">
                    <div className="col" style={{marginLeft: "-15px"}}>
                        <div className="card">
                            <div className="d-flex justify-content-between align-items-center">
                                {" "}
                                <h4 className="font-weight-bold"> 수강학생목록 ({key}명)</h4>
                                <div>
                                    <Button
                                        className="btn-danger"
                                        onClick={(e) => {
                                            setAddStu((o) => !o);
                                        }}
                                    >
                                        <MDBIcon
                                            far
                                            icon="plus-square"
                                            style={{marginRight: "5px"}}
                                        />
                                        인원추가
                                    </Button>
                                    <Popup
                                        open={addStu}
                                        contentStyle={{borderRadius: "1rem", minWidth: "690px"}}
                                    >
                                        <div className="modal-setting">
                                            <Form onSubmit={handleSubmit}>
                                                <Form.Group id="id">
                                                    <Form.Label
                                                        style={{
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        학생의 학번을 입력해주세요
                                                    </Form.Label>
                                                    <Form.Control type="text" ref={idRef} required/>
                                                </Form.Group>
                                                <Form.Group id="name">
                                                    <Form.Label
                                                        style={{
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        학생의 이름을 입력해주세요
                                                    </Form.Label>
                                                    <Form.Control type="text" ref={nameRef} required/>
                                                </Form.Group>
                                                <Button className="w-100" type="submit">
                                                    등록하기
                                                </Button>
                                            </Form>
                                        </div>
                                    </Popup>
                                </div>
                            </div>
                            <div>
                                <ShowList/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
