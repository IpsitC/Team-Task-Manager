import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../api/axios.js';

export const useProject = (projectId) => {
  const [project, setProject] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState('member');
  const [loading, setLoading] = useState(true);

  const fetchProject = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const { data } = await api.get(`/projects/${projectId}`);
      setProject(data.project);
      setCurrentUserRole(data.currentUserRole);
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not load project'));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const addMember = async (email) => {
    const { data } = await api.put(`/projects/${projectId}/add-member`, { email });
    setProject(data.project);
    toast.success('Member added');
  };

  const removeMember = async (userId) => {
    const { data } = await api.delete(`/projects/${projectId}/remove-member`, { data: { userId } });
    setProject(data.project);
    toast.success('Member removed');
  };

  const deleteProject = async () => {
    await api.delete(`/projects/${projectId}`);
    toast.success('Project deleted');
  };

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return { project, currentUserRole, isAdmin: currentUserRole === 'admin', loading, fetchProject, addMember, removeMember, deleteProject };
};
