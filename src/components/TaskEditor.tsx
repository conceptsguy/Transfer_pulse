import React, { useState } from 'react';
import { useWorkflowStore } from '../store/workflowStore';
import { X } from 'lucide-react';

interface TaskEditorProps {
  taskId: string;
  initialData: {
    label: string;
    assignee?: string;
    dueDate?: string;
    status: 'pending' | 'in-progress' | 'completed' | 'delayed';
  };
  onClose: () => void;
}

export default function TaskEditor({ taskId, initialData, onClose }: TaskEditorProps) {
  const updateNode = useWorkflowStore((state) => state.updateNode);
  const [data, setData] = useState(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateNode(taskId, { data });
    onClose();
  };

  return (
    <div className="absolute top-0 right-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Edit Task</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Task Name</label>
            <input
              type="text"
              value={data.label}
              onChange={(e) => setData({ ...data, label: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Assignee</label>
            <input
              type="text"
              value={data.assignee || ''}
              onChange={(e) => setData({ ...data, assignee: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              value={data.dueDate || ''}
              onChange={(e) => setData({ ...data, dueDate: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={data.status}
              onChange={(e) => setData({ ...data, status: e.target.value as any })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="delayed">Delayed</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}