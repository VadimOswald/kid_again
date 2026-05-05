import { useState } from "react";
import ParentView from "./pages/ParentView";
import ChildView from "./pages/ChildView";
import CreateTaskModal from "./components/CreateTaskModal";
import RejectTaskModal from "./components/RejectTaskModal";
import { useTaskManager } from "./hooks/useTaskManager";
import './App.css';

function App() {
  // Initial tasks data
  const initialTasks = [
    { id: 1, title: "Убрать в комнате", description: "", reward: 50, status: "new", comment: null },
    { id: 2, title: "Помыть посуду", description: "", reward: 30, status: "pending", comment: null },
    { id: 3, title: "Выгулять собаку", description: "", reward: 40, status: "approved", comment: null },
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
  const [role, setRole] = useState("child");
  
  // Modal state for creating/editing tasks
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  // Modal state for rejecting task
  const [rejectingTask, setRejectingTask] = useState(null);

  // Wrapper for addTask to match modal interface
  function handleCreateTask({ title, description, reward }) {
    addTask(title, description, reward);
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
    <>
      {/* Переключатель ролей - только для разработки! */}
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

      {role === "parent" && (
        <ParentView
          tasks={tasks}
          onAddTask={() => setIsModalOpen(true)}
          onEditTask={openEditModal}
          getActions={(task) => getAvailableActions(task, 'parent', openEditModal, openRejectModal)}
          balance={balance}
        />
      )}

      {role === "child" && (
        <ChildView
          tasks={tasks}
          getActions={(task) => getAvailableActions(task, 'child')}
          balance={balance}
        />
      )}

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
    </>
  );
}

export default App;
