import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

const listCommand: CommandDefinition = {
  name: 'tasks_list',
  group: 'tasks',
  subcommand: 'list',
  description: 'Get tasks in a list. Returns paginated results (max 100/page).',
  examples: [
    'clickup tasks list --list-id 123',
    'clickup tasks list --list-id 123 --statuses "open" --assignees "456"',
    'clickup tasks list --list-id 123 --page 1',
  ],

  inputSchema: z.object({
    list_id: z.string().describe('List ID'),
    archived: z.string().optional().describe('Include archived (true/false)'),
    page: z.coerce.number().optional().describe('Page number (0-indexed)'),
    order_by: z.string().optional().describe('Order by: id, created, updated, due_date'),
    reverse: z.string().optional().describe('Reverse order (true/false)'),
    subtasks: z.string().optional().describe('Include subtasks (true/false)'),
    statuses: z.string().optional().describe('Comma-separated status names'),
    include_closed: z.string().optional().describe('Include closed tasks (true/false)'),
    assignees: z.string().optional().describe('Comma-separated assignee user IDs'),
    due_date_gt: z.string().optional().describe('Due date greater than (Unix ms)'),
    due_date_lt: z.string().optional().describe('Due date less than (Unix ms)'),
    date_created_gt: z.string().optional().describe('Created after (Unix ms)'),
    date_created_lt: z.string().optional().describe('Created before (Unix ms)'),
    date_updated_gt: z.string().optional().describe('Updated after (Unix ms)'),
    date_updated_lt: z.string().optional().describe('Updated before (Unix ms)'),
  }),

  cliMappings: {
    options: [
      { field: 'list_id', flags: '--list-id <id>', description: 'List ID' },
      { field: 'archived', flags: '--archived <bool>', description: 'Include archived' },
      { field: 'page', flags: '--page <n>', description: 'Page number (0-indexed)' },
      { field: 'order_by', flags: '--order-by <field>', description: 'Order by field' },
      { field: 'reverse', flags: '--reverse <bool>', description: 'Reverse order' },
      { field: 'subtasks', flags: '--subtasks <bool>', description: 'Include subtasks' },
      { field: 'statuses', flags: '--statuses <names>', description: 'Comma-separated statuses' },
      { field: 'include_closed', flags: '--include-closed <bool>', description: 'Include closed' },
      { field: 'assignees', flags: '--assignees <ids>', description: 'Comma-separated assignee IDs' },
      { field: 'due_date_gt', flags: '--due-date-gt <ms>', description: 'Due after (Unix ms)' },
      { field: 'due_date_lt', flags: '--due-date-lt <ms>', description: 'Due before (Unix ms)' },
      { field: 'date_created_gt', flags: '--date-created-gt <ms>', description: 'Created after (Unix ms)' },
      { field: 'date_created_lt', flags: '--date-created-lt <ms>', description: 'Created before (Unix ms)' },
      { field: 'date_updated_gt', flags: '--date-updated-gt <ms>', description: 'Updated after (Unix ms)' },
      { field: 'date_updated_lt', flags: '--date-updated-lt <ms>', description: 'Updated before (Unix ms)' },
    ],
  },

  endpoint: { method: 'GET', path: '/list/{list_id}/task' },
  fieldMappings: {
    list_id: 'path',
    archived: 'query', page: 'query', order_by: 'query', reverse: 'query',
    subtasks: 'query', include_closed: 'query',
    due_date_gt: 'query', due_date_lt: 'query',
    date_created_gt: 'query', date_created_lt: 'query',
    date_updated_gt: 'query', date_updated_lt: 'query',
  },
  paginated: true,

  handler: async (input, client) => {
    const { list_id, statuses, assignees, ...query } = input;
    // ClickUp uses repeated query params for arrays: statuses[]=open&statuses[]=closed
    const url = `/list/${encodeURIComponent(list_id)}/task`;
    const params: Record<string, any> = { ...query };

    // Build array params manually
    let extra = '';
    if (statuses) {
      extra += statuses.split(',').map((s: string) => `&statuses[]=${encodeURIComponent(s.trim())}`).join('');
    }
    if (assignees) {
      extra += assignees.split(',').map((a: string) => `&assignees[]=${encodeURIComponent(a.trim())}`).join('');
    }

    if (extra) {
      // Use raw query string approach — build URL manually
      const qs = Object.entries(params)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
        .join('&');
      const fullPath = `${url}?${qs}${extra}`;
      return client.get(fullPath);
    }

    return client.get(url, params);
  },
};

