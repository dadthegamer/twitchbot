import React, { useState, useEffect } from 'react';
import '../../../styles/overlay/bottomLeft.css';


function Command() {
    const [command, setCommand] = useState('');
    const [description, setDescription] = useState('');
    const [showCard, setShowCard] = useState(false);

    useEffect(() => {
        // Get the commands from the server. Then get a random command and description of a command that is enabled
        fetch('/api/commands')
            .then((res) => res.json())
            .then((data) => {
                const validCommands = data.filter(command => command !== null);
                // Now filter out the commands that are not enabled
                const enabledCommands = validCommands.filter((command) => command.enabled === true);
                const randomIndex = Math.floor(Math.random() * enabledCommands.length);
                setCommand(enabledCommands[randomIndex].name);
                setDescription(enabledCommands[randomIndex].description);
                setTimeout(() => {
                    setShowCard(true);
                }, 200);
            });
    }, []);

    return (
        <div className='bottom-left-card'>
            {showCard && (
                <>
                    <span className='bottom-left-label'>Command Highlight</span>
                    <div className='command-highlight-container'>
                        <span>!{command}</span>
                        <span>{description}</span>
                    </div>
                </>
            )}
        </div>
    );
}

export default Command;