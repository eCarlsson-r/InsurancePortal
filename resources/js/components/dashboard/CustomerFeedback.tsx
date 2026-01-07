import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CustomerFeedback = () => {
    const percentage = 66;

    return (
        <CircularProgressbar
            value={percentage}
            styles={buildStyles({
                pathColor: "#7356f1",
                trailColor: "#E5E5E5"
            })}
        />
    );
};

export default CustomerFeedback;
