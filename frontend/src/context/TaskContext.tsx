import React, { useState, useEffect, ReactNode } from 'react';
import api, { Task } from '../services/api';
import { TaskContext } from './TaskContextCore';
import type { TaskStatus, NotificationType } from './TaskContextCore';

// Provider component
export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<TaskStatus>('ongoing');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<NotificationType>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter tasks based on active tab and search query
  const filteredTasks = tasks.filter(task => {
    const matchesTab = task.status === activeTab;
    const matchesSearch = searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesTab && matchesSearch;
  });

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Function to update task status based on deadlines
  const updateTaskStatuses = () => {
    const now = new Date();
    const updatedTasks = tasks.map(task => {
      // Only update ongoing tasks
      if (task.status === 'ongoing') {
        const deadline = new Date(task.deadline);
        if (deadline < now) {
          return { ...task, status: 'failure' as const };
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
  const createTask = async (title: string, description: string, deadline: string) => {
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
  const completeTask = async (taskId: string) => {
    setIsLoading(true);
    
    try {
      const completedTask = await api.completeTask(taskId);
      
      if (completedTask) {
        const updatedTasks = tasks.map(task => 
          task.id === taskId ? { ...task, status: 'success' as const, updatedAt: new Date().toISOString() } : task
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
  
  // Mark task as incomplete (ongoing)
  const markTaskIncomplete = async (taskId: string) => {
    setIsLoading(true);
    
    try {
      // Check if the deadline has passed
      const task = tasks.find(t => t.id === taskId);
      if (task && new Date(task.deadline) < new Date()) {
        showNotification('Cannot mark as incomplete because deadline has passed', 'error');
        setIsLoading(false);
        return;
      }
      
      const updatedTask = await api.markTaskIncomplete(taskId);
      
      if (updatedTask) {
        const updatedTasks = tasks.map(task => 
          task.id === taskId ? { ...task, status: 'ongoing' as const, updatedAt: new Date().toISOString() } : task
        );
        setTasks(updatedTasks);
        showNotification('Task marked as incomplete', 'success');
      } else {
        throw new Error('Failed to mark task as incomplete');
      }
    } catch (error) {
      console.error('Error marking task as incomplete:', error);
      showNotification('Failed to mark task as incomplete', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle task completion status
  const toggleTaskCompletion = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    if (task.status === 'success') {
      await markTaskIncomplete(taskId);
    } else if (task.status === 'ongoing') {
      await completeTask(taskId);
    }
    // Do nothing if status is 'failure' as it can't be toggled directly
  };

  // Delete task
  const deleteTask = async (taskId: string) => {
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

  // Change task status
  const changeTaskStatus = async (taskId: string, status: TaskStatus) => {
    setIsLoading(true);
    
    try {
      // Check if trying to set to 'ongoing' when deadline has passed
      if (status === 'ongoing') {
        const task = tasks.find(t => t.id === taskId);
        if (task && new Date(task.deadline) < new Date()) {
          showNotification('Cannot mark as ongoing because deadline has passed', 'error');
          setIsLoading(false);
          return;
        }
      }
      
      // Optimistically update the UI
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, status: status as TaskStatus, updatedAt: new Date().toISOString() } : task
      );
      setTasks(updatedTasks);
      
      // Update in the backend
      const updatedTask = await api.updateTask(taskId, { status });
      
      if (updatedTask) {
        showNotification(`Task status changed to ${status}`, 'success');
      } else {
        // If update fails, revert the UI
        setTasks(tasks);
        throw new Error('Failed to update task status');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      showNotification('Failed to update task status', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Reorder tasks
  const reorderTasks = (reorderedTasks: Task[]) => {
    setTasks(reorderedTasks);
    // Note: In a real app, you might want to persist this order to the backend
    // api.updateTaskOrder(reorderedTasks.map(task => task.id));
  };

  // Effect to load tasks on mount
  useEffect(() => {
    fetchTasks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Effect to update task statuses every minute
  useEffect(() => {
    updateTaskStatuses(); // Run once immediately
    
    const interval = setInterval(() => {
      updateTaskStatuses();
    }, 60000);
    
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  // Provide context value
  const value = {
    tasks,
    filteredTasks,
    isLoading,
    notification,
    activeTab,
    searchQuery,
    setActiveTab,
    setSearchQuery,
    createTask,
    completeTask,
    markTaskIncomplete,
    toggleTaskCompletion,
    deleteTask,
    showNotification,
    changeTaskStatus,
    reorderTasks
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};