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
        const isWeekend = dayName === 'Saturday' || dayName === 'Sunday';
        const isFriday = dayName === 'Friday';

        day.hour_analysis.forEach(hour => {
            const hourNum = hour.hour;

            // Strictly enforce slot time range
            if (hourNum >= slotStart && hourNum < slotEnd) {
                const intensity = hour.intensity_nr;

                if (isWeekend) {
                    if (intensity > weekendBusiest.intensity) {
                        weekendBusiest = { day: dayName, hour: hourNum, intensity };
                    }
                } else if (!isFriday) {
                    if (intensity > weekdayBusiest.intensity) {
                        weekdayBusiest = { day: dayName, hour: hourNum, intensity };
                    }
                }
            }
        });

        // Handle Friday separately - only consider hours within slot time
        if (isFriday) {
            day.hour_analysis.forEach(hour => {
                const hourNum = hour.hour;
                if (hourNum >= slotStart && hourNum < slotEnd) {
                    const intensity = hour.intensity_nr;
                    if (intensity > weekendBusiest.intensity) {
                        weekendBusiest = { day: 'Friday', hour: hourNum, intensity };
                    }
                }
            });
        }
    });

    // Only return results if they're within slot time
    return {
        weekend: weekendBusiest.day && weekendBusiest.hour >= slotStart && weekendBusiest.hour < slotEnd ? weekendBusiest : null,
        weekday: weekdayBusiest.day && weekdayBusiest.hour >= slotStart && weekdayBusiest.hour < slotEnd ? weekdayBusiest : null
    };
};
