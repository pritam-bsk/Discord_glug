import Invite from "../invite/invite.model.js";
import Member from "../members/member.model.js";
import { generateInviteCode } from "../../utils/inviteCode.js";
import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const createInvite = asyncHandler(async (req, res) => {
  const { serverId } = req.params;
  const { channelId } = req.body;
  const invite = await Invite.create({
    code: generateInviteCode(),
    serverId,
    channelId,
    createdBy: req.user.userId,
  });

    res.status(201).json(new ApiResponse(201, invite, "Invite created successfully"));
});

export const joinViaInvite = asyncHandler(async (req, res) => {
  const { code } = req.params;
  const userId = req.user.userId;

  const invite = await Invite.findOne({ code });
  if (!invite) throw new ApiError(404, "Invalid invite");

  const existing = await Member.findOne({
    serverId: invite.serverId,
    userId,
  });
  if (existing)
    throw new ApiError(400, "Already a member");

  await Member.create({
    serverId: invite.serverId,
    userId,
    role: "MEMBER",
  });
  await invite.save();

  res.json(new ApiResponse(200, { serverId: invite.serverId, channelId: invite.channelId }, "Joined server successfully"));
});