import { useState } from 'react';
import { getRelativeTimeFromNow } from '../utils/dateUtils';

interface TaskFormProps {
  onCreateTask: (title: string, description: string, deadline: string) => void;
  isLoading: boolean;
}

const TaskForm = ({ onCreateTask, isLoading }: TaskFormProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: '',
  });

  // Set minimum date to current date and time for deadline picker
  const getMinDate = () => {
    const now = new Date();
    // Format: YYYY-MM-DDThh:mm
    return now.toISOString().slice(0, 16);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !newTask.deadline) return;
    
    onCreateTask(newTask.title, newTask.description, newTask.deadline);
    setNewTask({ title: '', description: '', deadline: '' });
    setIsExpanded(false);
  };

  // Set initial deadline value when form is expanded
  const handleExpandForm = () => {
    // Set default deadline to end of current day (23:59)
    const now = new Date();
    const defaultDeadline = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      23,
      59,
      0
    );
    
    // Format the date in local timezone for the input
    const year = defaultDeadline.getFullYear();
    const month = String(defaultDeadline.getMonth() + 1).padStart(2, '0');
    const day = String(defaultDeadline.getDate()).padStart(2, '0');
    const hours = String(defaultDeadline.getHours()).padStart(2, '0');
    const minutes = String(defaultDeadline.getMinutes()).padStart(2, '0');
    
    const formattedDeadline = `${year}-${month}-${day}T${hours}:${minutes}`;
    
    setNewTask({
      ...newTask,
      deadline: formattedDeadline
    });
    
    setIsExpanded(true);
  };

  return (
    <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300">
      <div className={`bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white ${isExpanded ? 'pb-4' : 'rounded-lg'}`}>
        <h2 className="text-xl font-bold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create New Task
        </h2>
      </div>
      
      <form onSubmit={handleSubmit} className={`space-y-4 transition-all duration-300 px-4 ${isExpanded ? 'pb-4 pt-2' : 'h-0 overflow-hidden opacity-0'}`}>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            id="title"
            type="text"
            placeholder="What needs to be done?"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
            value={newTask.title}
            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
          <textarea
            id="description"
            placeholder="Add any details about this task..."
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
            rows={3}
            value={newTask.description}
            onChange={(e) => setNewTask({...newTask, description: e.target.value})}
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
          <input
            id="deadline"
            type="datetime-local"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
            value={newTask.deadline}
            onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
            min={getMinDate()}
            required
          />
          {newTask.deadline && (
            <p className="mt-1 text-sm text-gray-500">
              Due {getRelativeTimeFromNow(newTask.deadline)}
            </p>
          )}
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || !newTask.title || !newTask.deadline}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Adding...' : 'Add Task'}
          </button>
        </div>
      </form>
      
      {!isExpanded && (
        <button
          onClick={handleExpandForm}
          className="w-full py-3 text-blue-600 hover:bg-blue-50 transition flex items-center justify-center font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add a new task
        </button>
      )}
    </div>
  );
};

export default TaskForm;