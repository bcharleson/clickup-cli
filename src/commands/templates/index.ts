import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

const listCommand: CommandDefinition = {
  name: 'templates_list',
  group: 'templates',
  subcommand: 'list',
  description: 'Get task templates in a workspace.',
  examples: ['clickup templates list --team-id 123'],

  inputSchema: z.object({
    team_id: z.string().describe('Workspace (team) ID'),
    page: z.coerce.number().optional().describe('Page (0-indexed)'),
  }),

  cliMappings: {
    options: [
      { field: 'team_id', flags: '--team-id <id>', description: 'Workspace ID' },
      { field: 'page', flags: '--page <n>', description: 'Page (0-indexed)' },
    ],
  },

  endpoint: { method: 'GET', path: '/team/{team_id}/taskTemplate' },
  fieldMappings: { team_id: 'path', page: 'query' },

  handler: (input, client) => executeCommand(listCommand, input, client),
};

const createFromTemplateCommand: CommandDefinition = {
  name: 'templates_create_task',
  group: 'templates',
  subcommand: 'create-task',
  description: 'Create a task from a template.',
  examples: ['clickup templates create-task --list-id 123 --template-id abc --name "From Template"'],

  inputSchema: z.object({
    list_id: z.string().describe('List ID to create the task in'),
    template_id: z.string().describe('Template ID'),
    name: z.string().describe('Task name'),
  }),

  cliMappings: {
    options: [
      { field: 'list_id', flags: '--list-id <id>', description: 'List ID' },
      { field: 'template_id', flags: '--template-id <id>', description: 'Template ID' },
      { field: 'name', flags: '--name <name>', description: 'Task name' },
    ],
  },

  endpoint: { method: 'POST', path: '/list/{list_id}/taskTemplate/{template_id}' },
  fieldMappings: { list_id: 'path', template_id: 'path', name: 'body' },

  handler: (input, client) => executeCommand(createFromTemplateCommand, input, client),
};

export const allTemplatesCommands: CommandDefinition[] = [
  listCommand,
  createFromTemplateCommand,
];
