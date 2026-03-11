import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

const listCommand: CommandDefinition = {
  name: 'workspaces_list',
  group: 'workspaces',
  subcommand: 'list',
  description: 'Get all authorized workspaces (teams).',
  examples: ['clickup workspaces list'],

  inputSchema: z.object({}),
  cliMappings: {},
  endpoint: { method: 'GET', path: '/team' },
  fieldMappings: {},

  handler: (input, client) => executeCommand(listCommand, input, client),
};

const getSeatsCommand: CommandDefinition = {
  name: 'workspaces_seats',
  group: 'workspaces',
  subcommand: 'seats',
  description: 'Get workspace seat usage.',
  examples: ['clickup workspaces seats --team-id 123'],

  inputSchema: z.object({
    team_id: z.string().describe('Workspace (team) ID'),
  }),

  cliMappings: {
    options: [
      { field: 'team_id', flags: '--team-id <id>', description: 'Workspace ID' },
    ],
  },

  endpoint: { method: 'GET', path: '/team/{team_id}/seat' },
  fieldMappings: { team_id: 'path' },

  handler: (input, client) => executeCommand(getSeatsCommand, input, client),
};

const getPlanCommand: CommandDefinition = {
  name: 'workspaces_plan',
  group: 'workspaces',
  subcommand: 'plan',
  description: 'Get workspace plan details.',
  examples: ['clickup workspaces plan --team-id 123'],

  inputSchema: z.object({
    team_id: z.string().describe('Workspace (team) ID'),
  }),

  cliMappings: {
    options: [
      { field: 'team_id', flags: '--team-id <id>', description: 'Workspace ID' },
    ],
  },

  endpoint: { method: 'GET', path: '/team/{team_id}/plan' },
  fieldMappings: { team_id: 'path' },

  handler: (input, client) => executeCommand(getPlanCommand, input, client),
};

export const allWorkspacesCommands: CommandDefinition[] = [
  listCommand,
  getSeatsCommand,
  getPlanCommand,
];
