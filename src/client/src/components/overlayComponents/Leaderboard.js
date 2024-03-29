import React, { useState, useEffect } from 'react';
import '../../styles/overlay/leaderboard.css';


function Leaderboard() {
    const [leaderboards, setLeaderboards] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchedAllLeaderboards, setFetchedAllLeaderboards] = useState(false);
    const [currentLeaderboard, setCurrentLeaderboard] = useState({});
    const [duration, setDuration] = useState(15); // In seconds
    const [currentLeaderboardIndex, setCurrentLeaderboardIndex] = useState(0);
    const [leaderboardTitle, setLeaderboardTitle] = useState("");
    const [leaderboardDescription, setLeaderboardDescription] = useState("");
    const [leaderboardUsers, setLeaderboardUsers] = useState([]);

    useEffect(() => {
        fetchLeaderboards();
    }, []);

    const fetchLeaderboards = () => {
        fetch('/api/leaderboard', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.REACT_APP_API_KEY
            },
        })
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

    useEffect(() => {
        if (fetchedAllLeaderboards) {
            const interval = setInterval(() => {
                const leaderboardLength = leaderboards[currentLeaderboardIndex].data.length;
                if (leaderboardLength === 0) {
                    // Do a while loop to find the next leaderboard that has data
                    let i = 1;
                    while (leaderboardLength === 0) {
                        const nextIndex = (currentLeaderboardIndex + i) % leaderboards.length;
                        if (leaderboards[nextIndex].data.length > 0) {
                            setCurrentLeaderboard(leaderboards[nextIndex]);
                            setLeaderboardTitle(leaderboards[nextIndex].name);
                            setLeaderboardDescription(leaderboards[nextIndex].description);
                            setLeaderboardUsers(leaderboards[nextIndex].data);
                            setCurrentLeaderboardIndex(nextIndex);
                            break;
                        }
                        i++;
                    }
                } else {
                    // Set the current leaderboard
                    setCurrentLeaderboard(leaderboards[currentLeaderboardIndex]);
                    // Set the leaderboard title and description
                    setLeaderboardTitle(leaderboards[currentLeaderboardIndex].name);
                    setLeaderboardDescription(leaderboards[currentLeaderboardIndex].description);
                    // Set the leaderboard users
                    setLeaderboardUsers(leaderboards[currentLeaderboardIndex].data);
                    // Increment the current leaderboard index
                    setCurrentLeaderboardIndex((prevIndex) => {
                        fetchLeaderboards(); // Fetch the leaderboards again
                        return (prevIndex + 1) % leaderboards.length; // Wrap around to 0 when it reaches the end
                    });
                }
            }, duration * 1000);
            return () => clearInterval(interval);
        }
    }, [fetchedAllLeaderboards, leaderboards, duration, currentLeaderboardIndex]); // Include currentLeaderboardIndex as a dependency

    // Function to change each user to display flex after the animation delay
    useEffect(() => {
        if (leaderboardUsers.length > 0) {
            const users = document.querySelectorAll('.leaderboard-user');
            users.forEach((user, index) => {
                setTimeout(() => {
                    user.style.display = "flex";
                }, index * 100);
                // Once the last user is displayed wait for 5 seconds and then hide all the users
                if (index === leaderboardUsers.length - 1) {
                    setTimeout(() => {
                        users.forEach((user) => {
                            user.style.display = "none";
                        });
                        setLeaderboardUsers([]);
                    }, (duration - 1) * 1000);
                }
            });
        }
    }, [leaderboardUsers]);

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

    // Function to format the amount based on months. Example 22 should be 22 months, 1 should be 1 month, 0 should be 0 months
    function formatMonths(months) {
        if (months === 1) {
            return `${months} month`;
        } else {
            return `${months} months`;
        }
    }

    function formatAmount(amount, title) {
        // Check if the title contains "view time" and format accordingly
        if (title.toLowerCase().includes("view time")) {
            return formatMinutes(amount);
        } else if (title.toLowerCase().includes("months")) {
            return formatMonths(amount);
        } else {
            return numberWithCommas(amount);
        }
    }


    return (
        <>
            {isLoading ? (
                <div className="leaderboard-container">
                    <div className="leaderboard-title">Loading...</div>
                </div>
            ) : (
                <div className="leaderboard-container">
                    <div className='leaderboard-header'>
                        <span className="leaderboard-title">{leaderboardTitle}</span>
                        <span className="leaderboard-description">{leaderboardDescription}</span>
                    </div>
                    <div className="leaderboard-users">
                        {leaderboardUsers.length > 0 && (
                            (() => {
                                const delayedRenderedUsers = [];
                                for (let i = 0; i < leaderboardUsers.length; i++) {
                                    const user = leaderboardUsers[i];

                                    const userClassName = i === 0 ? "leaderboard-user first" : "leaderboard-user";
                                    delayedRenderedUsers.push(
                                        <div className={userClassName} key={i} style={
                                            {
                                                display: "none",
                                            }
                                        }>
                                            <div>
                                                <img src={user.profilePic} alt="" />
                                                <span className="leaderboard-user-name">{user.displayName}</span>
                                            </div>
                                            <span className="leaderboard-user-amount">{formatAmount(user.amount, leaderboardTitle)}</span>
                                        </div>
                                    );
                                }
                                return delayedRenderedUsers;
                            }
                            )()
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default Leaderboard;