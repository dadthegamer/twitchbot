import React, { useState, useEffect } from 'react';
import '../../../styles/overlay/bottomLeft.css';


function RandomReward() {
    const [reward, setReward] = useState({});

    useEffect(() => {
        fetch('/api/channelrewards')
            .then((res) => res.json())
            .then((data) => {
                // Get a random reward from the list of rewards that are enabled
                const filteredRewards = data.filter(reward => reward.isEnabled);
                const randomReward = filteredRewards[Math.floor(Math.random() * filteredRewards.length)];
                setReward(randomReward);
            });
    }, []);

    return (
        <div className='bottom-left-card' style={{ backgroundColor: '#E5E5E5' }}>
            <span className='bottom-left-label' style={
                {
                    color: '#000000',
                }
            }>Random Reward</span>
            <div className='random-reward-bottom-left-container'>
                <span>{reward.title}</span>
                <span>Cost: {reward.cost}</span>
            </div>
            <span className='bottom-left-reward-id' style={
                {
                    color: '#000000',
                }
            }>Reward: {reward.id}</span>
        </div>
    );
}