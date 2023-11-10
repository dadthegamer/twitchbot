import React, { useState, useEffect } from 'react';
import '../styles/GUI/dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTiktok, faTwitch } from '@fortawesome/free-brands-svg-icons';
import TwitchMessage from './SubComponents/twitchMessage';
import TikTokMessage from './SubComponents/TikTokMessage';
import { wsurl } from '../config';


function Dashboard() {
    const [messages, setMessages] = useState([]);
    const [service, setService] = useState('twitch');
    const [ws, setWs] = useState(null);
    const [tvMessage, setTvMessage] = useState('');

    // Connect to the websocket server and display any messages that come through
    useEffect(() => {
        const ws = new WebSocket(wsurl);

        ws.onopen = () => {
            console.log('Connected to the websocket server');
            setWs(ws);
        };
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data);
            if (data.type === 'chatMessage') {
                setMessages(prevMessages => [...prevMessages, data.payload]);
            } else if (data.type === 'displayMessage') {
                setTvMessage(data.payload.message);
            };
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
            if (service === 'twitch') {
                setMessages(prevMessages => [...prevMessages, { displayName: 'TheDadB0t', message, service: 'twitch' }]);
            } else if (service === 'tiktok') {
                setMessages(prevMessages => [...prevMessages, { message, service: 'tiktok' }]);
            }
            event.target.value = '';
        }
    }

    const handleDisplayChange = (event) => {
        if (event.key === 'Enter') {
            const message = event.target.value;
            const payload = {
                message
            };
            const data = {
                type: 'displayMessage',
                payload
            };
            ws.send(JSON.stringify(data));
            setTvMessage(message);
        }
    }

    const handleInputChange = (event) => {
        // Get the ID of the input that was changed
        const inputId = event.target.id;
        // Get the value of the input that was changed
        const inputValue = event.target.value;
        // Update the state with the new value
        if (inputId === 'tv-message') {
            setTvMessage(inputValue);
        };
    }

    return (
        <div className="content">
            <div className="chat-container">
                <div className="chat-messages-container">
                    {messages.map((message, index) => {
                        if (message.service === 'twitch') {
                            return <TwitchMessage key={index} message={message.message} username={message.displayName} color={message.color} />
                        } else if (message.service === 'tiktok') {
                            return <TikTokMessage key={index} message={message.message} username={message.username} />
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
            <div className="dashboard-right-side-container">
                <div className='tv-display-container'>
                    <span>TV Display</span>
                    <input type="text" id='tv-message' placeholder='tv message...' value={tvMessage} onChange={handleInputChange} onKeyDown={handleDisplayChange}/>
                </div>
                <div className="power-panel-container">
                    <span>Power Panel</span>
                    <div className="power-panel-buttons">
                        <button className="power-panel-button">On</button>
                        <button className="power-panel-button">Off</button>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Dashboard;