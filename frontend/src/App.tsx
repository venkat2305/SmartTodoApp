import { useState, useEffect } from 'react'
import './App.css'
import api, { Task } from './services/api'
import TaskForm from './components/TaskForm'
import TaskFilter from './components/TaskFilter'
import TaskList from './components/TaskList'

function App() {
  // State for tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<'ongoing' | 'success' | 'failure'>('ongoing');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter tasks based on active tab and search query
  const filteredTasks = tasks.filter(task => {
    const matchesTab = task.status === activeTab;
    const matchesSearch = searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  // Function to update task status based on deadlines
  const updateTaskStatuses = () => {
    const now = new Date();
    const updatedTasks = tasks.map(task => {
      // Only update ongoing tasks
      if (task.status === 'ongoing') {
        const deadline = new Date(task.deadline);
        if (deadline < now) {
          return { ...task, status: 'failure' };
        }
      }
      return task;
    });
    
    // Only update if there were changes
    if (JSON.stringify(updatedTasks) !== JSON.stringify(tasks)) {
      setTasks(updatedTasks);
      
      // Update any failed tasks in the backend
      updatedTasks.forEach(task => {
        if (task.status === 'failure' && tasks.find(t => t.id === task.id)?.status === 'ongoing') {
          api.updateTask(task.id, { status: 'failure' });
        }
      });
    }
  };

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Fetch tasks from backend
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const fetchedTasks = await api.getTasks();
      console.log('Fetched tasks:', fetchedTasks);
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      showNotification('Failed to load tasks', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Create new task
  const handleCreateTask = async (title: string, description: string, deadline: string) => {
    setIsLoading(true);
    
    try {
      const taskData = {
        title,
        description,
        deadline: new Date(deadline).toISOString(),
      };
      
      const createdTask = await api.createTask(taskData);
      
      if (createdTask) {
        setTasks([...tasks, createdTask]);
        showNotification('Task created successfully', 'success');
      } else {
        throw new Error('Failed to create task');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      showNotification('Failed to create task', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Mark task as complete
  const handleCompleteTask = async (taskId: string) => {
    setIsLoading(true);
    
    try {
      const completedTask = await api.completeTask(taskId);
      
      if (completedTask) {
        const updatedTasks = tasks.map(task => 
          task.id === taskId ? { ...task, status: 'success', updatedAt: new Date().toISOString() } : task
        );
        setTasks(updatedTasks);
        showNotification('Task marked as complete', 'success');
      } else {
        throw new Error('Failed to complete task');
      }
    } catch (error) {
      console.error('Error completing task:', error);
      showNotification('Failed to mark task as complete', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId: string) => {
    setIsLoading(true);
    
    try {
      const isDeleted = await api.deleteTask(taskId);
      
      if (isDeleted) {
        setTasks(tasks.filter(task => task.id !== taskId));
        showNotification('Task deleted successfully', 'success');
      } else {
        throw new Error('Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      showNotification('Failed to delete task', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to load tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // Effect to update task statuses every minute
  useEffect(() => {
    updateTaskStatuses(); // Run once immediately
    
    const interval = setInterval(() => {
      updateTaskStatuses();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [tasks]);

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="container mx-auto max-w-3xl bg-white rounded-lg shadow p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Smart Todo App</h1>
        
        {/* Notification */}
        {notification && (
          <div className={`mb-4 p-3 rounded-lg ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {notification.message}
          </div>
        )}
        
        {/* New Task Form */}
        <TaskForm onCreateTask={handleCreateTask} isLoading={isLoading} />
        
        {/* Task Filter Tabs */}
        <TaskFilter activeTab={activeTab} onChangeTab={setActiveTab} />
        
        {/* Search Bar */}
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full px-3 py-2 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          {searchQuery && (
            <button 
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchQuery('')}
            >
              ✖
            </button>
          )}
        </div>
        
        {/* Task List */}
        <TaskList 
          tasks={filteredTasks}
          isLoading={isLoading}
          searchQuery={searchQuery}
          activeTab={activeTab}
          onCompleteTask={handleCompleteTask}
          onDeleteTask={handleDeleteTask}
        />
        
        {/* Footer / Stats */}
        <div className="mt-8 pt-4 border-t text-sm text-gray-500">
          <div className="flex flex-col md:flex-row justify-between">
            <div>Total Tasks: {tasks.length}</div>
            <div className="flex flex-wrap gap-3 mt-2 md:mt-0">
              <span>Ongoing: {tasks.filter(t => t.status === 'ongoing').length}</span>
              <span>Completed: {tasks.filter(t => t.status === 'success').length}</span>
              <span>Failed: {tasks.filter(t => t.status === 'failure').length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
