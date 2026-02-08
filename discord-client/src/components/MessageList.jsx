import { useEffect, useState } from "react";
import { socket } from "../socket/socket";
import { getChannelMessages, getUserById } from "../api/auth.api";

export default function MessageList({ channelId }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        if (!channelId) return;

        getChannelMessages(channelId)
            .then((res) => setMessages(res.data))
            .catch(console.error);
    }, [channelId]);

    useEffect(() => {
        if (!channelId) return;

        const handleNewMessage = (message) => {
            setMessages((prev) => [...prev, message]);
        };

        socket.on("message:new", handleNewMessage);

        return () => {
            socket.off("message:new", handleNewMessage);
        };
    }, [channelId]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        socket.emit("message:send", {
            channelId,
            content: input,
        });

        setInput("");
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
                {messages.map((msg) => (
                    <div
                        key={msg._id}
                        style={{
                            padding: "8px 10px",
                            marginBottom: 5,
                            background: "#333",
                            borderRadius: 4,
                        }}
                    >
                        <strong>{msg.senderId?.username || msg.senderId}</strong>: {msg.content}
                        <div style={{ fontSize: 12, color: "#999" }}>
                            {new Date(msg.createdAt).toLocaleTimeString()}
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSend} style={{ padding: 10, borderTop: "1px solid #333" }}>
                <div style={{ display: "flex", gap: 10 }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        style={{
                            flex: 1,
                            padding: "8px 10px",
                            background: "#222",
                            border: "1px solid #444",
                            color: "#fff",
                            borderRadius: 4,
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: "8px 16px",
                            background: "#5865f2",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                            cursor: "pointer",
                        }}
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    );
}
