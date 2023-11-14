import React, { useState } from 'react';
import '../../styles/GUI/channelPoints.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import EditReward from './EditReward';


function ChannelPointSubComponent({ rewardData }) {
    const [enabled, setEnabled] = useState(rewardData.isEnabled);
    const [showEditReward, setShowEditReward] = useState(false);

    const handleToggleChange = (event) => {
        setEnabled(event.target.checked);
        // Make a put request to the server to update the reward
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isEnabled: event.target.checked })
        };
        fetch(`/api/channelpoints/toggle/${rewardData.id}`, requestOptions)
            .then(response => response.json())
            .then(data => console.log(data));
    }

    const handleEditReward = () => {
        console.log(rewardData);
        setShowEditReward(!showEditReward);
    }


    return (
        <>
            <div className='channel-point-container' onClick={handleEditReward}>
                <div>
                    <FontAwesomeIcon icon={faPlayCircle} className="fa-icon" />
                    <span>{rewardData.title}</span>
                </div>
                <div>
                    {!rewardData.managed ? (
                        <div className="switch-container" style={
                            { opacity: 0.5 }
                        }>
                            <input
                                type="checkbox"
                                className={`checkbox`}
                                id={`toggle-reward-checkbox-${rewardData.title}`}
                                checked={enabled}
                                disabled={!rewardData.managed} // Disable the checkbox here
                                onChange={handleToggleChange} // Enable toggling even if it's disabled
                            />
                            <label className="switch" htmlFor={`toggle-reward-checkbox-${rewardData.title}`}>
                                <span className="slider"></span>
                            </label>
                        </div>
                    ) : (
                        <div className="switch-container">
                            <input
                                type="checkbox"
                                className={`checkbox`}
                                id={`toggle-reward-checkbox-${rewardData.title}`}
                                checked={enabled}
                                onChange={handleToggleChange}
                            />
                            <label className="switch" htmlFor={`toggle-reward-checkbox-${rewardData.title}`}>
                                <span className="slider"></span>
                            </label>
                        </div>
                    )}
                </div>
            </div>
            {showEditReward ? <EditReward handleRewareClose={handleEditReward} rewardData={rewardData} /> : null}
        </>
    )
}

export default ChannelPointSubComponent