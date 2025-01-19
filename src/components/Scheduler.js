import React, { useState } from 'react';
import { metros, locations, slotData } from '../constants/data';
import { analyzeBusiestTimes } from '../utils/dataProcessing';
import StoreResults from './StoreResults';
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
        <div className="App">
            <div className="w-full max-w-4xl mx-auto p-4">
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Schedule Demo</h2>

                    {/* Metro Selection */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Select Metro Area</h3>
                        <select
                            value={selectedMetro}
                            onChange={(e) => handleMetroChange(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="">Select a metro area</option>
                            {metros.map(metro => (
                                <option key={metro} value={metro}>{metro}</option>
                            ))}
                        </select>
                    </div>

                    {/* Store Selection */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Select Stores</h3>
                        <div className="flex flex-col space-y-2">
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

                        <div className="flex flex-col space-y-6">
                            <div>
                                <h4 className="font-medium mb-2">Days Available</h4>
                                <div className="flex flex-col space-y-2">
                                    {Object.entries(availability.weekdays).map(([day, checked]) => (
                                        <label key={day} className="flex items-center space-x-2">
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
                            </div>

                            <div>
                                <h4 className="font-medium mb-2">Shifts Available</h4>
                                <div className="flex flex-col space-y-2">
                                    {Object.entries(availability.shift).map(([shift, checked]) => (
                                        <label key={shift} className="flex items-center space-x-2">
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
                        <StoreResults recommendations={recommendations} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Scheduler;
