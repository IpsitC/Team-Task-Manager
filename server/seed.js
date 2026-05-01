import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Activity from './models/Activity.js';
import Project from './models/Project.js';
import Task from './models/Task.js';
import User from './models/User.js';

dotenv.config();

const password = 'Password123!';

const addDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const previousDemoEmails = [
  'avery.admin@taskflow.demo',
  'maya.chen@taskflow.demo',
  'noah.patel@taskflow.demo',
  'lina.brooks@taskflow.demo',
  'omar.reyes@taskflow.demo'
];

const demoUsers = [
  { key: 'admin', name: 'Rajesh Kumar', designation: 'Engineering Manager', email: 'rajesh.kumar@taskflow.demo' },
  { key: 'pm', name: 'Priya Nair', designation: 'Product Manager', email: 'priya.nair@taskflow.demo' },
  { key: 'backend', name: 'Arjun Mehta', designation: 'Senior Backend Engineer', email: 'arjun.mehta@taskflow.demo' },
  { key: 'frontend', name: 'Neha Sharma', designation: 'Frontend Engineer', email: 'neha.sharma@taskflow.demo' },
  { key: 'qa', name: 'Vikram Singh', designation: 'QA Analyst', email: 'vikram.singh@taskflow.demo' },
  { key: 'designer', name: 'Ananya Rao', designation: 'UI/UX Designer', email: 'ananya.rao@taskflow.demo' }
];

const projectBlueprints = [
  {
    key: 'onboarding',
    name: 'Customer Onboarding Portal',
    description: 'Build a guided onboarding workflow for enterprise customers, including account setup, document upload, and approval tracking.',
    members: ['admin', 'pm', 'backend', 'frontend', 'qa', 'designer'],
    tasks: [
      {
        title: 'Finalize onboarding journey',
        description: 'Map the account setup, KYC upload, verification, and welcome email steps for enterprise customers.',
        assignees: ['pm', 'designer'],
        priority: 'High',
        status: 'In Progress',
        dueInDays: 2
      },
      {
        title: 'Build document upload API',
        description: 'Create secure upload endpoints with validation, file size limits, and audit-friendly metadata.',
        assignees: ['backend'],
        priority: 'High',
        status: 'To Do',
        dueInDays: 5
      },
      {
        title: 'Implement onboarding screens',
        description: 'Develop responsive setup screens with clear progress states and accessible form validation.',
        assignees: ['frontend', 'designer'],
        priority: 'Medium',
        status: 'To Do',
        dueInDays: 6
      },
      {
        title: 'Prepare regression test plan',
        description: 'Cover document upload, approval status changes, and invalid customer data scenarios.',
        assignees: ['qa'],
        priority: 'Medium',
        status: 'Done',
        dueInDays: -2
      }
    ]
  },
  {
    key: 'payments',
    name: 'Vendor Payments Automation',
    description: 'Automate vendor invoice validation, approval routing, payment status sync, and finance operations reporting.',
    members: ['admin', 'pm', 'backend', 'qa'],
    tasks: [
      {
        title: 'Define payment approval rules',
        description: 'Document approval limits, exception handling, and escalation paths for finance operations.',
        assignees: ['pm', 'admin'],
        priority: 'High',
        status: 'In Progress',
        dueInDays: 1
      },
      {
        title: 'Integrate payment status webhook',
        description: 'Receive payment gateway callbacks and update invoice status safely with retry handling.',
        assignees: ['backend'],
        priority: 'High',
        status: 'To Do',
        dueInDays: 4
      },
      {
        title: 'Validate duplicate invoice checks',
        description: 'Test invoice number, GSTIN, vendor account, and amount matching rules before approval.',
        assignees: ['qa'],
        priority: 'Medium',
        status: 'To Do',
        dueInDays: 3
      }
    ]
  },
  {
    key: 'crm',
    name: 'Field Sales CRM Rollout',
    description: 'Roll out CRM workflows for sales teams with lead assignment, follow-up reminders, and manager visibility.',
    members: ['admin', 'pm', 'frontend', 'qa'],
    tasks: [
      {
        title: 'Create lead assignment board',
        description: 'Design a clear view for managers to assign, rebalance, and track field sales leads.',
        assignees: ['frontend', 'designer'],
        priority: 'High',
        status: 'In Progress',
        dueInDays: 2
      },
      {
        title: 'Test follow-up reminder flow',
        description: 'Verify reminder timing, overdue states, and notification content for sales users.',
        assignees: ['qa', 'pm'],
        priority: 'Medium',
        status: 'To Do',
        dueInDays: 7
      },
      {
        title: 'Publish rollout readiness checklist',
        description: 'Prepare training, support contacts, regional rollout owners, and go-live sign-off steps.',
        assignees: ['admin', 'pm'],
        priority: 'Low',
        status: 'Done',
        dueInDays: -1
      }
    ]
  },
  {
    key: 'reporting',
    name: 'Data Quality and Reporting',
    description: 'Improve operational reporting accuracy by cleaning task metadata, owner mapping, and overdue work visibility.',
    members: ['admin', 'backend', 'qa'],
    tasks: [
      {
        title: 'Audit stale task ownership',
        description: 'Find tasks with inactive owners and prepare reassignment recommendations for project admins.',
        assignees: ['admin', 'qa'],
        priority: 'High',
        status: 'To Do',
        dueInDays: -1
      },
      {
        title: 'Create workload aggregation query',
        description: 'Count tasks across multiple assignees without double-counting project totals.',
        assignees: ['backend'],
        priority: 'Medium',
        status: 'In Progress',
        dueInDays: 5
      }
    ]
  }
];

const runSeed = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required. Create server/.env before running the seed script.');
  }

  await mongoose.connect(process.env.MONGO_URI);

  const demoEmails = demoUsers.map((user) => user.email);
  const cleanupEmails = [...previousDemoEmails, ...demoEmails];
  const cleanupUsers = await User.find({ email: { $in: cleanupEmails } }).select('_id');
  const cleanupUserIds = cleanupUsers.map((user) => user._id);
  const cleanupProjectNames = [
    'Website Launch Sprint',
    'Mobile App Beta',
    'Operations Backlog',
    ...projectBlueprints.map((project) => project.name)
  ];
  const cleanupProjects = await Project.find({
    $or: [{ name: { $in: cleanupProjectNames } }, { createdBy: { $in: cleanupUserIds } }]
  }).select('_id');
  const cleanupProjectIds = cleanupProjects.map((project) => project._id);

  if (cleanupProjectIds.length > 0) {
    await Task.deleteMany({ projectId: { $in: cleanupProjectIds } });
    await Project.deleteMany({ _id: { $in: cleanupProjectIds } });
  }

  await Activity.deleteMany({});
  await User.deleteMany({ email: { $in: cleanupEmails } });

  const createdUsers = await User.create(demoUsers.map((user) => ({ ...user, password })));
  const usersByKey = createdUsers.reduce((acc, user, index) => {
    acc[demoUsers[index].key] = user;
    return acc;
  }, {});

  for (const blueprint of projectBlueprints) {
    const project = await Project.create({
      name: blueprint.name,
      description: blueprint.description,
      createdBy: usersByKey.admin._id,
      members: blueprint.members.map((memberKey) => ({
        user: usersByKey[memberKey]._id,
        role: memberKey === 'admin' ? 'admin' : 'member'
      }))
    });

    await User.updateMany(
      { _id: { $in: blueprint.members.map((memberKey) => usersByKey[memberKey]._id) } },
      { $addToSet: { projects: project._id } }
    );

    await Task.create(
      blueprint.tasks.map((task) => {
        const assignees = task.assignees.map((memberKey) => usersByKey[memberKey]._id);
        return {
          title: task.title,
          description: task.description,
          projectId: project._id,
          assignedTo: assignees[0],
          assignees,
          priority: task.priority,
          status: task.status,
          dueDate: addDays(task.dueInDays),
          createdBy: usersByKey.admin._id
        };
      })
    );
  }

  console.log('Clean Indian demo data seeded successfully.');
  console.log('Login accounts:');
  demoUsers.forEach((user) => {
    console.log(`- ${user.name} (${user.designation}): ${user.email} / ${password}`);
  });

  await mongoose.disconnect();
};

runSeed().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect();
  process.exit(1);
});
