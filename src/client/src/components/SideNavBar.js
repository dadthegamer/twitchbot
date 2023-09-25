// src/client/src/components/Navbar.js
import React from 'react';
import '../styles/GUI/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGauge, faChartBar, faTerminal, faListCheck, faBullseye, faCoins, faStopwatch, faGem, faCalendar, faQuoteLeft, faHammer, faGamepad, faUserTag, faUsers, faDownload, faGear, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faTiktok, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { Link, useLocation } from 'react-router-dom';

function SideNavbar() {

    const location = useLocation();

    function isActive(path) {
        return location.pathname === path ? "active" : "";
    }


    return (
        <div className="sidebar">
            <div className="sidebar-header">
                {/* <img src="../../images/logo.png" alt="App Logo" className="sidebar-logo" /> */}
                <span>STREAM A.I.</span>
            </div>

            <ul className="sidebar-list">
                <li className={`sidebar-item ${isActive("/")}`}>
                    <FontAwesomeIcon icon={faGauge} className="fa-icon" />
                    <Link to="/" className="sidebar-link">
                        Dashboard
                    </Link>
                </li>
                <li className={`sidebar-item ${isActive("/statistics")}`}>
                    <FontAwesomeIcon icon={faChartBar} className="fa-icon"/>
                    <Link to="/statistics" className="sidebar-link">
                        Statistics
                    </Link>
                </li>
                <li className={`sidebar-item ${isActive("/commands")}`}>
                    <FontAwesomeIcon icon={faTerminal} className="fa-icon"/>
                    <Link to="/commands" className="sidebar-link">
                        Commands
                    </Link>
                </li>
                <li className={`sidebar-item ${isActive("/events")}`}>
                    <FontAwesomeIcon icon={faListCheck} className="fa-icon"/>
                    <Link to="/events" className="sidebar-link">
                        Events
                    </Link>
                </li>
                <li className={`sidebar-item ${isActive("/goals")}`}>
                    <FontAwesomeIcon icon={faBullseye} className="fa-icon"/>
                    <Link to="/goals" className="sidebar-link">
                        Goals
                    </Link>
                </li>
                <li className={`sidebar-item ${isActive("/currency")}`}>
                    <FontAwesomeIcon icon={faCoins} className="fa-icon"/>
                    <Link to="/currency" className="sidebar-link">
                        Currency
                    </Link>
                </li>
                <li className={`sidebar-item ${isActive("/timers")}`}>
                    <FontAwesomeIcon icon={faStopwatch} className="fa-icon"/>
                    <Link to="/timers" className="sidebar-link">
                        Timers
                    </Link>
                </li>
                <li className={`sidebar-item ${isActive("/channelpoints")}`}>
                    <FontAwesomeIcon icon={faGem} className="fa-icon"/>
                    <Link to="/channelpoints" className="sidebar-link">
                        Channel Points
                    </Link>
                </li>
                <li className={`sidebar-item ${isActive("/calendar")}`}>
                    <FontAwesomeIcon icon={faCalendar} className="fa-icon"/>
                    <Link to="/calendar" className="sidebar-link">
                        Calendar
                    </Link>
                </li>
                <li className={`sidebar-item ${isActive("/quotes")}`}>
                    <FontAwesomeIcon icon={faQuoteLeft} className="fa-icon"/>
                    <Link to="/quotes" className="sidebar-link">
                        Quotes
                    </Link>
                </li>
                <li className={`sidebar-item ${isActive("/moderation")}`}>
                    <FontAwesomeIcon icon={faHammer} className="fa-icon"/>
                    <Link to="/moderation" className="sidebar-link">
                        Moderation
                    </Link>
                </li>
                <li className={`sidebar-item ${isActive("/games")}`}>
                    <FontAwesomeIcon icon={faGamepad} className="fa-icon"/>
                    <Link to="/games" className="sidebar-link">
                        Games
                    </Link>
                </li>
                <li className={`sidebar-item ${isActive("/roles")}`}>
                    <FontAwesomeIcon icon={faUserTag} className="fa-icon"/>
                    <Link to="/roles" className="sidebar-link">
                        Roles
                    </Link>
                </li>
                <span>Applications</span>
                <li className={`sidebar-item ${isActive("/tiktok")}`}>
                    <FontAwesomeIcon icon={faTiktok} className="fa-icon"/>
                    <Link to="/tiktok" className="sidebar-link">
                        TikTok
                    </Link>
                </li>
                <li className={`sidebar-item ${isActive("/discord")}`}>
                    <FontAwesomeIcon icon={faDiscord} className="fa-icon"/>
                    <Link to="/discord" className="sidebar-link">
                        Discord
                    </Link>
                </li>
                <span>Settings</span>
                <li className="sidebar-item" id="users">
                    <FontAwesomeIcon icon={faUsers} className="fa-icon"/>
                    <Link to="/users" className="sidebar-link">
                        Users
                    </Link>
                </li>
                <li className="sidebar-item" id="users">
                    <FontAwesomeIcon icon={faDownload} className="fa-icon"/>
                    <Link to="/update" className="sidebar-link">
                        Update
                    </Link>
                </li>
                <li className="sidebar-item">
                    <FontAwesomeIcon icon={faGear} className="fa-icon"/>
                    <Link to="/settings" className="sidebar-link">
                        Settings
                    </Link>
                </li>
            </ul>

            <div className="sidebar-footer">
                <div className="user-info">
                    <div>
                        <img
                            src="https://static-cdn.jtvnw.net/jtv_user_pictures/074e7c92-b08a-4e6b-a1c2-4e28eade69c0-profile_image-70x70.png"
                            alt="User"
                            className="user-avatar"
                        />
                        <div className="user-name">Dad The Gamer</div>
                    </div>
                    <FontAwesomeIcon icon={faChevronRight} />
                </div>
            </div>
        </div>
    );
}

export default SideNavbar;
