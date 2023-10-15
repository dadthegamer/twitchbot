import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import '../styles/GUI/actions.css';
import Chat from './SubComponents/SubActions/Chat';

function Actions() {
    const [search, setSearch] = useState('');
    const [showActions, setShowActions] = useState(true);

    const handleActionSelected = () => {
        console.log('Action selected');
        setShowActions(false);
    }

    const handleCloseActions = () => {
        setShowActions(false);
    }

    const actionList = [
        {
            title: "Chat",
            component: <Chat onActionSelected={handleActionSelected} />
        },
        // Add more actions here with similar format
    ];

    const filteredActions = actionList.filter(action => 
        action.title.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        console.log(search);
    }, [search]);


    return (
        <div>
            {showActions && (
                <div className="actions-main-container">
                    <div className="actions-header">
                        <h2>Actions</h2>
                        <FontAwesomeIcon icon={faXmark} className="fa-icon" onClick={handleCloseActions}/>
                    </div>
                    <div className="actions-search-bar">
                        <FontAwesomeIcon icon={faSearch} className="fa-icon" />
                        <input
                            type="text"
                            placeholder="Search for actions..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="actions-container">
                        {filteredActions.map((action, index) => (
                            <div key={index}>
                                {action.component}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}


export default Actions;