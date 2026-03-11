import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

const listCommand: CommandDefinition = {
  name: 'spaces_list',
  group: 'spaces',
  subcommand: 'list',
  description: 'Get all spaces in a workspace.',
  examples: ['clickup spaces list --team-id 123'],

  inputSchema: z.object({
    team_id: z.string().describe('Workspace (team) ID'),
    archived: z.string().optional().describe('Include archived spaces (true/false)'),
  }),

  cliMappings: {
    options: [
      { field: 'team_id', flags: '--team-id <id>', description: 'Workspace ID' },
      { field: 'archived', flags: '--archived <bool>', description: 'Include archived (true/false)' },
    ],
  },

  endpoint: { method: 'GET', path: '/team/{team_id}/space' },
  fieldMappings: { team_id: 'path', archived: 'query' },

  handler: (input, client) => executeCommand(listCommand, input, client),
};

const getCommand: CommandDefinition = {
  name: 'spaces_get',
  group: 'spaces',
  subcommand: 'get',
  description: 'Get a space by ID.',
  examples: ['clickup spaces get <space_id>'],

  inputSchema: z.object({
    space_id: z.string().describe('Space ID'),
  }),

  cliMappings: {
    args: [{ field: 'space_id', name: 'space_id', required: true }],
  },

  endpoint: { method: 'GET', path: '/space/{space_id}' },
  fieldMappings: { space_id: 'path' },

  handler: (input, client) => executeCommand(getCommand, input, client),
};

const createCommand: CommandDefinition = {
  name: 'spaces_create',
  group: 'spaces',
  subcommand: 'create',
  description: 'Create a new space in a workspace.',
  examples: ['clickup spaces create --team-id 123 --name "Engineering"'],

  inputSchema: z.object({
    team_id: z.string().describe('Workspace (team) ID'),
    name: z.string().describe('Space name'),
    multiple_assignees: z.boolean().optional().describe('Allow multiple assignees'),
    features: z.string().optional().describe('JSON features config'),
  }),

  cliMappings: {
    options: [
      { field: 'team_id', flags: '--team-id <id>', description: 'Workspace ID' },
      { field: 'name', flags: '--name <name>', description: 'Space name' },
      { field: 'multiple_assignees', flags: '--multiple-assignees', description: 'Allow multiple assignees' },
      { field: 'features', flags: '--features <json>', description: 'JSON features config' },
    ],
  },

  endpoint: { method: 'POST', path: '/team/{team_id}/space' },
  fieldMappings: { team_id: 'path', name: 'body', multiple_assignees: 'body', features: 'body' },

  handler: async (input, client) => {
    const { team_id, features: featuresJson, ...body } = input;
    const finalBody: Record<string, any> = { ...body };
    if (featuresJson) {
      try {
        finalBody.features = JSON.parse(featuresJson);
      } catch {
        throw new Error('Invalid --features JSON');
      }
    }
    return client.post(`/team/${encodeURIComponent(team_id)}/space`, finalBody);
  },
};

const updateCommand: CommandDefinition = {
  name: 'spaces_update',
  group: 'spaces',
  subcommand: 'update',
  description: 'Update a space.',
  examples: ['clickup spaces update <space_id> --name "New Name"'],

  inputSchema: z.object({
    space_id: z.string().describe('Space ID'),
    name: z.string().optional().describe('New space name'),
    color: z.string().optional().describe('Space color hex'),
    private: z.boolean().optional().describe('Make space private'),
    admin_can_manage: z.boolean().optional().describe('Only admins can manage'),
    multiple_assignees: z.boolean().optional().describe('Allow multiple assignees'),
  }),

  cliMappings: {
    args: [{ field: 'space_id', name: 'space_id', required: true }],
    options: [
      { field: 'name', flags: '--name <name>', description: 'Space name' },
      { field: 'color', flags: '--color <hex>', description: 'Color hex' },
      { field: 'private', flags: '--private', description: 'Make private' },
      { field: 'admin_can_manage', flags: '--admin-can-manage', description: 'Admin-only management' },
      { field: 'multiple_assignees', flags: '--multiple-assignees', description: 'Allow multiple assignees' },
    ],
  },

  endpoint: { method: 'PUT', path: '/space/{space_id}' },
  fieldMappings: { space_id: 'path', name: 'body', color: 'body', private: 'body', admin_can_manage: 'body', multiple_assignees: 'body' },

  handler: (input, client) => {
    const { space_id, ...body } = input;
    return client.put(`/space/${encodeURIComponent(space_id)}`, body);
  },
};

const deleteCommand: CommandDefinition = {
  name: 'spaces_delete',
  group: 'spaces',
  subcommand: 'delete',
  description: 'Delete a space.',
  examples: ['clickup spaces delete <space_id>'],

  inputSchema: z.object({
    space_id: z.string().describe('Space ID'),
  }),

  cliMappings: {
    args: [{ field: 'space_id', name: 'space_id', required: true }],
  },

  endpoint: { method: 'DELETE', path: '/space/{space_id}' },
  fieldMappings: { space_id: 'path' },

  handler: (input, client) => executeCommand(deleteCommand, input, client),
};

export const allSpacesCommands: CommandDefinition[] = [
  listCommand,
  getCommand,
  createCommand,
  updateCommand,
  deleteCommand,
];
