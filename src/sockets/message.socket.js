import Message from "../modules/messages/message.model.js"
import Channel from "../modules/channels/channel.model.js"
import Member from "../modules/members/member.model.js"

export const registerMessageEvents = async (io, socket) => {
  console.log("socket.user =", socket.user);
  socket.on("message:send", async ({ channelId, content }) => {
    if (!channelId || !content?.trim()) return
    console.log("socketttttttt11111111");
    const channel = await Channel.findById(channelId)
    if (!channel) return
    console.log("sockettttttttt22222222");
    const member = await Member.findOne({
      serverId: channel.serverId,
      userId: socket.user.userId
    })
    console.log("socketttttttt33333333");
    if (!member) return;
    console.log({
      channelId,
      senderId: socket.user.userId,
      content
    });
    const message = await Message.create({
      channelId,
      senderId: socket.user.userId,
      content
    })

    const populatedMessage = await Message.findById(message._id).populate('senderId', 'username')

    io.to(`channel:${channelId}`).emit("message:new", populatedMessage)
  })

} 