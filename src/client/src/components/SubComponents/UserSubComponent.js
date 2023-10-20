import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faBan, faCrown, faHammer, faGift, faGem, faDollarSign, faClock } from '@fortawesome/free-solid-svg-icons';
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

    // Function to format the date. Example october 1st, 2020 12:00:00 AM
    function formatDate(date) {
        // Create a new date object from the date string
        const newDate = new Date(date);
        // Get the month, day, and year
        const month = newDate.toLocaleString('default', { month: 'long' });
        const day = newDate.getDate();
        const year = newDate.getFullYear();
        // Get the hours and minutes
        let hours = newDate.getHours();
        let minutes = newDate.getMinutes();
        // Get the AM or PM
        const ampm = hours >= 12 ? 'PM' : 'AM';
        // Convert the hours from 24 hour time to 12 hour time
        hours %= 12;
        hours = hours || 12;
        // If the minutes are less than 10, add a 0 in front of it
        if (minutes < 10) {
            minutes = `0${minutes}`;
        }
        // Return the formatted date
        return `${month} ${day}, ${year} ${hours}:${minutes} ${ampm}`;
    }

    // Function to handle the input change
    function handleInputChange(event) {
        // Get the input id and value
        const { id, value } = event.target;
        console.log(id, value);
        // Make an HTTP PUT request to update the user data
        // fetch(`/api/users/${userId}`, {
        //     method: 'PUT',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         [id]: value,
        //     }),
        // })
        //     .then((response) => response.json())
        //     .then((data) => {
        //         // Update the users state with the fetched data and sort the users alphabetically
        //         setUserData(data);
        //         console.log(data);
        //     })
        //     .catch((error) => {
        //         console.error('Error updating user data:', error);
        //     });
    }


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
                        <span className='follow-date'>Follow Date: {formatDate(userData.followDate)}</span>
                    </div>
                    <div className='user-data-wrapper'>
                        <div className="user-data-icons">
                        <span>Time Period</span>
                            <div>
                                <FontAwesomeIcon icon={faGift} className="user-data-icon" />
                                <span>Gifted Subs</span>
                            </div>
                            <div>
                                <FontAwesomeIcon icon={faGem} className="user-data-icon" />
                                <span>Bits</span>
                            </div>
                            <div>
                                <FontAwesomeIcon icon={faDollarSign} className="user-data-icon" />
                                <span>Donations</span>
                            </div>
                            <div>
                                <FontAwesomeIcon icon={faClock} className="user-data-icon" />
                                <span>View Time</span>
                            </div>
                        </div>
                        <div className="user-inputs-wrapper">
                            <div className="time-periods">
                                <span>All Time</span>
                                <span>Yearly</span>
                                <span>Monthly</span>
                                <span>Weekly</span>
                                <span>Stream</span>
                            </div>
                            <div className="inputs-wrapper-inner">
                                <input type="text" id='all-time-subs' placeholder="All Time Subs" value={userData.subs.allTime ?? 0} onChange={handleInputChange}/>
                                <input type="text" id='yearly-subs' placeholder="Yearly Subs" value={userData.subs.yearly ?? 0} onChange={handleInputChange}/>
                                <input type="text" id='monthly-subs' placeholder="Monhtly Subs" value={userData.subs.monthly ?? 0} onChange={handleInputChange}/>
                                <input type="text" id='weekly-subs' placeholder="Weekly Subs" value={userData.subs.weekly ?? 0} onChange={handleInputChange}/>
                                <input type="text" id='stream-subs' placeholder="Stream Subs" value={userData.subs.stream ?? 0} onChange={handleInputChange}/>
                            </div>
                            <div className="inputs-wrapper-inner">
                                <input type="text" id='all-time-bits' placeholder="All Time bits" value={userData.bits.allTime ?? 0} onChange={handleInputChange} />
                                <input type="text" id='yearly-bits' placeholder="Yearly bits" value={userData.bits.yearly ?? 0} onChange={handleInputChange} />
                                <input type="text" id='monthly-bits' placeholder="Monthly bits" value={userData.bits.monthly ?? 0} onChange={handleInputChange} />
                                <input type="text" id='weekly-bits' placeholder="Weekly bits" value={userData.bits.weekly ?? 0} onChange={handleInputChange} />
                                <input type="text" id='stream-bits' placeholder="Stream bits" value={userData.bits.stream ?? 0} onChange={handleInputChange} />
                            </div>
                            <div className="inputs-wrapper-inner">
                                <input type="text" id='all-time-donations' placeholder="All Time donations" value={userData.donations.allTime ?? 0} onChange={handleInputChange} />
                                <input type="text" id='yearly-donations' placeholder="Yearly donations" value={userData.donations.yearly ?? 0} onChange={handleInputChange} />
                                <input type="text" id='monthly-donations' placeholder="Monthly donations" value={userData.donations.monthly ?? 0} onChange={handleInputChange} />
                                <input type="text" id='weekly-donations' placeholder="Weekly donations" value={userData.donations.weekly ?? 0} onChange={handleInputChange} />
                                <input type="text" id='stream-donations' placeholder="Stream donations" value={userData.donations.stream ?? 0} onChange={handleInputChange} />
                            </div>
                            <div className="inputs-wrapper-inner">
                                <input type="text" id='all-time-view-time' placeholder="All Time view time" value={userData.viewTime.allTime ?? 0} onChange={handleInputChange} />
                                <input type="text" id='yearly-view-time' placeholder="Yearly view time" value={userData.viewTime.yearly ?? 0} onChange={handleInputChange} />
                                <input type="text" id='monthly-view-time' placeholder="Monthly view time" value={userData.viewTime.monthly ?? 0} onChange={handleInputChange} />
                                <input type="text" id='weekly-view-time' placeholder="Weekly view time" value={userData.viewTime.weekly ?? 0} onChange={handleInputChange} />
                                <input type="text" id='stream-view-time' placeholder="Stream view time" value={userData.viewTime.stream ?? 0} onChange={handleInputChange} />
                            </div>
                        </div>
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
                        <button className="user-action-button">
                            <FontAwesomeIcon icon={faXmark} className="user-action-icon" />
                            <span className="user-action-text">Delete</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserComponent;