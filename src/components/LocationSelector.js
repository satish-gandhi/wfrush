import React from 'react';
import { metros, locations, slotData } from '../constants/data';

const LocationSelector = ({
    selectedMetro,
    selectedLocation,
    onMetroChange,
    onLocationChange
}) => {
    const filteredLocations = locations.filter(location =>
        selectedMetro === "" || selectedMetro === "All" || location.metro === selectedMetro
    );

    const selectedLocationObj = locations.find(loc => loc.address === selectedLocation);
    const slotTime = selectedLocationObj ? slotData[selectedLocationObj.code] : null;

    return (
        <div style={{
            width: '800px',
            margin: '0 auto',
            padding: '0 20px'
        }}>
            <div style={{
                width: '760px',
                textAlign: 'center',
                marginBottom: '2rem'
            }}>
                <h1 className="ghostfounder-logo">GhostFounder</h1>
                <h2 className="text-xl text-gray-600">Whole Foods Market: Busy Times</h2>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '370px 370px',
                gap: '20px',
                marginBottom: '1.5rem',
                width: '760px'
            }}>
                <div style={{ width: '370px' }}>
                    <select
                        value={selectedMetro}
                        onChange={(e) => {
                            onMetroChange(e.target.value);
                            onLocationChange("");
                        }}
                        style={{
                            width: '370px',
                            height: '48px',
                            padding: '0 1rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#fff'
                        }}
                    >
                        <option value="" disabled>Select Metro Area</option>
                        {metros.map((metro) => (
                            <option key={metro} value={metro}>{metro}</option>
                        ))}
                    </select>
                </div>

                <div style={{ width: '370px' }}>
                    <select
                        value={selectedLocation}
                        onChange={(e) => onLocationChange(e.target.value)}
                        disabled={!selectedMetro}
                        style={{
                            width: '370px',
                            height: '48px',
                            padding: '0 1rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#fff'
                        }}
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
                </div>
            </div>

            <div style={{
                height: '80px',
                width: '760px'
            }}>
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
        </div>
    );
};

export default LocationSelector;