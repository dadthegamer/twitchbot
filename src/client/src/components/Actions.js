import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import '../styles/GUI/actions.css';
import Chat from './SubComponents/SubActions/Chat';
import TTS from './SubComponents/SubActions/TTS';
import Display from './SubComponents/SubActions/Display';


function Actions({onAddAction}) {
    const [search, setSearch] = useState('');
    const [showActions, setShowActions] = useState(true);

    const handleActionSelected = (actionData) => {
        setShowActions(false);
        onAddAction(actionData);
    }

    const handleCloseActions = () => {
        setShowActions(false);
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
            component: <div>Sound</div>
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
        }
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