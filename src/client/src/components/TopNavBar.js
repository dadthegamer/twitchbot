// src/client/src/components/Navbar.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import '../styles/main.css';

function TopNavbar() {
    return (
        <div className="top-nav-bar">
            <div className="stream-status">
                <span>OFFLINE</span>
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
