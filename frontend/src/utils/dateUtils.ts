import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import calendar from 'dayjs/plugin/calendar';

// Initialize dayjs plugins
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(calendar);

// Update locale for more detailed relative time
dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'a few seconds',
    m: 'a minute',
    mm: '%d minutes',
    h: 'an hour',
    hh: '%d hours',
    d: 'a day',
    dd: '%d days',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years'
  }
});

/**
 * Format a date string in a human-readable format
 */
export const formatDate = (dateString: string): string => {
  return dayjs(dateString).format('MMM D, YYYY [at] h:mm A');
};

/**
 * Get relative time from now (e.g., "in 2 days" or "3 hours ago")
 */
export const getRelativeTimeFromNow = (dateString: string): string => {
  return dayjs(dateString).fromNow();
};

/**
 * Calculate time remaining until deadline
 * @returns Object containing days, hours, minutes and total seconds remaining
 */
export const getTimeRemaining = (deadline: string) => {
  const total = dayjs(deadline).valueOf() - dayjs().valueOf();
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  
  return {
    total,
    days,
    hours,
    minutes,
    seconds,
    isExpired: total <= 0
  };
};

/**
 * Return a formatted string showing countdown
 */
export const getCountdown = (deadline: string): string => {
  const remaining = getTimeRemaining(deadline);
  
  if (remaining.isExpired) {
    return 'Expired';
  }
  
  if (remaining.days > 0) {
    return `${remaining.days}d ${remaining.hours}h remaining`;
  }
  
  if (remaining.hours > 0) {
    return `${remaining.hours}h ${remaining.minutes}m remaining`;
  }
  
  return `${remaining.minutes}m ${remaining.seconds}s remaining`;
};

/**
 * Get an appropriate color class based on time remaining
 */
export const getDeadlineColorClass = (deadline: string): string => {
  const { total, days } = getTimeRemaining(deadline);
  
  if (total <= 0) {
    return 'text-red-600';
  }
  
  if (days === 0) {
    // Less than a day left
    const hours = total / (1000 * 60 * 60);
    if (hours < 3) {
      return 'text-red-600'; // Very urgent - red
    } else if (hours < 24) {
      return 'text-amber-600'; // Urgent - amber
    }
  } else if (days <= 2) {
    return 'text-amber-500'; // Soon - amber
  }
  
  return 'text-green-600'; // Plenty of time - green
};

export default {
  formatDate,
  getRelativeTimeFromNow,
  getTimeRemaining,
  getCountdown,
  getDeadlineColorClass
};