import io from 'socket.io-client';
import { writeToLogFile } from '../utilities/logging.js';
import { onDonation } from '../handlers/twitch/eventHandlers/donationHandler.js';

const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjaXRhZGVsIiwiZXhwIjoxNjkxNDUxNjEyLCJqdGkiOiIzYWU2ODZhMC04MjBlLTQxYTQtYmNjYy1kNTkzMGE1ZGE2NmEiLCJjaGFubmVsIjoiNjA2ODUyNzc3ODQxNjEwYjY3ZDQyNzVkIiwicm9sZSI6Im93bmVyIiwiYXV0aFRva2VuIjoieVlEQTFOR3lDcWhvSlRtLXB0aWppei11aFJpVUhRUDVKRlFVYVAzTGdkRE9wVVdjIiwidXNlciI6IjYwNjg1Mjc3Nzg0MTYxNmZmNGQ0Mjc1YyIsInVzZXJfaWQiOiI3YTNmMmRiZC1hNmQ5LTQ4ZTUtODhmMC0zNjdhZjE5NmY3Y2EiLCJ1c2VyX3JvbGUiOiJjcmVhdG9yIiwicHJvdmlkZXIiOiJ0d2l0Y2giLCJwcm92aWRlcl9pZCI6IjY0NDMxMzk3IiwiY2hhbm5lbF9pZCI6ImZlOGNmMGM4LTZkYmMtNGEyNS1hYTA1LTdkNzgyOTg5ZDJlMSIsImNyZWF0b3JfaWQiOiJjZmM2ZWE0Ni04MDRkLTQzNDktODFhOC03ZjZlY2M2ZmNhOTMifQ.8CuJpLkgwDwm42lyZv5d5ER3kYxIK32xXlAcurVz-rw';

export async function subscribeToDonationEvents() {
    try {
        const socket = io('https://realtime.streamelements.com', {
            query: { token: jwt },
            transports: ['websocket']
        });
    
        socket.on('connect', onConnect);
    
        socket.on('authenticated', onAuthenticated);
    
        socket.on('event', (data) => {
            const { type } = data;
            switch (type) {
                case 'tip':
                    onDonation(data);
                    break;
            }
        });
    
        socket.on('event:reset', (data) => {
            console.log(data);
        });
    
        function onConnect() {
            socket.emit('authenticate', {method: 'jwt', token: jwt});
        }
    
        function onAuthenticated(data) {
            const { channelId } = data;
            console.log(`Successfully connected to StreamElements channel ${channelId}`)
            writeToLogFile('info', `Successfully connected to StreamElements channel ${channelId}`);
        }
    }
    catch (error) {
        writeToLogFile('error', `Error in subscribeToDonationEvents: ${error}`);
    }
}


