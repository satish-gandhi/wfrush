import { slotData } from '../constants/data';
import { parseSlotTime } from './timeUtils';

export const analyzeBusiestTimes = (analysisData, locationName) => {
    if (!analysisData || analysisData.length === 0) return { weekend: null, weekday: null };

    const slotTime = slotData[locationName];
    if (!slotTime) return { weekend: null, weekday: null };

    const [slotStart, slotEnd] = parseSlotTime(slotTime);

    let weekendBusiest = { day: '', hour: 0, intensity: -Infinity };
    let weekdayBusiest = { day: '', hour: 0, intensity: -Infinity };

    analysisData.forEach(day => {
        const dayName = day.day_info.day_text;
        const isWeekend = dayName === 'Friday' || dayName === 'Saturday' || dayName === 'Sunday';

        day.hour_analysis.forEach(hour => {
            const hourNum = hour.hour;
            if (hourNum >= slotStart && hourNum < slotEnd) {
                if (isWeekend) {
                    if ((dayName === 'Friday' && hourNum >= 12) || dayName === 'Saturday' || dayName === 'Sunday') {
                        if (hour.intensity_nr > weekendBusiest.intensity) {
                            weekendBusiest = { day: dayName, hour: hourNum, intensity: hour.intensity_nr };
                        }
                    }
                } else if (dayName !== 'Friday') {
                    if (hour.intensity_nr > weekdayBusiest.intensity) {
                        weekdayBusiest = { day: dayName, hour: hourNum, intensity: hour.intensity_nr };
                    }
                }
            }
        });
    });

    return {
        weekend: weekendBusiest.day ? weekendBusiest : null,
        weekday: weekdayBusiest.day ? weekdayBusiest : null
    };
};
