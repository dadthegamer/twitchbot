import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDice } from '@fortawesome/free-solid-svg-icons';

function Spin({ onActionSelected }) {

    const handleActionSelected = () => {
        onActionSelected({type: 'spin', name: 'Spin'});
    }

    return (
        <div className="action-container">
            <div className="action-inner" onClick={handleActionSelected}>
                <FontAwesomeIcon icon={faDice} className='action-icon' />
                <p className='action-title'>Spin</p>
                <span>Spin for points</span>
            </div>
        </div>
    )
}


export default Spin;