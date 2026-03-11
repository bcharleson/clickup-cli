import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

const listCommand: CommandDefinition = {
  name: 'goals_list',
  group: 'goals',
  subcommand: 'list',
  description: 'Get all goals in a workspace.',
  examples: ['clickup goals list --team-id 123'],

  inputSchema: z.object({
    team_id: z.string().describe('Workspace (team) ID'),
    include_completed: z.string().optional().describe('Include completed (true/false)'),
  }),

  cliMappings: {
    options: [
      { field: 'team_id', flags: '--team-id <id>', description: 'Workspace ID' },
      { field: 'include_completed', flags: '--include-completed <bool>', description: 'Include completed' },
    ],
  },

  endpoint: { method: 'GET', path: '/team/{team_id}/goal' },
  fieldMappings: { team_id: 'path', include_completed: 'query' },

  handler: (input, client) => executeCommand(listCommand, input, client),
};

const getCommand: CommandDefinition = {
  name: 'goals_get',
  group: 'goals',
  subcommand: 'get',
  description: 'Get a goal by ID.',
  examples: ['clickup goals get <goal_id>'],

  inputSchema: z.object({
    goal_id: z.string().describe('Goal ID'),
  }),

  cliMappings: {
    args: [{ field: 'goal_id', name: 'goal_id', required: true }],
  },

  endpoint: { method: 'GET', path: '/goal/{goal_id}' },
  fieldMappings: { goal_id: 'path' },

  handler: (input, client) => executeCommand(getCommand, input, client),
};

const createCommand: CommandDefinition = {
  name: 'goals_create',
  group: 'goals',
  subcommand: 'create',
  description: 'Create a goal.',
  examples: ['clickup goals create --team-id 123 --name "Q1 Revenue" --due-date 1711929600000'],

  inputSchema: z.object({
    team_id: z.string().describe('Workspace (team) ID'),
    name: z.string().describe('Goal name'),
    due_date: z.string().optional().describe('Due date (Unix ms)'),
    description: z.string().optional().describe('Goal description'),
    multiple_owners: z.boolean().optional().describe('Allow multiple owners'),
    owners: z.string().optional().describe('Comma-separated owner user IDs'),
    color: z.string().optional().describe('Goal color hex'),
  }),

  cliMappings: {
    options: [
      { field: 'team_id', flags: '--team-id <id>', description: 'Workspace ID' },
      { field: 'name', flags: '--name <name>', description: 'Goal name' },
      { field: 'due_date', flags: '--due-date <ms>', description: 'Due date (Unix ms)' },
      { field: 'description', flags: '--description <text>', description: 'Description' },
      { field: 'multiple_owners', flags: '--multiple-owners', description: 'Allow multiple owners' },
      { field: 'owners', flags: '--owners <ids>', description: 'Comma-separated owner IDs' },
      { field: 'color', flags: '--color <hex>', description: 'Color hex' },
    ],
  },

  endpoint: { method: 'POST', path: '/team/{team_id}/goal' },
  fieldMappings: {},

  handler: async (input, client) => {
    const { team_id, owners, ...body } = input;
    const finalBody: Record<string, any> = { ...body };
    if (owners) {
      finalBody.owners = owners.split(',').map((id: string) => Number(id.trim()));
    }
    return client.post(`/team/${encodeURIComponent(team_id)}/goal`, finalBody);
  },
};

const updateCommand: CommandDefinition = {
  name: 'goals_update',
  group: 'goals',
  subcommand: 'update',
  description: 'Update a goal.',
  examples: ['clickup goals update <goal_id> --name "Updated Goal"'],

  inputSchema: z.object({
    goal_id: z.string().describe('Goal ID'),
    name: z.string().optional().describe('Goal name'),
    due_date: z.string().optional().describe('Due date (Unix ms)'),
    description: z.string().optional().describe('Description'),
    color: z.string().optional().describe('Color hex'),
    add_owners: z.string().optional().describe('Comma-separated owner IDs to add'),
    rem_owners: z.string().optional().describe('Comma-separated owner IDs to remove'),
  }),

  cliMappings: {
    args: [{ field: 'goal_id', name: 'goal_id', required: true }],
    options: [
      { field: 'name', flags: '--name <name>', description: 'Goal name' },
      { field: 'due_date', flags: '--due-date <ms>', description: 'Due date (Unix ms)' },
      { field: 'description', flags: '--description <text>', description: 'Description' },
      { field: 'color', flags: '--color <hex>', description: 'Color hex' },
      { field: 'add_owners', flags: '--add-owners <ids>', description: 'Add owner IDs' },
      { field: 'rem_owners', flags: '--rem-owners <ids>', description: 'Remove owner IDs' },
    ],
  },

  endpoint: { method: 'PUT', path: '/goal/{goal_id}' },
  fieldMappings: {},

  handler: async (input, client) => {
    const { goal_id, add_owners, rem_owners, ...body } = input;
    const finalBody: Record<string, any> = { ...body };
    if (add_owners) finalBody.add_owners = add_owners.split(',').map((id: string) => Number(id.trim()));
    if (rem_owners) finalBody.rem_owners = rem_owners.split(',').map((id: string) => Number(id.trim()));
    return client.put(`/goal/${encodeURIComponent(goal_id)}`, finalBody);
  },
};

