import { UserMinus, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api, { getErrorMessage } from '../../api/axios.js';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import { initials } from '../../utils/constants.js';

const MemberPanel = ({ project, isAdmin, onAddMember, onRemoveMember }) => {
  const [email, setEmail] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [domain, setDomain] = useState(import.meta.env.VITE_COMPANY_EMAIL_DOMAIN || 'taskflow.demo');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAvailableUsers = async () => {
      if (!isAdmin || !project?._id) return;

      try {
        const { data } = await api.get(`/projects/${project._id}/available-members`);
        setAvailableUsers(data.users || []);
        setDomain(data.domain || domain);
      } catch (error) {
        toast.error(getErrorMessage(error, 'Could not load available users'));
      }
    };

    fetchAvailableUsers();
  }, [domain, isAdmin, project?._id, project?.members?.length]);

  const addMemberByEmail = async (memberEmail) => {
    if (!memberEmail.trim()) return;

    setSaving(true);
    try {
      await onAddMember(memberEmail.trim());
      setEmail('');
      setSelectedEmail('');
      setAvailableUsers((current) => current.filter((user) => user.email !== memberEmail.trim()));
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not add member');
    } finally {
      setSaving(false);
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    addMemberByEmail(email);
  };

  const submitSelectedUser = async (event) => {
    event.preventDefault();
    addMemberByEmail(selectedEmail);
  };

  const removeMember = (member) => {
    const confirmed = window.confirm(`Remove ${member.user.name} from this project?`);
    if (!confirmed) return;
    onRemoveMember(member.user._id);
  };

  return (
    <div className="space-y-5">
      {isAdmin && (
        <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-card xl:grid-cols-2">
          <form onSubmit={submitSelectedUser} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <label className="block flex-1">
              <span className="mb-1.5 block text-sm font-semibold text-slate-700">Add existing company user</span>
              <select
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
                value={selectedEmail}
                onChange={(event) => setSelectedEmail(event.target.value)}
              >
                <option value="">Select a registered @{domain} user</option>
                {availableUsers.map((user) => (
                  <option key={user._id} value={user.email}>
                    {user.name} - {user.designation || user.email}
                  </option>
                ))}
              </select>
            </label>
            <Button type="submit" disabled={saving || !selectedEmail}>
              <UserPlus size={16} />
              Add
            </Button>
          </form>

          <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Input label={`Add by company email (@${domain})`} type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder={`teammate@${domain}`} />
            </div>
            <Button type="submit" disabled={saving || !email.trim()}>
              <UserPlus size={16} />
              Add
            </Button>
          </form>
        </div>
      )}
      <div className="rounded-xl border border-slate-200 bg-white shadow-card">
        {project?.members?.map((member) => (
          <div key={member.user._id} className="flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-3 last:border-b-0">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">{initials(member.user.name)}</div>
              <div>
                <p className="font-semibold text-slate-900">{member.user.name}</p>
                <p className="text-sm text-slate-500">{member.user.designation || member.user.email}</p>
                {member.user.designation && <p className="text-xs text-slate-400">{member.user.email}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold capitalize text-slate-600">{member.role}</span>
              {isAdmin && member.role !== 'admin' && (
                <Button variant="secondary" className="text-rose-600 hover:bg-rose-50" onClick={() => removeMember(member)} aria-label="Remove member">
                  <UserMinus size={16} />
                  Remove
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberPanel;
