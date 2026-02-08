const socket = io("http://localhost:8000", {
  auth: { token: accessToken }
});

socket.emit("channel:join", { channelId });

socket.emit("message:send", {
  channelId,
  content: "hello"
});

socket.on("message:new", (msg) => {
  console.log(msg);
});
