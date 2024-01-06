import io from 'socket.io-client';
import logger from "../utilities/logger.js";
import { onDonation } from '../handlers/twitch/eventHandlers/donationHandler.js';


export async function subscribeToDonationEvents() {
    try {
        const jwt = process.env.STREAMELEMENTS_JWT;
        if (!jwt) {
            throw new Error('No StreamElements JWT found in environment variables');
        }
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
            logger.info(`Successfully connected to StreamElements channel ${channelId}`);
        }
    }
    catch (error) {
        logger.error(`Error subscribing to donation events: ${error}`);
    }
}


