import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import '../styles/GUI/channelPoints.css';
import Actions from './Actions';


function ChannelPoints() {
    const [search, setSearch] = useState('');
    const [showActions, setShowActions] = useState(true);
    const [channelPoints, setChannelPoints] = useState([]);

    useEffect(() => {
        fetch('/api/channel-points')
            .then(res => res.json())
            .then(channelPoints => setChannelPoints(channelPoints));
    }, []);

    return (
        <div></div>
    )
}


export default ChannelPoints;