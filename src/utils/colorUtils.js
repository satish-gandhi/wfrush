export const getIntensityColor = (intensity_nr) => {
    switch (intensity_nr) {
        case -2: return "#B2D8CE"; // Very Light Green
        case -1: return "#66B5A1"; // Light Green
        case 0: return "#00674B";  // Main Green
        case 1: return "#004D38";  // Dark Green
        case 2: return "#003325";  // Very Dark Green
        default: return "#F3F4F6"; // Gray
    }
};

export const getTextColor = (intensity_nr) => {
    return intensity_nr >= 0 ? "white" : "black";
};
