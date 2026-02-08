import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import ServerList from "../components/ServerList";
import ChannelList from "../components/ChannelList";

export default function Home() {
  const { user, loading } = useAuth();
  const [selectedServer, setSelectedServer] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <ServerList
        selectedServerId={selectedServer?._id}
        onSelect={(server) => {
          setSelectedServer(server);
          setSelectedChannel(null);
        }}
      />

      {selectedServer && (
        <ChannelList
          serverId={selectedServer._id}
          selectedChannel={selectedChannel}
          onSelect={setSelectedChannel}
        />
      )}

      <div style={{ flex: 1, padding: 20 }}>
        {selectedChannel ? (
          <h2># {selectedChannel.name}</h2>
        ) : (
          <h2>Select a channel</h2>
        )}
      </div>
    </div>
  );
}
