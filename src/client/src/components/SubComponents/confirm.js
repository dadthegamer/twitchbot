import React from 'react';
import '../../styles/GUI/confirm.css';

function Confirmation({ message, onConfirm, onCancel }) {
    return (
        <div className="confirmation">
            <p>{message}</p>
            <div className="buttons">
                <button id='confirm-button' onClick={onConfirm}>Confirm</button>
                <button id='cancel-button' onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
}

export default Confirmation;
