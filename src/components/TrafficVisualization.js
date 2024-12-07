import React from 'react';
import { getIntensityColor, getTextColor, formatHourRange } from '../utils/utils';

const TrafficVisualization = ({ day, demoHours }) => {
    return (
        <div style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: "1rem" }}>
            <h3 className="font-bold mb-2">
                {day.day_info.day_text}
                <span className="text-sm font-normal ml-2 text-gray-600">
                    Demo Hours: {formatHourRange(demoHours?.[day.day_info.day_text.toLowerCase()])}
                </span>
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(24, 1fr)", gap: "2px" }}>
                {day.hour_analysis.map((hour, hourIndex) => (
                    <div
                        key={hourIndex}
                        style={{
                            backgroundColor: getIntensityColor(hour.intensity_nr),
                            color: getTextColor(hour.intensity_nr),
                            padding: "0.5rem",
                            height: "2rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.75rem",
                            cursor: "default"
                        }}
                        title={`${hour.hour}:00 - ${hour.intensity_txt}`}
                    >
                        {hour.hour}
                    </div>
                ))}
            </div>
            <div style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>
                <p>Busy Hours: {day.busy_hours.map(h => `${h}:00`).join(", ")}</p>
                <p>Quiet Hours: {day.quiet_hours.map(h => `${h}:00`).join(", ")}</p>
            </div>
        </div>
    );
};

export default TrafficVisualization;