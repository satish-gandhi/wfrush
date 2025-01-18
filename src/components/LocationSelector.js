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
            width: '100%',
            maxWidth: '800px',
            margin: '0 auto',
            padding: '10px 20px 10px 20px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>


            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
                marginBottom: '1.5rem',
                width: '100%',
                maxWidth: '760px'
            }}>
                <div style={{ width: '100%' }}>
                    <select
                        value={selectedMetro}
                        onChange={(e) => {
                            onMetroChange(e.target.value);
                            onLocationChange("");
                        }}
                        style={{
                            width: '100%',
                            height: '48px',
                            padding: '0 1rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#fff',
                            boxSizing: 'border-box'
                        }}
                    >
                        <option value="" disabled>Select Metro Area</option>
                        {metros.map((metro) => (
                            <option key={metro} value={metro}>{metro}</option>
                        ))}
                    </select>
                </div>

                <div style={{ width: '100%' }}>
                    <select
                        value={selectedLocation}
                        onChange={(e) => onLocationChange(e.target.value)}
                        disabled={!selectedMetro}
                        style={{
                            width: '100%',
                            height: '48px',
                            padding: '0 1rem',
                            borderRadius: '0.5rem',
                            border: '1px solid #e2e8f0',
                            backgroundColor: '#fff',
                            boxSizing: 'border-box'
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
                minHeight: '80px',
                width: '100%',
                maxWidth: '800px',
                marginBottom: '40px'
            }}>
                {selectedLocation && (
                    <div className="location-address" style={{
                        backgroundColor: '#f1f5f9',
                        padding: '16px',
                        borderRadius: '8px',
                        marginTop: '8px'
                    }}>
                        <p style={{ margin: '0' }}>{selectedLocation}</p>
                        {slotTime && (
                            <p style={{
                                margin: '8px 0 0 0',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#166534'
                            }}>
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
