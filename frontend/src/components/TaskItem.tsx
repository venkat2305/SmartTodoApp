import { Task } from '../services/api';

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  disabled: boolean;
}

const TaskItem = ({ task, onComplete, onDelete, disabled }: TaskItemProps) => {
  // Format deadline relative to now
  const formatDeadline = (deadline: string): string => {
    const now = new Date();
    const taskDeadline = new Date(deadline);
    const diffTime = taskDeadline.getTime() - now.getTime();
    
    if (diffTime < 0) {
      return 'Expired';
    }
    
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h`;
    } else if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    } else {
      return `${diffMinutes}m`;
    }
  };

  // Get urgency class for task (for visual feedback)
  const getUrgencyClass = (deadline: string): string => {
    const now = new Date();
    const taskDeadline = new Date(deadline);
    const diffHours = (taskDeadline.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffHours < 0) return 'opacity-60'; // Already expired
    if (diffHours < 3) return 'border-l-4 border-red-500'; // Very urgent (< 3 hours)
    if (diffHours < 24) return 'border-l-4 border-amber-500'; // Urgent (< 24 hours)
    return '';
  };

  return (
    <div 
      className={`border p-4 rounded-lg shadow-sm transition transform hover:scale-[1.01] ${getUrgencyClass(task.deadline)}`}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-bold text-lg">{task.title}</h3>
          {task.description && (
            <p className="text-gray-600 whitespace-pre-line">{task.description}</p>
          )}
          
          <div className="mt-2 flex items-center text-sm">
            {task.status === 'ongoing' ? (
              <div className="flex items-center">
                <span className="mr-1">⏱️</span>
                <span className="text-blue-600 font-medium">
                  Due in: {formatDeadline(task.deadline)}
                </span>
              </div>
            ) : task.status === 'success' ? (
              <div className="flex items-center text-green-600">
                <span className="mr-1">✅</span>
                <span className="font-medium">Completed</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <span className="mr-1">❌</span>
                <span className="font-medium">Expired</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-2">
          {task.status === 'ongoing' && (
            <button
              onClick={() => onComplete(task.id)}
              disabled={disabled}
              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm disabled:opacity-50"
            >
              Complete
            </button>
          )}
          <button
            onClick={() => onDelete(task.id)}
            disabled={disabled}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
      
      {/* Show deadline date in readable format */}
      <div className="mt-3 text-xs text-gray-500">
        Deadline: {new Date(task.deadline).toLocaleString()}
      </div>
    </div>
  );
};

export default TaskItem;