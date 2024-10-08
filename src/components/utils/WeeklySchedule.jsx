import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const daysOfWeek = ['L', 'MA', 'MI', 'J', 'V', 'S', 'D'];

const generateTimes = (showMinutes, sessions) => {
    const times = [];
    const addTimes = (start, end) => {
        for (let hour = start; hour < end; hour++) {
            times.push(`${hour % 12 || 12}:00 ${hour < 12 ? 'AM' : 'PM'}`);
            if (showMinutes) {
                times.push(`${hour % 12 || 12}:30 ${hour < 12 ? 'AM' : 'PM'}`);
            }
        }
    };

    if (sessions.morning) addTimes(5, 13); // 5 AM - 1 PM
    if (sessions.afternoon) addTimes(13, 21); // 1 PM - 9 PM
    if (sessions.night) addTimes(21, 24); // 9 PM - 12 AM
    if (sessions.night) addTimes(0, 5); // 12 AM - 5 AM

    return times;
};

const convertTimeToMinutes = (time) => {
    const [hour, minute] = time.split(':');
    const period = time.split(' ')[1];
    let totalMinutes = parseInt(hour) * 60 + parseInt(minute);
    if (period === 'PM' && hour !== '12') {
        totalMinutes += 12 * 60;
    }
    if (period === 'AM' && hour === '12') {
        totalMinutes -= 12 * 60;
    }
    return totalMinutes;
};

const isTimeInRange = (time, start, end) => {
    const timeMinutes = convertTimeToMinutes(time);
    const startMinutes = convertTimeToMinutes(start);
    const endMinutes = convertTimeToMinutes(end);
    return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
};

const WeeklySchedule = ({ showMinutes, sessions, onTimeSelect, selectedRanges }) => {
    const times = generateTimes(showMinutes, sessions);

    return (
        <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" gap={1}>
            {daysOfWeek.map((day, index) => (
                <Box key={day + index} border="1px solid #ccc" padding={1}>
                    <Typography variant="h6" align="center">{day}</Typography>
                    {times.map((time) => {
                        const isSelected = (selectedRanges[day] || []).some(([start, end]) =>
                            isTimeInRange(time, start, end)
                        );
                        return (
                            <Button
                                key={time}
                                variant="outlined"
                                onClick={() => onTimeSelect(day, time)}
                                fullWidth
                                sx={{
                                    mt: 0.5,
                                    fontSize: '0.75rem',
                                    padding: '4px',
                                    backgroundColor: isSelected ? '#c8e6c9' : 'inherit',
                                }}
                            >
                                {time}
                            </Button>
                        );
                    })}
                </Box>
            ))}
        </Box>
    );
};

export default WeeklySchedule;