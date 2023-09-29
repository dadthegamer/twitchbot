import React, { useState, useEffect } from 'react';
import '../styles/GUI/dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTiktok, faTwitch } from '@fortawesome/free-brands-svg-icons';
import TwitchMessage from './SubComponents/twitchMessage';


function Dashboard() {
    const [messages, setMessages] = useState([]);
    const [messageType, setMessageType] = useState(''); 

    // Connect to the websocket server and display any messages that come through
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8080');
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'chatMessage') {
                setMessages(prevMessages => [...prevMessages, data.payload]);
            }
        };

        // Don't forget to close the WebSocket connection when the component unmounts
        return () => ws.close();
    }, []);

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
                    <FontAwesomeIcon icon={faTiktok} className='fa-icon'/>
                    <input type="text" placeholder='type a message' id='chat-input' />
                </div>
            </div>
        </div>
    )
}


export default Dashboard;