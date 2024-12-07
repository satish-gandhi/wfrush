import React from 'react';

const Legend = () => (
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
);

export default Legend;