import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

const WEBHOOK_EVENTS = [
  'taskCreated', 'taskUpdated', 'taskDeleted', 'taskPriorityUpdated',
  'taskStatusUpdated', 'taskAssigneeUpdated', 'taskDueDateUpdated',
  'taskTagUpdated', 'taskMoved', 'taskCommentPosted', 'taskCommentUpdated',
  'taskTimeEstimateUpdated', 'taskTimeTrackedUpdated',
  'listCreated', 'listUpdated', 'listDeleted',
  'folderCreated', 'folderUpdated', 'folderDeleted',
  'spaceCreated', 'spaceUpdated', 'spaceDeleted',
  'goalCreated', 'goalUpdated', 'goalDeleted',
  'keyResultCreated', 'keyResultUpdated', 'keyResultDeleted',
].join(', ');

const listCommand: CommandDefinition = {
  name: 'webhooks_list',
  group: 'webhooks',
  subcommand: 'list',
  description: 'Get all webhooks in a workspace.',
  examples: ['clickup webhooks list --team-id 123'],

  inputSchema: z.object({
    team_id: z.string().describe('Workspace (team) ID'),
  }),

  cliMappings: {
    options: [{ field: 'team_id', flags: '--team-id <id>', description: 'Workspace ID' }],
  },

  endpoint: { method: 'GET', path: '/team/{team_id}/webhook' },
  fieldMappings: { team_id: 'path' },

  handler: (input, client) => executeCommand(listCommand, input, client),
};

const createCommand: CommandDefinition = {
  name: 'webhooks_create',
  group: 'webhooks',
  subcommand: 'create',
  description: `Create a webhook. Events: ${WEBHOOK_EVENTS}`,
  examples: [
    'clickup webhooks create --team-id 123 --endpoint "https://example.com/hook" --events "taskCreated,taskUpdated"',
  ],

  inputSchema: z.object({
    team_id: z.string().describe('Workspace (team) ID'),
    endpoint: z.string().describe('Webhook URL'),
    events: z.string().describe('Comma-separated event names'),
    space_id: z.string().optional().describe('Filter to space ID'),
    folder_id: z.string().optional().describe('Filter to folder ID'),
    list_id: z.string().optional().describe('Filter to list ID'),
    task_id: z.string().optional().describe('Filter to task ID'),
  }),

  cliMappings: {
    options: [
      { field: 'team_id', flags: '--team-id <id>', description: 'Workspace ID' },
      { field: 'endpoint', flags: '--endpoint <url>', description: 'Webhook URL' },
      { field: 'events', flags: '--events <list>', description: 'Comma-separated events' },
      { field: 'space_id', flags: '--space-id <id>', description: 'Filter to space' },
      { field: 'folder_id', flags: '--folder-id <id>', description: 'Filter to folder' },
      { field: 'list_id', flags: '--list-id <id>', description: 'Filter to list' },
      { field: 'task_id', flags: '--task-id <id>', description: 'Filter to task' },
    ],
  },

  endpoint: { method: 'POST', path: '/team/{team_id}/webhook' },
  fieldMappings: {},

  handler: async (input, client) => {
    const { team_id, events, ...body } = input;
    return client.post(`/team/${encodeURIComponent(team_id)}/webhook`, {
      ...body,
      events: events.split(',').map((e: string) => e.trim()),
    });
  },
};

const updateCommand: CommandDefinition = {
  name: 'webhooks_update',
  group: 'webhooks',
  subcommand: 'update',
  description: 'Update a webhook.',
  examples: ['clickup webhooks update <webhook_id> --endpoint "https://example.com/new" --events "taskCreated" --status "active"'],

  inputSchema: z.object({
    webhook_id: z.string().describe('Webhook ID'),
    endpoint: z.string().optional().describe('New webhook URL'),
    events: z.string().optional().describe('Comma-separated events (replaces all)'),
    status: z.string().optional().describe('Status: active or inactive'),
  }),

  cliMappings: {
    args: [{ field: 'webhook_id', name: 'webhook_id', required: true }],
    options: [
      { field: 'endpoint', flags: '--endpoint <url>', description: 'Webhook URL' },
      { field: 'events', flags: '--events <list>', description: 'Comma-separated events' },
      { field: 'status', flags: '--status <active|inactive>', description: 'Status' },
    ],
  },

  endpoint: { method: 'PUT', path: '/webhook/{webhook_id}' },
  fieldMappings: {},

  handler: async (input, client) => {
    const { webhook_id, events, ...body } = input;
    const finalBody: Record<string, any> = { ...body };
    if (events) finalBody.events = events.split(',').map((e: string) => e.trim());
    return client.put(`/webhook/${encodeURIComponent(webhook_id)}`, finalBody);
  },
};

const deleteCommand: CommandDefinition = {
  name: 'webhooks_delete',
  group: 'webhooks',
  subcommand: 'delete',
  description: 'Delete a webhook.',
  examples: ['clickup webhooks delete <webhook_id>'],

  inputSchema: z.object({
    webhook_id: z.string().describe('Webhook ID'),
  }),

  cliMappings: {
    args: [{ field: 'webhook_id', name: 'webhook_id', required: true }],
  },

  endpoint: { method: 'DELETE', path: '/webhook/{webhook_id}' },
  fieldMappings: { webhook_id: 'path' },

  handler: (input, client) => executeCommand(deleteCommand, input, client),
};

export const allWebhooksCommands: CommandDefinition[] = [
  listCommand,
  createCommand,
  updateCommand,
  deleteCommand,
];
