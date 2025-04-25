import { Task } from '../services/api';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  searchQuery: string;
  activeTab: 'ongoing' | 'success' | 'failure';
  onCompleteTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const TaskList = ({ 
  tasks, 
  isLoading,
  searchQuery, 
  activeTab,
  onCompleteTask, 
  onDeleteTask 
}: TaskListProps) => {

  // If loading and no tasks, show loading spinner
  if (isLoading && tasks.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        <svg className="animate-spin h-8 w-8 mx-auto mb-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading tasks...
      </div>
    );
  }
  
  // If no tasks after filtering, show message
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
        {searchQuery ? (
          <p className="text-lg font-medium mb-2">No matching tasks found</p>
        ) : (
          <>
            <p className="text-lg font-medium mb-2">No {activeTab} tasks found</p>
            {activeTab === 'ongoing' && (
              <p className="text-sm">Create a new task to get started!</p>
            )}
          </>
        )}
      </div>
    );
  }
  
  // Display tasks
  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <TaskItem 
          key={task.id}
          task={task} 
          onComplete={onCompleteTask} 
          onDelete={onDeleteTask} 
          disabled={isLoading} 
        />
      ))}
    </div>
  );
};

export default TaskList;