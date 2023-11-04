// src/client/src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import '../styles/GUI/main.css';

function TopNavbar() {
    const [twitchConnected, setTwitchConnected] = useState(false);
    const [tiktokConnected, setTiktokConnected] = useState(false);

    const connectedStyle = { color: 'green' };
    const disconnectedStyle = { color: 'red' };

    // Get the connection status of Twitch and TikTok from the server
    useEffect(() => {
        fetch('/api/status/twitch')
            .then(res => res.json())
            .then(data => {
                setTwitchConnected(data.connected);
            });
        fetch('/api/status/tiktok')
            .then(res => res.json())
            .then(data => {
                setTiktokConnected(data.connected);
            });
    }, []);

    // Toggle the connection status of Twitch and TikTok
    function handleConnectionToggle(e) {
        const connection = e.currentTarget.id.split('-')[0];
        const connected = connection === 'twitch' ? twitchConnected : tiktokConnected;
        const newStatus = !connected;
        const body = { connected: newStatus };
        fetch(`/api/status/${connection}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    if (connection === 'twitch') {
                        setTwitchConnected(newStatus);
                    }
                    else {
                        setTiktokConnected(newStatus);
                    }
                }
            });
    }
    return (
        <div className="top-nav-bar">
            <div className="stream-status">
                <span>OFFLINE</span>
            </div>
            <div className="top-nav-bar-status-container">
                <div id='twitch-connection' style={twitchConnected ? connectedStyle : disconnectedStyle} onClick={handleConnectionToggle}>
                    <FontAwesomeIcon icon={faPowerOff} />
                    <span>Twitch</span>
                </div>
                <div id='tiktok-connection' style={tiktokConnected ? connectedStyle : disconnectedStyle} onClick={handleConnectionToggle}>
                    <FontAwesomeIcon icon={faPowerOff} />
                    <span>TikTok</span>
                </div>
            </div>
            <div className="notifications-container">
                <div className="notification" id="notifications">
                    <FontAwesomeIcon icon={faBell} />
                    <span className="notification-count">0</span>
                </div>
                <div className="notifications" id="notifications-items">
                    <div className="notification-filters">
                        <button id="filter-all">All</button>
                        <button id="filter-info">Info</button>
                        <button id="filter-errors">Errors</button>
                    </div>
                    <div className="notification-items-container">
                    </div>
                    <div className="notification-actions">
                        <button>Acknowledge All</button>
                        <button>Delete All</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TopNavbar;
