import React from 'react';
import { metros, locations } from '../constants/data';

const LocationSelector = ({
    selectedMetro,
    selectedLocation,
    onMetroChange,
    onLocationChange
}) => {
    const filteredLocations = locations.filter(location =>
        selectedMetro === "" || selectedMetro === "All" || location.metro === selectedMetro
    );

    return (
        <div className="mb-6">
            <h1 className="text-2xl font-bold mb-4">Whole Foods Market: Busy Times</h1>

            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <select
                    value={selectedMetro}
                    onChange={(e) => {
                        onMetroChange(e.target.value);
                        onLocationChange("");
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
                    onChange={(e) => onLocationChange(e.target.value)}
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
    );
};

export default LocationSelector;
