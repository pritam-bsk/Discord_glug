import { useEffect, useState } from "react";
import { getServerChannels, createChannel, createInvite } from "../api/auth.api";

export default function ChannelList({ serverId, selectedChannel, onSelect }) {
  const [channels, setChannels] = useState([]);
  const [inviteCode, setInviteCode] = useState("");

  useEffect(() => {
    if (!serverId) return;

    getServerChannels(serverId)
      .then((res) => setChannels(res.data))
      .catch(console.error);
  }, [serverId]);

  const handleCreateChannel = async () => {
    const name = prompt("Channel name");
    if (!name) return;

    try {
      const res = await createChannel(serverId, { name });
      setChannels((prev) => [...prev, res.data.data]);
      onSelect(res.data.data);
    } catch {
      alert("Failed to create channel");
    }
  };

  const handleGenerateInvite = async () => {
    try {
      const res = await createInvite(serverId, {});
      const code = res.data.data?.code || res.data.code;
      setInviteCode(code);

      // Try to copy to clipboard
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
        alert("Invite code copied: " + code);
      } else {
        alert("Invite code: " + code + "\n(Copy manually - clipboard not available)");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate invite");
    }
  };

  return (
    <div style={{ width: 220, borderRight: "1px solid #333", padding: 10 }}>
      <h4>Channels</h4>

      {channels.map((channel) => (
        <div
          key={channel._id}
          onClick={() => onSelect(channel)}
          style={{
            padding: "6px 8px",
            cursor: "pointer",
            background:
              selectedChannel?._id === channel._id ? "#444" : "transparent",
          }}
        >
          # {channel.name}
        </div>
      ))}

      <div
        onClick={handleCreateChannel}
        style={{ marginTop: 10, cursor: "pointer", color: "lime" }}
      >
        + Add Channel
      </div>

      <div
        onClick={handleGenerateInvite}
        style={{ marginTop: 5, cursor: "pointer", color: "#5865f2" }}
      >
        📤 Invite
      </div>

      {inviteCode && (
        <div style={{ marginTop: 10, fontSize: 11, color: "#999", wordBreak: "break-all" }}>
          Code: {inviteCode}
        </div>
      )}
    </div>
  );
}
