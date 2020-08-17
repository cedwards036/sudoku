import React, { useState, useEffect } from 'react';
import '../styles/Timer.css';

export default function Timer(props) {
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    useEffect(() => {
        let interval = null;
        if (props.isActive) {
            interval = setInterval(() => {
                setElapsedSeconds(seconds => seconds + 1);
            }, 1000);
        } else if (!props.isActive && elapsedSeconds !== 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [props.isActive, elapsedSeconds]);

    function formattedTime() {
        const hours = zeroPad(Math.floor(elapsedSeconds / 3600));
        const minutes = zeroPad(Math.floor(elapsedSeconds / 60) % 60);
        const seconds = zeroPad(elapsedSeconds % 60);
        return `${hours}:${minutes}:${seconds}`
    }

    function zeroPad(num, maxDigits = 2) {
        return num.toString().padStart(maxDigits, '0')
    }

    return (
        <div className="timer">{formattedTime()}</div>
    )
}