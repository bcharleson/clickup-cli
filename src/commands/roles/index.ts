import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

const listCommand: CommandDefinition = {
  name: 'roles_list',
  group: 'roles',
  subcommand: 'list',
  description: 'Get custom roles in a workspace.',
  examples: ['clickup roles list --team-id 123'],

  inputSchema: z.object({
    team_id: z.string().describe('Workspace (team) ID'),
  }),

  cliMappings: {
    options: [{ field: 'team_id', flags: '--team-id <id>', description: 'Workspace ID' }],
  },

  endpoint: { method: 'GET', path: '/team/{team_id}/customroles' },
  fieldMappings: { team_id: 'path' },

  handler: (input, client) => executeCommand(listCommand, input, client),
};

export const allRolesCommands: CommandDefinition[] = [listCommand];
