import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

const taskMembersCommand: CommandDefinition = {
  name: 'members_task',
  group: 'members',
  subcommand: 'task',
  description: 'Get members who have access to a task.',
  examples: ['clickup members task <task_id>'],

  inputSchema: z.object({
    task_id: z.string().describe('Task ID'),
  }),

  cliMappings: {
    args: [{ field: 'task_id', name: 'task_id', required: true }],
  },

  endpoint: { method: 'GET', path: '/task/{task_id}/member' },
  fieldMappings: { task_id: 'path' },

  handler: (input, client) => executeCommand(taskMembersCommand, input, client),
};

const listMembersCommand: CommandDefinition = {
  name: 'members_list',
  group: 'members',
  subcommand: 'list',
  description: 'Get members who have access to a list.',
  examples: ['clickup members list <list_id>'],

  inputSchema: z.object({
    list_id: z.string().describe('List ID'),
  }),

  cliMappings: {
    args: [{ field: 'list_id', name: 'list_id', required: true }],
  },

  endpoint: { method: 'GET', path: '/list/{list_id}/member' },
  fieldMappings: { list_id: 'path' },

  handler: (input, client) => executeCommand(listMembersCommand, input, client),
};

export const allMembersCommands: CommandDefinition[] = [
  taskMembersCommand,
  listMembersCommand,
];
