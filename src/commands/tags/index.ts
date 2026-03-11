import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

const listCommand: CommandDefinition = {
  name: 'tags_list',
  group: 'tags',
  subcommand: 'list',
  description: 'Get all tags in a space.',
  examples: ['clickup tags list --space-id 123'],

  inputSchema: z.object({
    space_id: z.string().describe('Space ID'),
  }),

  cliMappings: {
    options: [{ field: 'space_id', flags: '--space-id <id>', description: 'Space ID' }],
  },

  endpoint: { method: 'GET', path: '/space/{space_id}/tag' },
  fieldMappings: { space_id: 'path' },

  handler: (input, client) => executeCommand(listCommand, input, client),
};

const createCommand: CommandDefinition = {
  name: 'tags_create',
  group: 'tags',
  subcommand: 'create',
  description: 'Create a tag in a space.',
  examples: ['clickup tags create --space-id 123 --name "bug" --tag-fg "ffffff" --tag-bg "ff0000"'],

  inputSchema: z.object({
    space_id: z.string().describe('Space ID'),
    name: z.string().describe('Tag name'),
    tag_fg: z.string().optional().describe('Foreground color hex'),
    tag_bg: z.string().optional().describe('Background color hex'),
  }),

  cliMappings: {
    options: [
      { field: 'space_id', flags: '--space-id <id>', description: 'Space ID' },
      { field: 'name', flags: '--name <name>', description: 'Tag name' },
      { field: 'tag_fg', flags: '--tag-fg <hex>', description: 'Foreground color' },
      { field: 'tag_bg', flags: '--tag-bg <hex>', description: 'Background color' },
    ],
  },

  endpoint: { method: 'POST', path: '/space/{space_id}/tag' },
  fieldMappings: {},

  handler: async (input, client) => {
    const { space_id, ...tag } = input;
    return client.post(`/space/${encodeURIComponent(space_id)}/tag`, { tag });
  },
};

const updateCommand: CommandDefinition = {
  name: 'tags_update',
  group: 'tags',
  subcommand: 'update',
  description: 'Update a space tag.',
  examples: ['clickup tags update --space-id 123 --tag-name "bug" --new-name "defect"'],

  inputSchema: z.object({
    space_id: z.string().describe('Space ID'),
    tag_name: z.string().describe('Current tag name'),
    new_name: z.string().optional().describe('New tag name'),
    tag_fg: z.string().optional().describe('Foreground color hex'),
    tag_bg: z.string().optional().describe('Background color hex'),
  }),

  cliMappings: {
    options: [
      { field: 'space_id', flags: '--space-id <id>', description: 'Space ID' },
      { field: 'tag_name', flags: '--tag-name <name>', description: 'Current tag name' },
      { field: 'new_name', flags: '--new-name <name>', description: 'New tag name' },
      { field: 'tag_fg', flags: '--tag-fg <hex>', description: 'Foreground color' },
      { field: 'tag_bg', flags: '--tag-bg <hex>', description: 'Background color' },
    ],
  },

  endpoint: { method: 'PUT', path: '/space/{space_id}/tag/{tag_name}' },
  fieldMappings: {},

  handler: async (input, client) => {
    const { space_id, tag_name, ...tag } = input;
    return client.put(
      `/space/${encodeURIComponent(space_id)}/tag/${encodeURIComponent(tag_name)}`,
      { tag },
    );
  },
};

const deleteCommand: CommandDefinition = {
  name: 'tags_delete',
  group: 'tags',
  subcommand: 'delete',
  description: 'Delete a tag from a space.',
  examples: ['clickup tags delete --space-id 123 --tag-name "bug"'],

  inputSchema: z.object({
    space_id: z.string().describe('Space ID'),
    tag_name: z.string().describe('Tag name'),
  }),

  cliMappings: {
    options: [
      { field: 'space_id', flags: '--space-id <id>', description: 'Space ID' },
      { field: 'tag_name', flags: '--tag-name <name>', description: 'Tag name' },
    ],
  },

  endpoint: { method: 'DELETE', path: '/space/{space_id}/tag/{tag_name}' },
  fieldMappings: { space_id: 'path', tag_name: 'path' },

  handler: (input, client) => executeCommand(deleteCommand, input, client),
};

const addToTaskCommand: CommandDefinition = {
  name: 'tags_add_to_task',
  group: 'tags',
  subcommand: 'add-to-task',
  description: 'Add a tag to a task.',
  examples: ['clickup tags add-to-task --task-id abc --tag-name "bug"'],

  inputSchema: z.object({
    task_id: z.string().describe('Task ID'),
    tag_name: z.string().describe('Tag name'),
  }),

  cliMappings: {
    options: [
      { field: 'task_id', flags: '--task-id <id>', description: 'Task ID' },
      { field: 'tag_name', flags: '--tag-name <name>', description: 'Tag name' },
    ],
  },

  endpoint: { method: 'POST', path: '/task/{task_id}/tag/{tag_name}' },
  fieldMappings: { task_id: 'path', tag_name: 'path' },

  handler: (input, client) => executeCommand(addToTaskCommand, input, client),
};

const removeFromTaskCommand: CommandDefinition = {
  name: 'tags_remove_from_task',
  group: 'tags',
  subcommand: 'remove-from-task',
  description: 'Remove a tag from a task.',
  examples: ['clickup tags remove-from-task --task-id abc --tag-name "bug"'],

  inputSchema: z.object({
    task_id: z.string().describe('Task ID'),
    tag_name: z.string().describe('Tag name'),
  }),

  cliMappings: {
    options: [
      { field: 'task_id', flags: '--task-id <id>', description: 'Task ID' },
      { field: 'tag_name', flags: '--tag-name <name>', description: 'Tag name' },
    ],
  },

  endpoint: { method: 'DELETE', path: '/task/{task_id}/tag/{tag_name}' },
  fieldMappings: { task_id: 'path', tag_name: 'path' },

  handler: (input, client) => executeCommand(removeFromTaskCommand, input, client),
};

export const allTagsCommands: CommandDefinition[] = [
  listCommand,
  createCommand,
  updateCommand,
  deleteCommand,
  addToTaskCommand,
  removeFromTaskCommand,
];
