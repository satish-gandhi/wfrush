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
                    <h3 className="font-semibold text-lg">Top Weekend Times:</h3>
                    {busiestTimes.weekend.map((slot, index) => (
                        <p key={index} className="text-gray-700">
                            {index + 1}. {slot.day} from {formatTime(slot.startHour)} to {formatTime(slot.endHour)}
                        </p>
                    ))}
                </div>
            )}

            {busiestTimes.weekday && (
                <div>
                    <h3 className="font-semibold text-lg">Top Weekday Times:</h3>
                    {busiestTimes.weekday.map((slot, index) => (
                        <p key={index} className="text-gray-700">
                            {index + 1}. {slot.day} from {formatTime(slot.startHour)} to {formatTime(slot.endHour)}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BusiestTimesDisplay;