const getCommand: CommandDefinition = {
  name: 'tasks_get',
  group: 'tasks',
  subcommand: 'get',
  description: 'Get a task by ID.',
  examples: [
    'clickup tasks get <task_id>',
    'clickup tasks get <task_id> --include-subtasks true',
  ],

  inputSchema: z.object({
    task_id: z.string().describe('Task ID'),
    include_subtasks: z.string().optional().describe('Include subtasks (true/false)'),
    include_markdown_description: z.string().optional().describe('Include markdown description (true/false)'),
  }),

  cliMappings: {
    args: [{ field: 'task_id', name: 'task_id', required: false }],
    options: [
      { field: 'task_id', flags: '--task-id <id>', description: 'Task ID (alternative to positional arg)' },
      { field: 'include_subtasks', flags: '--include-subtasks <bool>', description: 'Include subtasks' },
      { field: 'include_markdown_description', flags: '--include-markdown', description: 'Include markdown description' },
    ],
  },

  endpoint: { method: 'GET', path: '/task/{task_id}' },
  fieldMappings: { task_id: 'path', include_subtasks: 'query', include_markdown_description: 'query' },

  handler: (input, client) => executeCommand(getCommand, input, client),
};

const createCommand: CommandDefinition = {
  name: 'tasks_create',
  group: 'tasks',
  subcommand: 'create',
  description: 'Create a new task in a list.',
  examples: [
    'clickup tasks create --list-id 123 --name "Fix bug"',
    'clickup tasks create --list-id 123 --name "Feature" --priority 2 --assignees "456,789" --status "in progress"',
  ],

  inputSchema: z.object({
    list_id: z.string().describe('List ID'),
    name: z.string().describe('Task name'),
    description: z.string().optional().describe('Task description (plain text)'),
    markdown_description: z.string().optional().describe('Task description (markdown)'),
    assignees: z.string().optional().describe('Comma-separated assignee user IDs'),
    status: z.string().optional().describe('Status name'),
    priority: z.coerce.number().optional().describe('Priority (1=urgent, 2=high, 3=normal, 4=low)'),
    due_date: z.string().optional().describe('Due date (Unix ms)'),
    due_date_time: z.boolean().optional().describe('Due date includes time'),
    start_date: z.string().optional().describe('Start date (Unix ms)'),
    start_date_time: z.boolean().optional().describe('Start date includes time'),
    time_estimate: z.coerce.number().optional().describe('Time estimate (ms)'),
    tags: z.string().optional().describe('Comma-separated tag names'),
    parent: z.string().optional().describe('Parent task ID (creates subtask)'),
    links_to: z.string().optional().describe('Task ID to link to'),
    notify_all: z.boolean().optional().describe('Notify all assignees'),
    custom_fields: z.string().optional().describe('JSON array of custom field values'),
  }),

  cliMappings: {
    options: [
      { field: 'list_id', flags: '--list-id <id>', description: 'List ID' },
      { field: 'name', flags: '--name <name>', description: 'Task name' },
      { field: 'description', flags: '--description <text>', description: 'Description' },
      { field: 'markdown_description', flags: '--markdown-description <md>', description: 'Markdown description' },
      { field: 'assignees', flags: '--assignees <ids>', description: 'Comma-separated assignee IDs' },
      { field: 'status', flags: '--status <name>', description: 'Status name' },
      { field: 'priority', flags: '--priority <n>', description: 'Priority (1-4)' },
      { field: 'due_date', flags: '--due-date <ms>', description: 'Due date (Unix ms)' },
      { field: 'due_date_time', flags: '--due-date-time', description: 'Due date has time' },
      { field: 'start_date', flags: '--start-date <ms>', description: 'Start date (Unix ms)' },
      { field: 'start_date_time', flags: '--start-date-time', description: 'Start date has time' },
      { field: 'time_estimate', flags: '--time-estimate <ms>', description: 'Time estimate (ms)' },
      { field: 'tags', flags: '--tags <names>', description: 'Comma-separated tags' },
      { field: 'parent', flags: '--parent <id>', description: 'Parent task ID (subtask)' },
      { field: 'links_to', flags: '--links-to <id>', description: 'Link to task ID' },
      { field: 'notify_all', flags: '--notify-all', description: 'Notify all assignees' },
      { field: 'custom_fields', flags: '--custom-fields <json>', description: 'JSON custom fields' },
    ],
  },

  endpoint: { method: 'POST', path: '/list/{list_id}/task' },
  fieldMappings: {},

  handler: async (input, client) => {
    const { list_id, assignees, tags, custom_fields: cfJson, ...rest } = input;
    const body: Record<string, any> = { ...rest };

    if (assignees) {
      body.assignees = assignees.split(',').map((id: string) => Number(id.trim()));
    }
    if (tags) {
      body.tags = tags.split(',').map((t: string) => t.trim());
    }
    if (cfJson) {
      try {
        body.custom_fields = JSON.parse(cfJson);
      } catch {
        throw new Error('Invalid --custom-fields JSON. Expected: [{"id":"field_id","value":"val"}]');
      }
    }

    return client.post(`/list/${encodeURIComponent(list_id)}/task`, body);
  },
};

