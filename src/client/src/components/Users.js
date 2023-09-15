import React, { useState, useEffect } from 'react';
import '../styles/main.css';
import '../styles/users.css';

function Users() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        // Define the URL of your server endpoint to fetch user data
        const apiUrl = '/api/users'; // Replace with your actual API URL

        // Make an HTTP GET request to fetch user data
        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                // Update the users state with the fetched data and sort the users alphabetically
                setUsers(data.sort((a, b) => a.display_name.localeCompare(b.display_name)));
                setFilteredUsers(data.sort((a, b) => a.display_name.localeCompare(b.display_name)));
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
                user.display_name.toLowerCase().includes(searchTerm)
            );
            setFilteredUsers(filteredUsers);
        }

        // Clean up the event listener when the component unmounts
        return () => {
            searchInput.removeEventListener('input', handleSearch);
        };
    }, [users]);

    return (
        <div className="content">
            <div className="search-bar">
                <input type="text" placeholder="Search" />
                <i className="fa-solid fa-magnifying-glass"></i>
            </div>
            <div className="users-container">
                {/* Map over the filteredUsers array and render each user */}
                {filteredUsers.map((user) => (
                    <div key={user.id} className="user-container">
                        <img src={user.profile_image_url} alt={user.username} className="user-avatar" />
                        <span className="username">{user.display_name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Users;
