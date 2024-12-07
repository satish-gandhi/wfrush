import React from 'react';
import { formatTime } from '../utils/timeUtils';

const BusiestTimesDisplay = ({ busiestTimes }) => {
    if (!busiestTimes.weekend && !busiestTimes.weekday) {
        return null;
    }

    return (
        <div className="mb-6 p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Recommended Demo Times (Busiest Hours)</h2>

            {busiestTimes.weekend && (
                <div className="mb-4">
                    <h3 className="font-semibold text-lg">Busiest Weekend Time:</h3>
                    <p className="text-gray-700">
                        {busiestTimes.weekend.day} at {formatTime(busiestTimes.weekend.hour)}
                    </p>
                </div>
            )}

            {busiestTimes.weekday && (
                <div>
                    <h3 className="font-semibold text-lg">Busiest Weekday Time:</h3>
                    <p className="text-gray-700">
                        {busiestTimes.weekday.day} at {formatTime(busiestTimes.weekday.hour)}
                    </p>
                </div>
            )}
        </div>
    );
};

export default BusiestTimesDisplay;
