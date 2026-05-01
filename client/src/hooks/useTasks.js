import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../api/axios.js';

export const useTasks = (projectId, filters, options = {}) => {
  const { enabled = true } = options;
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(enabled);

  const fetchTasks = useCallback(async () => {
    if (!projectId || !enabled) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get(`/tasks/project/${projectId}`, { params: filters });
      setTasks(data.tasks);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not load tasks'));
    } finally {
      setLoading(false);
    }
  }, [enabled, projectId, filters]);

  const createTask = async (payload) => {
    const { data } = await api.post('/tasks', { ...payload, projectId });
    setTasks((current) => [data.task, ...current]);
    toast.success('Task created');
    return data.task;
  };

  const updateTask = async (taskId, payload, options = {}) => {
    try {
      const { data } = await api.put(`/tasks/${taskId}`, payload);
      setTasks((current) => current.map((task) => (task._id === taskId ? data.task : task)));
      if (!options.silent) toast.success('Task updated');
      return data.task;
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not update task'));
      throw error;
    }
  };

  const deleteTask = async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
    setTasks((current) => current.filter((task) => task._id !== taskId));
    toast.success('Task deleted');
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, loading, fetchTasks, createTask, updateTask, deleteTask };
};
