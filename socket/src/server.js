const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

const http = require("http");
const port = 4000;
const Index = "/index.html";
app.set("port", port);

//https://jinhyukoo.github.io/js/2020/12/13/peerJS%EC%82%AC%EC%9A%A9%ED%95%B4%EB%B3%B4%EA%B8%B0.html
app.get("/", (req, res) => {
    res.sendFile(Index, {root: __dirname});
});

//경원
// ID : nXKrFtze25Ega3Hb2VHN
// secret : d45U4kaKGG
//형찬
// ID : KWs9Ziq6kJKhiZRNbrW5
// secret : SbPxW5FnuS
//주혁
// ID : AUQpEFdrXtvFKNOcjGKO
// secret : hs8YBpxhZq
//재호
// ID : e2O6A9FbaJKz056vHYsy
// secret : 4pC9nipoqx
//종민
// ID : Mo_d0dmRjBOaHTb6qMqc
// secret : xsRNSeVZUN
app.post("/stt", async (req, res) => {
    try {
        const result = await axios({
            method: "POST",
            url: "https://openapi.naver.com/v1/papago/n2mt",
            data: {
                source: req.body.source,
                target: req.body.target,
                text: req.body.text,
            },
            headers: {
                "X-Naver-Client-Id": "Mo_d0dmRjBOaHTb6qMqc",
                "X-Naver-Client-Secret": "xsRNSeVZUN",
                Accept: "application/json",
            },
        });

        const resultText = result.data.message.result.translatedText;
        res.send(resultText);
    } catch (err) {
        res.send(err);
    }

    res.status(200);
});
//끝
const server = http.createServer(app);
server.listen(port, () => console.log(`listen in ${port} port`));
const io = require("socket.io")(server, {
    cors: {
        origin: ["http://localhost:3000", "https://capstone-925e4.web.app"],
        methods: ["GET", "POST"],
    },
});
io.on("connection", socket => {
    console.log("[connected from]", socket.id, new Date());
    socket.on("join-room", (roomId, userId) => {
        console.log(roomId, userId);
        socket.join(roomId);
        socket.to(roomId).emit("user-connected", userId);

        socket.on("disconnect", () => {
            socket.to(roomId).emit("user-disconnected", userId);
        });
    });
});