const updateCommand: CommandDefinition = {
  name: 'tasks_update',
  group: 'tasks',
  subcommand: 'update',
  description: 'Update an existing task.',
  examples: [
    'clickup tasks update <task_id> --name "Updated name"',
    'clickup tasks update --task-id abc123 --status "done" --priority 1',
  ],

  inputSchema: z.object({
    task_id: z.string().describe('Task ID'),
    name: z.string().optional().describe('Task name'),
    description: z.string().optional().describe('Description (plain text)'),
    markdown_description: z.string().optional().describe('Description (markdown)'),
    status: z.string().optional().describe('Status name'),
    priority: z.coerce.number().optional().describe('Priority (1-4)'),
    due_date: z.string().optional().describe('Due date (Unix ms)'),
    due_date_time: z.boolean().optional().describe('Due date includes time'),
    start_date: z.string().optional().describe('Start date (Unix ms)'),
    start_date_time: z.boolean().optional().describe('Start date includes time'),
    time_estimate: z.coerce.number().optional().describe('Time estimate (ms)'),
    parent: z.string().optional().describe('Parent task ID'),
    assignees_add: z.string().optional().describe('Comma-separated user IDs to add'),
    assignees_rem: z.string().optional().describe('Comma-separated user IDs to remove'),
    archived: z.boolean().optional().describe('Archive/unarchive task'),
  }),

  cliMappings: {
    args: [{ field: 'task_id', name: 'task_id', required: false }],
    options: [
      { field: 'task_id', flags: '--task-id <id>', description: 'Task ID (alternative to positional arg)' },
      { field: 'name', flags: '--name <name>', description: 'Task name' },
      { field: 'description', flags: '--description <text>', description: 'Description' },
      { field: 'markdown_description', flags: '--markdown-description <md>', description: 'Markdown description' },
      { field: 'status', flags: '--status <name>', description: 'Status name' },
      { field: 'priority', flags: '--priority <n>', description: 'Priority (1-4)' },
      { field: 'due_date', flags: '--due-date <ms>', description: 'Due date (Unix ms)' },
      { field: 'due_date_time', flags: '--due-date-time', description: 'Due date has time' },
      { field: 'start_date', flags: '--start-date <ms>', description: 'Start date (Unix ms)' },
      { field: 'start_date_time', flags: '--start-date-time', description: 'Start date has time' },
      { field: 'time_estimate', flags: '--time-estimate <ms>', description: 'Time estimate (ms)' },
      { field: 'parent', flags: '--parent <id>', description: 'Parent task ID' },
      { field: 'assignees_add', flags: '--assignees-add <ids>', description: 'Add assignees (comma-sep IDs)' },
      { field: 'assignees_rem', flags: '--assignees-rem <ids>', description: 'Remove assignees (comma-sep IDs)' },
      { field: 'archived', flags: '--archived', description: 'Archive task' },
    ],
  },

  endpoint: { method: 'PUT', path: '/task/{task_id}' },
  fieldMappings: {},

  handler: async (input, client) => {
    const { task_id, assignees_add, assignees_rem, ...rest } = input;
    const body: Record<string, any> = { ...rest };

    if (assignees_add || assignees_rem) {
      body.assignees = {
        add: assignees_add ? assignees_add.split(',').map((id: string) => Number(id.trim())) : [],
        rem: assignees_rem ? assignees_rem.split(',').map((id: string) => Number(id.trim())) : [],
      };
    }

    return client.put(`/task/${encodeURIComponent(task_id)}`, body);
  },
};

