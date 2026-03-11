import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

const listCommand: CommandDefinition = {
  name: 'folders_list',
  group: 'folders',
  subcommand: 'list',
  description: 'Get all folders in a space.',
  examples: ['clickup folders list --space-id 123'],

  inputSchema: z.object({
    space_id: z.string().describe('Space ID'),
    archived: z.string().optional().describe('Include archived (true/false)'),
  }),

  cliMappings: {
    options: [
      { field: 'space_id', flags: '--space-id <id>', description: 'Space ID' },
      { field: 'archived', flags: '--archived <bool>', description: 'Include archived' },
    ],
  },

  endpoint: { method: 'GET', path: '/space/{space_id}/folder' },
  fieldMappings: { space_id: 'path', archived: 'query' },

  handler: (input, client) => executeCommand(listCommand, input, client),
};

const getCommand: CommandDefinition = {
  name: 'folders_get',
  group: 'folders',
  subcommand: 'get',
  description: 'Get a folder by ID.',
  examples: ['clickup folders get <folder_id>'],

  inputSchema: z.object({
    folder_id: z.string().describe('Folder ID'),
  }),

  cliMappings: {
    args: [{ field: 'folder_id', name: 'folder_id', required: true }],
  },

  endpoint: { method: 'GET', path: '/folder/{folder_id}' },
  fieldMappings: { folder_id: 'path' },

  handler: (input, client) => executeCommand(getCommand, input, client),
};

const createCommand: CommandDefinition = {
  name: 'folders_create',
  group: 'folders',
  subcommand: 'create',
  description: 'Create a folder in a space.',
  examples: ['clickup folders create --space-id 123 --name "Sprint 1"'],

  inputSchema: z.object({
    space_id: z.string().describe('Space ID'),
    name: z.string().describe('Folder name'),
  }),

  cliMappings: {
    options: [
      { field: 'space_id', flags: '--space-id <id>', description: 'Space ID' },
      { field: 'name', flags: '--name <name>', description: 'Folder name' },
    ],
  },

  endpoint: { method: 'POST', path: '/space/{space_id}/folder' },
  fieldMappings: { space_id: 'path', name: 'body' },

  handler: (input, client) => executeCommand(createCommand, input, client),
};

const updateCommand: CommandDefinition = {
  name: 'folders_update',
  group: 'folders',
  subcommand: 'update',
  description: 'Update a folder.',
  examples: ['clickup folders update <folder_id> --name "New Name"'],

  inputSchema: z.object({
    folder_id: z.string().describe('Folder ID'),
    name: z.string().describe('New folder name'),
  }),

  cliMappings: {
    args: [{ field: 'folder_id', name: 'folder_id', required: true }],
    options: [
      { field: 'name', flags: '--name <name>', description: 'Folder name' },
    ],
  },

  endpoint: { method: 'PUT', path: '/folder/{folder_id}' },
  fieldMappings: { folder_id: 'path', name: 'body' },

  handler: (input, client) => executeCommand(updateCommand, input, client),
};

const deleteCommand: CommandDefinition = {
  name: 'folders_delete',
  group: 'folders',
  subcommand: 'delete',
  description: 'Delete a folder.',
  examples: ['clickup folders delete <folder_id>'],

  inputSchema: z.object({
    folder_id: z.string().describe('Folder ID'),
  }),

  cliMappings: {
    args: [{ field: 'folder_id', name: 'folder_id', required: true }],
  },

  endpoint: { method: 'DELETE', path: '/folder/{folder_id}' },
  fieldMappings: { folder_id: 'path' },

  handler: (input, client) => executeCommand(deleteCommand, input, client),
};

export const allFoldersCommands: CommandDefinition[] = [
  listCommand,
  getCommand,
  createCommand,
  updateCommand,
  deleteCommand,
];
