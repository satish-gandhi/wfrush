import React, { useState, useEffect } from "react";

const BusyTimes = () => {
    const [analysis, setAnalysis] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedMetro, setSelectedMetro] = useState("");
    const getIntensityColor = (intensity_nr) => {
        switch (intensity_nr) {
            case -2: return "#DBEAFE"; // Very Light Blue
            case -1: return "#93C5FD"; // Light Blue
            case 0: return "#60A5FA";  // Medium Blue
            case 1: return "#3B82F6";  // Blue
            case 2: return "#2563EB";  // Dark Blue
            default: return "#F3F4F6"; // Gray
        }
    };

    const getTextColor = (intensity_nr) => {
        return intensity_nr > 0 ? "white" : "black";
    };
    const locations = [
        // Austin/SA Metro
        {
            name: "Whole Foods Market - William Cannon",
            address: "4301 W. William Cannon, Bldg B, Ste 800, Austin, TX 78749",
            metro: "Austin/SA"
        },
        {
            name: "Whole Foods Market - Bee Cave",
            address: "12601 Hill Country Blvd, Bee Cave, TX 78738",
            metro: "Austin/SA"
        },
        {
            name: "Whole Foods Market - Cedar Park",
            address: "5001 183A Toll Road, Retail #16, Cedar Park, TX 78613",
            metro: "Austin/SA"
        },
        {
            name: "Whole Foods Market - Domain",
            address: "11920 Domain Drive, Austin, TX 78758",
            metro: "Austin/SA"
        },
        {
            name: "Whole Foods Market - East Austin",
            address: "901 E 5th Street ste 100 Austin, TX 78702",
            metro: "Austin/SA"
        },
        {
            name: "Whole Foods Market - Gateway",
            address: "9607 Research Blvd., #300, Austin, TX 78759",
            metro: "Austin/SA"
        },
        {
            name: "Whole Foods Market - Downtown Austin",
            address: "525 N Lamar Blvd., Austin, TX 78703",
            metro: "Austin/SA"
        },
        {
            name: "Whole Foods Market - Alamo Quarry",
            address: "255 E. Basse Rd, Ste 130, San Antonio, TX 78209",
            metro: "Austin/SA"
        },
        {
            name: "Whole Foods Market - Blanco",
            address: "18403 Blanco Rd, San Antonio, TX, 78258",
            metro: "Austin/SA"
        },

        // Dallas Metro
        {
            name: "Whole Foods Market - Addison",
            address: "5100 Belt Line Rd, Suite 1012, Addison, TX 75254",
            metro: "Dallas"
        },
        {
            name: "Whole Foods Market - Colleyville",
            address: "4801 Colleyville Blvd, Colleyville, TX 76034",
            metro: "Dallas"
        },
        {
            name: "Whole Foods Market - Richardson",
            address: "1411 E Renner Rd, Richardson, TX 75082",
            metro: "Dallas"
        },
        {
            name: "Whole Foods Market - Preston Forest",
            address: "11700 Preston Rd, Ste 714, Dallas, TX 75230",
            metro: "Dallas"
        },
        {
            name: "Whole Foods Market - Fort Worth",
            address: "3720 Vision Dr, Fort Worth, TX 76109",
            metro: "Dallas"
        },
        {
            name: "Whole Foods Market - Fairview",
            address: "105 Stacy Rd., Fairview, TX 75069",
            metro: "Dallas"
        },
        {
            name: "Whole Foods Market - Highland Village",
            address: "4041 Waller Creek, Highland Village, TX 75077",
            metro: "Dallas"
        },
        {
            name: "Whole Foods Market - Park Cities",
            address: "4100 Lomo Alto Dr, Dallas, TX 75219",
            metro: "Dallas"
        },
        {
            name: "Whole Foods Market - Irving",
            address: "6741 N MacArthur, Irving, TX 75039",
            metro: "Dallas"
        },
        {
            name: "Whole Foods Market - Lakewood",
            address: "2118 Abrams Road, Dallas, TX 75214",
            metro: "Dallas"
        },
        {
            name: "Whole Foods Market - Park Lane",
            address: "8190 Park Lane, Suite 351, Dallas, TX 75231",
            metro: "Dallas"
        },
        {
            name: "Whole Foods Market - Arlington",
            address: "801 East Lamar Blvd., Arlington, TX 76011",
            metro: "Dallas"
        },
        {
            name: "Whole Foods Market - Plano",
            address: "2201 Preston Rd, Suite C, Plano, TX 75093",
            metro: "Dallas"
        },
        {
            name: "Whole Foods Market - Uptown Dallas",
            address: "2510 McKinney Ave, Dallas TX 75201",
            metro: "Dallas"
        },

        // Arkansas Metro
        {
            name: "Whole Foods Market - Little Rock",
            address: "501 S. Bowman Road, Little Rock, AR, 72211",
            metro: "Arkansas"
        },
        {
            name: "Whole Foods Market - Fayetteville",
            address: "3425 N. College Ave, Fayetteville, AR 72703",
            metro: "Arkansas"
        },

        // Oklahoma Metro
        {
            name: "Whole Foods Market - Oklahoma City",
            address: "6001 N. Western Ave., Oklahoma City, OK 73118",
            metro: "Oklahoma"
        },
        {
            name: "Whole Foods Market - Tulsa",
            address: "1401 E. 41st St., Tulsa, OK 74105",
            metro: "Oklahoma"
        },
        {
            name: "Whole Foods Market - Yale",
            address: "9136 South Yale, Tulsa, OK 74137",
            metro: "Oklahoma"
        },

        // Houston Metro
        {
            name: "Whole Foods Market - Bellaire",
            address: "4004 Bellaire Blvd, Houston, TX 77025",
            metro: "Houston"
        },
        {
            name: "Whole Foods Market - Champions",
            address: "10133 Louetta Road, Houston, TX 77070",
            metro: "Houston"
        },
        {
            name: "Whole Foods Market - North Loop",
            address: "101 N Loop W, Houston, TX 77018",
            metro: "Houston"
        },
        {
            name: "Whole Foods Market - Upper Kirby",
            address: "2955 Kirby Dr, Houston, TX 77098",
            metro: "Houston"
        },
        {
            name: "Whole Foods Market - Katy",
            address: "6601 S Fry Rd, Katy, TX 77494",
            metro: "Houston"
        },
        {
            name: "Whole Foods Market - Midtown Houston",
            address: "515 Elgin St, Houston, TX 77006",
            metro: "Houston"
        },
        {
            name: "Whole Foods Market - Montrose",
            address: "701 Waugh Drive, Houston, TX 77019",
            metro: "Houston"
        },
        {
            name: "Whole Foods Market - Post Oak",
            address: "1700 Post Oak Blvd, Suite 1G101, Houston, TX 77056",
            metro: "Houston"
        },
        {
            name: "Whole Foods Market - Sugar Land",
            address: "15900 Southwest Freeway, Sugar Land, TX 77479",
            metro: "Houston"
        },
        {
            name: "Whole Foods Market - Voss",
            address: "1407 S Voss Rd, Houston, TX 77057",
            metro: "Houston"
        },
        {
            name: "Whole Foods Market - Woodlands",
            address: "1925 Hughes Landing, Suite 100, Woodlands, TX 77380",
            metro: "Houston"
        },
        {
            name: "Whole Foods Market - Westchase",
            address: "11041 Westheimer Rd, Houston, TX 77042",
            metro: "Houston"
        },

        // Louisiana Metro
        {
            name: "Whole Foods Market - Magazine St",
            address: "5600 Magazine St, New Orleans, LA 70115",
            metro: "Louisiana"
        },
        {
            name: "Whole Foods Market - Lafayette",
            address: "4247 Ambassador Caffery Parkway, Lafayette, LA 70508",
            metro: "Louisiana"
        },
        {
            name: "Whole Foods Market - Broad St",
            address: "300 N. Broad St., Suite 103, New Orleans, LA 70119",
            metro: "Louisiana"
        },
        {
            name: "Whole Foods Market - Baton Rouge",
            address: "7529 Corporate Blvd, Baton Rouge, LA 70809",
            metro: "Louisiana"
        },
        {
            name: "Whole Foods Market - Mandeville",
            address: "3450 Highway 190, Mandeville, LA 70471",
            metro: "Louisiana"
        },
        {
            name: "Whole Foods Market - Metairie",
            address: "3420 Veterans Memorial Blvd, Metairie, LA 70002",
            metro: "Louisiana"
        },
        {
            name: "Whole Foods Market - Shreveport",
            address: "1380 E. 70th St, Shreveport, LA 71105",
            metro: "Louisiana"
        }
    ];

    const metros = ["All", "Dallas", "Austin/SA", "Arkansas", "Oklahoma", "Houston", "Louisiana"];

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
                    { method: "POST" }
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
                <h1 className="text-2xl font-bold mb-4">Whole Foods Market: Busy Times</h1>

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
                <p>Please select a location to view busy times.</p>
            ) : loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
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
                </div>
            )}

            {analysis.length > 0 && (
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
            )}
        </div>
    );
};

export default BusyTimes;