const deleteCommand: CommandDefinition = {
  name: 'tasks_delete',
  group: 'tasks',
  subcommand: 'delete',
  description: 'Delete a task.',
  examples: ['clickup tasks delete <task_id>', 'clickup tasks delete --task-id abc123'],

  inputSchema: z.object({
    task_id: z.string().describe('Task ID'),
  }),

  cliMappings: {
    args: [{ field: 'task_id', name: 'task_id', required: false }],
    options: [
      { field: 'task_id', flags: '--task-id <id>', description: 'Task ID (alternative to positional arg)' },
    ],
  },

  endpoint: { method: 'DELETE', path: '/task/{task_id}' },
  fieldMappings: { task_id: 'path' },

  handler: (input, client) => executeCommand(deleteCommand, input, client),
};

const filteredCommand: CommandDefinition = {
  name: 'tasks_filtered',
  group: 'tasks',
  subcommand: 'filtered',
  description: 'Get filtered tasks across an entire workspace (team).',
  examples: [
    'clickup tasks filtered --team-id 123',
    'clickup tasks filtered --team-id 123 --assignees "456" --statuses "in progress"',
  ],

  inputSchema: z.object({
    team_id: z.string().describe('Workspace (team) ID'),
    page: z.coerce.number().optional().describe('Page number (0-indexed)'),
    order_by: z.string().optional().describe('Order by: id, created, updated, due_date'),
    reverse: z.string().optional().describe('Reverse order (true/false)'),
    subtasks: z.string().optional().describe('Include subtasks (true/false)'),
    statuses: z.string().optional().describe('Comma-separated status names'),
    include_closed: z.string().optional().describe('Include closed (true/false)'),
    assignees: z.string().optional().describe('Comma-separated assignee IDs'),
    space_ids: z.string().optional().describe('Comma-separated space IDs'),
    project_ids: z.string().optional().describe('Comma-separated folder IDs'),
    list_ids: z.string().optional().describe('Comma-separated list IDs'),
    due_date_gt: z.string().optional().describe('Due after (Unix ms)'),
    due_date_lt: z.string().optional().describe('Due before (Unix ms)'),
    date_created_gt: z.string().optional().describe('Created after (Unix ms)'),
    date_created_lt: z.string().optional().describe('Created before (Unix ms)'),
    date_updated_gt: z.string().optional().describe('Updated after (Unix ms)'),
    date_updated_lt: z.string().optional().describe('Updated before (Unix ms)'),
  }),

  cliMappings: {
    options: [
      { field: 'team_id', flags: '--team-id <id>', description: 'Workspace ID' },
      { field: 'page', flags: '--page <n>', description: 'Page (0-indexed)' },
      { field: 'order_by', flags: '--order-by <field>', description: 'Order by field' },
      { field: 'reverse', flags: '--reverse <bool>', description: 'Reverse order' },
      { field: 'subtasks', flags: '--subtasks <bool>', description: 'Include subtasks' },
      { field: 'statuses', flags: '--statuses <names>', description: 'Comma-separated statuses' },
      { field: 'include_closed', flags: '--include-closed <bool>', description: 'Include closed' },
      { field: 'assignees', flags: '--assignees <ids>', description: 'Comma-separated assignee IDs' },
      { field: 'space_ids', flags: '--space-ids <ids>', description: 'Comma-separated space IDs' },
      { field: 'project_ids', flags: '--project-ids <ids>', description: 'Comma-separated folder IDs' },
      { field: 'list_ids', flags: '--list-ids <ids>', description: 'Comma-separated list IDs' },
      { field: 'due_date_gt', flags: '--due-date-gt <ms>', description: 'Due after (Unix ms)' },
      { field: 'due_date_lt', flags: '--due-date-lt <ms>', description: 'Due before (Unix ms)' },
      { field: 'date_created_gt', flags: '--date-created-gt <ms>', description: 'Created after (Unix ms)' },
      { field: 'date_created_lt', flags: '--date-created-lt <ms>', description: 'Created before (Unix ms)' },
      { field: 'date_updated_gt', flags: '--date-updated-gt <ms>', description: 'Updated after (Unix ms)' },
      { field: 'date_updated_lt', flags: '--date-updated-lt <ms>', description: 'Updated before (Unix ms)' },
    ],
  },

  endpoint: { method: 'GET', path: '/team/{team_id}/task' },
  fieldMappings: {},

  handler: async (input, client) => {
    const { team_id, statuses, assignees, space_ids, project_ids, list_ids, ...query } = input;
    const url = `/team/${encodeURIComponent(team_id)}/task`;

    let extra = '';
    if (statuses) extra += statuses.split(',').map((s: string) => `&statuses[]=${encodeURIComponent(s.trim())}`).join('');
    if (assignees) extra += assignees.split(',').map((a: string) => `&assignees[]=${encodeURIComponent(a.trim())}`).join('');
    if (space_ids) extra += space_ids.split(',').map((s: string) => `&space_ids[]=${encodeURIComponent(s.trim())}`).join('');
    if (project_ids) extra += project_ids.split(',').map((p: string) => `&project_ids[]=${encodeURIComponent(p.trim())}`).join('');
    if (list_ids) extra += list_ids.split(',').map((l: string) => `&list_ids[]=${encodeURIComponent(l.trim())}`).join('');

    if (extra) {
      const qs = Object.entries(query)
        .filter(([, v]) => v !== undefined)
        .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
        .join('&');
      return client.get(`${url}?${qs}${extra}`);
    }

    return client.get(url, query);
  },
};

const timeInStatusCommand: CommandDefinition = {
  name: 'tasks_time_in_status',
  group: 'tasks',
  subcommand: 'time-in-status',
  description: "Get a task's time spent in each status.",
  examples: ['clickup tasks time-in-status <task_id>'],

  inputSchema: z.object({
    task_id: z.string().describe('Task ID'),
  }),

  cliMappings: {
    args: [{ field: 'task_id', name: 'task_id', required: false }],
    options: [
      { field: 'task_id', flags: '--task-id <id>', description: 'Task ID (alternative to positional arg)' },
    ],
  },

  endpoint: { method: 'GET', path: '/task/{task_id}/time_in_status' },
  fieldMappings: { task_id: 'path' },

  handler: (input, client) => executeCommand(timeInStatusCommand, input, client),
};

export const allTasksCommands: CommandDefinition[] = [
  listCommand,
  getCommand,
  createCommand,
  updateCommand,
  deleteCommand,
  filteredCommand,
  timeInStatusCommand,
];
