import React, { useState, useEffect } from 'react';
import '../styles/GUI/tiktok.css';

function TikTok() {
    const [tiktokdata, setTikTokData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const result = await fetch('/api/status/tiktok');
            const body = await result.json();
            setTikTokData(body);
            setIsLoading(false);
        }
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        // Set the value of the input element to the state
        const value = e.target.value;
        const id = e.target.id;
        switch (id) {
            case 'tiktok-username':
                setUserName(value);
                break;
            default:
                break;
        }
    };

    const handleUpdateUsername = (e) => {
        // Make a post request to update the username
        const value = e.target.value;
        fetch('/api/tiktok', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: value }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
            });
        };

    return (
        <div className='content'>
            <div className='tiktok-username-wrapper'>
                <input type="text" id='tiktok-username' placeholder='enter your tiktok username...' onChange={handleInputChange} onBlur={handleUpdateUsername} value={userName}/>
            </div>
            <div className='tik'>
                <div className="tiktok-progressbar">
                    <div className="tiktok-progressbar-fill" style={{ width: `${60}%` }}></div>
                </div>
            </div>
        </div>
    )
}

export default TikTok;