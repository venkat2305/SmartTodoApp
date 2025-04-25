import './App.css'
import TaskForm from './components/TaskForm'
import TaskFilter from './components/TaskFilter'
import TaskList from './components/TaskList'
import SearchBar from './components/SearchBar'
import Notification from './components/Notification'
import TaskStats from './components/TaskStats'
import { TaskProvider } from './context/TaskContext'
import { useTaskContext } from './context/TaskContextCore'

// AppContent component uses the context
const AppContent = () => {
  const { 
    filteredTasks, 
    isLoading, 
    notification,
    activeTab,
    searchQuery,
    setActiveTab, 
    setSearchQuery,
    createTask,
    toggleTaskCompletion,
    deleteTask,
    changeTaskStatus,
    reorderTasks
  } = useTaskContext();

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-4 sm:p-6">
      <div className="container mx-auto max-w-4xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
            Smart Todo App
          </h1>
          <p className="text-gray-600">Manage your tasks with ease and efficiency</p>
        </header>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Notification */}
          {notification && (
            <div className="p-4 border-b">
              <Notification 
                message={notification.message} 
                type={notification.type} 
              />
            </div>
          )}
          
          <div className="p-4 sm:p-6">
            {/* New Task Form */}
            <TaskForm 
              onCreateTask={createTask} 
              isLoading={isLoading} 
            />
            
            {/* Task Filter Tabs */}
            <TaskFilter 
              activeTab={activeTab} 
              onChangeTab={setActiveTab} 
            />
            
            {/* Search Bar */}
            <SearchBar 
              value={searchQuery} 
              onChange={setSearchQuery} 
            />
            
            {/* Task List */}
            <TaskList 
              tasks={filteredTasks}
              isLoading={isLoading}
              searchQuery={searchQuery}
              activeTab={activeTab}
              onCompleteTask={toggleTaskCompletion}
              onDeleteTask={deleteTask}
              onStatusChange={changeTaskStatus}
              onReorderTasks={reorderTasks}
            />
            
            {/* Footer / Stats */}
            <TaskStats />
          </div>
        </div>
      </div>
    </div>
  )
}

// Main App component that provides the TaskContext
function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  )
}

export default App
