import { createInvite } from "../api/invite.api";

export default function ServerHeader({ server }) {
  const handleInvite = async () => {
    try {
      const res = await createInvite(server._id);

      const inviteCode = res.data.code;
      const inviteUrl = `${window.location.origin}/invite/${inviteCode}`;

      await navigator.clipboard.writeText(inviteUrl);
      alert("Invite link copied");
    } catch (e) {
      alert("Failed to create invite");
    }
  };

  return (
    <div className="server-header">
      <h3>{server.name}</h3>
      <button onClick={handleInvite}>Invite</button>
    </div>
  );
}
