import React from 'react';
import { formatTime } from '../utils/timeUtils';

const BusiestTimesDisplay = ({ busiestTimes }) => {
    if (!busiestTimes.weekend && !busiestTimes.weekday) {
        return <div className="busiest-times-card min-h-[200px] flex items-center justify-center">
            <p className="text-gray-500">No busy times data available</p>
        </div>;
    }

    return (
        <div className="busiest-times-card min-h-[200px]">
            <h2 className="text-xl font-bold mb-4">Recommended Demo Times (Busiest Hours)</h2>

            {busiestTimes.weekend && (
                <div className="mb-4">
                    <h3 className="font-semibold text-lg mb-3">Top Weekend Times:</h3>
                    {busiestTimes.weekend.map((slot, index) => (
                        <div key={index} className="time-slot">
                            <span className="font-medium">{index + 1}. {slot.day}</span>
                            <span className="text-muted"> from {formatTime(slot.startHour)} to {formatTime(slot.endHour)}</span>
                        </div>
                    ))}
                </div>
            )}

            {busiestTimes.weekday && (
                <div>
                    <h3 className="font-semibold text-lg mb-3">Top Weekday Times:</h3>
                    {busiestTimes.weekday.map((slot, index) => (
                        <div key={index} className="time-slot">
                            <span className="font-medium">{index + 1}. {slot.day}</span>
                            <span className="text-muted"> from {formatTime(slot.startHour)} to {formatTime(slot.endHour)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default BusiestTimesDisplay;
