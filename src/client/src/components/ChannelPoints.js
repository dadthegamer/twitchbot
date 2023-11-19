import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import '../styles/GUI/channelPoints.css';
import ChannelPointSubComponent from './SubComponents/ChannelPointSubComponent';
import NewChannelPoint from './NewChannelPoint';
import EditReward from './SubComponents/EditReward';

function ChannelPoints() {
    const [search, setSearch] = useState('');
    const [showActions, setShowActions] = useState(true);
    const [channelPoints, setChannelPoints] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newChannelPoint, setNewChannelPoint] = useState(false);
    const [editReward, setEditReward] = useState(false);

    // Get the channel points from the server and set the state as well as set the loading state to false
    useEffect(() => {
        const getChannelPoints = async () => {
            const channelPointsFromServer = await fetchChannelPoints();
            setChannelPoints(channelPointsFromServer);
            setIsLoading(false);
            // Sort the channel points by the title
            channelPointsFromServer.sort((a, b) => (a.title > b.title) ? 1 : -1);
        }
        getChannelPoints();
    }, []);

    const filteredChannelRewards = channelPoints.filter(channelPoint =>
        channelPoint && channelPoint.title && channelPoint.title.toLowerCase().includes(search.toLowerCase())
    );


    // Fetch the channel points from the server
    const fetchChannelPoints = async () => {
        const res = await fetch('/api/channelpoints');
        const data = await res.json();
        return data;
    }

    // Handle the click event for the new channel point button
    const handleNewChannelPointClick = () => {
        setNewChannelPoint(true);
    }

    const handleNewChannelPointClose = () => {
        setNewChannelPoint(false);
    }

    // Handle the click event for the edit reward button
    const handleEditReward = () => {
        setEditReward(true);
    }

    // Handly adding a reward
    const handleAddReward = (data) => {
        console.log(`Adding reward: ${data}`);
        setChannelPoints([...channelPoints, data]);
    }


    return (
        <div className='content'>
            {newChannelPoint ? (
                <NewChannelPoint handleNewChannelPointClose={handleNewChannelPointClose} rewardData={handleAddReward}/>
            ) : null}
            <div className="options-container">
                <button id="new-command-button" onClick={handleNewChannelPointClick}>New Reward</button>
                <div className="search-bar">
                    <FontAwesomeIcon icon={faSearch} className="fa-icon" />
                    <input
                        type="text"
                        placeholder="Search for channel rewards..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="chanelpoints-main-container">
                    {filteredChannelRewards.map((channelPoint) => (
                        <ChannelPointSubComponent key={channelPoint.id} rewardData={channelPoint} onClick={handleEditReward} />
                    ))}
                </div>
            )}
        </div>
    )
}


export default ChannelPoints;