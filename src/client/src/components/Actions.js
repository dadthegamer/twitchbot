import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import '../styles/GUI/actions.css';
import Chat from './SubComponents/SubActions/Chat';
import TTS from './SubComponents/SubActions/TTS';
import Display from './SubComponents/SubActions/Display';
import Sound from './SubComponents/SubActions/Sound';
import Queue from './SubComponents/SubActions/Queue';
import Spin from './SubComponents/SubActions/Spin';
import LumiaStream from './SubComponents/SubActions/LumiaStream';
import Quote from './SubComponents/SubActions/Quote';
import Counter from './SubComponents/SubActions/Counter';
import Announce from './SubComponents/SubActions/Announce';
import Poll from './SubComponents/SubActions/Poll';
import Delay from './SubComponents/SubActions/Delay';
import Discord from './SubComponents/SubActions/Discord';
import Currency from './SubComponents/SubActions/Currency';

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
            component: <Spin onActionSelected={handleActionSelected} />
        },
        {
            title: "Lumia Stream Command",
            component: <LumiaStream onActionSelected={handleActionSelected} />
        },
        {
            title: "Counter",
            component: <Counter onActionSelected={handleActionSelected} />
        },
        {
            title: "Queue",
            component: <Queue onActionSelected={handleActionSelected} />
        },
        {
            title: "Quote",
            component: <Quote onActionSelected={handleActionSelected} />
        },
        {
            title: "Announce",
            component: <Announce onActionSelected={handleActionSelected} />
        },
        {
            title: "Poll",
            component: <Poll onActionSelected={handleActionSelected} />
        },
        {
            title: "Delay",
            component: <Delay onActionSelected={handleActionSelected} />
        },
        {
            title: "Discord",
            component: <Discord onActionSelected={handleActionSelected} />
        },
        {
            title: "Currency",
            component: <Currency onActionSelected={handleActionSelected} />
        },
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
                <FontAwesomeIcon icon={faXmark} className="fa-icon" onClick={onActionsClose} onKeyDown={onActionsClose}/>
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