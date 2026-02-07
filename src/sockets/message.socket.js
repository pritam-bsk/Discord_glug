import Message from "../modules/messages/message.model.js";
import Channel from "../modules/channels/channel.model.js";
import Member from "../modules/members/member.model.js";


export const registerMessageEvents = (io, socket) => {

  socket.on("message:send", async ({ channelId, content }) => {
    if (!channelId || !content?.trim()) return;

    const channel = await Channel.findById(channelId);
    if (!channel) return;

    const member = await Member.findOne({
      serverId: channel.serverId,
      userId: socket.user.userId
    });
    if (!member) return;

    const message = await Message.create({
      channelId,
      senderId: socket.user.userId,
      content
    });

    io.to(`channel:${channelId}`).emit("message:new", {
      _id: message._id,
      channelId,
      senderId: socket.user.userId,
      content,
      createdAt: message.createdAt
    });
  });

};