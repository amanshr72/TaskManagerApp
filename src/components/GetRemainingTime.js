import React, { useState, useEffect } from 'react';

const GetRemainingTime = ({ endDate }) => {
    const [remainingTime, setRemainingTime] = useState("");

    useEffect(() => {
        const end = new Date(endDate).getTime();

        if (isNaN(end)) {
            setRemainingTime("Invalid date format");
            return;
        }

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const diffInSeconds = Math.floor((end - now) / 1000);

            if (now >= end) {
                clearInterval(interval);
                setRemainingTime("Time over");
                return;
            }

            const days = Math.floor(diffInSeconds / (3600 * 24));
            const hours = Math.floor((diffInSeconds % (3600 * 24)) / 3600);
            const minutes = Math.floor((diffInSeconds % 3600) / 60);

            if (days > 0) {
                setRemainingTime(`${days}d`);
            } else if (hours > 0) {
                setRemainingTime(`${hours}h`);
            } else {
                setRemainingTime(`${minutes}m`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [endDate]);

    return <>{remainingTime}</>;
};

export default GetRemainingTime;
