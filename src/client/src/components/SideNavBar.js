// src/client/src/components/Navbar.js
import React from 'react';
import '../styles/main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGauge, faChartBar, faTerminal, faListCheck, faCoins, faStopwatch, faGem, faCalendar, faQuoteLeft, faHammer, faGamepad, faUserTag, faUsers, faDownload, faGear, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faTiktok, faDiscord } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom';

function SideNavbar() {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <img src="../../images/logo.png" alt="App Logo" className="sidebar-logo" />
                <span>STREAM A.I.</span>
            </div>

            <ul className="sidebar-list">
                <li className="sidebar-item">
                    <FontAwesomeIcon icon={faGauge} />
                    <Link to="/" className="sidebar-link">
                        Dashboard
                    </Link>
                </li>
                <li className="sidebar-item">
                    <FontAwesomeIcon icon={faChartBar} />
                    <Link to="/statistics" className="sidebar-link">
                        Statistics
                    </Link>
                </li>
                <li className="sidebar-item" id="commands-link">
                    <FontAwesomeIcon icon={faTerminal} />
                    <Link to="/commands" className="sidebar-link">
                        Commands
                    </Link>
                </li>
                <li className="sidebar-item">
                    <FontAwesomeIcon icon={faListCheck} />
                    <Link to="/events" className="sidebar-link">
                        Events
                    </Link>
                </li>
                <li className="sidebar-item">
                    <FontAwesomeIcon icon={faCoins} />
                    <Link to="/currency" className="sidebar-link">
                        Currency
                    </Link>
                </li>
                <li className="sidebar-item">
                    <FontAwesomeIcon icon={faStopwatch} />
                    <Link to="/timers" className="sidebar-link">
                        Timers
                    </Link>
                </li>
                <li className="sidebar-item" id="channel-points-link">
                    <FontAwesomeIcon icon={faGem} />
                    <Link to="/channelpoints" className="sidebar-link">
                        Channel Points
                    </Link>
                </li>
                <li className="sidebar-item">
                    <FontAwesomeIcon icon={faCalendar} />
                    <Link to="/calendar" className="sidebar-link">
                        Calendar
                    </Link>
                </li>
                <li className="sidebar-item" id="quotes-link">
                    <FontAwesomeIcon icon={faQuoteLeft} />
                    <Link to="/quotes" className="sidebar-link">
                        Quotes
                    </Link>
                </li>
                <li className="sidebar-item">
                    <FontAwesomeIcon icon={faHammer} />
                    <Link to="/moderation" className="sidebar-link">
                        Moderation
                    </Link>
                </li>
                <li className="sidebar-item">
                    <FontAwesomeIcon icon={faGamepad} />
                    <Link to="/games" className="sidebar-link">
                        Games
                    </Link>
                </li>
                <li className="sidebar-item">
                    <FontAwesomeIcon icon={faUserTag} />
                    <Link to="/roles" className="sidebar-link">
                        Roles
                    </Link>
                </li>
                <span>Applications</span>
                <li className="sidebar-item">
                    <FontAwesomeIcon icon={faTiktok} />
                    <Link to="/tiktok" className="sidebar-link">
                        TikTok
                    </Link>
                </li>
                <li className="sidebar-item">
                    <FontAwesomeIcon icon={faDiscord} />
                    <Link to="/discord" className="sidebar-link">
                        Discord
                    </Link>
                </li>
                <span>Settings</span>
                <li className="sidebar-item" id="users">
                    <FontAwesomeIcon icon={faUsers} />
                    <Link to="/users" className="sidebar-link">
                        Users
                    </Link>
                </li>
                <li className="sidebar-item" id="users">
                    <FontAwesomeIcon icon={faDownload} />
                    <Link to="/update" className="sidebar-link">
                        Update
                    </Link>
                </li>
                <li className="sidebar-item">
                    <FontAwesomeIcon icon={faGear} />
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
