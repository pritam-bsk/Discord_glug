import api from "./axios";
export const login = (data) => api.post("/auth/login", data);
export const register = (data) => api.post("/auth/register", data);
export const getMe = () => api.get("/auth/me");
export const logout = () => api.post("/auth/logout");

export const getMyServers = () => api.get("/servers");
export const createServer = (data) => api.post("/servers", data);


export const getServerChannels = (serverId) => api.get(`/servers/${serverId}/channels`);
export const createChannel = (serverId, data) => api.post(`/servers/${serverId}/channels`, data);

export const getChannelMessages = (channelId) => api.get(`/messages/${channelId}`);
export const getUserById = (userId) => api.get(`users/${userId}`)

