import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

const inviteCommand: CommandDefinition = {
  name: 'guests_invite',
  group: 'guests',
  subcommand: 'invite',
  description: 'Invite a guest to a workspace.',
  examples: ['clickup guests invite --team-id 123 --email "guest@example.com"'],

  inputSchema: z.object({
    team_id: z.string().describe('Workspace (team) ID'),
    email: z.string().describe('Guest email'),
    can_edit_tags: z.boolean().optional().describe('Can edit tags'),
    can_see_time_spent: z.boolean().optional().describe('Can see time spent'),
    can_see_time_estimated: z.boolean().optional().describe('Can see time estimated'),
  }),

  cliMappings: {
    options: [
      { field: 'team_id', flags: '--team-id <id>', description: 'Workspace ID' },
      { field: 'email', flags: '--email <email>', description: 'Guest email' },
      { field: 'can_edit_tags', flags: '--can-edit-tags', description: 'Can edit tags' },
      { field: 'can_see_time_spent', flags: '--can-see-time-spent', description: 'Can see time spent' },
      { field: 'can_see_time_estimated', flags: '--can-see-time-estimated', description: 'Can see time estimated' },
    ],
  },

  endpoint: { method: 'POST', path: '/team/{team_id}/guest' },
  fieldMappings: { team_id: 'path', email: 'body', can_edit_tags: 'body', can_see_time_spent: 'body', can_see_time_estimated: 'body' },

  handler: (input, client) => executeCommand(inviteCommand, input, client),
};

const getCommand: CommandDefinition = {
  name: 'guests_get',
  group: 'guests',
  subcommand: 'get',
  description: 'Get a guest in a workspace.',
  examples: ['clickup guests get --team-id 123 --guest-id 456'],

  inputSchema: z.object({
    team_id: z.string().describe('Workspace (team) ID'),
    guest_id: z.string().describe('Guest ID'),
  }),

  cliMappings: {
    options: [
      { field: 'team_id', flags: '--team-id <id>', description: 'Workspace ID' },
      { field: 'guest_id', flags: '--guest-id <id>', description: 'Guest ID' },
    ],
  },

  endpoint: { method: 'GET', path: '/team/{team_id}/guest/{guest_id}' },
  fieldMappings: { team_id: 'path', guest_id: 'path' },

  handler: (input, client) => executeCommand(getCommand, input, client),
};

const updateCommand: CommandDefinition = {
  name: 'guests_update',
  group: 'guests',
  subcommand: 'update',
  description: 'Update a guest in a workspace.',
  examples: ['clickup guests update --team-id 123 --guest-id 456 --can-edit-tags true'],

  inputSchema: z.object({
    team_id: z.string().describe('Workspace (team) ID'),
    guest_id: z.string().describe('Guest ID'),
    username: z.string().optional().describe('Guest username'),
    can_edit_tags: z.boolean().optional().describe('Can edit tags'),
    can_see_time_spent: z.boolean().optional().describe('Can see time spent'),
    can_see_time_estimated: z.boolean().optional().describe('Can see time estimated'),
  }),

  cliMappings: {
    options: [
      { field: 'team_id', flags: '--team-id <id>', description: 'Workspace ID' },
      { field: 'guest_id', flags: '--guest-id <id>', description: 'Guest ID' },
      { field: 'username', flags: '--username <name>', description: 'Username' },
      { field: 'can_edit_tags', flags: '--can-edit-tags', description: 'Can edit tags' },
      { field: 'can_see_time_spent', flags: '--can-see-time-spent', description: 'Can see time spent' },
      { field: 'can_see_time_estimated', flags: '--can-see-time-estimated', description: 'Can see time estimated' },
    ],
  },

  endpoint: { method: 'PUT', path: '/team/{team_id}/guest/{guest_id}' },
  fieldMappings: { team_id: 'path', guest_id: 'path', username: 'body', can_edit_tags: 'body', can_see_time_spent: 'body', can_see_time_estimated: 'body' },

  handler: (input, client) => executeCommand(updateCommand, input, client),
};

const removeCommand: CommandDefinition = {
  name: 'guests_remove',
  group: 'guests',
  subcommand: 'remove',
  description: 'Remove a guest from a workspace.',
  examples: ['clickup guests remove --team-id 123 --guest-id 456'],

  inputSchema: z.object({
    team_id: z.string().describe('Workspace (team) ID'),
    guest_id: z.string().describe('Guest ID'),
  }),

  cliMappings: {
    options: [
      { field: 'team_id', flags: '--team-id <id>', description: 'Workspace ID' },
      { field: 'guest_id', flags: '--guest-id <id>', description: 'Guest ID' },
    ],
  },

  endpoint: { method: 'DELETE', path: '/team/{team_id}/guest/{guest_id}' },
  fieldMappings: { team_id: 'path', guest_id: 'path' },

  handler: (input, client) => executeCommand(removeCommand, input, client),
};

const addToTaskCommand: CommandDefinition = {
  name: 'guests_add_to_task',
  group: 'guests',
  subcommand: 'add-to-task',
  description: 'Add a guest to a task.',
  examples: ['clickup guests add-to-task --task-id abc --guest-id 456'],

  inputSchema: z.object({
    task_id: z.string().describe('Task ID'),
    guest_id: z.string().describe('Guest ID'),
    permission_level: z.string().optional().describe('Permission: read, comment, edit, create'),
  }),

  cliMappings: {
    options: [
      { field: 'task_id', flags: '--task-id <id>', description: 'Task ID' },
      { field: 'guest_id', flags: '--guest-id <id>', description: 'Guest ID' },
      { field: 'permission_level', flags: '--permission <level>', description: 'Permission level' },
    ],
  },

  endpoint: { method: 'POST', path: '/task/{task_id}/guest/{guest_id}' },
  fieldMappings: { task_id: 'path', guest_id: 'path', permission_level: 'body' },

  handler: (input, client) => executeCommand(addToTaskCommand, input, client),
};

const removeFromTaskCommand: CommandDefinition = {
  name: 'guests_remove_from_task',
  group: 'guests',
  subcommand: 'remove-from-task',
  description: 'Remove a guest from a task.',
  examples: ['clickup guests remove-from-task --task-id abc --guest-id 456'],

  inputSchema: z.object({
    task_id: z.string().describe('Task ID'),
    guest_id: z.string().describe('Guest ID'),
  }),

  cliMappings: {
    options: [
      { field: 'task_id', flags: '--task-id <id>', description: 'Task ID' },
      { field: 'guest_id', flags: '--guest-id <id>', description: 'Guest ID' },
    ],
  },

  endpoint: { method: 'DELETE', path: '/task/{task_id}/guest/{guest_id}' },
  fieldMappings: { task_id: 'path', guest_id: 'path' },

  handler: (input, client) => executeCommand(removeFromTaskCommand, input, client),
};

export const allGuestsCommands: CommandDefinition[] = [
  inviteCommand,
  getCommand,
  updateCommand,
  removeCommand,
  addToTaskCommand,
  removeFromTaskCommand,
];
