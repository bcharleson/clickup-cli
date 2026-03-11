import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

const listCommand: CommandDefinition = {
  name: 'time_tracking_list',
  group: 'time-tracking',
  subcommand: 'list',
  description: 'Get time entries in a workspace (defaults to last 30 days).',
  examples: [
    'clickup time-tracking list --team-id 123',
    'clickup time-tracking list --team-id 123 --start-date 1704067200000 --end-date 1706745600000',
  ],

  inputSchema: z.object({
    team_id: z.string().describe('Workspace (team) ID'),
    start_date: z.string().optional().describe('Start date (Unix ms)'),
    end_date: z.string().optional().describe('End date (Unix ms)'),
    assignee: z.string().optional().describe('Comma-separated user IDs'),
    include_task_tags: z.string().optional().describe('Include task tags (true/false)'),
    include_location_names: z.string().optional().describe('Include location names (true/false)'),
    space_id: z.string().optional().describe('Filter by space ID'),
    folder_id: z.string().optional().describe('Filter by folder ID'),
    list_id: z.string().optional().describe('Filter by list ID'),
    task_id: z.string().optional().describe('Filter by task ID'),
  }),

  cliMappings: {
    options: [
      { field: 'team_id', flags: '--team-id <id>', description: 'Workspace ID' },
      { field: 'start_date', flags: '--start-date <ms>', description: 'Start date (Unix ms)' },
      { field: 'end_date', flags: '--end-date <ms>', description: 'End date (Unix ms)' },
      { field: 'assignee', flags: '--assignee <ids>', description: 'Comma-separated user IDs' },
      { field: 'include_task_tags', flags: '--include-task-tags <bool>', description: 'Include task tags' },
      { field: 'include_location_names', flags: '--include-location-names <bool>', description: 'Include location names' },
      { field: 'space_id', flags: '--space-id <id>', description: 'Filter by space' },
      { field: 'folder_id', flags: '--folder-id <id>', description: 'Filter by folder' },
      { field: 'list_id', flags: '--list-id <id>', description: 'Filter by list' },
      { field: 'task_id', flags: '--task-id <id>', description: 'Filter by task' },
    ],
  },

  endpoint: { method: 'GET', path: '/team/{team_id}/time_entries' },
  fieldMappings: {
    team_id: 'path',
    start_date: 'query', end_date: 'query', assignee: 'query',
    include_task_tags: 'query', include_location_names: 'query',
    space_id: 'query', folder_id: 'query', list_id: 'query', task_id: 'query',
  },

  handler: (input, client) => executeCommand(listCommand, input, client),
};

const getCommand: CommandDefinition = {
  name: 'time_tracking_get',
  group: 'time-tracking',
  subcommand: 'get',
  description: 'Get a single time entry.',
  examples: ['clickup time-tracking get --team-id 123 --timer-id 456'],

  inputSchema: z.object({
    team_id: z.string().describe('Workspace (team) ID'),
    timer_id: z.string().describe('Time entry ID'),
  }),

  cliMappings: {
    options: [
      { field: 'team_id', flags: '--team-id <id>', description: 'Workspace ID' },
      { field: 'timer_id', flags: '--timer-id <id>', description: 'Time entry ID' },
    ],
  },

  endpoint: { method: 'GET', path: '/team/{team_id}/time_entries/{timer_id}' },
  fieldMappings: { team_id: 'path', timer_id: 'path' },

  handler: (input, client) => executeCommand(getCommand, input, client),
};

