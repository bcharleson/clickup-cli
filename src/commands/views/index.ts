import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

const listWorkspaceCommand: CommandDefinition = {
  name: 'views_list_workspace',
  group: 'views',
  subcommand: 'list-workspace',
  description: 'Get all views in a workspace.',
  examples: ['clickup views list-workspace --team-id 123'],

  inputSchema: z.object({
    team_id: z.string().describe('Workspace (team) ID'),
  }),

  cliMappings: {
    options: [{ field: 'team_id', flags: '--team-id <id>', description: 'Workspace ID' }],
  },

  endpoint: { method: 'GET', path: '/team/{team_id}/view' },
  fieldMappings: { team_id: 'path' },

  handler: (input, client) => executeCommand(listWorkspaceCommand, input, client),
};

const listSpaceCommand: CommandDefinition = {
  name: 'views_list_space',
  group: 'views',
  subcommand: 'list-space',
  description: 'Get all views in a space.',
  examples: ['clickup views list-space --space-id 123'],

  inputSchema: z.object({
    space_id: z.string().describe('Space ID'),
  }),

  cliMappings: {
    options: [{ field: 'space_id', flags: '--space-id <id>', description: 'Space ID' }],
  },

  endpoint: { method: 'GET', path: '/space/{space_id}/view' },
  fieldMappings: { space_id: 'path' },

  handler: (input, client) => executeCommand(listSpaceCommand, input, client),
};

const listFolderCommand: CommandDefinition = {
  name: 'views_list_folder',
  group: 'views',
  subcommand: 'list-folder',
  description: 'Get all views in a folder.',
  examples: ['clickup views list-folder --folder-id 123'],

  inputSchema: z.object({
    folder_id: z.string().describe('Folder ID'),
  }),

  cliMappings: {
    options: [{ field: 'folder_id', flags: '--folder-id <id>', description: 'Folder ID' }],
  },

  endpoint: { method: 'GET', path: '/folder/{folder_id}/view' },
  fieldMappings: { folder_id: 'path' },

  handler: (input, client) => executeCommand(listFolderCommand, input, client),
};

const listListCommand: CommandDefinition = {
  name: 'views_list_list',
  group: 'views',
  subcommand: 'list-list',
  description: 'Get all views in a list.',
  examples: ['clickup views list-list --list-id 123'],

  inputSchema: z.object({
    list_id: z.string().describe('List ID'),
  }),

  cliMappings: {
    options: [{ field: 'list_id', flags: '--list-id <id>', description: 'List ID' }],
  },

  endpoint: { method: 'GET', path: '/list/{list_id}/view' },
  fieldMappings: { list_id: 'path' },

  handler: (input, client) => executeCommand(listListCommand, input, client),
};

const getCommand: CommandDefinition = {
  name: 'views_get',
  group: 'views',
  subcommand: 'get',
  description: 'Get a view by ID.',
  examples: ['clickup views get <view_id>'],

  inputSchema: z.object({
    view_id: z.string().describe('View ID'),
  }),

  cliMappings: {
    args: [{ field: 'view_id', name: 'view_id', required: true }],
  },

  endpoint: { method: 'GET', path: '/view/{view_id}' },
  fieldMappings: { view_id: 'path' },

  handler: (input, client) => executeCommand(getCommand, input, client),
};

const getTasksCommand: CommandDefinition = {
  name: 'views_tasks',
  group: 'views',
  subcommand: 'tasks',
  description: 'Get tasks visible in a view.',
  examples: ['clickup views tasks <view_id>'],

  inputSchema: z.object({
    view_id: z.string().describe('View ID'),
    page: z.coerce.number().optional().describe('Page number (0-indexed)'),
  }),

  cliMappings: {
    args: [{ field: 'view_id', name: 'view_id', required: true }],
    options: [{ field: 'page', flags: '--page <n>', description: 'Page (0-indexed)' }],
  },

  endpoint: { method: 'GET', path: '/view/{view_id}/task' },
  fieldMappings: { view_id: 'path', page: 'query' },

  handler: (input, client) => executeCommand(getTasksCommand, input, client),
};

const deleteCommand: CommandDefinition = {
  name: 'views_delete',
  group: 'views',
  subcommand: 'delete',
  description: 'Delete a view.',
  examples: ['clickup views delete <view_id>'],

  inputSchema: z.object({
    view_id: z.string().describe('View ID'),
  }),

  cliMappings: {
    args: [{ field: 'view_id', name: 'view_id', required: true }],
  },

  endpoint: { method: 'DELETE', path: '/view/{view_id}' },
  fieldMappings: { view_id: 'path' },

  handler: (input, client) => executeCommand(deleteCommand, input, client),
};

export const allViewsCommands: CommandDefinition[] = [
  listWorkspaceCommand,
  listSpaceCommand,
  listFolderCommand,
  listListCommand,
  getCommand,
  getTasksCommand,
  deleteCommand,
];
