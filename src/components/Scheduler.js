import React, { useState } from 'react';
import { metros, locations, slotData } from '../constants/data';
import { analyzeBusiestTimes } from '../utils/dataProcessing';

const Scheduler = () => {
    const [selectedMetro, setSelectedMetro] = useState('');
    const [selectedStores, setSelectedStores] = useState([]);
    const [availability, setAvailability] = useState({
        weekdays: {
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false
        },
        shift: {
            morning: false,
            evening: false
        }
    });
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleMetroChange = (metro) => {
        setSelectedMetro(metro);
        setSelectedStores([]); // Reset stores when metro changes
    };

    const handleStoreChange = (store) => {
        setSelectedStores(prev => {
            return prev.includes(store)
                ? prev.filter(s => s !== store)
                : [...prev, store];
        });
    };

    const handleAvailabilityChange = (category, key) => {
        setAvailability(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: !prev[category][key]
            }
        }));
    };

    const fetchStoreData = async (store) => {
        const params = new URLSearchParams({
            api_key_private: process.env.REACT_APP_BESTTIME_API_KEY || "pri_53a711d76c0843c78bf6356c7e729311",
            venue_name: "Whole Foods Market",
            venue_address: store.address
        });

        try {
            const response = await fetch(
                `https://besttime.app/api/v1/forecasts?${params}`,
                { method: "POST" }
            );
            const data = await response.json();
            console.log('\n=== BestTime API Response ===');
            console.log('Status:', data.status);
            console.log('Venue Info:', {
                name: data.venue_info?.venue_name,
                address: data.venue_info?.venue_address,
                timezone: data.venue_info?.timezone
            });
            console.log('\nRaw Analysis Data:');
            if (data.analysis) {
                data.analysis.forEach(day => {
                    console.log(`\n${day.day_info.day_text}:`, {
                        day_raw: day.day_info.day_raw,
                        day_int: day.day_info.day_int,
                        hour_analysis: day.hour_analysis.map(hour => ({
                            hour: hour.hour,
                            intensity: hour.intensity_nr,
                            intensity_txt: hour.intensity_txt,
                            occupancy: hour.occupancy,
                        }))
                    });
                });
            } else {
                console.log('No analysis data available');
            }

            if (data.status === "OK" && data.analysis) {
                return analyzeBusiestTimes(data.analysis, store.code);
            }
            throw new Error(`Failed to fetch data for ${store.name}`);
        } catch (err) {
            console.error(`Error fetching data for ${store.name}:`, err);
            return null;
        }
    };

    const findBestSlots = async () => {
        if (selectedStores.length === 0) {
            setError("Please select at least one store");
            return;
        }

        if (!Object.values(availability.weekdays).some(day => day) ||
            !Object.values(availability.shift).some(shift => shift)) {
            setError("Please select at least one day and shift");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const storeDataPromises = selectedStores.map(async storeAddress => {
                const store = locations.find(loc => loc.address === storeAddress);
                if (!store) return null;

                const data = await fetchStoreData(store);
                return { store, data };
            });

            const storesData = await Promise.all(storeDataPromises);
            const validStoresData = storesData.filter(data => data && data.data);
            console.log('Valid stores data:', validStoresData);

            let recommendedSlots = [];

            // Process all store data first
            console.log('Processing store data...');
            validStoresData.forEach(({ store, data }) => {
                const { weekend, weekday } = data;
                const slotTime = slotData[store.code];
                if (!slotTime) return;

                // Not currently using slot time range for validation
                const isValidTime = (hour) => {
                    const isMorning = hour < 12;
                    const isEvening = hour >= 12;
                    return (availability.shift.morning && isMorning) ||
                        (availability.shift.evening && isEvening);
                };

                const processSlots = (slots, isWeekend) => {
                    if (!slots) return;
                    slots.forEach(slot => {
                        const day = slot.day.toLowerCase();
                        // Check if the day is selected in availability
                        const dayAvailable = availability.weekdays[day];
                        const timeValid = isValidTime(slot.startHour);

                        if (dayAvailable && timeValid) {
                            recommendedSlots.push({
                                store: store.name,
                                address: store.address,
                                day: slot.day,
                                startHour: slot.startHour,
                                endHour: slot.endHour,
                                footTraffic: slot.footTraffic
                            });
                        }
                    });
                };

                // Process weekday slots first
                processSlots(weekday, false);

                // Only process weekend slots if we don't have enough weekday slots
                if (recommendedSlots.length < 5) {
                    processSlots(weekend, true);
                }
            });

            // Sort by foot traffic level
            recommendedSlots = recommendedSlots
                .sort((a, b) => b.footTraffic - a.footTraffic)
                .slice(0, 10);

            if (recommendedSlots.length === 0) {
                setError("No slots found during selected availability. Try expanding your availability or selecting different stores.");
                return;
            }

            setRecommendations(recommendedSlots);
        } catch (err) {
            setError("Failed to fetch store data. Please try again.");
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const getTrafficDescription = (level) => {
        if (level >= 75) return 'Peak Hours';
        if (level >= 50) return 'High Traffic';
        if (level >= 25) return 'Moderate Traffic';
        return 'Low Traffic';
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Schedule Demo</h2>

                {/* Metro Selection */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Select Metro Area</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {metros.map(metro => (
                            <label key={metro} className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="metro"
                                    value={metro}
                                    checked={selectedMetro === metro}
                                    onChange={() => handleMetroChange(metro)}
                                    className="w-4 h-4"
                                />
                                <span>{metro}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Store Selection */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Select Stores</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {locations
                            .filter(loc => selectedMetro === loc.metro)
                            .map(store => (
                                <label key={store.address} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedStores.includes(store.address)}
                                        onChange={() => handleStoreChange(store.address)}
                                        className="w-4 h-4"
                                    />
                                    <span>{store.name}</span>
                                </label>
                            ))}
                    </div>
                </div>

                {/* Team Availability */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Team Availability</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium mb-2">Days Available</h4>
                            {Object.entries(availability.weekdays).map(([day, checked]) => (
                                <label key={day} className="flex items-center space-x-2 mb-2">
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => handleAvailabilityChange('weekdays', day)}
                                        className="w-4 h-4"
                                    />
                                    <span className="capitalize">{day}</span>
                                </label>
                            ))}
                        </div>

                        <div>
                            <h4 className="font-medium mb-2">Shifts Available</h4>
                            {Object.entries(availability.shift).map(([shift, checked]) => (
                                <label key={shift} className="flex items-center space-x-2 mb-2">
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => handleAvailabilityChange('shift', shift)}
                                        className="w-4 h-4"
                                    />
                                    <span className="capitalize">{shift}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Find Slots Button */}
                <button
                    onClick={findBestSlots}
                    disabled={loading}
                    className="find-slots-btn w-full"
                >
                    {loading ? 'Finding Best Slots...' : 'Find Highest Traffic Demo Slots'}
                </button>

                {error && (
                    <div className="text-red-600 mt-4 p-4 bg-red-50 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Recommendations */}
                {recommendations.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-3">Best Demo Slots by Store</h3>
                        <p className="text-sm text-gray-600 mb-4">Showing top 3 times per store based on foot traffic data</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {Object.values(recommendations.reduce((acc, slot) => {
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
                            }, {})).map((storeData, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                                    <div className="bg-gray-50 p-4 border-b">
                                        <h4 className="font-semibold text-lg">{storeData.store}</h4>
                                        <p className="text-sm text-gray-600">{storeData.address}</p>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        {storeData.slots.map((slot, slotIndex) => (
                                            <div key={slotIndex} className="border-b last:border-b-0 pb-3 last:pb-0">
                                                <div className="flex justify-between items-center">
                                                    <p className="text-sm font-medium">
                                                        {slot.day} - {slot.startHour}:00 to {slot.endHour}:00
                                                    </p>
                                                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${slot.footTraffic >= 75 ? 'bg-red-100 text-red-800' :
                                                            slot.footTraffic >= 50 ? 'bg-orange-100 text-orange-800' :
                                                                slot.footTraffic >= 25 ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-green-100 text-green-800'
                                                        }`}>
                                                        Traffic: {slot.footTraffic}
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {getTrafficDescription(slot.footTraffic)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Scheduler;
