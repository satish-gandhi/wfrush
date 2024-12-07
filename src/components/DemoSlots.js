import React from 'react';
import { formatHourRange, getBestDemoSlots } from '../utils/utils';

const DemoSlots = ({ analysis, demoHours }) => {
    const slots = getBestDemoSlots(analysis, demoHours);
    if (!slots) return null;

    return (
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="text-xl font-bold mb-3">Recommended Demo Slots</h3>
            <div className="space-y-2">
                <div className="p-3 bg-white rounded shadow-sm">
                    <h4 className="font-bold text-blue-800">Weekend Demo Slots</h4>
                    <p className="text-sm">
                        Available Time: {formatHourRange(slots.weekendSlots.time)}
                        <br />
                        <span className="text-gray-600">{slots.weekendSlots.traffic}</span>
                    </p>
                </div>
                <div className="p-3 bg-white rounded shadow-sm">
                    <h4 className="font-bold text-blue-800">Weekday Morning Demo Slots</h4>
                    <p className="text-sm">
                        Available Time: {formatHourRange(slots.weekdaySlots.time)}
                        <br />
                        <span className="text-gray-600">{slots.weekdaySlots.traffic}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DemoSlots;