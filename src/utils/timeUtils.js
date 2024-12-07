export const formatTime = (hour) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
};

export const parseSlotTime = (slotTime) => {
    if (!slotTime) return [null, null];

    return slotTime.split('-').map(time => {
        const hour = parseInt(time.replace(/[APM]/g, ''));
        return time.includes('PM') && hour !== 12 ? hour + 12 : hour;
    });
};
