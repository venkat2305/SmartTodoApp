const LOCAL_API_URL = 'http://localhost:8000/api';
const PRODUCTION_API_URL = 'https://smarttodoapp.onrender.com/api';
const API_BASE_URL = LOCAL_API_URL;

// API response interfaces
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// Backend task interface (matches exact API response)
interface BackendTask {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'ongoing' | 'success' | 'failure';
  created_at: string;
  updated_at: string;
}

// Frontend task interface (what we use in our app)
export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'ongoing' | 'success' | 'failure';
  createdAt: string;
  updatedAt: string;
}

// Convert backend task format to frontend task format
const convertTask = (backendTask: BackendTask): Task => ({
  id: backendTask.id,
  title: backendTask.title,
  description: backendTask.description,
  deadline: backendTask.deadline,
  status: backendTask.status,
  createdAt: backendTask.created_at,
  updatedAt: backendTask.updated_at
});

// Convert frontend task format to backend task format
const convertToBackendTask = (task: Partial<Task>): Partial<BackendTask> => {
  const backendTask: Partial<BackendTask> = {};
  
  if (task.title !== undefined) backendTask.title = task.title;
  if (task.description !== undefined) backendTask.description = task.description;
  if (task.deadline !== undefined) backendTask.deadline = task.deadline;
  if (task.status !== undefined) backendTask.status = task.status;
  
  return backendTask;
};

// API service functions
export const api = {
  // Fetch all tasks
  async getTasks(): Promise<Task[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/`);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      
      const data: PaginatedResponse<BackendTask> = await response.json();
      return data.results.map(convertTask);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  },

  // Create a new task
  async createTask(task: Omit<Task, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<Task | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...task, status: 'ongoing' }),
      });
      
      if (!response.ok) throw new Error('Failed to create task');
      
      const backendTask: BackendTask = await response.json();
      return convertTask(backendTask);
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  },

  // Update a task
  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    try {
      const backendUpdates = convertToBackendTask(updates);
      const response = await fetch(`${API_BASE_URL}/tasks/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendUpdates),
      });
      
      if (!response.ok) throw new Error('Failed to update task');
      
      const backendTask: BackendTask = await response.json();
      return convertTask(backendTask);
    } catch (error) {
      console.error('Error updating task:', error);
      return null;
    }
  },

  // Delete a task
  async deleteTask(id: string): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}/`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete task');
      
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  },

  // Mark a task as complete
  async completeTask(id: string): Promise<Task | null> {
    return this.updateTask(id, { status: 'success' });
  }
};

export default api;