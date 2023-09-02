import { fetchWithTimeout } from "./utils.js";

export async function getServerInfo() {
    let serverip;
    let serverPort;
    let serverWSport;
    try {
        const response = await fetchWithTimeout(`http://localhost:3001/api/status`);
        const data = await response.json();
        if (data.online) {
            serverip = 'localhost';
            serverPort = '3001';
            serverWSport = '8080';
            console.log(`Connected to localhost:3001`)
            return { serverip, serverPort, serverWSport };
        }
    } catch (error) {
        try {
            const response = await fetchWithTimeout(`http://192.168.1.31:3500/api/status`);
            const data = await response.json();
            if (data.online) {
                serverip = '192.168.1.31';
                serverPort = '3500';
                serverWSport = '3505';
                console.log(`Connected to 192.168.1.31:3500`)
                return { serverip, serverPort, serverWSport };
            }
        } catch (extError) {
            console.error("Failed to connect to both localhost and external server.", extError);
        }
    }
}