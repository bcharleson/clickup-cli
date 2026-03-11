import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

const listWorkspaceCommand: CommandDefinition = {
  name: 'custom_fields_list_workspace',
  group: 'custom-fields',
  subcommand: 'list-workspace',
  description: 'Get all custom fields accessible in a workspace.',
  examples: ['clickup custom-fields list-workspace --team-id 123'],

  inputSchema: z.object({
    team_id: z.string().describe('Workspace (team) ID'),
  }),

  cliMappings: {
    options: [{ field: 'team_id', flags: '--team-id <id>', description: 'Workspace ID' }],
  },

  endpoint: { method: 'GET', path: '/team/{team_id}/field' },
  fieldMappings: { team_id: 'path' },

  handler: (input, client) => executeCommand(listWorkspaceCommand, input, client),
};

const listCommand: CommandDefinition = {
  name: 'custom_fields_list',
  group: 'custom-fields',
  subcommand: 'list',
  description: 'Get custom fields for a list.',
  examples: ['clickup custom-fields list --list-id 123'],

  inputSchema: z.object({
    list_id: z.string().describe('List ID'),
  }),

  cliMappings: {
    options: [{ field: 'list_id', flags: '--list-id <id>', description: 'List ID' }],
  },

  endpoint: { method: 'GET', path: '/list/{list_id}/field' },
  fieldMappings: { list_id: 'path' },

  handler: (input, client) => executeCommand(listCommand, input, client),
};

const listFolderCommand: CommandDefinition = {
  name: 'custom_fields_list_folder',
  group: 'custom-fields',
  subcommand: 'list-folder',
  description: 'Get custom fields for a folder.',
  examples: ['clickup custom-fields list-folder --folder-id 123'],

  inputSchema: z.object({
    folder_id: z.string().describe('Folder ID'),
  }),

  cliMappings: {
    options: [{ field: 'folder_id', flags: '--folder-id <id>', description: 'Folder ID' }],
  },

  endpoint: { method: 'GET', path: '/folder/{folder_id}/field' },
  fieldMappings: { folder_id: 'path' },

  handler: (input, client) => executeCommand(listFolderCommand, input, client),
};

const listSpaceCommand: CommandDefinition = {
  name: 'custom_fields_list_space',
  group: 'custom-fields',
  subcommand: 'list-space',
  description: 'Get custom fields for a space.',
  examples: ['clickup custom-fields list-space --space-id 123'],

  inputSchema: z.object({
    space_id: z.string().describe('Space ID'),
  }),

  cliMappings: {
    options: [{ field: 'space_id', flags: '--space-id <id>', description: 'Space ID' }],
  },

  endpoint: { method: 'GET', path: '/space/{space_id}/field' },
  fieldMappings: { space_id: 'path' },

  handler: (input, client) => executeCommand(listSpaceCommand, input, client),
};

const setValueCommand: CommandDefinition = {
  name: 'custom_fields_set',
  group: 'custom-fields',
  subcommand: 'set',
  description: 'Set a custom field value on a task.',
  examples: ['clickup custom-fields set --task-id abc --field-id def --value "some value"'],

  inputSchema: z.object({
    task_id: z.string().describe('Task ID'),
    field_id: z.string().describe('Custom field ID'),
    value: z.string().describe('Field value (use JSON for complex types)'),
  }),

  cliMappings: {
    options: [
      { field: 'task_id', flags: '--task-id <id>', description: 'Task ID' },
      { field: 'field_id', flags: '--field-id <id>', description: 'Custom field ID' },
      { field: 'value', flags: '--value <val>', description: 'Field value' },
    ],
  },

  endpoint: { method: 'POST', path: '/task/{task_id}/field/{field_id}' },
  fieldMappings: {},

  handler: async (input, client) => {
    let parsedValue: any = input.value;
    try {
      parsedValue = JSON.parse(input.value);
    } catch {
      // Use as string if not valid JSON
    }
    return client.post(
      `/task/${encodeURIComponent(input.task_id)}/field/${encodeURIComponent(input.field_id)}`,
      { value: parsedValue },
    );
  },
};

const removeValueCommand: CommandDefinition = {
  name: 'custom_fields_remove',
  group: 'custom-fields',
  subcommand: 'remove',
  description: 'Remove a custom field value from a task.',
  examples: ['clickup custom-fields remove --task-id abc --field-id def'],

  inputSchema: z.object({
    task_id: z.string().describe('Task ID'),
    field_id: z.string().describe('Custom field ID'),
  }),

  cliMappings: {
    options: [
      { field: 'task_id', flags: '--task-id <id>', description: 'Task ID' },
      { field: 'field_id', flags: '--field-id <id>', description: 'Custom field ID' },
    ],
  },

  endpoint: { method: 'DELETE', path: '/task/{task_id}/field/{field_id}' },
  fieldMappings: { task_id: 'path', field_id: 'path' },

  handler: (input, client) => executeCommand(removeValueCommand, input, client),
};

export const allCustomFieldsCommands: CommandDefinition[] = [
  listWorkspaceCommand,
  listCommand,
  listFolderCommand,
  listSpaceCommand,
  setValueCommand,
  removeValueCommand,
];
