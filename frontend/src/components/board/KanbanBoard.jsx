import { useState, useCallback } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import KanbanColumn from "./KanbanColumn";
import taskService from "../../services/taskService";

const COLUMNS = ["To Do", "In Progress", "Done"];

/**
 * KanbanBoard
 * @param {array}    tasks        - full task list for the project
 * @param {function} setTasks     - state setter (lifted to ProjectDetailsPage)
 * @param {function} onAddTask    - open create-task modal pre-filled with a column
 * @param {function} onDeleteTask - delete a task by id
 */
const KanbanBoard = ({ tasks, setTasks, onAddTask, onDeleteTask }) => {
  const [dragging, setDragging] = useState(false);

  // Group tasks by status
  const grouped = COLUMNS.reduce((acc, col) => {
    acc[col] = tasks.filter((t) => t.status === col);
    return acc;
  }, {});

  const handleDragStart = () => setDragging(true);

  const handleDragEnd = useCallback(
    async (result) => {
      setDragging(false);
      const { source, destination, draggableId } = result;

      // Dropped outside or same column + same index
      if (!destination) return;
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      )
        return;

      const newStatus = destination.droppableId;

      // Optimistic UI update
      setTasks((prev) =>
        prev.map((t) =>
          t._id === draggableId ? { ...t, status: newStatus } : t
        )
      );

      try {
        await taskService.updateStatus(draggableId, newStatus);
      } catch (err) {
        console.error("Status update failed, rolling back:", err);
        // Rollback to original status on failure
        setTasks((prev) =>
          prev.map((t) =>
            t._id === draggableId ? { ...t, status: source.droppableId } : t
          )
        );
      }
    },
    [setTasks]
  );

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div
        className={`flex gap-5 overflow-x-auto pb-4 transition-opacity ${
          dragging ? "opacity-95" : "opacity-100"
        }`}
      >
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col}
            columnId={col}
            tasks={grouped[col]}
            onAddTask={onAddTask}
            onDelete={onDeleteTask}
          />
        ))}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
