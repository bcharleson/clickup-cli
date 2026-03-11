import { Command } from 'commander';
import { ClickUpClient } from '../../core/client.js';
import { saveConfig } from '../../core/config.js';
import { output, outputError } from '../../core/output.js';
import type { GlobalOptions } from '../../core/types.js';

export function registerLoginCommand(program: Command): void {
  program
    .command('login')
    .description('Authenticate with your ClickUp API token')
    .option('--api-token <token>', 'API token (skips interactive prompt)')
    .action(async (opts) => {
      const globalOpts = program.opts() as GlobalOptions;

      try {
        let apiToken = opts.apiToken || process.env.CLICKUP_API_TOKEN;

        if (!apiToken) {
          if (!process.stdin.isTTY) {
            outputError(
              new Error('No API token provided. Use --api-token or set CLICKUP_API_TOKEN'),
              globalOpts,
            );
            return;
          }

          console.log('Get your API token from: ClickUp Settings > Apps > API Token\n');

          const { password } = await import('@inquirer/prompts');
          apiToken = await password({
            message: 'Enter your API token:',
            mask: '*',
          });
        }

        if (!apiToken) {
          outputError(new Error('No API token provided'), globalOpts);
          return;
        }

        const client = new ClickUpClient({ apiToken });

        if (globalOpts.output === 'pretty' || process.stdin.isTTY) {
          console.log('Validating API token...');
        }

        let user: any;
        try {
          user = await client.get('/user');
        } catch {
          user = null;
        }

        // Get default team
        let defaultTeamId: string | undefined;
        try {
          const teams: any = await client.get('/team');
          if (teams?.teams?.length > 0) {
            defaultTeamId = String(teams.teams[0].id);
          }
        } catch {
          // Non-critical
        }

        await saveConfig({
          api_token: apiToken,
          default_team_id: defaultTeamId,
        });

        const result = {
          status: 'authenticated',
          user: user?.user?.username ?? 'unknown',
          user_id: user?.user?.id ?? 'unknown',
          default_team_id: defaultTeamId ?? 'unknown',
          config_path: '~/.clickup-cli/config.json',
        };

        if (globalOpts.output === 'pretty' || process.stdin.isTTY) {
          console.log(`\nAuthenticated successfully!`);
          if (user?.user?.username) {
            console.log(`User: ${user.user.username}`);
          }
          if (defaultTeamId) {
            console.log(`Default Workspace ID: ${defaultTeamId}`);
          }
          console.log('Config saved to ~/.clickup-cli/config.json');
        } else {
          output(result, globalOpts);
        }
      } catch (error) {
        outputError(error, globalOpts);
      }
    });
}
