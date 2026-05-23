import { Calendar, Flag, Trash2 } from "lucide-react";

const PRIORITY_STYLES = {
  High:   "text-red-400   bg-red-400/10   border-red-400/30",
  Medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  Low:    "text-green-400  bg-green-400/10  border-green-400/30",
};

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
  });
};

/**
 * TaskCard
 * @param {object}   task        - task document from MongoDB
 * @param {function} onDelete    - called with task._id
 * @param {object}   dragHandleProps - spread onto the drag handle (from DnD lib)
 */
const TaskCard = ({ task, onDelete, dragHandleProps = {} }) => {
  const priorityClass = PRIORITY_STYLES[task.priority] ?? PRIORITY_STYLES.Low;
  const dueDate       = formatDate(task.dueDate);
  const initials      = task.assignedTo?.name
    ? task.assignedTo.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div
      {...dragHandleProps}
      className="bg-gray-800 border border-gray-700 rounded-lg p-3.5 shadow-sm
                 hover:border-blue-500/50 hover:shadow-blue-500/5 hover:shadow-md
                 transition-all duration-150 cursor-grab active:cursor-grabbing group"
    >
      {/* Priority badge */}
      <div className="flex items-center justify-between mb-2">
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5
                       rounded-full border ${priorityClass}`}
        >
          <Flag size={9} />
          {task.priority}
        </span>

        <button
          onClick={() => onDelete(task._id)}
          className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400
                     transition-all duration-150 p-0.5 rounded"
          title="Delete task"
        >
          <Trash2 size={13} />
        </button>
      </div>

      {/* Title */}
      <p className="text-white text-sm font-medium leading-snug mb-3">
        {task.title}
      </p>

      {/* Footer: due date + assignee */}
      <div className="flex items-center justify-between">
        {dueDate ? (
          <span className="flex items-center gap-1 text-gray-500 text-[11px]">
            <Calendar size={10} />
            {dueDate}
          </span>
        ) : (
          <span />
        )}

        {/* Assignee avatar */}
        <div
          title={task.assignedTo?.name ?? "Unassigned"}
          className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center
                     text-white text-[10px] font-bold"
        >
          {initials}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
