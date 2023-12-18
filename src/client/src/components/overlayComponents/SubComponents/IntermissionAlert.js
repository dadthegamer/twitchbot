import React, { useState } from 'react';
import '../../../styles/overlay/intermission.css';

function IntermissionAlert({ userDisplayName, alertMessage, alertColor }) {
    const [showAlert, setShowAlert] = useState(true);

    return (
        <div
            className={`intermission-alert ${showAlert ? 'show' : ''}`}
            style={{
                backgroundColor: alertColor || '#000000',
            }}
        >
            <span className='intermission-alert-display-name'>{userDisplayName}</span>
            <span className='intermission-alert-message'>{alertMessage}</span>
        </div>
    );
}

export default IntermissionAlert;