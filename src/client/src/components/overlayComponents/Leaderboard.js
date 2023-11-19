import React, { useState, useEffect } from 'react';
import '../../styles/overlay/leaderboard.css';


function Leaderboard() {
    const [leaderboards, setLeaderboards] = useState([]);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [leaderboardTitle, setLeaderboardTitle] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [fetchedAllLeaderboards, setFetchedAllLeaderboards] = useState(false);
    const [currentLeaderboardData, setCurrentLeaderboardData] = useState([]);
    const [leaderboardDescription, setLeaderboardDescription] = useState('');

    useEffect(() => {
        fetchLeaderboards();
    }, []);

    useEffect(() => {
        if (fetchedAllLeaderboards) {
            displayLeaderboard();
        }
    }, [fetchedAllLeaderboards]);

    const fetchLeaderboards = () => {
        fetch('/api/leaderboard')
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setLeaderboards(data);
                setIsLoading(false);
                setFetchedAllLeaderboards(true);
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
            });
    };

    let currentLeaderboardIndex = 0;

    const displayLeaderboard = () => {
        setShowLeaderboard(false);
        if (leaderboards.length === 0) {
            fetchLeaderboards();
            return;
        }
        if (currentLeaderboardIndex >= leaderboards.length) {
            console.log('Reached end of leaderboards, fetching again');
            currentLeaderboardIndex = 0;
            fetchLeaderboards();
        }
        if (leaderboards[currentLeaderboardIndex].data.length > 0) {
            setLeaderboardTitle(leaderboards[currentLeaderboardIndex].name);
            setLeaderboardDescription(leaderboards[currentLeaderboardIndex].description);
            setCurrentLeaderboardData([...leaderboards[currentLeaderboardIndex].data]);
            setShowLeaderboard(true);
            setTimeout(() => {
                currentLeaderboardIndex++;
                setShowLeaderboard(false);
                displayLeaderboard();
            }, 10000); // Wait for 10 seconds before hiding
        } else {
            currentLeaderboardIndex++;
            displayLeaderboard(); // Call the function recursively to move to the next leaderboard
        }
    };

    function formatMinutes(minutes) {
        const days = Math.floor(minutes / 1440); // 1440 mins per day
        minutes = minutes % 1440;
        const hours = Math.floor(minutes / 60);
        minutes = minutes % 60;
        let str = '';
        if (days > 0) {
            str += `${days}d `;
        }
        if (hours > 0) {
            str += `${hours}h `;
        }
        if (minutes > 0) {
            str += `${minutes}m`;
        }
        return str.trim();
    }

    // Function to format a number with commas
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function formatAmount(amount, title) {
        // Check if the title contains "view time" and format accordingly
        if (title.toLowerCase().includes("view time")) {
            return formatMinutes(amount);
        } else {
            return numberWithCommas(amount);
        }
    }


    return (
        <div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {showLeaderboard && (
                        <div className="leaderboard-container">
                            <div className="leaderboard-header">
                                <span className='title'>{leaderboardTitle}</span>
                                <span className='description'>{leaderboardDescription}</span>
                            </div>
                            <div className="leaderboard">
                                {currentLeaderboardData.map(leaderboard => {
                                    try {
                                        return (
                                            <div className="leaderboard-entry" key={leaderboard.displayName}>
                                                <div>
                                                    <img src={leaderboard.profilePic} alt="" />
                                                    <span>{leaderboard.displayName}</span>
                                                </div>
                                                <span className='amount'>{formatAmount(leaderboard.amount, leaderboardTitle)}</span>
                                            </div>
                                        );
                                    } catch (err) {
                                        console.log('Error rendering leaderboard:', err);
                                    }
                                })}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default Leaderboard;