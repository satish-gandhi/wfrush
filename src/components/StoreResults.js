import React from 'react';

const StoreResults = ({ recommendations }) => {
    const getTrafficColor = (level) => {
        if (level >= 75) return 'text-red-700 bg-red-100';
        if (level >= 50) return 'text-orange-700 bg-orange-100';
        if (level >= 25) return 'text-yellow-700 bg-yellow-100';
        return 'text-green-700 bg-green-100';
    };

    // Group recommendations by store
    const storeResults = recommendations.reduce((acc, slot) => {
        if (!acc[slot.store]) {
            acc[slot.store] = {
                store: slot.store,
                address: slot.address,
                slots: []
            };
        }
        if (acc[slot.store].slots.length < 3) {
            acc[slot.store].slots.push(slot);
        }
        return acc;
    }, {});

    return (
        <div className="daily-analysis-container">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recommended Demo Slots</h2>
                <span className="text-sm text-muted">Showing top 3 slots per store</span>
            </div>

            <div className="flex flex-col gap-6">
                {Object.values(storeResults).map((storeData, index) => (
                    <div key={index} className="busiest-times-card">
                        {/* Store Header */}
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">{storeData.store}</h3>
                            <div className="location-address">
                                {storeData.address}
                            </div>
                        </div>

                        {/* Slots Container */}
                        <div className="time-slots-container flex flex-row flex-wrap gap-4">                            {storeData.slots.map((slot, slotIndex) => (
                            <div
                                key={slotIndex}
                                className="time-slotschedule p-4 bg-gray-50 rounded-lg"
                            >
                                <div className="flex flex-col space-y-3">
                                    <div className="text-gray-800">
                                        <span className="font-medium">Day:</span> {slot.day}
                                    </div>
                                    <div className="text-gray-800">
                                        <span className="font-medium">Time Slot:</span> {slot.startHour}:00 - {slot.endHour}:00
                                    </div>
                                    <div className="text-gray-800">
                                        <span className="font-medium">Traffic Level:</span>
                                        <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getTrafficColor(slot.footTraffic)}`}>
                                            {slot.footTraffic}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StoreResults;
