import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

const listInFolderCommand: CommandDefinition = {
  name: 'lists_list',
  group: 'lists',
  subcommand: 'list',
  description: 'Get all lists in a folder.',
  examples: ['clickup lists list --folder-id 123'],

  inputSchema: z.object({
    folder_id: z.string().describe('Folder ID'),
    archived: z.string().optional().describe('Include archived (true/false)'),
  }),

  cliMappings: {
    options: [
      { field: 'folder_id', flags: '--folder-id <id>', description: 'Folder ID' },
      { field: 'archived', flags: '--archived <bool>', description: 'Include archived' },
    ],
  },

  endpoint: { method: 'GET', path: '/folder/{folder_id}/list' },
  fieldMappings: { folder_id: 'path', archived: 'query' },

  handler: (input, client) => executeCommand(listInFolderCommand, input, client),
};

const listFolderlessCommand: CommandDefinition = {
  name: 'lists_folderless',
  group: 'lists',
  subcommand: 'folderless',
  description: 'Get folderless lists in a space.',
  examples: ['clickup lists folderless --space-id 123'],

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

  endpoint: { method: 'GET', path: '/space/{space_id}/list' },
  fieldMappings: { space_id: 'path', archived: 'query' },

  handler: (input, client) => executeCommand(listFolderlessCommand, input, client),
};

const getCommand: CommandDefinition = {
  name: 'lists_get',
  group: 'lists',
  subcommand: 'get',
  description: 'Get a list by ID.',
  examples: ['clickup lists get <list_id>'],

  inputSchema: z.object({
    list_id: z.string().describe('List ID'),
  }),

  cliMappings: {
    args: [{ field: 'list_id', name: 'list_id', required: true }],
  },

  endpoint: { method: 'GET', path: '/list/{list_id}' },
  fieldMappings: { list_id: 'path' },

  handler: (input, client) => executeCommand(getCommand, input, client),
};

const createCommand: CommandDefinition = {
  name: 'lists_create',
  group: 'lists',
  subcommand: 'create',
  description: 'Create a list in a folder.',
  examples: ['clickup lists create --folder-id 123 --name "Backlog"'],

  inputSchema: z.object({
    folder_id: z.string().describe('Folder ID'),
    name: z.string().describe('List name'),
    content: z.string().optional().describe('List description'),
    due_date: z.string().optional().describe('Due date (Unix ms)'),
    priority: z.coerce.number().optional().describe('Priority (1=urgent, 2=high, 3=normal, 4=low)'),
    status: z.string().optional().describe('Status name'),
  }),

  cliMappings: {
    options: [
      { field: 'folder_id', flags: '--folder-id <id>', description: 'Folder ID' },
      { field: 'name', flags: '--name <name>', description: 'List name' },
      { field: 'content', flags: '--content <desc>', description: 'List description' },
      { field: 'due_date', flags: '--due-date <ms>', description: 'Due date (Unix ms)' },
      { field: 'priority', flags: '--priority <n>', description: 'Priority (1-4)' },
      { field: 'status', flags: '--status <name>', description: 'Status name' },
    ],
  },

  endpoint: { method: 'POST', path: '/folder/{folder_id}/list' },
  fieldMappings: { folder_id: 'path', name: 'body', content: 'body', due_date: 'body', priority: 'body', status: 'body' },

  handler: (input, client) => executeCommand(createCommand, input, client),
};

const createFolderlessCommand: CommandDefinition = {
  name: 'lists_create_folderless',
  group: 'lists',
  subcommand: 'create-folderless',
  description: 'Create a folderless list in a space.',
  examples: ['clickup lists create-folderless --space-id 123 --name "Backlog"'],

  inputSchema: z.object({
    space_id: z.string().describe('Space ID'),
    name: z.string().describe('List name'),
    content: z.string().optional().describe('List description'),
    due_date: z.string().optional().describe('Due date (Unix ms)'),
    priority: z.coerce.number().optional().describe('Priority (1-4)'),
    status: z.string().optional().describe('Status name'),
  }),

  cliMappings: {
    options: [
      { field: 'space_id', flags: '--space-id <id>', description: 'Space ID' },
      { field: 'name', flags: '--name <name>', description: 'List name' },
      { field: 'content', flags: '--content <desc>', description: 'List description' },
      { field: 'due_date', flags: '--due-date <ms>', description: 'Due date (Unix ms)' },
      { field: 'priority', flags: '--priority <n>', description: 'Priority (1-4)' },
      { field: 'status', flags: '--status <name>', description: 'Status name' },
    ],
  },

  endpoint: { method: 'POST', path: '/space/{space_id}/list' },
  fieldMappings: { space_id: 'path', name: 'body', content: 'body', due_date: 'body', priority: 'body', status: 'body' },

  handler: (input, client) => executeCommand(createFolderlessCommand, input, client),
};

const updateCommand: CommandDefinition = {
  name: 'lists_update',
  group: 'lists',
  subcommand: 'update',
  description: 'Update a list.',
  examples: ['clickup lists update <list_id> --name "Sprint 2"'],

  inputSchema: z.object({
    list_id: z.string().describe('List ID'),
    name: z.string().optional().describe('List name'),
    content: z.string().optional().describe('List description'),
    due_date: z.string().optional().describe('Due date (Unix ms)'),
    priority: z.coerce.number().optional().describe('Priority (1-4)'),
    status: z.string().optional().describe('Status name'),
  }),

  cliMappings: {
    args: [{ field: 'list_id', name: 'list_id', required: true }],
    options: [
      { field: 'name', flags: '--name <name>', description: 'List name' },
      { field: 'content', flags: '--content <desc>', description: 'Description' },
      { field: 'due_date', flags: '--due-date <ms>', description: 'Due date (Unix ms)' },
      { field: 'priority', flags: '--priority <n>', description: 'Priority (1-4)' },
      { field: 'status', flags: '--status <name>', description: 'Status name' },
    ],
  },

  endpoint: { method: 'PUT', path: '/list/{list_id}' },
  fieldMappings: { list_id: 'path', name: 'body', content: 'body', due_date: 'body', priority: 'body', status: 'body' },

  handler: (input, client) => {
    const { list_id, ...body } = input;
    return client.put(`/list/${encodeURIComponent(list_id)}`, body);
  },
};

const deleteCommand: CommandDefinition = {
  name: 'lists_delete',
  group: 'lists',
  subcommand: 'delete',
  description: 'Delete a list.',
  examples: ['clickup lists delete <list_id>'],

  inputSchema: z.object({
    list_id: z.string().describe('List ID'),
  }),

  cliMappings: {
    args: [{ field: 'list_id', name: 'list_id', required: true }],
  },

  endpoint: { method: 'DELETE', path: '/list/{list_id}' },
  fieldMappings: { list_id: 'path' },

  handler: (input, client) => executeCommand(deleteCommand, input, client),
};

const addTaskCommand: CommandDefinition = {
  name: 'lists_add_task',
  group: 'lists',
  subcommand: 'add-task',
  description: 'Add an existing task to a list (task appears in multiple lists).',
  examples: ['clickup lists add-task --list-id 123 --task-id abc'],

  inputSchema: z.object({
    list_id: z.string().describe('List ID'),
    task_id: z.string().describe('Task ID'),
  }),

  cliMappings: {
    options: [
      { field: 'list_id', flags: '--list-id <id>', description: 'List ID' },
      { field: 'task_id', flags: '--task-id <id>', description: 'Task ID' },
    ],
  },

  endpoint: { method: 'POST', path: '/list/{list_id}/task/{task_id}' },
  fieldMappings: { list_id: 'path', task_id: 'path' },

  handler: (input, client) => executeCommand(addTaskCommand, input, client),
};

const removeTaskCommand: CommandDefinition = {
  name: 'lists_remove_task',
  group: 'lists',
  subcommand: 'remove-task',
  description: 'Remove a task from a list.',
  examples: ['clickup lists remove-task --list-id 123 --task-id abc'],

  inputSchema: z.object({
    list_id: z.string().describe('List ID'),
    task_id: z.string().describe('Task ID'),
  }),

  cliMappings: {
    options: [
      { field: 'list_id', flags: '--list-id <id>', description: 'List ID' },
      { field: 'task_id', flags: '--task-id <id>', description: 'Task ID' },
    ],
  },

  endpoint: { method: 'DELETE', path: '/list/{list_id}/task/{task_id}' },
  fieldMappings: { list_id: 'path', task_id: 'path' },

  handler: (input, client) => executeCommand(removeTaskCommand, input, client),
};

export const allListsCommands: CommandDefinition[] = [
  listInFolderCommand,
  listFolderlessCommand,
  getCommand,
  createCommand,
  createFolderlessCommand,
  updateCommand,
  deleteCommand,
  addTaskCommand,
  removeTaskCommand,
];