const createCommand: CommandDefinition = {
  name: 'time_tracking_create',
  group: 'time-tracking',
  subcommand: 'create',
  description: 'Create a time entry.',
  examples: ['clickup time-tracking create --team-id 123 --task-id abc --duration 3600000 --description "Bug fix"'],

  inputSchema: z.object({
    team_id: z.string().describe('Workspace (team) ID'),
    task_id: z.string().optional().describe('Task ID (optional for standalone entries)'),
    description: z.string().optional().describe('Time entry description'),
    start: z.string().describe('Start time (Unix ms)'),
    duration: z.coerce.number().describe('Duration in milliseconds'),
    assignee: z.coerce.number().optional().describe('User ID'),
    billable: z.boolean().optional().describe('Billable entry'),
    tags: z.string().optional().describe('JSON array of tag objects'),
  }),

  cliMappings: {
    options: [
      { field: 'team_id', flags: '--team-id <id>', description: 'Workspace ID' },
      { field: 'task_id', flags: '--task-id <id>', description: 'Task ID' },
      { field: 'description', flags: '--description <text>', description: 'Description' },
      { field: 'start', flags: '--start <ms>', description: 'Start time (Unix ms)' },
      { field: 'duration', flags: '--duration <ms>', description: 'Duration (ms)' },
      { field: 'assignee', flags: '--assignee <id>', description: 'User ID' },
      { field: 'billable', flags: '--billable', description: 'Billable' },
      { field: 'tags', flags: '--tags <json>', description: 'JSON tags array' },
    ],
  },

  endpoint: { method: 'POST', path: '/team/{team_id}/time_entries' },
  fieldMappings: {},

  handler: async (input, client) => {
    const { team_id, tags: tagsJson, ...body } = input;
    const finalBody: Record<string, any> = { ...body };
    if (tagsJson) {
      try {
        finalBody.tags = JSON.parse(tagsJson);
      } catch {
        throw new Error('Invalid --tags JSON');
      }
    }
    return client.post(`/team/${encodeURIComponent(team_id)}/time_entries`, finalBody);
  },
};

const updateCommand: CommandDefinition = {
  name: 'time_tracking_update',
  group: 'time-tracking',
  subcommand: 'update',
  description: 'Update a time entry.',
  examples: ['clickup time-tracking update --team-id 123 --timer-id 456 --duration 7200000'],

  inputSchema: z.object({
    team_id: z.string().describe('Workspace (team) ID'),
    timer_id: z.string().describe('Time entry ID'),
    description: z.string().optional().describe('Description'),
    start: z.string().optional().describe('Start time (Unix ms)'),
    duration: z.coerce.number().optional().describe('Duration (ms)'),
    assignee: z.coerce.number().optional().describe('User ID'),
    billable: z.boolean().optional().describe('Billable'),
    tag_action: z.string().optional().describe('Tag action: add or remove'),
    tags: z.string().optional().describe('JSON tags array'),
  }),

  cliMappings: {
    options: [
      { field: 'team_id', flags: '--team-id <id>', description: 'Workspace ID' },
      { field: 'timer_id', flags: '--timer-id <id>', description: 'Time entry ID' },
      { field: 'description', flags: '--description <text>', description: 'Description' },
      { field: 'start', flags: '--start <ms>', description: 'Start time (Unix ms)' },
      { field: 'duration', flags: '--duration <ms>', description: 'Duration (ms)' },
      { field: 'assignee', flags: '--assignee <id>', description: 'User ID' },
      { field: 'billable', flags: '--billable', description: 'Billable' },
      { field: 'tag_action', flags: '--tag-action <action>', description: 'Tag action (add/remove)' },
      { field: 'tags', flags: '--tags <json>', description: 'JSON tags array' },
    ],
  },

  endpoint: { method: 'PUT', path: '/team/{team_id}/time_entries/{timer_id}' },
  fieldMappings: {},

  handler: async (input, client) => {
    const { team_id, timer_id, tags: tagsJson, ...body } = input;
    const finalBody: Record<string, any> = { ...body };
    if (tagsJson) {
      try {
        finalBody.tags = JSON.parse(tagsJson);
      } catch {
        throw new Error('Invalid --tags JSON');
      }
    }
    return client.put(`/team/${encodeURIComponent(team_id)}/time_entries/${encodeURIComponent(timer_id)}`, finalBody);
  },
};

const deleteCommand: CommandDefinition = {
  name: 'time_tracking_delete',
  group: 'time-tracking',
  subcommand: 'delete',
  description: 'Delete a time entry.',
  examples: ['clickup time-tracking delete --team-id 123 --timer-id 456'],

  inputSchema: z.object({
    team_id: z.string().describe('Workspace (team) ID'),
    timer_id: z.string().describe('Time entry ID'),
  }),

  cliMappings: {
    options: [
      { field: 'team_id', flags: '--team-id <id>', description: 'Workspace ID' },
      { field: 'timer_id', flags: '--timer-id <id>', description: 'Time entry ID' },
    ],
  },

  endpoint: { method: 'DELETE', path: '/team/{team_id}/time_entries/{timer_id}' },
  fieldMappings: { team_id: 'path', timer_id: 'path' },

  handler: (input, client) => executeCommand(deleteCommand, input, client),
};

