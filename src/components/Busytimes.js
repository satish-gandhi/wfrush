import React, { useState, useEffect } from "react";
import LocationSelector from './LocationSelector';
import BusiestTimesDisplay from './BusiestTimesDisplay';
import DailyAnalysis from './DailyAnalysis';
import Legend from './Legend';
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

                setAnalysis(data.analysis);
                const selectedLocationObj = locations.find(loc => loc.address === selectedLocation);
                if (selectedLocationObj) {
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
        <div className="p-4 max-w-4xl mx-auto">
            <LocationSelector
                selectedMetro={selectedMetro}
                selectedLocation={selectedLocation}
                onMetroChange={setSelectedMetro}
                onLocationChange={setSelectedLocation}
            />

            {!selectedLocation ? (
                <p>Please select a location to view busy times.</p>
            ) : loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : (
                <>
                    <BusiestTimesDisplay busiestTimes={busiestTimes} />
                    <DailyAnalysis analysis={analysis} />
                    {analysis.length > 0 && <Legend />}
                </>
            )}
        </div>
    );
};

export default BusyTimes;
