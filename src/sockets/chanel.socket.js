export const registerChannelEvents = (socket) => {

  socket.on("channel:join", ({ channelId }) => {
    socket.join(`channel:${channelId}`);
  });
  socket.on("channel:leave", ({ channelId }) => {
    socket.leave(`channel:${channelId}`);
  });

};
