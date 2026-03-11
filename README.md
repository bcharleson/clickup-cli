# ClickUp CLI

**JSON-first, agent-native CLI for the ClickUp API v2.**

> ClickUp has no official CLI for its project management API. This CLI fills that gap — covering workspaces, spaces, folders, lists, tasks, comments, time tracking, goals, webhooks, and more. Every command returns structured JSON, works from the terminal _and_ as an MCP tool — so your AI agents can manage your entire ClickUp workspace the same way a human would from the command line.

## Why Agent-Native?

| | `clickup-cli` (This) |
|---|---|
| **Scope** | Full ClickUp API v2 — 105 commands across 19 groups |
| **Output** | JSON-first — machine-parseable by default |
| **MCP Support** | Built-in MCP server — every command is an MCP tool |
| **Agent Use** | Every command works identically from terminal or MCP |
| **Auth** | API token (3-tier resolution) |

**Agent-native** means:
- **JSON-first output** — every response is valid JSON, pipe to `jq` or consume from any language
- **Dual entry point** — same commands work as CLI _and_ MCP tools with zero adaptation
- **Structured errors** — errors return `{ "error": "...", "code": "..." }`, not stack traces
- **Field filtering** — `--fields id,name,status.status` returns only what you need
- **No interactive prompts in automation** — all params available as flags, env vars, or config

## Install

```bash
npm install -g @bcharleson/clickup-cli
```

## Quick Start

```bash
# 1. Get your API token from ClickUp
# Settings → Apps → API Token → Generate

# 2. Authenticate
export CLICKUP_API_TOKEN="pk_xxxxx"

# 3. List your workspaces
clickup workspaces list --pretty

# 4. List spaces in a workspace
clickup spaces list --team-id 12345678

# 5. List tasks in a list
clickup tasks list --list-id 11111 --pretty
```

## Auth

### 1. Get your API token

1. In ClickUp, go to **Settings** → **Apps** → **API Token**
2. Click **Generate** to create a personal API token
3. Copy the token (starts with `pk_`)

### 2. Authenticate

Three-tier resolution (highest priority first):

```bash
# Option A: Environment variable (recommended for agents)
export CLICKUP_API_TOKEN="pk_xxxxx"

# Option B: Interactive login (saves to ~/.clickup-cli/config.json)
clickup login

# Option C: Per-command flag
clickup tasks list --list-id 123 --api-token "pk_xxxxx"
```

### 3. Verify

```bash
clickup workspaces list --pretty
```

## ClickUp Hierarchy

```
Workspace (team_id) → Space → Folder (optional) → List → Task → Subtask
```

**Key notes:**
- `team_id` in the API = Workspace ID (legacy naming)
- Folderless Lists sit directly under Spaces
- Tasks belong to a "home" List but can appear in multiple Lists
- Dates are Unix milliseconds throughout the API
- Priority: 1=urgent, 2=high, 3=normal, 4=low

## Commands

### Hierarchy (22 commands)

| Group | Commands |
|-------|----------|
| **workspaces** | `list`, `seats`, `plan` |
| **spaces** | `list`, `get`, `create`, `update`, `delete` |
| **folders** | `list`, `get`, `create`, `update`, `delete` |
| **lists** | `list`, `folderless`, `get`, `create`, `create-folderless`, `update`, `delete`, `add-task`, `remove-task` |

### Tasks & Content (35 commands)

| Group | Commands |
|-------|----------|
| **tasks** | `list`, `get`, `create`, `update`, `delete`, `filtered`, `time-in-status` |
| **comments** | `list-task`, `create-task`, `list-list`, `create-list`, `list-view`, `create-view`, `update`, `delete`, `list-replies`, `create-reply` |
| **checklists** | `create`, `update`, `delete`, `create-item`, `update-item`, `delete-item` |
| **custom-fields** | `list-workspace`, `list`, `list-folder`, `list-space`, `set`, `remove` |
| **tags** | `list`, `create`, `update`, `delete`, `add-to-task`, `remove-from-task` |
| **dependencies** | `add`, `remove`, `add-link`, `remove-link` |

### Views & Tracking (24 commands)

| Group | Commands |
|-------|----------|
| **views** | `list-workspace`, `list-space`, `list-folder`, `list-list`, `get`, `tasks`, `delete` |
| **time-tracking** | `list`, `get`, `create`, `update`, `delete`, `current`, `start`, `stop`, `history` |
| **goals** | `list`, `get`, `create`, `update`, `delete`, `create-key-result`, `update-key-result`, `delete-key-result` |

### Admin & Config (24 commands)

| Group | Commands |
|-------|----------|
| **webhooks** | `list`, `create`, `update`, `delete` |
| **users** | `me`, `get`, `invite`, `update`, `remove` |
| **guests** | `invite`, `get`, `update`, `remove`, `add-to-task`, `remove-from-task` |
| **members** | `task`, `list` |
| **templates** | `list`, `create-task` |
| **roles** | `list` |