const deleteCommand: CommandDefinition = {
  name: 'goals_delete',
  group: 'goals',
  subcommand: 'delete',
  description: 'Delete a goal.',
  examples: ['clickup goals delete <goal_id>'],

  inputSchema: z.object({
    goal_id: z.string().describe('Goal ID'),
  }),

  cliMappings: {
    args: [{ field: 'goal_id', name: 'goal_id', required: true }],
  },

  endpoint: { method: 'DELETE', path: '/goal/{goal_id}' },
  fieldMappings: { goal_id: 'path' },

  handler: (input, client) => executeCommand(deleteCommand, input, client),
};

const createKeyResultCommand: CommandDefinition = {
  name: 'goals_create_key_result',
  group: 'goals',
  subcommand: 'create-key-result',
  description: 'Create a key result (target) for a goal.',
  examples: ['clickup goals create-key-result --goal-id abc --name "Revenue $1M" --type number --steps-start 0 --steps-end 1000000'],

  inputSchema: z.object({
    goal_id: z.string().describe('Goal ID'),
    name: z.string().describe('Key result name'),
    owners: z.string().optional().describe('Comma-separated owner user IDs'),
    type: z.string().describe('Type: number, currency, boolean, percentage, automatic'),
    steps_start: z.coerce.number().optional().describe('Start value'),
    steps_end: z.coerce.number().optional().describe('End value'),
    unit: z.string().optional().describe('Unit label'),
    task_ids: z.string().optional().describe('Comma-separated task IDs (for automatic type)'),
    list_ids: z.string().optional().describe('Comma-separated list IDs (for automatic type)'),
  }),

  cliMappings: {
    options: [
      { field: 'goal_id', flags: '--goal-id <id>', description: 'Goal ID' },
      { field: 'name', flags: '--name <name>', description: 'Key result name' },
      { field: 'owners', flags: '--owners <ids>', description: 'Owner user IDs' },
      { field: 'type', flags: '--type <type>', description: 'Type (number, currency, boolean, percentage, automatic)' },
      { field: 'steps_start', flags: '--steps-start <n>', description: 'Start value' },
      { field: 'steps_end', flags: '--steps-end <n>', description: 'End value' },
      { field: 'unit', flags: '--unit <label>', description: 'Unit label' },
      { field: 'task_ids', flags: '--task-ids <ids>', description: 'Task IDs (automatic type)' },
      { field: 'list_ids', flags: '--list-ids <ids>', description: 'List IDs (automatic type)' },
    ],
  },

  endpoint: { method: 'POST', path: '/goal/{goal_id}/key_result' },
  fieldMappings: {},

  handler: async (input, client) => {
    const { goal_id, owners, task_ids, list_ids, ...body } = input;
    const finalBody: Record<string, any> = { ...body };
    if (owners) finalBody.owners = owners.split(',').map((id: string) => Number(id.trim()));
    if (task_ids) finalBody.task_ids = task_ids.split(',').map((id: string) => id.trim());
    if (list_ids) finalBody.list_ids = list_ids.split(',').map((id: string) => id.trim());
    return client.post(`/goal/${encodeURIComponent(goal_id)}/key_result`, finalBody);
  },
};

const updateKeyResultCommand: CommandDefinition = {
  name: 'goals_update_key_result',
  group: 'goals',
  subcommand: 'update-key-result',
  description: 'Update a key result.',
  examples: ['clickup goals update-key-result <key_result_id> --steps-current 500000'],

  inputSchema: z.object({
    key_result_id: z.string().describe('Key result ID'),
    steps_current: z.coerce.number().optional().describe('Current value'),
    note: z.string().optional().describe('Progress note'),
  }),

  cliMappings: {
    args: [{ field: 'key_result_id', name: 'key_result_id', required: true }],
    options: [
      { field: 'steps_current', flags: '--steps-current <n>', description: 'Current value' },
      { field: 'note', flags: '--note <text>', description: 'Progress note' },
    ],
  },

  endpoint: { method: 'PUT', path: '/key_result/{key_result_id}' },
  fieldMappings: { key_result_id: 'path', steps_current: 'body', note: 'body' },

  handler: (input, client) => executeCommand(updateKeyResultCommand, input, client),
};

const deleteKeyResultCommand: CommandDefinition = {
  name: 'goals_delete_key_result',
  group: 'goals',
  subcommand: 'delete-key-result',
  description: 'Delete a key result.',
  examples: ['clickup goals delete-key-result <key_result_id>'],

  inputSchema: z.object({
    key_result_id: z.string().describe('Key result ID'),
  }),

  cliMappings: {
    args: [{ field: 'key_result_id', name: 'key_result_id', required: true }],
  },

  endpoint: { method: 'DELETE', path: '/key_result/{key_result_id}' },
  fieldMappings: { key_result_id: 'path' },

  handler: (input, client) => executeCommand(deleteKeyResultCommand, input, client),
};

export const allGoalsCommands: CommandDefinition[] = [
  listCommand,
  getCommand,
  createCommand,
  updateCommand,
  deleteCommand,
  createKeyResultCommand,
  updateKeyResultCommand,
  deleteKeyResultCommand,
];
