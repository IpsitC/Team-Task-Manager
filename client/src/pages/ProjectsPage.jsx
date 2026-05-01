import { Clock3, FolderKanban, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import Badge from '../components/common/Badge.jsx';
import Button from '../components/common/Button.jsx';
import Input from '../components/common/Input.jsx';
import Modal from '../components/common/Modal.jsx';
import Spinner from '../components/common/Spinner.jsx';
import PageWrapper from '../components/layout/PageWrapper.jsx';
import ProjectCard from '../components/projects/ProjectCard.jsx';
import { useProjects } from '../hooks/useProjects.js';

const ProjectsPage = () => {
  const { projects, loading, createProject, joinProject, leaveProject } = useProjects({ scope: 'discover' });
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);

  const myProjects = useMemo(() => projects.filter((project) => project.isMember), [projects]);
  const availableProjects = useMemo(() => projects.filter((project) => !project.isMember), [projects]);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await createProject(form);
      setForm({ name: '', description: '' });
      setModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageWrapper>
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-card">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-600">Projects</p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-950">Workspace projects</h1>
            <p className="mt-2 max-w-2xl text-slate-500">Open joined projects, create new workspaces, or join available projects.</p>
          </div>
          <Button onClick={() => setModalOpen(true)}>
            <Plus size={16} />
            New Project
          </Button>
        </div>
      </div>

      {loading ? (
        <Spinner label="Loading projects" />
      ) : (
        <div className="grid gap-6">
          <section>
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950">My projects</h2>
                <p className="mt-1 text-sm text-slate-500">Projects you have joined and can work inside.</p>
              </div>
              <Badge className="border-blue-200 bg-blue-50 text-blue-700">{myProjects.length} joined</Badge>
            </div>
            {myProjects.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {myProjects.map((project) => (
                  <ProjectCard key={project._id} project={project} onJoin={joinProject} onLeave={leaveProject} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
                <FolderKanban className="mx-auto text-blue-500" size={28} />
                <p className="mt-3 text-sm font-semibold text-slate-600">Join an available project or create a new one.</p>
              </div>
            )}
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950">Available projects</h2>
                <p className="mt-1 text-sm text-slate-500">Workspace projects you can join when you need access.</p>
              </div>
              <Badge className="border-slate-200 bg-slate-50 text-slate-600">{availableProjects.length} open</Badge>
            </div>
            {availableProjects.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {availableProjects.map((project) => (
                  <ProjectCard key={project._id} project={project} onJoin={joinProject} onLeave={leaveProject} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
                <Clock3 className="mx-auto text-slate-400" size={28} />
                <p className="mt-3 text-sm font-semibold text-slate-600">No available projects to join.</p>
              </div>
            )}
          </section>
        </div>
      )}

      <Modal
        open={modalOpen}
        title="Create project"
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" form="project-form" disabled={saving}>Create</Button>
          </>
        }
      >
        <form id="project-form" onSubmit={submit} className="grid gap-4">
          <Input label="Name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
          <Input label="Description" as="textarea" value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} />
        </form>
      </Modal>
    </PageWrapper>
  );
};

export default ProjectsPage;
