import { Task } from '../services/api';
import TaskItem from './TaskItem';
import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  searchQuery: string;
  activeTab: 'ongoing' | 'success' | 'failure';
  onCompleteTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onReorderTasks?: (tasks: Task[]) => void;
  onStatusChange?: (id: string, status: 'ongoing' | 'success' | 'failure') => void;
}

const TaskList = ({
  tasks,
  isLoading,
  searchQuery,
  activeTab,
  onCompleteTask,
  onDeleteTask,
  onReorderTasks,
  onStatusChange
}: TaskListProps) => {
  // Local state to handle tasks while dragging
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  // Update local tasks when props tasks change
  if (JSON.stringify(tasks) !== JSON.stringify(localTasks)) {
    setLocalTasks(tasks);
  }

  // Set up drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement before activation
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setLocalTasks((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        const reorderedTasks = arrayMove(items, oldIndex, newIndex);
        
        // Notify parent component about reordering if callback provided
        if (onReorderTasks) {
          onReorderTasks(reorderedTasks);
        }
        
        return reorderedTasks;
      });
    }
  };

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
  if (localTasks.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        {searchQuery ? (
          <>
            <p className="text-lg font-medium mb-2">No matching tasks found</p>
            <p className="text-sm text-gray-500">Try adjusting your search query</p>
          </>
        ) : (
          <>
            <p className="text-lg font-medium mb-2">No {activeTab} tasks found</p>
            {activeTab === 'ongoing' && (
              <p className="text-sm text-gray-500">Create a new task to get started!</p>
            )}
          </>
        )}
      </div>
    );
  }
  
  // Display tasks with drag and drop
  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext 
        items={localTasks.map(task => task.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {localTasks.map(task => (
            <TaskItem 
              key={task.id}
              task={task} 
              onComplete={onCompleteTask} 
              onDelete={onDeleteTask}
              onStatusChange={onStatusChange}
              disabled={isLoading} 
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default TaskList;