import React from 'react';

interface TaskFilterProps {
  activeTab: 'ongoing' | 'success' | 'failure';
  onChangeTab: (tab: 'ongoing' | 'success' | 'failure') => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ activeTab, onChangeTab }) => {
  return (
    <div className="mb-6">
      <div className="bg-white px-1 pt-1 border rounded-lg shadow-sm">
        <nav className="flex flex-wrap -mb-px">
          <button
            onClick={() => onChangeTab('ongoing')}
            className={`relative inline-flex items-center px-4 py-3 border-b-2 rounded-t-lg 
              ${activeTab === 'ongoing' 
                ? 'border-blue-600 text-blue-600 font-medium' 
                : 'border-transparent hover:text-gray-600 hover:border-gray-300'} 
              text-sm w-full sm:w-auto justify-center sm:justify-start`}
          >
            <span className="mr-2">⏱️</span>
            Ongoing
          </button>
          <button
            onClick={() => onChangeTab('success')}
            className={`relative inline-flex items-center px-4 py-3 border-b-2 rounded-t-lg 
              ${activeTab === 'success' 
                ? 'border-green-600 text-green-600 font-medium' 
                : 'border-transparent hover:text-gray-600 hover:border-gray-300'} 
              text-sm w-full sm:w-auto justify-center sm:justify-start`}
          >
            <span className="mr-2">✅</span>
            Completed
          </button>
          <button
            onClick={() => onChangeTab('failure')}
            className={`relative inline-flex items-center px-4 py-3 border-b-2 rounded-t-lg 
              ${activeTab === 'failure' 
                ? 'border-red-600 text-red-600 font-medium' 
                : 'border-transparent hover:text-gray-600 hover:border-gray-300'} 
              text-sm w-full sm:w-auto justify-center sm:justify-start`}
          >
            <span className="mr-2">❌</span>
            Failed
          </button>
        </nav>
      </div>
    </div>
  );
};

export default TaskFilter;