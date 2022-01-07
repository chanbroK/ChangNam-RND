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
const naverDev = {
    id: "r2Dn0DLfFIVvmVwJdnB5", pw: "cCboqqhCh0"
}
app.set("port", port);

app.get("/", (req, res) => {
    res.sendFile(Index, {root: __dirname});
});


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
                "X-Naver-Client-Id": naverDev.id,
                "X-Naver-Client-Secret": naverDev.pw,
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
        origin: "*",
        methods: ["GET", "POST"],
    },
    secure: false,
    rejectUnauthorized: false
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
