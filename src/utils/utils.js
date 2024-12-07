export const getIntensityColor = (intensity_nr) => {
    switch (intensity_nr) {
        case -2: return "#DBEAFE";
        case -1: return "#93C5FD";
        case 0: return "#60A5FA";
        case 1: return "#3B82F6";
        case 2: return "#2563EB";
        default: return "#F3F4F6";
    }
};

export const getTextColor = (intensity_nr) => {
    return intensity_nr > 0 ? "white" : "black";
};

export const formatHourRange = (range) => {
    if (!range || range === "CLOSED") return range;
    return range;
};

export const getBestDemoSlots = (analysis, demoHours) => {
    if (!analysis || !demoHours) return null;

    const weekendSlots = {
        day: "Saturday",
        time: demoHours.saturday,
        traffic: "High traffic expected between 2PM-4PM"
    };

    const weekdaySlots = {
        day: "Wednesday",
        time: demoHours.wednesday,
        traffic: "Peak traffic during demo hours"
    };

    return { weekendSlots, weekdaySlots };
};