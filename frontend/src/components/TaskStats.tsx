import React from 'react';
import { useTaskContext } from '../context/TaskContext';

const TaskStats: React.FC = () => {
  const { tasks } = useTaskContext();
  
  const ongoingCount = tasks.filter(t => t.status === 'ongoing').length;
  const completedCount = tasks.filter(t => t.status === 'success').length;
  const failedCount = tasks.filter(t => t.status === 'failure').length;
  
  return (
    <div className="mt-8 pt-4 border-t text-sm text-gray-500">
      <div className="flex flex-col md:flex-row justify-between">
        <div>Total Tasks: {tasks.length}</div>
        <div className="flex flex-wrap gap-3 mt-2 md:mt-0">
          <span>Ongoing: {ongoingCount}</span>
          <span>Completed: {completedCount}</span>
          <span>Failed: {failedCount}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskStats;