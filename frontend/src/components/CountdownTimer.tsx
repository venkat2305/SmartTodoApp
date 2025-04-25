import React, { useState, useEffect } from 'react';
import { getCountdown, getDeadlineColorClass } from '../utils/dateUtils';

interface CountdownTimerProps {
  deadline: string;
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ deadline, className = '' }) => {
  const [countdown, setCountdown] = useState(getCountdown(deadline));
  const [colorClass, setColorClass] = useState(getDeadlineColorClass(deadline));
  
  useEffect(() => {
    // Update the countdown every second
    const intervalId = setInterval(() => {
      setCountdown(getCountdown(deadline));
      setColorClass(getDeadlineColorClass(deadline));
    }, 1000);
    
    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, [deadline]);
  
  return (
    <div className={`font-medium text-sm ${colorClass} ${className}`}>
      {countdown}
    </div>
  );
};

export default CountdownTimer;