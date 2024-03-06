import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import '../../../styles/overlay/camWidget.css';


function LatestEvents() {
    const [latestEvents, setLatestEvents] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/events/latest');
                const data = await response.json();
                setLatestEvents(data);
            } catch (error) {
                console.error('Error fetching latest events:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className='latest-events-container'>
            <div className='latest-events-icon-wrapper'>
                <FontAwesomeIcon icon={faHeart} className='latest-events-icon' />
            </div>
            <div>
                <span>Latest Follower</span>
                <span>SomeRandomTwitchUser</span>
            </div>
        </div>
    );
}

export default LatestEvents;