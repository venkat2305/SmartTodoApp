type TaskStatus = 'ongoing' | 'success' | 'failure';

interface TaskFilterProps {
  activeTab: TaskStatus;
  onChangeTab: (tab: TaskStatus) => void;
}

const TaskFilter = ({ activeTab, onChangeTab }: TaskFilterProps) => {
  return (
    <div className="flex mb-4 border-b">
      <button
        className={`px-4 py-2 ${activeTab === 'ongoing' ? 'font-bold text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-500'}`}
        onClick={() => onChangeTab('ongoing')}
      >
        Ongoing
      </button>
      <button
        className={`px-4 py-2 ${activeTab === 'success' ? 'font-bold text-green-600 border-b-2 border-green-600' : 'text-gray-600 hover:text-green-500'}`}
        onClick={() => onChangeTab('success')}
      >
        Completed
      </button>
      <button
        className={`px-4 py-2 ${activeTab === 'failure' ? 'font-bold text-red-600 border-b-2 border-red-600' : 'text-gray-600 hover:text-red-500'}`}
        onClick={() => onChangeTab('failure')}
      >
        Failed
      </button>
    </div>
  );
};

export default TaskFilter;