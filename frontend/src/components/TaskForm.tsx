import { useState } from 'react';

interface TaskFormProps {
  onCreateTask: (title: string, description: string, deadline: string) => void;
  isLoading: boolean;
}

const TaskForm = ({ onCreateTask, isLoading }: TaskFormProps) => {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    deadline: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !newTask.deadline) return;
    
    onCreateTask(newTask.title, newTask.description, newTask.deadline);
    setNewTask({ title: '', description: '', deadline: '' });
  };

  return (
    <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-3">Create New Task</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Task title"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
          value={newTask.title}
          onChange={(e) => setNewTask({...newTask, title: e.target.value})}
          required
        />
        <textarea
          placeholder="Description (optional)"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
          rows={3}
          value={newTask.description}
          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
        ></textarea>
        <div>
          <label className="block mb-1 text-sm font-medium">Deadline</label>
          <input
            type="datetime-local"
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none transition"
            value={newTask.deadline}
            onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !newTask.title || !newTask.deadline}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Adding Task...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;