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

    // Initialize arrays to store busiest times
    let weekendBusiest = [];
    let weekdayBusiest = [];

    analysisData.forEach(day => {
        const dayName = day.day_info.day_text;

        // Get traffic data for each hour within store hours
        console.log(`\nAnalyzing ${dayName}:`);
        console.log('Traffic data by hour:');

        for (let hour = slotStart; hour < slotEnd; hour++) {
            const trafficLevel = day.day_raw[hour];
            console.log(`  ${hour}:00-${hour + 1}:00 - Traffic Level: ${trafficLevel}`);

            // Only process hours with valid traffic data
            if (typeof trafficLevel === 'number') {
                const timeSlot = {
                    day: dayName,
                    startHour: hour,
                    endHour: hour + 1,
                    footTraffic: trafficLevel
                };

                // Only Saturday and Sunday are weekends
                const isWeekend = dayName === 'Saturday' || dayName === 'Sunday';

                if (isWeekend) {
                    weekendBusiest.push(timeSlot);
                    console.log(`  Added to weekend slots`);
                } else {
                    weekdayBusiest.push(timeSlot);
                    console.log(`  Added to weekday slots`);
                }
            }
        }
    });

    console.log('\nSorted Results:');

    // Sort slots by traffic level and log results
    weekendBusiest.sort((a, b) => b.footTraffic - a.footTraffic);
    weekdayBusiest.sort((a, b) => b.footTraffic - a.footTraffic);

    console.log('Weekend Slots:', weekendBusiest.length);
    weekendBusiest.forEach((slot, index) => {
        console.log(`${index + 1}. ${slot.day} ${slot.startHour}:00-${slot.endHour}:00 (Traffic Level: ${slot.footTraffic})`);
    });

    console.log('\nWeekday Slots:', weekdayBusiest.length);
    weekdayBusiest.forEach((slot, index) => {
        console.log(`${index + 1}. ${slot.day} ${slot.startHour}:00-${slot.endHour}:00 (Traffic Level: ${slot.footTraffic})`);
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
