import { useEffect, useState } from "react";
import { getMyServers, createServer, joinViaInvite } from "../api/auth.api";

export default function ServerList({ selectedServerId, onSelect }) {
  const [servers, setServers] = useState([]);

  const fetchServers = () => {
    getMyServers()
      .then((res) => setServers(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchServers();
  }, []);

  const handleCreateServer = async () => {
    const name = prompt("Enter server name");
    if (!name) return;

    try {
      const res = await createServer({ name });
      setServers((prev) => [...prev, res.data]);
      onSelect(res.data);
    } catch (err) {
      alert("Failed to create server");
    }
  };

  const handleJoinServer = async () => {
    const code = prompt("Enter invite code");
    if (!code) return;

    try {
      await joinViaInvite(code.trim());
      alert("Joined server!");
      fetchServers();
    } catch (err) {
      console.error(err);
      alert("Failed to join: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ width: 80, borderRight: "1px solid #333" }}>
      {servers.map((server) => (
        <div
          key={server._id}
          onClick={() => onSelect(server)}
          style={{
            padding: 10,
            cursor: "pointer",
            background:
              selectedServerId === server._id ? "#444" : "transparent",
          }}
        >
          {server.name[0]}
        </div>
      ))}

      {/* Add server button */}
      <div
        onClick={handleCreateServer}
        style={{
          padding: 10,
          cursor: "pointer",
          color: "lime",
          fontWeight: "bold",
        }}
      >
        +
      </div>

      {/* Join server button */}
      <div
        onClick={handleJoinServer}
        style={{
          padding: 10,
          cursor: "pointer",
          color: "#5865f2",
          fontWeight: "bold",
        }}
      >
        ⮑
      </div>
    </div>
  );
}
