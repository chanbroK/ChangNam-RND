import React from "react";
import {Link} from "react-router-dom";
import {makeStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {getRecordPath} from "../../utils/Lecture";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
    },
    details: {
        display: "flex",
        flexDirection: "column",
    },
    content: {
        flex: "1 0 auto",
    },
    cover: {
        width: 151,
    },
    controls: {
        display: "flex",
        alignItems: "center",
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    playIcon: {
        height: 38,
        width: 38,
    },
}));

export const RecordLectureList = ({match}) => {
    const [lecInfo, setLecInfo] = React.useState();
    if (lecInfo === undefined) {
        getRecordPath(match.params.lecture).then((doc) => {
            setLecInfo(doc.docs);
        });
    }
    const ShowList = () => {
        let lecList;
        if (lecInfo !== undefined) {
            lecList = lecInfo.map((lecture) => (
                <Link to={`/recordvideo/${match.params.lecture}/${lecture.id}`}>
                    <div
                        style={{paddingLeft: "100px", paddingTop: "50px", width: "60%"}}
                    >
                        <Card className={classes.root}>
                            <div className={classes.details}>
                                <CardContent className={classes.content}>
                                    <Typography component="h5" variant="h5">
                                        {match.params.lecture}
                                    </Typography>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        {lecture.id}
                                    </Typography>
                                </CardContent>
                                <div className={classes.controls}/>
                            </div>
                        </Card>
                    </div>
                </Link>
            ));
        }
        return <div>{lecList}</div>;
    };

    const classes = useStyles();
    return (
        <div
            className="card overflow-auto"
            style={{width: "80%", marginLeft: "50px"}}
        >
            <div className="col-md-6">
        <span
            className="badge "
            style={{
                width: "100px",
                display: "block",
                marginBottom: "20px",
                fontSize: "1rem",
                backgroundColor: "#D65E2A",
                color: "white",
            }}
        >
          강의명
        </span>
                <span
                    className="badge "
                    style={{
                        width: "300px",
                        display: "block",
                        fontSize: "1rem",
                        backgroundColor: "#D65E2A",
                        color: "white",
                    }}
                >
          {match.params.lecture}
        </span>
            </div>
            <ShowList/>
        </div>
    );
};

export default RecordLectureList;
