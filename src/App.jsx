import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import CreateTaskModal from './shared/modals/CreateTaskModal';
import RejectTaskModal from './shared/modals/RejectTaskModal';
import { useTaskManager } from './shared/hooks/useTaskManager';
import ParentView from './parent/pages/ParentView';
import ChildView from './child/pages/ChildView';
import './App.css';

// Temporary dev-only role switcher component
function DevRoleSwitcher({ role, setRole }) {
  return (
    <div className="role-switcher">
      <button 
        className={`role-btn ${role === 'parent' ? 'active' : ''}`}
        onClick={() => setRole("parent")}
      >
        👨 Родитель
      </button>
      <button 
        className={`role-btn ${role === 'child' ? 'active' : ''}`}
        onClick={() => setRole("child")}
      >
        👦 Ребёнок
      </button>
    </div>
  );
}

// Parent Layout wrapper
function ParentLayout({ tasks, balance, onAddTask, onEditTask, approveTask, rejectTask, deleteTask, getAvailableActions }) {
  return (
    <ParentView
      tasks={tasks}
      onAddTask={onAddTask}
      onEditTask={onEditTask}
      getActions={getAvailableActions}
      balance={balance}
      approveTask={approveTask}
      rejectTask={rejectTask}
      deleteTask={deleteTask}
    />
  );
}

// Child Layout wrapper
function ChildLayout({ tasks, balance, getActions }) {
  return (
    <ChildView
      tasks={tasks}
      getActions={getActions}
      balance={balance}
    />
  );
}

function App() {
  // Initial tasks data
  const initialTasks = [
    { id: 1, title: "Убрать в комнате", description: "", reward: 50, status: "new", comment: null, icon: "cleaning" },
    { id: 2, title: "Помыть посуду", description: "", reward: 30, status: "pending", comment: null, icon: "dishes" },
    { id: 3, title: "Выгулять собаку", description: "", reward: 40, status: "approved", comment: null, icon: "sport" },
  ];
  
  // Use centralized task manager hook
  const {
    tasks,
    balance,
    addTask,
    completeTask,
    approveTask,
    rejectTask,
    editTask,
    deleteTask,
    getAvailableActions,
    getStatusConfig,
    canEdit,
    canDelete,
    canComplete,
    canApprove,
    canReject,
    TASK_STATUS,
  } = useTaskManager(initialTasks, 120);
  
  // Role for switching (temporary, until auth is implemented)
  // In production, this will come from backend auth
  const [role, setRole] = useState("parent");
  
  // Modal state for creating/editing tasks
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Modal state for rejecting task
  const [rejectingTask, setRejectingTask] = useState(null);

  // Wrapper for addTask to match modal interface
  function handleCreateTask({ title, description, reward, icon }) {
    addTask(title, description, reward, icon);
  }

  // Handler for editing task
  function handleEditTask(id, data) {
    editTask(id, data);
    setEditingTask(null);
  }

  // Open edit modal
  function openEditModal(task) {
    setEditingTask(task);
    setIsModalOpen(true);
  }

  // Open reject modal
  function openRejectModal(task) {
    setRejectingTask(task);
  }

  return (
    <BrowserRouter>
      {/* Dev-only role switcher - will be removed in production */}
      <DevRoleSwitcher role={role} setRole={setRole} />

      <Routes>
        {/* Parent Routes */}
        <Route 
          path="/parent/tasks" 
          element={
            role === 'parent' ? (
              <ParentLayout
                tasks={tasks}
                onAddTask={() => setIsModalOpen(true)}
                onEditTask={openEditModal}
                approveTask={approveTask}
                rejectTask={rejectTask}
                deleteTask={deleteTask}
                getAvailableActions={(task) => getAvailableActions(task, 'parent', openEditModal, openRejectModal)}
                balance={balance}
              />
            ) : (
              <Navigate to="/child/tasks" replace />
            )
          } 
        />
        <Route 
          path="/parent/family" 
          element={
            role === 'parent' ? (
              <ParentLayout
                tasks={tasks}
                onAddTask={() => setIsModalOpen(true)}
                onEditTask={openEditModal}
                approveTask={approveTask}
                rejectTask={rejectTask}
                deleteTask={deleteTask}
                getAvailableActions={(task) => getAvailableActions(task, 'parent', openEditModal, openRejectModal)}
                balance={balance}
              />
            ) : (
              <Navigate to="/child/tasks" replace />
            )
          } 
        />
        <Route 
          path="/parent/rewards" 
          element={
            role === 'parent' ? (
              <ParentLayout
                tasks={tasks}
                onAddTask={() => setIsModalOpen(true)}
                onEditTask={openEditModal}
                approveTask={approveTask}
                rejectTask={rejectTask}
                deleteTask={deleteTask}
                getAvailableActions={(task) => getAvailableActions(task, 'parent', openEditModal, openRejectModal)}
                balance={balance}
              />
            ) : (
              <Navigate to="/child/tasks" replace />
            )
          } 
        />

        {/* Child Routes */}
        <Route 
          path="/child/tasks" 
          element={
            role === 'child' ? (
              <ChildLayout
                tasks={tasks}
                getActions={(task) => getAvailableActions(task, 'child')}
                balance={balance}
              />
            ) : (
              <Navigate to="/parent/tasks" replace />
            )
          } 
        />
        <Route 
          path="/child/shop" 
          element={
            role === 'child' ? (
              <ChildLayout
                tasks={tasks}
                getActions={(task) => getAvailableActions(task, 'child')}
                balance={balance}
              />
            ) : (
              <Navigate to="/parent/tasks" replace />
            )
          } 
        />
        <Route 
          path="/child/balance" 
          element={
            role === 'child' ? (
              <ChildLayout
                tasks={tasks}
                getActions={(task) => getAvailableActions(task, 'child')}
                balance={balance}
              />
            ) : (
              <Navigate to="/parent/tasks" replace />
            )
          } 
        />

        {/* Default redirect */}
        <Route 
          path="/" 
          element={
            <Navigate to={role === 'parent' ? "/parent/tasks" : "/child/tasks"} replace /> 
          } 
        />
        
        {/* Catch-all redirect */}
        <Route 
          path="*" 
          element={
            <Navigate to={role === 'parent' ? "/parent/tasks" : "/child/tasks"} replace /> 
          } 
        />
      </Routes>

      {/* Модальное окно создания/редактирования задачи */}
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        mode={editingTask ? "edit" : "create"}
        initialData={editingTask}
        taskId={editingTask?.id}
        onCreate={handleCreateTask}
        onSave={handleEditTask}
      />

      {/* Модальное окно отправки на доработку */}
      <RejectTaskModal
        isOpen={!!rejectingTask}
        taskTitle={rejectingTask?.title}
        onClose={() => setRejectingTask(null)}
        onSubmit={(comment) => {
          rejectTask(rejectingTask.id, comment);
          setRejectingTask(null);
        }}
      />
    </BrowserRouter>
  );
}

export default App;