### Auth & Config

| Command | Description |
|---------|-------------|
| `login` | Authenticate with API token |
| `logout` | Remove stored credentials |
| `status` | Show current auth + account info |

## Global Options

```
--api-token <token>   Override stored auth
--output <format>     json (default) or pretty
--pretty              Shorthand for --output pretty
--quiet               Suppress output, exit codes only
--fields <fields>     Comma-separated field filter (supports nested: status.status)
```

## Examples

```bash
# Navigate the hierarchy
clickup workspaces list --fields teams
clickup spaces list --team-id 12345678
clickup folders list --space-id 98765
clickup lists list --folder-id 54321
clickup tasks list --list-id 11111

# Create a task with full details
clickup tasks create --list-id 123 \
  --name "Implement OAuth flow" \
  --description "Add OAuth 2.0 support" \
  --priority 2 \
  --status "in progress" \
  --assignees "456,789" \
  --due-date "1711929600000" \
  --tags "backend,auth" \
  --time-estimate 14400000

# Search tasks across a workspace
clickup tasks filtered --team-id 123 --assignees "456"
clickup tasks filtered --team-id 123 --statuses "in progress" --space-ids "111,222"

# Comments and checklists
clickup comments create-task --task-id abc --comment-text "Ready for review"
clickup checklists create --task-id abc --name "Deploy checklist"
clickup checklists create-item --checklist-id ck1 --name "Run tests"

# Time tracking
clickup time-tracking start --team-id 123 --task-id abc --description "Working on OAuth"
clickup time-tracking current --team-id 123
clickup time-tracking stop --team-id 123

# Goals and OKRs
clickup goals create --team-id 123 --name "Q1 Revenue Target" \
  --due-date "1711929600000" --owners "456"
clickup goals create-key-result --goal-id abc \
  --name "Close 50 deals" --type number --steps-start 0 --steps-end 50

# Webhooks
clickup webhooks create --team-id 123 \
  --endpoint "https://example.com/webhooks/clickup" \
  --events "taskCreated,taskUpdated,taskStatusUpdated"

# Custom fields
clickup custom-fields list --list-id 123
clickup custom-fields set --task-id abc --field-id cf_1 --value "high"

# Tags
clickup tags list --space-id 123
clickup tags add-to-task --task-id abc --tag-name "urgent"

# Dependencies
clickup dependencies add --task-id taskB --depends-on taskA
clickup dependencies add-link --task-id task1 --links-to task2

# Views
clickup views list-workspace --team-id 123
clickup views tasks --view-id v123

# Users and guests
clickup users me
clickup users invite --team-id 123 --email "user@example.com"
clickup guests invite --team-id 123 --email "guest@example.com"

# Pipe to jq
clickup tasks list --list-id 123 | jq '.tasks[].name'
clickup tasks filtered --team-id 123 | jq '.tasks[] | {id, name, status: .status.status}'
```

## MCP Server

The CLI includes a built-in MCP server exposing all 105 commands as tools:

```bash
# Start the MCP server
clickup mcp
```

### MCP Config

```json
{
  "mcpServers": {
    "clickup": {
      "command": "npx",
      "args": ["@bcharleson/clickup-cli", "mcp"],
      "env": {
        "CLICKUP_API_TOKEN": "pk_xxxxx"
      }
    }
  }
}
```

Or with a local install:

```json
{
  "mcpServers": {
    "clickup": {
      "command": "node",
      "args": ["/path/to/clickup-cli/dist/mcp.js"],
      "env": {
        "CLICKUP_API_TOKEN": "pk_xxxxx"
      }
    }
  }
}
```

### MCP Tool Names

All tools are named `{group}_{subcommand}` with hyphens converted to underscores:
- `tasks_list`, `tasks_get`, `tasks_create`, `tasks_update`, `tasks_delete`, `tasks_filtered`
- `comments_create_task`, `comments_list_task`, ...
- `time_tracking_start`, `time_tracking_stop`, `time_tracking_current`, ...
- `goals_create`, `goals_create_key_result`, ...
- `webhooks_create`, `webhooks_list`, ...

## Architecture

This CLI follows a metadata-driven architecture shared across [hubspot-cli](https://github.com/bcharleson/hubspot-cli) and [instantly-cli](https://github.com/bcharleson/instantly-cli):

- **CommandDefinition** — single struct drives both CLI registration and MCP tool registration
- **Zod schemas** — input validation shared between CLI and MCP
- **Declarative endpoints** — `{ method, path, fieldMappings }` drives HTTP request building
- **Thin REST client** — bare token auth, exponential backoff on 429s, rate-limit header handling
- **Dual entry** — `dist/index.js` (CLI) and `dist/mcp.js` (MCP server)

## License

MIT
