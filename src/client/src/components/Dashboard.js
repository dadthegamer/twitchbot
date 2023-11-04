import React, { useState, useEffect } from 'react';
import '../styles/GUI/dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTiktok, faTwitch } from '@fortawesome/free-brands-svg-icons';
import TwitchMessage from './SubComponents/twitchMessage';
import { wsurl } from '../config';


function Dashboard() {
    const [messages, setMessages] = useState([]);
    const [service, setService] = useState('twitch');
    const [ws, setWs] = useState(null);

    // Connect to the websocket server and display any messages that come through
    useEffect(() => {
        const ws = new WebSocket(wsurl);

        ws.onopen = () => {
            console.log('Connected to the websocket server');
            setWs(ws);
        };
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'chatMessage') {
                setMessages(prevMessages => [...prevMessages, data.payload]);
            }
        };
        // Don't forget to close the WebSocket connection when the component unmounts
        return () => ws.close();
    }, []);

    const handleMessageServiceChange = (event) => {
        setService(event.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            const message = event.target.value;
            const payload = {
                message,
                service
            };
            const data = {
                type: 'chatMessage',
                payload
            };
            ws.send(JSON.stringify(data));
            event.target.value = '';
        }
    }

    return (
        <div className="content">
            <div className="chat-container">
                <div className="chat-messages-container">
                    {messages.map((message, index) => {
                        if (message.service === 'twitch') {
                            return <TwitchMessage key={index} message={message.message} username={message.displayName} color={message.color} />
                        } else if (message.service === 'tiktok') {
                            return <TwitchMessage key={index} message={message.message} username={message.username} color={message.color} />
                        }
                    })}
                </div>
                <div className='input-container'>
                    <select
                        value={service}
                        onChange={handleMessageServiceChange}
                        className="service-dropdown"
                        id="service-selector"
                    >
                        <option value="twitch">Twitch</option>
                        <option value="tiktok">TikTok</option>
                    </select>
                    <input type="text" placeholder='type a message' id='chat-input' onKeyDown={handleKeyDown} />
                </div>
            </div>
        </div>
    )
}


export default Dashboard;