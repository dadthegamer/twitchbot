import React, { useState } from 'react';
import '../../styles/GUI/channelPoints.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faEllipsisVertical, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';


function ChannelPointSubComponent({ rewardData }) {
    const [editMenu, setEditMenu] = useState(false);
    const [enabled, setEnabled] = useState(rewardData.isEnabled);

    const handleDeleteReward = () => {
        // Make a DELETE request to the server to delete the command
        const response = fetch(`/api/channelpoints/${rewardData.title}`, {
            method: 'DELETE',
        });
        // If the response is successful, remove the command from the DOM
        if (response.status === 200) {
            const command = document.getElementById(rewardData.title);
            command.remove();
        }
    }

    const handleToggleChange = (event) => {
        setEnabled(event.target.checked);
    }

    return (
        <div className='channel-point-container'>
            <div>
                <FontAwesomeIcon icon={faPlayCircle} className="fa-icon" />
                <span>{rewardData.title}</span>
            </div>
            <div>
                {!rewardData.managed ? (
                    <div className="switch-container" style={
                        {opacity: 0.5}
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
                {editMenu && (
                    <div className="command-menu">
                        <div>
                            <FontAwesomeIcon icon={faEdit} className="fa-icon" />
                            <span>Edit</span>
                        </div>
                        <div onClick={handleDeleteReward}>
                            <FontAwesomeIcon icon={faTrash} className="fa-icon" />
                            <span>Delete</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChannelPointSubComponent