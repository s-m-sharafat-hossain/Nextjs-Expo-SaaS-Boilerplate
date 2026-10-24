// apps/web/src/features/projects/components/KanbanBoard.tsx
"use client";

import React, { useState } from "react";
import { moveTaskAction, createTaskAction } from "../projects.action";

export interface TaskItem {
  id: string;
  projectId: string;
  title: string;
  description?: string | null;
  status: string; // TODO, IN_PROGRESS, IN_REVIEW, DONE
  priority: string; // LOW, MEDIUM, HIGH, URGENT
  order: number;
  dueDate?: string | Date | null;
  assignee?: { id: string; name: string; image?: string | null } | null;
  _count?: { comments: number };
}

interface KanbanBoardProps {
  projectId: string;
  projectName: string;
  initialTasks: TaskItem[];
}

const COLUMNS = [
  { key: "TODO", title: "To Do", bg: "bg-slate-100 dark:bg-slate-800/60", badge: "bg-slate-200 text-slate-700" },
  { key: "IN_PROGRESS", title: "In Progress", bg: "bg-blue-50/60 dark:bg-blue-950/30", badge: "bg-blue-100 text-blue-700" },
  { key: "IN_REVIEW", title: "In Review", bg: "bg-amber-50/60 dark:bg-amber-950/30", badge: "bg-amber-100 text-amber-700" },
  { key: "DONE", title: "Completed", bg: "bg-emerald-50/60 dark:bg-emerald-950/30", badge: "bg-emerald-100 text-emerald-700" },
];

const PRIORITY_BADGES: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
  MEDIUM: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  HIGH: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  URGENT: "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold",
};

export function KanbanBoard({ projectId, projectName, initialTasks }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM");
  const [newStatus, setNewStatus] = useState<"TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE">("TODO");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMove = async (taskId: string, targetStatus: "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE") => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: targetStatus } : t))
    );

    try {
      await moveTaskAction(taskId, { status: targetStatus });
    } catch (err) {
      console.error("Failed to move task", err);
      // Revert if error
      setTasks(initialTasks);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setIsSubmitting(true);

    try {
      const created = await createTaskAction({
        projectId,
        title: newTitle,
        description: newDesc,
        priority: newPriority,
        status: newStatus,
        order: tasks.length,
      });

      setTasks((prev) => [...prev, created as any]);
      setShowModal(false);
      setNewTitle("");
      setNewDesc("");
    } catch (err) {
      console.error("Failed to create task", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>📋</span> {projectName}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {tasks.length} total tasks across 4 workflow stages
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 shadow-sm"
        >
          <span>+ Add Task</span>
        </button>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.key);

          return (
            <div
              key={col.key}
              className={`rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 flex flex-col min-h-[550px] ${col.bg}`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800 mb-4">
                <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  {col.title}
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${col.badge}`}>
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${PRIORITY_BADGES[task.priority] || PRIORITY_BADGES.MEDIUM}`}>
                        {task.priority}
                      </span>

                      {/* Status Dropdown / Action */}
                      <select
                        value={task.status}
                        onChange={(e) => handleMove(task.id, e.target.value as any)}
                        className="text-[11px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5 text-slate-600 dark:text-slate-300 cursor-pointer"
                      >
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="IN_REVIEW">Review</option>
                        <option value="DONE">Done</option>
                      </select>
                    </div>

                    <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mt-2">
                      {task.title}
                    </h4>

                    {task.description && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {task.description}
                      </p>
                    )}

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        {task.assignee?.name ? (
                          <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold flex items-center justify-center">
                            {task.assignee.name.charAt(0)}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">Unassigned</span>
                        )}
                      </div>

                      {task._count?.comments ? (
                        <span>💬 {task._count.comments}</span>
                      ) : null}
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="h-28 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-400 font-medium">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Create New Task</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Webhook Dispatcher"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Task details and acceptance criteria..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                    Initial Column
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="DONE">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
