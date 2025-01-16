import { slotData } from '../constants/data';
import { parseSlotTime } from './timeUtils';

export const analyzeBusiestTimes = (analysisData, locationName) => {
    console.log('\n=== Analyzing Busiest Times for', locationName, '===');

    if (!analysisData || analysisData.length === 0) {
        console.log('No analysis data available');
        return { weekend: null, weekday: null };
    }

    const slotTime = slotData[locationName];
    if (!slotTime) {
        console.log('No slot time found for location');
        return { weekend: null, weekday: null };
    }

    const [slotStart, slotEnd] = parseSlotTime(slotTime);
    console.log('Store Hours:', `${slotStart}:00 to ${slotEnd}:00`);

    // Initialize arrays to store top 3 busiest times
    let weekendBusiest = [];
    let weekdayBusiest = [];

    // Helper function to insert a time slot while maintaining top 3 sorted by intensity
    const insertTimeSlot = (arr, newSlot) => {
        arr.push(newSlot);
        arr.sort((a, b) => b.intensity - a.intensity);
        if (arr.length > 3) arr.pop();
    };

    analysisData.forEach(day => {
        const dayName = day.day_info.day_text;
        const isFriday = dayName === 'Friday';

        // Get the hour analysis within slot time and with valid intensity data
        const validHours = day.hour_analysis.filter(hour => {
            const isWithinSlot = hour.hour >= slotStart && hour.hour < slotEnd;
            const hasValidData = hour.intensity_nr !== undefined &&
                hour.intensity_nr !== null &&
                hour.intensity_txt &&
                hour.intensity_txt !== 'Closed';

            if (isWithinSlot && !hasValidData) {
                console.log(`  Skipping ${hour.hour}:00 - No valid intensity data available`);
            }

            return isWithinSlot && hasValidData;
        });

        console.log(`\nAnalyzing ${dayName}:`);
        console.log('Valid hours with traffic data:');
        validHours.forEach(hour => {
            const intensity = hour.intensity_nr;
            const startHour = hour.hour;
            const endHour = startHour + 1;
            console.log(`  ${startHour}:00-${endHour}:00 - Intensity: ${intensity} (${hour.intensity_txt})`);

            const timeSlot = {
                day: dayName,
                startHour,
                endHour,
                intensity
            };

            // Consider Friday afternoons (after 12 PM) as weekend
            const isWeekend = dayName === 'Saturday' || dayName === 'Sunday' ||
                (isFriday && startHour >= 12);

            if (isWeekend) {
                insertTimeSlot(weekendBusiest, timeSlot);
                if (weekendBusiest.length <= 3) {
                    console.log(`  Added to weekend top 3! Current intensity rank: ${weekendBusiest.length}`);
                }
            } else {
                insertTimeSlot(weekdayBusiest, timeSlot);
                if (weekdayBusiest.length <= 3) {
                    console.log(`  Added to weekday top 3! Current intensity rank: ${weekdayBusiest.length}`);
                }
            }
        });

        if (validHours.length === 0) {
            console.log('  No valid hours with traffic data found for this day');
        }
    });

    console.log('\nFinal Results:');

    console.log('Weekend Top 3:');
    weekendBusiest.forEach((slot, index) => {
        console.log(`${index + 1}. ${slot.day} ${slot.startHour}:00-${slot.endHour}:00 (Intensity: ${slot.intensity})`);
    });

    console.log('\nWeekday Top 3:');
    weekdayBusiest.forEach((slot, index) => {
        console.log(`${index + 1}. ${slot.day} ${slot.startHour}:00-${slot.endHour}:00 (Intensity: ${slot.intensity})`);
    });

    // Filter out any times outside slot time range
    weekendBusiest = weekendBusiest.filter(slot =>
        slot.startHour >= slotStart && slot.endHour <= slotEnd
    );
    weekdayBusiest = weekdayBusiest.filter(slot =>
        slot.startHour >= slotStart && slot.endHour <= slotEnd
    );

    return {
        weekend: weekendBusiest.length > 0 ? weekendBusiest : null,
        weekday: weekdayBusiest.length > 0 ? weekdayBusiest : null
    };
};
