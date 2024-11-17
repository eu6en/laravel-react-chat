// Check if the provided date is today
export const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getUTCDate() === today.getUTCDate() &&
        date.getUTCMonth() === today.getUTCMonth() &&
        date.getUTCFullYear() === today.getUTCFullYear();
};

// Check if the provided date is yesterday
export const isYesterday = (date: Date): boolean => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.getUTCDate() === yesterday.getUTCDate() &&
        date.getUTCMonth() === yesterday.getUTCMonth() &&
        date.getUTCFullYear() === yesterday.getUTCFullYear();
};
