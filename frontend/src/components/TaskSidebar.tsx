import { useState, ChangeEvent, FC } from "react";
import {
  CheckCircle,
  CircleDashed,
  Clock,
  AlertTriangle,
  Plus,
  MessageSquare,
} from "lucide-react";
import React from "react";

// Task status options
export const STATUS = {
  TODO: "todo",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
  BLOCKED: "blocked",
} as const;

export type Status = (typeof STATUS)[keyof typeof STATUS];

export interface Task {
  id: number;
  title: string;
  status: Status;
  messages: string[];
}

// Initial tasks for demo purposes
const initialTasks: Task[] = [
  {
    id: 1,
    title: "Design mockups",
    status: STATUS.COMPLETED,
    messages: ["Completed all mockups", "Sent for review"],
  },
  {
    id: 2,
    title: "Implement frontend",
    status: STATUS.IN_PROGRESS,
    messages: ["Working on responsive layout"],
  },
  {
    id: 3,
    title: "Backend integration",
    status: STATUS.TODO,
    messages: [],
  },
  {
    id: 4,
    title: "Deploy to staging",
    status: STATUS.BLOCKED,
    messages: ["Waiting for API access"],
  },
];

// Status icon mapping
const StatusIcon: FC<{ status: Status }> = ({ status }) => {
  switch (status) {
    case STATUS.COMPLETED:
      return <CheckCircle className="text-green-500" size={18} />;
    case STATUS.IN_PROGRESS:
      return <Clock className="text-blue-500" size={18} />;
    case STATUS.BLOCKED:
      return <AlertTriangle className="text-red-500" size={18} />;
    case STATUS.TODO:
    default:
      return <CircleDashed className="text-gray-500" size={18} />;
  }
};

// Status badge component
const StatusBadge: FC<{ status: Status }> = ({ status }) => {
  const getStatusClasses = () => {
    switch (status) {
      case STATUS.COMPLETED:
        return "bg-green-100 text-green-800 border-green-300";
      case STATUS.IN_PROGRESS:
        return "bg-blue-100 text-blue-800 border-blue-300";
      case STATUS.BLOCKED:
        return "bg-red-100 text-red-800 border-red-300";
      case STATUS.TODO:
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full border ${getStatusClasses()}`}
    >
      {status.replace("-", " ")}
    </span>
  );
};

interface TaskItemProps {
  task: Task;
  onStatusChange: (taskId: number, newStatus: Status) => void;
  onAddMessage: (taskId: number, message: string) => void;
}

// Task item component
const TaskItem: FC<TaskItemProps> = ({
  task,
  onStatusChange,
  onAddMessage,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [newMessage, setNewMessage] = useState<string>("");

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(task.id, e.target.value as Status);
  };

  const handleAddMessage = () => {
    if (newMessage.trim()) {
      onAddMessage(task.id, newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="border rounded-lg p-3 mb-3 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatusIcon status={task.status} />
          <span className="font-medium">{task.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={task.status} />
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700"
            type="button"
          >
            <MessageSquare size={16} />
            {task.messages.length > 0 && (
              <span className="ml-1 text-xs">{task.messages.length}</span>
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t">
          <select
            value={task.status}
            onChange={handleStatusChange}
            className="w-full mb-2 p-2 border rounded text-sm bg-gray-50"
          >
            <option value={STATUS.TODO}>To Do</option>
            <option value={STATUS.IN_PROGRESS}>In Progress</option>
            <option value={STATUS.COMPLETED}>Completed</option>
            <option value={STATUS.BLOCKED}>Blocked</option>
          </select>

          {task.messages.length > 0 && (
            <div className="mb-3">
              <h4 className="text-xs text-gray-500 mb-1">Updates:</h4>
              <ul className="text-sm">
                {task.messages.map((message, idx) => (
                  <li key={idx} className="py-1 px-2 bg-gray-50 rounded mb-1">
                    {message}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Add update..."
              className="flex-1 p-2 text-sm border rounded"
            />
            <button
              onClick={handleAddMessage}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
              type="button"
            >
              Add
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main task sidebar component
interface TaskSidebarProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskSidebar: FC<TaskSidebarProps> = ({ tasks, setTasks }) => {
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");

  // Add a new task
  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now(),
        title: newTaskTitle,
        status: STATUS.TODO,
        messages: [],
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle("");
    }
  };

  // Update task status
  const updateTaskStatus = (taskId: number, newStatus: Status) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  // Add message to a task
  const addTaskMessage = (taskId: number, message: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? { ...task, messages: [...task.messages, message] }
          : task
      )
    );
  };

  // Mark task as completed
  const markAsCompleted = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: STATUS.COMPLETED } : task
      )
    );
  };

  return (
    <div className="h-full w-96 bg-gray-50 border-r p-4 flex flex-col">
      <h2 className="text-lg font-bold mb-4">Tasks</h2>

      {/* Add task form */}
      <div className="flex mb-4 gap-2">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="New task..."
          className="flex-1 p-2 border rounded text-sm"
        />
        <button
          onClick={addTask}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded"
          type="button"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Task filters */}
      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-2">FILTER BY STATUS</div>
        <div className="flex flex-wrap gap-1">
          <button
            className="text-xs px-2 py-1 rounded-full bg-gray-200 hover:bg-gray-300"
            type="button"
          >
            All
          </button>
          <StatusBadge status={STATUS.TODO} />
          <StatusBadge status={STATUS.IN_PROGRESS} />
          <StatusBadge status={STATUS.COMPLETED} />
          <StatusBadge status={STATUS.BLOCKED} />
        </div>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onStatusChange={updateTaskStatus}
            onAddMessage={addTaskMessage}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskSidebar;
