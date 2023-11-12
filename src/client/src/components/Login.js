import React, { useState, useEffect } from 'react';
import '../styles/GUI/newCommand.css';


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loginStatus, setLoginStatus] = useState(false);

    const login = () => {
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username, password: password }),
        }).then((response) => {
            return response.json();
        }).then((data) => {
            if (data.auth) {
                localStorage.setItem("token", data.token);
                setLoginStatus(true);
            }
        });
    }

    useEffect(() => {
        if (localStorage.getItem("token")) {
            setLoginStatus(true);
        }
    }, [])

    return (
        <div className="newCommand">
            <h1>Login</h1>
            <label>Username</label>
            <input type="text" onChange={(e) => { setUsername(e.target.value) }} />
            <label>Password</label>
            <input type="password" onChange={(e) => { setPassword(e.target.value) }} />
            <button onClick={login}>Login</button>
            {loginStatus && <h1>You are logged in</h1>}
        </div>
    );
}

export default Login;