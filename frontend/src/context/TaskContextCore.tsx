import { createContext, useContext } from 'react';
import { Task } from '../services/api';

// Define types
export type TaskStatus = 'ongoing' | 'success' | 'failure';

export type NotificationType = {
  message: string;
  type: 'success' | 'error';
} | null;

export interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  isLoading: boolean;
  notification: NotificationType;
  activeTab: TaskStatus;
  searchQuery: string;
  setActiveTab: (tab: TaskStatus) => void;
  setSearchQuery: (query: string) => void;
  createTask: (title: string, description: string, deadline: string) => Promise<void>;
  completeTask: (taskId: string) => Promise<void>;
  markTaskIncomplete: (taskId: string) => Promise<void>;
  toggleTaskCompletion: (taskId: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  showNotification: (message: string, type: 'success' | 'error') => void;
  changeTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  reorderTasks: (reorderedTasks: Task[]) => void;
}

// Create context
export const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Custom hook for using the task context
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};