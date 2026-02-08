import { useEffect, useState } from "react";
import { getServerChannels, createChannel } from "../api/auth.api";

export default function ChannelList({ serverId, selectedChannel, onSelect }) {
  const [channels, setChannels] = useState([]);

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
    </div>
  );
}
