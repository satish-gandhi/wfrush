import React, { useState, useEffect } from "react";

const BusyTimes = () => {
    const [analysis, setAnalysis] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedMetro, setSelectedMetro] = useState("");

    const getIntensityColor = (intensity_nr) => {
        switch (intensity_nr) {
            case -2: return "#DBEAFE";
            case -1: return "#93C5FD";
            case 0: return "#60A5FA";
            case 1: return "#3B82F6";
            case 2: return "#2563EB";
            default: return "#F3F4F6";
        }
    };

    const getTextColor = (intensity_nr) => {
        return intensity_nr > 0 ? "white" : "black";
    };

    const metros = ["All", "Dallas", "Austin/SA", "Arkansas", "Oklahoma", "Houston", "Louisiana"];

    const locations = [
        // Austin/SA Metro
        {
            name: "Whole Foods Market - William Cannon",
            address: "4301 W. William Cannon, Bldg B, Ste 800, Austin, TX 78749",
            metro: "Austin/SA",
            demoHours: { monday: "7AM-11AM", tuesday: "7AM-11AM", wednesday: "7AM-11AM", thursday: "7AM-11AM", friday: "7AM-11AM", saturday: "7AM-11AM" }
        },
        {
            name: "Whole Foods Market - Bee Cave",
            address: "12601 Hill Country Blvd, Bee Cave, TX 78738",
            metro: "Austin/SA",
            demoHours: { monday: "6AM-12PM", tuesday: "6AM-12PM", wednesday: "6AM-12PM", thursday: "6AM-12PM", friday: "6AM-12PM", saturday: "CLOSED" }
        },
        {
            name: "Whole Foods Market - Cedar Park",
            address: "5001 183A Toll Road, Retail #16, Cedar Park, TX 78613",
            metro: "Austin/SA",
            demoHours: { monday: "6AM-12PM", tuesday: "6AM-12PM", wednesday: "6AM-12PM", thursday: "6AM-12PM", friday: "6AM-12PM", saturday: "CLOSED" }
        },
        {
            name: "Whole Foods Market - Domain",
            address: "11920 Domain Drive, Austin, TX 78758",
            metro: "Austin/SA",
            demoHours: { monday: "7AM-12PM", tuesday: "7AM-12PM", wednesday: "7AM-12PM", thursday: "7AM-12PM", friday: "7AM-12PM", saturday: "CLOSED" }
        },
        {
            name: "Whole Foods Market - East Austin",
            address: "901 E 5th Street ste 100 Austin, TX 78702",
            metro: "Austin/SA",
            demoHours: { monday: "7AM-12PM", tuesday: "7AM-12PM", wednesday: "7AM-12PM", thursday: "7AM-12PM", friday: "7AM-12PM", saturday: "appointment only" }
        },
        {
            name: "Whole Foods Market - Gateway",
            address: "9607 Research Blvd., #300, Austin, TX 78759",
            metro: "Austin/SA",
            demoHours: { monday: "7AM-12PM", tuesday: "7AM-12PM", wednesday: "7AM-12PM", thursday: "7AM-12PM", friday: "7AM-12PM", saturday: "CLOSED" }
        },
        {
            name: "Whole Foods Market - Downtown Austin",
            address: "525 N Lamar Blvd., Austin, TX 78703",
            metro: "Austin/SA",
            demoHours: { monday: "7AM-12PM", tuesday: "7AM-12PM", wednesday: "7AM-12PM", thursday: "7AM-12PM", friday: "7AM-12PM", saturday: "CLOSED" }
        },
        {
            name: "Whole Foods Market - Alamo Quarry",
            address: "255 E. Basse Rd, Ste 130, San Antonio, TX 78209",
            metro: "Austin/SA",
            demoHours: { monday: "7AM-1PM", tuesday: "7AM-1PM", wednesday: "7AM-1PM", thursday: "7AM-1PM", friday: "7AM-1PM", saturday: "CLOSED" }
        },
        // ... Add all other locations here
    ];

    useEffect(() => {
        if (!selectedLocation) {
            setAnalysis([]);
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
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                );

                const data = await response.json();

                if (data.status !== "OK" || !data.analysis) {
                    throw new Error("Failed to fetch venue data");
                }

                setAnalysis(data.analysis);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchBusyTimes();
    }, [selectedLocation]);

    const filteredLocations = locations.filter(location =>
        selectedMetro === "" || selectedMetro === "All" || location.metro === selectedMetro
    );

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-4">Whole Foods Market: Busy Times & Demo Slots</h1>

                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <select
                        value={selectedMetro}
                        onChange={(e) => {
                            setSelectedMetro(e.target.value);
                            setSelectedLocation("");
                        }}
                        className="p-2 border rounded"
                        style={{ minWidth: "200px" }}
                    >
                        <option value="">Select Metro Area</option>
                        {metros.map((metro) => (
                            <option key={metro} value={metro}>{metro}</option>
                        ))}
                    </select>

                    <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="p-2 border rounded"
                        style={{ minWidth: "300px" }}
                    >
                        <option value="">Select a location</option>
                        {filteredLocations.map((location, index) => (
                            <option key={index} value={location.address}>
                                {location.name}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedLocation && (
                    <p className="text-gray-600">Address: {selectedLocation}</p>
                )}
            </div>

            {!selectedLocation ? (
                <p>Please select a location to view busy times and demo slots.</p>
            ) : loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <div className="bg-blue-50 p-4 rounded">
                        <h3 className="text-lg font-bold mb-2">Demo Hours</h3>
                        {selectedLocation && (
                            <div className="space-y-1">
                                {Object.entries(locations.find(l => l.address === selectedLocation)?.demoHours || {}).map(([day, hours]) => (
                                    <div key={day} className="flex justify-between">
                                        <span className="capitalize">{day}:</span>
                                        <span>{hours}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {analysis.map((day, index) => (
                        <div key={index} style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: "1rem" }}>
                            <h3 className="font-bold mb-2">{day.day_info.day_text}</h3>
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
                    ))}

                    <div className="mt-4 p-3 bg-gray-100 rounded">
                        <h4 className="font-bold mb-2">Legend:</h4>
                        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                            <div>
                                <span style={{ backgroundColor: "#DBEAFE" }} className="inline-block w-4 h-4 mr-2"></span>
                                Very Quiet
                            </div>
                            <div>
                                <span style={{ backgroundColor: "#93C5FD" }} className="inline-block w-4 h-4 mr-2"></span>
                                Below Average
                            </div>
                            <div>
                                <span style={{ backgroundColor: "#60A5FA" }} className="inline-block w-4 h-4 mr-2"></span>
                                Average
                            </div>
                            <div>
                                <span style={{ backgroundColor: "#3B82F6" }} className="inline-block w-4 h-4 mr-2"></span>
                                Above Average
                            </div>
                            <div>
                                <span style={{ backgroundColor: "#2563EB" }} className="inline-block w-4 h-4 mr-2"></span>
                                Very Busy
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusyTimes;