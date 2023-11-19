import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/GUI/streamathon.css';

function Streamathon() {
    const [settings, setSettings] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    // const [currentTimer, setCurrentTimer] = useState(0);
    const [formattedTime, setFormattedTime] = useState('00:00:00');
    const [streamathonActive, setStreamathonActive] = useState(false);

    let currentTimer = 0;

    // Use effect to get the streamathon settings from the server. Set the state as well as the loading state.
    useEffect(() => {
        fetch('/api/streamathon')
            .then(res => res.json())
            .then(res => {
                setSettings(res);
                setStreamathonActive(res.streamathonActive);
            })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        fetch('/api/streamdata')
            .then(res => res.json())
            .then(res => {
                if (!res.streamInfo.live && settings.streamathonActive) {
                    console.log('Stream is live and streamathon is active');
                    setFormattedTime(formatTimeInSeconds(settings.streamathonCurrentTimer));
                    setIsLoading(false);
                    startStreamathonTimerNow();
                    currentTimer = settings.streamathonCurrentTimer;
                } else {
                    setFormattedTime(formatTimeInSeconds(settings.streamathonStartTime));
                    setIsLoading(false);
                }
                setIsLoading(false);
            })
            .catch(err => console.log(err));
    }, [settings]);

    // Function to format the time to display on the streamathon page. Time will be in seconds.
    function formatTimeInSeconds(seconds) {
        if (seconds < 10) {
            return `00:0${seconds}`;
        } else if (seconds < 60) {
            return `00:${seconds}`;
        } else if (seconds < 3600) {
            const mm = Math.floor(seconds / 60);
            const ss = seconds % 60;
            // If the minutes are less than 10 do not add a 0 in front of the minutes else add a 0 in front of the minutes
            const formattedMM = mm < 10 ? `${mm}` : mm;
            const formattedSS = ss < 10 ? `0${ss}` : ss;
            return `${formattedMM}:${formattedSS}`;
        } else {
            const hh = Math.floor(seconds / 3600);
            const remainingSeconds = seconds % 3600;
            const mm = Math.floor(remainingSeconds / 60);
            const ss = remainingSeconds % 60;
            const formattedHH = hh < 10 ? `0${hh}` : hh;
            const formattedMM = mm < 10 ? `0${mm}` : mm;
            const formattedSS = ss < 10 ? `0${ss}` : ss;

            if (hh < 10) {
                return `${hh}:${formattedMM}:${formattedSS}`;
            } else {
                return `${formattedHH}:${formattedMM}:${formattedSS}`;
            }
        }
    }

    // Function to start the streamathon timer based on the current time
    function startStreamathonTimerNow() {
        const interval = setInterval(() => {
            currentTimer--;
            setFormattedTime(formatTimeInSeconds(currentTimer));
            if (currentTimer <= 0) {
                clearInterval(interval);
            };
        }, 1000);
    }


    // Function to handle the toggle change to toogle rather the streamathon is active or not.
    function handleActiveChange(event) {
        console.log(event);
        // Toggle the streamathon active state
        const checked = event.target.checked;
        setStreamathonActive(checked);

        settings.streamathonActive = checked;

        // Make a put request to the server to update the streamathon active state
        fetch('/api/streamathon', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                settings: settings,
            })
        })
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }

    // Function to handle the change of an input field
    const handleInputChange = (event) => {
        let { id, value } = event.target;
        // Convert the value to a number
        const updatedSettings = { ...settings };
        switch (id) {
            case 'description':
                // Convert the value to a string
                value = value.toString();
                updatedSettings.description = value;
                break;
            case 'start-time':
                value = Number(value);
                updatedSettings.streamathonStartTime = value;
                // Format the time to display on the page
                setFormattedTime(formatTimeInSeconds(value));
                break;
            case 'cap':
                value = Number(value);
                updatedSettings.streamathonCap = value;
                break;
            case 'subs-time':
                value = Number(value);
                updatedSettings.parameters.subs.time = value;
                break;
            case 'subs-min':
                value = Number(value);
                updatedSettings.parameters.subs.minimum = value;
                break;
            case 'bits-time':
                value = Number(value);
                updatedSettings.parameters.bits.time = value;
                break;
            case 'bits-min':
                value = Number(value);
                updatedSettings.parameters.bits.minimum = value;
                break;
            case 'donations-time':
                value = Number(value);
                updatedSettings.parameters.donations.time = value;
                break;
            case 'donations-min':
                value = Number(value);
                updatedSettings.parameters.donations.minimum = value;
                break;
            case 'followers':
                value = Number(value);
                updatedSettings.parameters.followers = value;
                break;
            case 'hype-train':
                value = Number(value);
                updatedSettings.parameters.hypeTrain.perLevel = value;
                break;
            case 'tiktok-followers-time':
                value = Number(value);
                updatedSettings.parameters.tikTok.followers.time = value;
                break;
            case 'tiktok-followers-min':
                value = Number(value);
                updatedSettings.parameters.tikTok.followers.minimum = value;
                break;
            case 'tiktok-likes-time':
                value = Number(value);
                updatedSettings.parameters.tikTok.likes.time = value;
                break;
            case 'tiktok-likes-min':
                value = Number(value);
                updatedSettings.parameters.tikTok.likes.minimum = value;
                break;
            case 'tiktok-gifts-time':
                value = Number(value);
                updatedSettings.parameters.tikTok.gifts.time = value;
                break;
            case 'tiktok-gifts-min':
                value = Number(value);
                updatedSettings.parameters.tikTok.gifts.minimum = value;
                break;
            default:
                break;
        }
        // Set the value of the input field to the value of the settings object
        setSettings(updatedSettings);

        // Make a put request to the server to update the streamathon settings
        fetch('/api/streamathon', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                settings: updatedSettings,
            })
        })
            .then(res => console.log(res))
            .catch(err => console.log(err));
    };


    return (
        <div className='content'>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className='streamathon-main-container'>
                    <div className='streamathon-header'>
                        <h2>Streamathon Settings</h2>
                        <span id='current-timer'>{formattedTime ? formattedTime : 'Invalid Time'}</span>
                        <div className="switch-container">
                            <input type="checkbox" className="checkbox" id={`toggle-streamathon-active`} onChange={handleActiveChange} checked={streamathonActive} />
                            <label className="switch" htmlFor={`toggle-streamathon-active`}>
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                    <div className="streamathon-form-container">
                        <div className="input-container">
                            <label htmlFor="">Description</label>
                            <input type="text" id="description" value={settings.description} onChange={handleInputChange} />
                        </div>
                        <div className="input-container">
                            <label htmlFor="">Start Time</label>
                            <input type="text" id="start-time" value={settings.streamathonStartTime} onChange={handleInputChange} />
                        </div>
                        <div className="input-container">
                            <label htmlFor="cap">Cap</label>
                            <input type="text" id="cap" value={settings.streamathonCap} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="streamathon-form-container">
                        <div className="input-container">
                            <label htmlFor="">Subs</label>
                            <div>
                                <label htmlFor="subs-time">Time</label>
                                <input type="text" id="subs-time" value={settings.parameters.subs.time} onChange={handleInputChange} />
                                <label htmlFor="subs-min">Min</label>
                                <input type="text" id="subs-min" value={settings.parameters.subs.minimum} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="input-container">
                            <label htmlFor="">Bits</label>
                            <div>
                                <label htmlFor="bits-time">Time</label>
                                <input type="text" id="bits-time" value={settings.parameters.bits.time} onChange={handleInputChange} />
                                <label htmlFor="bits-min">Min</label>
                                <input type="text" id="bits-min" value={settings.parameters.bits.minimum} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="input-container">
                            <label htmlFor="">Donations</label>
                            <div>
                                <label htmlFor="donations-time">Time</label>
                                <input type="text" id="donations-time" value={settings.parameters.donations.time} onChange={handleInputChange} />
                                <label htmlFor="donations-min">Min</label>
                                <input type="text" id="donations-min" value={settings.parameters.donations.minimum} onChange={handleInputChange} />
                            </div>
                        </div>
                        <div className="input-container">
                            <label htmlFor="followers">Followers</label>
                            <input type="text" id='followers' value={settings.parameters.followers} onChange={handleInputChange} />
                        </div>
                        <div className="input-container">
                            <label htmlFor="hype-train">Hype Train (Per Level)</label>
                            <input type="text" id='hype-train' value={settings.parameters.hypeTrain.perLevel} onChange={handleInputChange} />
                        </div>
                        <div className="input-container">
                            <label htmlFor="">TikTok Followers</label>
                            <label htmlFor="tiktok-followers-time">Time</label>
                            <input type="text" id='tiktok-followers-time' value={settings.parameters.tikTok.followers.time} onChange={handleInputChange} />
                            <label htmlFor="tiktok-followers-min">Min</label>
                            <input type="text" id='tiktok-followers-min' value={settings.parameters.tikTok.followers.minimum} onChange={handleInputChange} />
                        </div>
                        <div className="input-container">
                            <label htmlFor="">TikTok Likes</label>
                            <label htmlFor="tiktok-likes-time">Time</label>
                            <input type="text" id='tiktok-likes-time' value={settings.parameters.tikTok.likes.time} onChange={handleInputChange} />
                            <label htmlFor="tiktok-likes-min">Min</label>
                            <input type="text" id='tiktok-likes-min' value={settings.parameters.tikTok.likes.minimum} onChange={handleInputChange} />
                        </div>
                        <div className="input-container">
                            <label htmlFor="">TikTok Gifts</label>
                            <label htmlFor="tiktok-gifts-time">Time</label>
                            <input type="text" id='tiktok-gifts-time' value={settings.parameters.tikTok.gifts.time} onChange={handleInputChange} />
                            <label htmlFor="tiktok-gifts-min">Min</label>
                            <input type="text" id='tiktok-gifts-min' value={settings.parameters.tikTok.gifts.minimum} onChange={handleInputChange} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Streamathon;