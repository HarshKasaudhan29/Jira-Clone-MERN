import { Plus } from "lucide-react";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

const COLUMN_STYLES = {
  "To Do":       { dot: "bg-gray-400",   header: "text-gray-300" },
  "In Progress": { dot: "bg-yellow-400", header: "text-yellow-300" },
  "Done":        { dot: "bg-green-400",  header: "text-green-300" },
};

/**
 * KanbanColumn
 * @param {string}   columnId   - one of "To Do" | "In Progress" | "Done"
 * @param {array}    tasks      - tasks belonging to this column
 * @param {function} onAddTask  - open create-task modal with this column pre-selected
 * @param {function} onDelete   - delete handler passed to TaskCard
 */
const KanbanColumn = ({ columnId, tasks, onAddTask, onDelete }) => {
  const styles = COLUMN_STYLES[columnId] ?? COLUMN_STYLES["To Do"];

  return (
    <div className="flex flex-col w-72 shrink-0">
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
          <h3 className={`text-sm font-semibold ${styles.header}`}>
            {columnId}
          </h3>
          <span className="bg-gray-800 text-gray-400 text-[11px] font-medium
                           px-1.5 py-0.5 rounded-full border border-gray-700">
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => onAddTask(columnId)}
          className="p-1 rounded text-gray-500 hover:text-blue-400 hover:bg-gray-800
                     transition-colors"
          title={`Add task to ${columnId}`}
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Droppable area */}
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col gap-2.5 min-h-[120px] rounded-xl p-2 transition-colors
                        ${
                          snapshot.isDraggingOver
                            ? "bg-blue-600/10 border border-blue-500/30"
                            : "bg-gray-900/60 border border-gray-800"
                        }`}
          >
            {tasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={{
                      ...provided.draggableProps.style,
                      opacity: snapshot.isDragging ? 0.85 : 1,
                    }}
                  >
                    <TaskCard
                      task={task}
                      onDelete={onDelete}
                      dragHandleProps={provided.dragHandleProps}
                    />
                  </div>
                )}
              </Draggable>
            ))}

            {provided.placeholder}

            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <p className="text-gray-700 text-xs text-center py-6">
                No tasks here
              </p>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default KanbanColumn;
