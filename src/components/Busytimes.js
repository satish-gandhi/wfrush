import React, { useState, useEffect } from "react";
import LocationSelector from './LocationSelector';
import BusiestTimesDisplay from './BusiestTimesDisplay';
import DailyAnalysis from './DailyAnalysis';
import { analyzeBusiestTimes } from '../utils/dataProcessing';
import { locations } from '../constants/data';

const BusyTimes = () => {
    const [analysis, setAnalysis] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedMetro, setSelectedMetro] = useState("");
    const [busiestTimes, setBusiestTimes] = useState({ weekend: null, weekday: null });

    useEffect(() => {
        if (!selectedLocation) {
            setAnalysis([]);
            setBusiestTimes({ weekend: null, weekday: null });
            return;
        }

        const fetchBusyTimes = async () => {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams({
                api_key_private: "pri_53a711d76c0843c78bf6356c7e729311",
                venue_name: "Whole Foods Market",
                venue_address: selectedLocation
            });

            try {
                const response = await fetch(
                    `https://besttime.app/api/v1/forecasts?${params}`,
                    { method: "POST" }
                );

                const data = await response.json();

                if (data.status !== "OK" || !data.analysis) {
                    throw new Error("Failed to fetch venue data");
                }

                console.log("API Response Analysis:", data.analysis);
                setAnalysis(data.analysis);
                const selectedLocationObj = locations.find(loc => loc.address === selectedLocation);
                if (selectedLocationObj) {
                    console.log("Setting analysis data, length:", data.analysis.length);
                    setBusiestTimes(analyzeBusiestTimes(data.analysis, selectedLocationObj.code));
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchBusyTimes();
    }, [selectedLocation]);

    return (
        <div className="App">
            <div className="p-4 max-w-4xl mx-auto">
                <LocationSelector
                    selectedMetro={selectedMetro}
                    selectedLocation={selectedLocation}
                    onMetroChange={setSelectedMetro}
                    onLocationChange={setSelectedLocation}
                />

                <div className="min-h-[600px]">
                    {!selectedLocation ? (
                        <div className="text-center text-gray-600 p-8 bg-white rounded-lg shadow-sm">
                            Please select a location to view busy times.
                        </div>
                    ) : loading ? (
                        <div className="text-center text-gray-600 p-8 bg-white rounded-lg shadow-sm">
                            <div className="animate-pulse">Loading...</div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-600 p-8 bg-white rounded-lg shadow-sm border border-red-200">
                            {error}
                        </div>
                    ) : (
                        <>
                            <BusiestTimesDisplay busiestTimes={busiestTimes} />
                            <DailyAnalysis analysis={analysis} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BusyTimes;
