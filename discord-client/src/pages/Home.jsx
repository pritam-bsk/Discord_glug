import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ServerList from "../components/ServerList";
import ChannelList from "../components/ChannelList";
import MessageList from "../components/MessageList";
import { socket, connectSocket } from "../socket/socket";

export default function Home() {
  const { user, loading } = useAuth();
  const [selectedServer, setSelectedServer] = useState(null);
  const [selectedChannel, setSelectedChannel] = useState(null);

  useEffect(() => {
    if (user) {
      connectSocket();
    }
  }, [user]);

  useEffect(() => {
    if (!selectedChannel || !socket) return;

    socket.emit("channel:join", { channelId: selectedChannel._id });

    return () => {
      socket.emit("channel:leave", { channelId: selectedChannel._id });
    };
  }, [selectedChannel]);


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

      <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column" }}>
        {selectedChannel ? (
          <>
            <h2># {selectedChannel.name}</h2>
            <MessageList channelId={selectedChannel._id} />
          </>
        ) : (
          <h2>Select a channel</h2>
        )}
      </div>
    </div>
  );
}
