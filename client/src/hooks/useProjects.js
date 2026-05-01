import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../api/axios.js';

export const useProjects = (options = {}) => {
  const { autoLoad = true, scope = 'mine' } = typeof options === 'boolean' ? { autoLoad: options, scope: 'mine' } : options;
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(autoLoad);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = scope === 'discover' ? '/projects/discover/all' : '/projects';
      const { data } = await api.get(endpoint);
      setProjects(data.projects);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not load projects'));
    } finally {
      setLoading(false);
    }
  }, [scope]);

  const createProject = async (payload) => {
    const { data } = await api.post('/projects', payload);
    setProjects((current) => [data.project, ...current]);
    toast.success('Project created');
    return data.project;
  };

  const joinProject = async (projectId) => {
    const { data } = await api.put(`/projects/${projectId}/join`);
    setProjects((current) => current.map((project) => (project._id === projectId ? data.project : project)));
    toast.success('Joined project');
    return data.project;
  };

  const leaveProject = async (projectId) => {
    const { data } = await api.put(`/projects/${projectId}/leave`);
    setProjects((current) => {
      if (data.deleted) {
        return current.filter((project) => project._id !== projectId);
      }

      if (scope === 'mine') {
        return current.filter((project) => project._id !== projectId);
      }

      return current.map((project) => (project._id === projectId ? data.project : project));
    });
    toast.success('Left project');
    return data;
  };

  const deleteProject = async (projectId) => {
    await api.delete(`/projects/${projectId}`);
    setProjects((current) => current.filter((project) => project._id !== projectId));
    toast.success('Project deleted');
  };

  useEffect(() => {
    if (autoLoad) fetchProjects();
  }, [autoLoad, fetchProjects]);

  return { projects, loading, fetchProjects, createProject, joinProject, leaveProject, deleteProject };
};
