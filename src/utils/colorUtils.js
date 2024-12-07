export const getIntensityColor = (intensity_nr) => {
    switch (intensity_nr) {
        case -2: return "#DBEAFE"; // Very Light Blue
        case -1: return "#93C5FD"; // Light Blue
        case 0: return "#60A5FA";  // Medium Blue
        case 1: return "#3B82F6";  // Blue
        case 2: return "#2563EB";  // Dark Blue
        default: return "#F3F4F6"; // Gray
    }
};

export const getTextColor = (intensity_nr) => {
    return intensity_nr > 0 ? "white" : "black";
};
