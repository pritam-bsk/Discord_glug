import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { joinViaInvite } from "../api/auth.api";

export default function Invite() {
    const { code } = useParams();
    const navigate = useNavigate();
    console.log("########"+code)
    useEffect(() => {
        joinViaInvite(code)
            .then(() => navigate("/"))
            .catch(() => alert("Invite invalid or expired"));
    }, []);

    return <p>Joining server...</p>;
}
