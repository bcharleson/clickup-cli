import { Command } from 'commander';
import { loadConfig, getConfigPath } from '../../core/config.js';
import { ClickUpClient } from '../../core/client.js';
import { output, outputError } from '../../core/output.js';
import type { GlobalOptions } from '../../core/types.js';

export function registerStatusCommand(program: Command): void {
  program
    .command('status')
    .description('Show current authentication status')
    .action(async () => {
      const globalOpts = program.opts() as GlobalOptions;
      try {
        const config = await loadConfig();
        const envToken = process.env.CLICKUP_API_TOKEN;
        const token = config?.api_token || envToken;

        if (!token) {
          const result = {
            authenticated: false,
            source: 'none',
            config_path: getConfigPath(),
          };
          if (globalOpts.output === 'pretty' || process.stdin.isTTY) {
            console.log('Not authenticated. Run: clickup login');
          } else {
            output(result, globalOpts);
          }
          return;
        }

        const source = config?.api_token ? 'config' : 'env';
        const client = new ClickUpClient({ apiToken: token });

        let user: any;
        try {
          user = await client.get('/user');
        } catch {
          user = null;
        }

        const result = {
          authenticated: true,
          source,
          user: user?.user?.username ?? 'unknown',
          user_id: user?.user?.id ?? 'unknown',
          default_team_id: config?.default_team_id ?? 'not set',
          config_path: getConfigPath(),
        };

        if (globalOpts.output === 'pretty' || process.stdin.isTTY) {
          console.log(`Authenticated: yes (via ${source})`);
          if (user?.user?.username) console.log(`User: ${user.user.username}`);
          if (config?.default_team_id) console.log(`Default Workspace: ${config.default_team_id}`);
        } else {
          output(result, globalOpts);
        }
      } catch (error) {
        outputError(error, globalOpts);
      }
    });
}
