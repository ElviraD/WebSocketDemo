const path = require("path");
const express = require("express");
const app = express();
const server = require("http").Server(app);
const WebSocket = require("ws");

const wss = new WebSocket.Server({ server: server });

const robot = [
  "加油呀",
  "测试哈哈哈哈",
  "干活",
  "你说的对",
  "冲啊",
  "一切顺利",
];
wss.on("connection", (ws) => {
  // 监听客户端消息
  ws.on("message", (message) => {
    let msgData = JSON.parse(message);
    console.log(wss.clients.size, msgData);
    if (msgData.type === "open") {
      // 初始连接时标识会话
      ws.sessionId = `${msgData.fromUserId}`;
    } else {
      let sessionId = `${msgData.fromUserId}`;
      const content = robot[Math.ceil(Math.random() * 5)];
      console.log("send====robot", content);
      wss.clients.forEach((client) => {
        console.log("text=====client", sessionId, client.sessionId, message);
        if (client.sessionId !== sessionId) {
          console.log("send===!", message);
          client.send(message);
        }
        client.send(
          JSON.stringify({
            fromUserId: 0,
            fromUserName: "robot自动回复",
            toUserId: 0,
            type: "text",
            content,
          })
        );
      });
    }
  });
  setInterval(() => {
    const content = robot[Math.ceil(Math.random() * 5)]
    wss.clients.forEach((client) => {
      client.send(
        JSON.stringify({
          fromUserId: -1,
          fromUserName: "robot广播",
          toUserId: 0,
          type: "text",
          content,
        })
      );
    })
  }, 10000)
  

  // 连接关闭
  ws.on("close", () => {
    console.log("连接关闭");
  });
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../src/page1.html"));
});
app.get("/2", function (req, res) {
  res.sendFile(path.join(__dirname, "../src/page2.html"));
});
app.get("/3", function (req, res) {
  res.sendFile(path.join(__dirname, "../src/page3.html"));
});

server.listen(8888, function () {
  console.log("http://localhost:8888");
});
