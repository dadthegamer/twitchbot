import React, { useState, useEffect } from 'react';
import UserComponent from './SubComponents/UserSubComponent';
import '../styles/GUI/users.css';

function Users() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [showUserInfo, setShowUserInfo] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // Define the URL of your server endpoint to fetch user data
        const apiUrl = '/api/users'; // Replace with your actual API URL

        // Make an HTTP GET request to fetch user data
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                // Update the users state with the fetched data and sort the users alphabetically
                setUsers(data.sort((a, b) => a.displayName.localeCompare(b.displayName)));
                setFilteredUsers(data.sort((a, b) => a.displayName.localeCompare(b.displayName)));
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    }, []);

    useEffect(() => {
        // Add an event listener for the search bar after the component has mounted
        const searchInput = document.querySelector('.search-bar input');
        searchInput.addEventListener('input', handleSearch);

        // Define the event handler function for the search bar
        function handleSearch(event) {
            const searchTerm = event.target.value.toLowerCase();
            const filteredUsers = users.filter((user) =>
                // Filter the users array and return only users whose display_name includes the search term. Sort the users alphabetically.
                user.displayName.toLowerCase().includes(searchTerm)
            );
            setFilteredUsers(filteredUsers);
        }

        // Clean up the event listener when the component unmounts
        return () => {
            searchInput.removeEventListener('input', handleSearch);
        };
    }, [users]);

    // Define the event handler function for the user container
    async function handleOnClick(event) {
        // Get the user ID from the clicked user container
        const userId = event.currentTarget.dataset.id;
        setUserId(userId);
        setShowUserInfo(true);
    }

    return (
        <div className="content">
            <div className="search-bar">
                <input type="text" placeholder="Search" />
                <i className="fa-solid fa-magnifying-glass"></i>
            </div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="users-container">
                    {/* Map over the filteredUsers array and render each user */}
                    {filteredUsers.map((user) => (
                        <div key={user.id} className="user-container" data-id={user.id} onClick={handleOnClick}>
                            <img src={user.profilePictureUrl} alt={user.username} className="user-avatar" />
                            <span className="username">{user.displayName}</span>
                        </div>
                    ))}
                </div>)}
            {showUserInfo && (
                <UserComponent userId={userId} />
            )}
        </div>
    );
}

export default Users;
