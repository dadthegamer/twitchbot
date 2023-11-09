import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import '../styles/GUI/actions.css';
import Chat from './SubComponents/SubActions/Chat';
import TTS from './SubComponents/SubActions/TTS';
import Display from './SubComponents/SubActions/Display';
import Sound from './SubComponents/SubActions/Sound';
import Queue from './SubComponents/SubActions/Queue';

function Actions({ onAddAction, onActionsClose }) {
    const [search, setSearch] = useState('');

    const handleActionSelected = (actionData) => {
        onAddAction(actionData);
        onActionsClose();
    }

    const actionList = [
        {
            title: "Chat",
            component: <Chat onActionSelected={handleActionSelected} />
        },
        {
            title: "TTS",
            component: <TTS onActionSelected={handleActionSelected} />
        },
        {
            title: "Display",
            component: <Display onActionSelected={handleActionSelected} />
        },
        {
            title: "Sound",
            component: <Sound onActionSelected={handleActionSelected} />
        },
        {
            title: "Spin",
            component: <div>Spin</div>
        },
        {
            title: "Lumia Stream Command",
            component: <div>Lumia Stream Command</div>
        },
        {
            title: "Counter",
            component: <div>Counter</div>
        },
        {
            title: "Queue",
            component: <Queue onActionSelected={handleActionSelected} />
        },
        {
            title: "Quote",
            component: <div>Quote</div>
        }
        // Add more actions here with similar format
    ];

    actionList.sort((a, b) => a.title.localeCompare(b.title));

    const filteredActions = actionList.filter(action =>
        action.title.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        console.log(search);
    }, [search]);


    return (
        <div className="actions-main-container">
            <div className="actions-header">
                <h2>Actions</h2>
                <FontAwesomeIcon icon={faXmark} className="fa-icon" onClick={onActionsClose} />
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
    )
}


export default Actions;