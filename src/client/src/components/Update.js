import React, { useState, useEffect } from 'react';

function Update() {
    const [update, setUpdate] = useState(true);
    const [body, setBody] = useState("");

    useEffect(() => {
        // Call the function once when the component is mounted
        checkForUpdate();
    }, []);

    function checkForUpdate() {
        fetch("/api/update")
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (!data.update) {
                    setUpdate(true);
                    setBody(data.update.body);
                    console.log(data.update.body);
                }
            });
    }

    return (
        <div className="content">
            {update && (
                <div className="update-alert">
                    <p>There is an update available. Please restart the app.</p>
                    <p>{body}</p>
                </div>
            )}
        </div>
    )
}

export default Update;