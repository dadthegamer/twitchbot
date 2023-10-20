import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faBan, faCrown, faHammer } from '@fortawesome/free-solid-svg-icons';
import '../../styles/GUI/userComponent.css';

function UserComponent({ userId }) {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Get the user data from the server
    useEffect(() => {
        // Make an HTTP GET request to fetch user data
        fetch(`/api/users/${userId}`)
            .then((response) => response.json())
            .then((data) => {
                // Update the users state with the fetched data and sort the users alphabetically
                setUserData(data);
                console.log(data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    }, []);


    return (
        <div className="user-main-container">
            <FontAwesomeIcon icon={faXmark} className="close-icon" />
            {isLoading ? (
                <p>Getting user data...</p>
            ) : (
                <div className='user-wrapper'>
                    <div className="user-roles-wrapper">
                        {userData.roles.subscriber && <span className='sub-status'>Subscriber</span>}
                        {userData.roles.moderator && <span className='mod-status'>Mod</span>}
                        {userData.roles.vip && <span className='vip-status'>VIP</span>}
                    </div>
                    <div className="user-info-wrapper">
                        <img src={userData.profilePictureUrl} alt="" />
                        <span className='user-display-name'>{userData.displayName}</span>
                    </div>
                    <div className='user-data-wrapper'>
                        
                        </div>
                    <div className="user-actions-container">
                        <button className="user-action-button">
                            <FontAwesomeIcon icon={faBan} className="user-action-icon" />
                            <span className="user-action-text">Ban</span>
                        </button>
                        <button className="user-action-button">
                            <FontAwesomeIcon icon={faCrown} className="user-action-icon" />
                            <span className="user-action-text">VIP</span>
                        </button>
                        <button className="user-action-button">
                            <FontAwesomeIcon icon={faHammer} className="user-action-icon" />
                            <span className="user-action-text">Mod</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserComponent;