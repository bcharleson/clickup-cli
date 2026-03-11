import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

const addDependencyCommand: CommandDefinition = {
  name: 'dependencies_add',
  group: 'dependencies',
  subcommand: 'add',
  description: 'Add a dependency between two tasks.',
  examples: [
    'clickup dependencies add --task-id abc --depends-on def',
    'clickup dependencies add --task-id abc --dependency-of ghi',
  ],

  inputSchema: z.object({
    task_id: z.string().describe('Task ID'),
    depends_on: z.string().optional().describe('Task ID this task depends on (waiting on)'),
    dependency_of: z.string().optional().describe('Task ID that depends on this task (blocking)'),
  }),

  cliMappings: {
    options: [
      { field: 'task_id', flags: '--task-id <id>', description: 'Task ID' },
      { field: 'depends_on', flags: '--depends-on <id>', description: 'Depends on task ID' },
      { field: 'dependency_of', flags: '--dependency-of <id>', description: 'Dependency of task ID' },
    ],
  },

  endpoint: { method: 'POST', path: '/task/{task_id}/dependency' },
  fieldMappings: { task_id: 'path', depends_on: 'body', dependency_of: 'body' },

  handler: (input, client) => executeCommand(addDependencyCommand, input, client),
};

const removeDependencyCommand: CommandDefinition = {
  name: 'dependencies_remove',
  group: 'dependencies',
  subcommand: 'remove',
  description: 'Remove a dependency between two tasks.',
  examples: ['clickup dependencies remove --task-id abc --depends-on def'],

  inputSchema: z.object({
    task_id: z.string().describe('Task ID'),
    depends_on: z.string().optional().describe('Task ID this task depends on'),
    dependency_of: z.string().optional().describe('Task ID that depends on this task'),
  }),

  cliMappings: {
    options: [
      { field: 'task_id', flags: '--task-id <id>', description: 'Task ID' },
      { field: 'depends_on', flags: '--depends-on <id>', description: 'Depends on task ID' },
      { field: 'dependency_of', flags: '--dependency-of <id>', description: 'Dependency of task ID' },
    ],
  },

  endpoint: { method: 'DELETE', path: '/task/{task_id}/dependency' },
  fieldMappings: { task_id: 'path', depends_on: 'query', dependency_of: 'query' },

  handler: (input, client) => executeCommand(removeDependencyCommand, input, client),
};

const addLinkCommand: CommandDefinition = {
  name: 'dependencies_add_link',
  group: 'dependencies',
  subcommand: 'add-link',
  description: 'Link two tasks together (non-directional).',
  examples: ['clickup dependencies add-link --task-id abc --links-to def'],

  inputSchema: z.object({
    task_id: z.string().describe('Task ID'),
    links_to: z.string().describe('Task ID to link to'),
  }),

  cliMappings: {
    options: [
      { field: 'task_id', flags: '--task-id <id>', description: 'Task ID' },
      { field: 'links_to', flags: '--links-to <id>', description: 'Links to task ID' },
    ],
  },

  endpoint: { method: 'POST', path: '/task/{task_id}/link/{links_to}' },
  fieldMappings: { task_id: 'path', links_to: 'path' },

  handler: (input, client) => executeCommand(addLinkCommand, input, client),
};

const removeLinkCommand: CommandDefinition = {
  name: 'dependencies_remove_link',
  group: 'dependencies',
  subcommand: 'remove-link',
  description: 'Remove a link between two tasks.',
  examples: ['clickup dependencies remove-link --task-id abc --links-to def'],

  inputSchema: z.object({
    task_id: z.string().describe('Task ID'),
    links_to: z.string().describe('Linked task ID'),
  }),

  cliMappings: {
    options: [
      { field: 'task_id', flags: '--task-id <id>', description: 'Task ID' },
      { field: 'links_to', flags: '--links-to <id>', description: 'Linked task ID' },
    ],
  },

  endpoint: { method: 'DELETE', path: '/task/{task_id}/link/{links_to}' },
  fieldMappings: { task_id: 'path', links_to: 'path' },

  handler: (input, client) => executeCommand(removeLinkCommand, input, client),
};

export const allDependenciesCommands: CommandDefinition[] = [
  addDependencyCommand,
  removeDependencyCommand,
  addLinkCommand,
  removeLinkCommand,
];
