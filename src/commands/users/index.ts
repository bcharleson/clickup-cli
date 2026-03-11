import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

const getMeCommand: CommandDefinition = {
  name: 'users_me',
  group: 'users',
  subcommand: 'me',
  description: 'Get the authenticated user.',
  examples: ['clickup users me'],

  inputSchema: z.object({}),
  cliMappings: {},
  endpoint: { method: 'GET', path: '/user' },
  fieldMappings: {},

  handler: (input, client) => executeCommand(getMeCommand, input, client),
};

const getCommand: CommandDefinition = {
  name: 'users_get',
  group: 'users',
  subcommand: 'get',
  description: 'Get a user in a workspace.',
  examples: ['clickup users get --team-id 123 --user-id 456'],

  inputSchema: z.object({
    team_id: z.string().describe('Workspace (team) ID'),
    user_id: z.string().describe('User ID'),
  }),

  cliMappings: {
    options: [
      { field: 'team_id', flags: '--team-id <id>', description: 'Workspace ID' },
      { field: 'user_id', flags: '--user-id <id>', description: 'User ID' },
    ],
  },

  endpoint: { method: 'GET', path: '/team/{team_id}/user/{user_id}' },
  fieldMappings: { team_id: 'path', user_id: 'path' },

  handler: (input, client) => executeCommand(getCommand, input, client),
};

const inviteCommand: CommandDefinition = {
  name: 'users_invite',
  group: 'users',
  subcommand: 'invite',
  description: 'Invite a user to a workspace.',
  examples: ['clickup users invite --team-id 123 --email "user@example.com" --admin false'],

  inputSchema: z.object({
    team_id: z.string().describe('Workspace (team) ID'),
    email: z.string().describe('User email'),
    admin: z.boolean().optional().describe('Grant admin role'),
    custom_role_id: z.coerce.number().optional().describe('Custom role ID'),
  }),

  cliMappings: {
    options: [
      { field: 'team_id', flags: '--team-id <id>', description: 'Workspace ID' },
      { field: 'email', flags: '--email <email>', description: 'User email' },
      { field: 'admin', flags: '--admin', description: 'Grant admin role' },
      { field: 'custom_role_id', flags: '--custom-role-id <id>', description: 'Custom role ID' },
    ],
  },

  endpoint: { method: 'POST', path: '/team/{team_id}/user' },
  fieldMappings: { team_id: 'path', email: 'body', admin: 'body', custom_role_id: 'body' },

  handler: (input, client) => executeCommand(inviteCommand, input, client),
};

const updateCommand: CommandDefinition = {
  name: 'users_update',
  group: 'users',
  subcommand: 'update',
  description: 'Update a user role in a workspace.',
  examples: ['clickup users update --team-id 123 --user-id 456 --admin true'],

  inputSchema: z.object({
    team_id: z.string().describe('Workspace (team) ID'),
    user_id: z.string().describe('User ID'),
    username: z.string().optional().describe('New username'),
    admin: z.boolean().optional().describe('Grant/revoke admin'),
    custom_role_id: z.coerce.number().optional().describe('Custom role ID'),
  }),

  cliMappings: {
    options: [
      { field: 'team_id', flags: '--team-id <id>', description: 'Workspace ID' },
      { field: 'user_id', flags: '--user-id <id>', description: 'User ID' },
      { field: 'username', flags: '--username <name>', description: 'Username' },
      { field: 'admin', flags: '--admin', description: 'Admin role' },
      { field: 'custom_role_id', flags: '--custom-role-id <id>', description: 'Custom role ID' },
    ],
  },

  endpoint: { method: 'PUT', path: '/team/{team_id}/user/{user_id}' },
  fieldMappings: { team_id: 'path', user_id: 'path', username: 'body', admin: 'body', custom_role_id: 'body' },

  handler: (input, client) => executeCommand(updateCommand, input, client),
};

const removeCommand: CommandDefinition = {
  name: 'users_remove',
  group: 'users',
  subcommand: 'remove',
  description: 'Remove a user from a workspace.',
  examples: ['clickup users remove --team-id 123 --user-id 456'],

  inputSchema: z.object({
    team_id: z.string().describe('Workspace (team) ID'),
    user_id: z.string().describe('User ID'),
  }),

  cliMappings: {
    options: [
      { field: 'team_id', flags: '--team-id <id>', description: 'Workspace ID' },
      { field: 'user_id', flags: '--user-id <id>', description: 'User ID' },
    ],
  },

  endpoint: { method: 'DELETE', path: '/team/{team_id}/user/{user_id}' },
  fieldMappings: { team_id: 'path', user_id: 'path' },

  handler: (input, client) => executeCommand(removeCommand, input, client),
};

export const allUsersCommands: CommandDefinition[] = [
  getMeCommand,
  getCommand,
  inviteCommand,
  updateCommand,
  removeCommand,
];
