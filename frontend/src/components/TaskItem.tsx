import { Task } from '../services/api';
import { formatDate } from '../utils/dateUtils';
import CountdownTimer from './CountdownTimer';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, status: 'ongoing' | 'success' | 'failure') => void;
  disabled: boolean;
}

const TaskItem = ({ task, onComplete, onDelete, onStatusChange, disabled }: TaskItemProps) => {
  // Setup drag and drop functionality
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };
  
  // Handle status change when clicked
  const handleStatusClick = (newStatus: 'ongoing' | 'success' | 'failure') => {
    if (onStatusChange && !disabled) {
      onStatusChange(task.id, newStatus);
    }
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`border p-4 rounded-lg shadow-sm transition bg-white 
        ${isDragging ? 'shadow-lg ring-2 ring-blue-300' : 'hover:shadow-md'}
        ${task.status === 'success' ? 'border-l-4 border-green-500' : 
          task.status === 'failure' ? 'border-l-4 border-red-500' : ''}`}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-grow">
          <div className="flex items-center">
            <div 
              className={`w-4 h-4 rounded-full mr-2 cursor-pointer
                ${task.status === 'success' ? 'bg-green-500' : 
                  task.status === 'failure' ? 'bg-red-500' : 'bg-blue-500'}`}
              onClick={() => {
                const nextStatus = 
                  task.status === 'ongoing' ? 'success' : 
                  task.status === 'success' ? 'failure' : 'ongoing';
                handleStatusClick(nextStatus);
              }}
              title="Click to change status"
            />
            <h3 className={`font-bold text-lg ${task.status === 'success' ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </h3>
          </div>
          
          {task.description && (
            <p className={`text-gray-600 whitespace-pre-line ${task.status === 'success' ? 'text-gray-400' : ''}`}>
              {task.description}
            </p>
          )}
          
          <div className="mt-2 flex items-center text-sm">
            {task.status === 'ongoing' ? (
              <CountdownTimer deadline={task.deadline} />
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
          <div className="cursor-grab text-gray-400 hover:text-gray-600 p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </div>
          {task.status === 'ongoing' && (
            <button
              onClick={() => onComplete(task.id)}
              disabled={disabled}
              className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition text-sm disabled:opacity-50 shadow-sm"
              aria-label="Complete task"
            >
              Complete
            </button>
          )}
          <button
            onClick={() => onDelete(task.id)}
            disabled={disabled}
            className="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition disabled:opacity-50"
            aria-label="Delete task"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Show deadline date in readable format */}
      <div className="mt-3 text-xs text-gray-500">
        Deadline: {formatDate(task.deadline)}
      </div>
    </div>
  );
};

export default TaskItem;