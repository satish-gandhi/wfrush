import React, { useState } from 'react';
import { metros, locations, slotData } from '../constants/data';

const LocationSelector = ({
    selectedMetro,
    selectedLocation,
    onMetroChange,
    onLocationChange
}) => {
    const [isSearching, setIsSearching] = useState(false);
    const filteredLocations = locations.filter(location =>
        selectedMetro === "" || selectedMetro === "All" || location.metro === selectedMetro
    );

    const selectedLocationObj = locations.find(loc => loc.address === selectedLocation);
    const slotTime = selectedLocationObj ? slotData[selectedLocationObj.code] : null;

    const handleFindSlots = () => {
        setIsSearching(true);
        setTimeout(() => {
            setIsSearching(false);
        }, 2000);
    };

    return (
        <div className="mb-8 text-center">
            <div className="logo-header mb-6">
                <div className="text-left">
                    <h1 className="ghostfounder-logo">GhostFounder</h1>
                </div>
                <h2 className="text-xl text-gray-600 text-center">Whole Foods Market: Busy Times</h2>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-4">
                <div className="w-full sm:w-1/3 min-w-[200px]">
                    <select
                        value={selectedMetro}
                        onChange={(e) => {
                            onMetroChange(e.target.value);
                            onLocationChange("");
                        }}
                    >
                        <option value="" disabled>Select Metro Area</option>
                        {metros.map((metro) => (
                            <option key={metro} value={metro}>{metro}</option>
                        ))}
                    </select>
                </div>

                <div className="w-full sm:w-1/2 min-w-[300px] flex flex-col gap-4">
                    <select
                        value={selectedLocation}
                        onChange={(e) => onLocationChange(e.target.value)}
                        disabled={!selectedMetro}
                    >
                        <option value="" disabled>
                            {!selectedMetro ? "First select a metro area" : "Select a location"}
                        </option>
                        {filteredLocations.map((location, index) => (
                            <option key={index} value={location.address}>
                                {location.name}
                            </option>
                        ))}
                    </select>

                    {selectedLocation && (
                        <>
                            <button
                                onClick={handleFindSlots}
                                disabled={isSearching}
                                className="find-slots-btn bg-green-700 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:bg-green-800 transition-all"
                            >
                                Find Best Slots
                            </button>
                            {isSearching && (
                                <div className="popup-overlay">
                                    <div className="popup-content">
                                        <div className="popup-spinner"></div>
                                        <p className="text-lg font-medium mt-4">Finding Best Slots...</p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {selectedLocation && (
                <div className="location-address">
                    <p>{selectedLocation}</p>
                    {slotTime && (
                        <p className="mt-2 text-sm font-medium text-green-800">
                            Available demo slots: {slotTime.split('-')[0]}:00 AM - {slotTime.split('-')[1]}:00 {parseInt(slotTime.split('-')[1]) >= 12 ? 'PM' : 'AM'}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default LocationSelector;