const currentCommand: CommandDefinition = {
  name: 'time_tracking_current',
  group: 'time-tracking',
  subcommand: 'current',
  description: 'Get the currently running time entry.',
  examples: ['clickup time-tracking current --team-id 123'],

  inputSchema: z.object({
    team_id: z.string().describe('Workspace (team) ID'),
    assignee: z.coerce.number().optional().describe('User ID'),
  }),

  cliMappings: {
    options: [
      { field: 'team_id', flags: '--team-id <id>', description: 'Workspace ID' },
      { field: 'assignee', flags: '--assignee <id>', description: 'User ID' },
    ],
  },

  endpoint: { method: 'GET', path: '/team/{team_id}/time_entries/current' },
  fieldMappings: { team_id: 'path', assignee: 'query' },

  handler: (input, client) => executeCommand(currentCommand, input, client),
};

const startCommand: CommandDefinition = {
  name: 'time_tracking_start',
  group: 'time-tracking',
  subcommand: 'start',
  description: 'Start a timer.',
  examples: ['clickup time-tracking start --team-id 123 --task-id abc'],

  inputSchema: z.object({
    team_id: z.string().describe('Workspace (team) ID'),
    task_id: z.string().describe('Task ID'),
    description: z.string().optional().describe('Description'),
    billable: z.boolean().optional().describe('Billable'),
  }),

  cliMappings: {
    options: [
      { field: 'team_id', flags: '--team-id <id>', description: 'Workspace ID' },
      { field: 'task_id', flags: '--task-id <id>', description: 'Task ID' },
      { field: 'description', flags: '--description <text>', description: 'Description' },
      { field: 'billable', flags: '--billable', description: 'Billable' },
    ],
  },

  endpoint: { method: 'POST', path: '/team/{team_id}/time_entries/start' },
  fieldMappings: { team_id: 'path', task_id: 'body', description: 'body', billable: 'body' },

  handler: (input, client) => {
    const { team_id, ...body } = input;
    return client.post(`/team/${encodeURIComponent(team_id)}/time_entries/start`, body);
  },
};

const stopCommand: CommandDefinition = {
  name: 'time_tracking_stop',
  group: 'time-tracking',
  subcommand: 'stop',
  description: 'Stop the running timer.',
  examples: ['clickup time-tracking stop --team-id 123'],

  inputSchema: z.object({
    team_id: z.string().describe('Workspace (team) ID'),
  }),

  cliMappings: {
    options: [{ field: 'team_id', flags: '--team-id <id>', description: 'Workspace ID' }],
  },

  endpoint: { method: 'POST', path: '/team/{team_id}/time_entries/stop' },
  fieldMappings: { team_id: 'path' },

  handler: (input, client) => client.post(`/team/${encodeURIComponent(input.team_id)}/time_entries/stop`),
};

const historyCommand: CommandDefinition = {
  name: 'time_tracking_history',
  group: 'time-tracking',
  subcommand: 'history',
  description: 'Get time entry change history.',
  examples: ['clickup time-tracking history --team-id 123 --timer-id 456'],

  inputSchema: z.object({
    team_id: z.string().describe('Workspace (team) ID'),
    timer_id: z.string().describe('Time entry ID'),
  }),

  cliMappings: {
    options: [
      { field: 'team_id', flags: '--team-id <id>', description: 'Workspace ID' },
      { field: 'timer_id', flags: '--timer-id <id>', description: 'Time entry ID' },
    ],
  },

  endpoint: { method: 'GET', path: '/team/{team_id}/time_entries/{timer_id}/history' },
  fieldMappings: { team_id: 'path', timer_id: 'path' },

  handler: (input, client) => executeCommand(historyCommand, input, client),
};

export const allTimeTrackingCommands: CommandDefinition[] = [
  listCommand,
  getCommand,
  createCommand,
  updateCommand,
  deleteCommand,
  currentCommand,
  startCommand,
  stopCommand,
  historyCommand,
];
