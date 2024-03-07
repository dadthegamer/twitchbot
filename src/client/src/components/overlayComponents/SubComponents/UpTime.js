import React, { useState, useEffect } from 'react';
import '../../../styles/overlay/bottomLeft.css';


function UpTime() {
    const [timer, setTimer] = useState(0); // In seconds
    const [startDate, setStartDate] = useState(0);
    const [stringTime, setStringTime] = useState('0:0:0');

    useEffect(() => {
        fetch('/api/stream')
            .then((res) => res.json())
            .then((data) => {
                const { startDate } = data.stream;
                setStartDate(startDate);
                const now = new Date();
            });
    }, []);

    // Function to format the timer into a string
    const formatTime = (time) => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;

        return `${hours}:${minutes}:${seconds}`;
    };

    // Function to calculate the time since the stream started
    const calculateTime = (streamStartTime) => {
        const now = new Date();
        const diff = Math.floor((now - new Date(streamStartTime)) / 1000);
        setTimer(diff);
        setStringTime(formatTime(diff));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            calculateTime(startDate);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    return (
        <div className='bottom-left-card'>
            <span className='bottom-left-label'>Uptime</span>
            <span className='bottom-left-uptime'>{stringTime}</span>
        </div>
    );
}

export default UpTime;