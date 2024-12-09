export const formatTime = (hour) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
};

export const parseSlotTime = (slotTime) => {
    if (!slotTime) return [null, null];

    // Split on hyphen and parse as integers
    const [start, end] = slotTime.split('-').map(time => parseInt(time, 10));
    return [start, end];
};
