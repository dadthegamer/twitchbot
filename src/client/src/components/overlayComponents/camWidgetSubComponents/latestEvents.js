import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faGem, faDollarSign, faStar, faTv } from '@fortawesome/free-solid-svg-icons';
import '../../../styles/overlay/camWidget.css';


function LatestEvents({ event, displayName, hideClass, opacity }) {

    console.log(`LatestEvents: ${event}, ${displayName}, ${hideClass}, ${opacity}`);
    // Switch statement to determine which icon to display
    const determineIcon = (event) => {
        switch (event) {
            case 'latestSub':
                return faStar;
            case 'latestCheer':
                return faGem;
            case 'latestDonation':
                return faDollarSign;
            case 'latestRaid':
                return faTv;
            case 'latestFollower':
                return faHeart;
            default:
                return faHeart;
        }
    };

    // Switch statement to determine which text to display
    const determineText = (event) => {
        switch (event) {
            case 'latestSub':
                return 'Subscriber';
            case 'latestCheer':
                return 'Cheer';
            case 'latestDonation':
                return 'Donation';
            case 'latestRaid':
                return 'Raid';
            case 'latestFollower':
                return 'Follower';
            default:
                return 'Follower';
        }
    };

    // Switch statement to determine the background color of latest-events-icon-wrapper
    const determineColor = (event) => {
        switch (event) {
            case 'latestCheer':
                return '#9146FF';
            case 'latestDonation':
                return '#00ff04';
            case 'latestSub':
                return '#0015ff';
            case 'latestRaid':
                return '#FF6B00';
            case 'latestFollower':
                return '#FF0000';
            default:
                return '#00FF00';
        }
    };

    return (
        <div className={`latest-events-container ${hideClass}`} style={
            {
                opacity: opacity
            }
        }>
            <div className='latest-events-icon-wrapper' style={
                {
                    backgroundColor: determineColor(event)
                }
            }>
                <FontAwesomeIcon icon={determineIcon(event)} className='latest-events-icon' />
            </div>
            <div>
                <span style={
                    {
                        color: determineColor(event)
                    }
                }>Latest {determineText(event)}</span>
                <span>{displayName}</span>
            </div>
        </div>
    );
}

export default LatestEvents;