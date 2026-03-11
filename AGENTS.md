# AI Agent Guide — ClickUp CLI

> This file helps AI agents (Claude, GPT, Gemini, open-source models, etc.) install, authenticate, and use the ClickUp CLI to manage project management — workspaces, spaces, folders, lists, tasks, comments, time tracking, goals, webhooks, and more — via the ClickUp API v2.

## Quick Start

```bash
# Install globally
npm install -g clickup-cli

# Authenticate (non-interactive — best for agents)
export CLICKUP_API_TOKEN="pk_xxxxx"

# Verify it works
clickup workspaces list
```

**Requirements:** Node.js 18+

## Authentication

Set your API token via environment variable — no interactive login needed:

```bash
export CLICKUP_API_TOKEN="pk_xxxxx"
```

Or pass it per-command:

```bash
clickup tasks list --list-id 123 --api-token "pk_xxxxx"
```

API tokens are generated from: ClickUp Settings > Apps > API Token

### Token Resolution Order

1. `--api-token` flag (highest priority)
2. `CLICKUP_API_TOKEN` environment variable
3. Stored config from `~/.clickup-cli/config.json`

## Output Format

All commands output **JSON to stdout** by default — ready for parsing:

```bash
# Default: compact JSON (agent-optimized)
clickup tasks list --list-id 123
# → {"tasks":[{"id":"abc","name":"Fix bug","status":{"status":"open"},...}]}

# Pretty-printed JSON
clickup tasks list --list-id 123 --pretty

# Select specific fields
clickup tasks list --list-id 123 --fields id,name,status.status

# Suppress output (exit code only)
clickup tasks create --list-id 123 --name "Test" --quiet
```

**Exit codes:** 0 = success, 1 = error. Errors go to stderr as JSON:
```json
{"error":"No API token found. Set CLICKUP_API_TOKEN, use --api-token, or run: clickup login","code":"AUTH_ERROR"}
```

## ClickUp Hierarchy

```
Workspace (team_id) > Space > Folder (optional) > List > Task > Subtask
```

**Key notes:**
- `team_id` in the API = Workspace ID (legacy naming)
- Folderless Lists sit directly under Spaces
- Tasks belong to a "home" List but can appear in multiple Lists
- Dates are Unix milliseconds throughout the API
- Priority: 1=urgent, 2=high, 3=normal, 4=low

## Discovering Commands

```bash
# List all command groups
clickup --help

# List subcommands in a group
clickup tasks --help

# Get help for a specific subcommand
clickup tasks create --help
```

## All Command Groups & Subcommands

### workspaces
```
list     Get all authorized workspaces
seats    Get workspace seat usage
plan     Get workspace plan details
```

### spaces
```
list     Get all spaces in a workspace
get      Get a space by ID
create   Create a new space
update   Update a space
delete   Delete a space
```

### folders
```
list     Get folders in a space
get      Get a folder by ID
create   Create a folder
update   Update a folder
delete   Delete a folder
```

### lists
```
list              Get lists in a folder
folderless        Get folderless lists in a space
get               Get a list by ID
create            Create a list in a folder
create-folderless Create a folderless list
update            Update a list
delete            Delete a list
add-task          Add a task to a list
remove-task       Remove a task from a list
```

### tasks
```
list           Get tasks in a list (max 100/page)
get            Get a task by ID
create         Create a task in a list
update         Update a task
delete         Delete a task
filtered       Search tasks across a workspace
time-in-status Get time spent in each status
```

### comments
```
list-task     Get comments on a task
create-task   Create a comment on a task
list-list     Get comments on a list
create-list   Create a comment on a list
list-view     Get comments on a chat view
create-view   Create a comment on a view
update        Update a comment
delete        Delete a comment
list-replies  Get threaded replies
create-reply  Create a threaded reply
```

### checklists
```
create       Create a checklist on a task
update       Update a checklist
delete       Delete a checklist
create-item  Add an item to a checklist
update-item  Update a checklist item
delete-item  Delete a checklist item
```

### custom-fields
```
list-workspace  Get workspace-level custom fields
list            Get custom fields for a list
list-folder     Get custom fields for a folder
list-space      Get custom fields for a space
set             Set a custom field value on a task
remove          Remove a custom field value
```

### tags
```
list              Get tags in a space
create            Create a tag
update            Update a tag
delete            Delete a tag
add-to-task       Add a tag to a task
remove-from-task  Remove a tag from a task
```

### views
```
list-workspace  Get workspace views
list-space      Get space views
list-folder     Get folder views
list-list       Get list views
get             Get a view
tasks           Get tasks in a view
delete          Delete a view
```

### time-tracking
```
list     Get time entries (default: last 30 days)
get      Get a single time entry
create   Create a time entry
update   Update a time entry
delete   Delete a time entry
current  Get running time entry
start    Start a timer
stop     Stop the running timer
history  Get time entry history
```

### goals
```
list               Get goals in a workspace
get                Get a goal by ID
create             Create a goal
update             Update a goal
delete             Delete a goal
create-key-result  Create a key result (target)
update-key-result  Update a key result
delete-key-result  Delete a key result
```

### webhooks
```
list     Get webhooks in a workspace
create   Create a webhook
update   Update a webhook
delete   Delete a webhook
```

### users
```
me       Get the authenticated user
get      Get a user in a workspace
invite   Invite a user
update   Update a user role
remove   Remove a user from a workspace
```

### guests
```
invite           Invite a guest
get              Get a guest
update           Update a guest
remove           Remove a guest
add-to-task      Add guest to a task
remove-from-task Remove guest from a task
```

### members
```
task   Get members with access to a task
list   Get members with access to a list
```

### dependencies
```
add          Add a dependency (waiting on / blocking)
remove       Remove a dependency
add-link     Link two tasks (non-directional)
remove-link  Remove a task link
```

### templates
```
list         Get task templates
create-task  Create a task from a template
```

### roles
```
list   Get custom roles in a workspace
```

## Common Workflows

### Navigate the hierarchy

```bash
# 1. Get your workspace ID
clickup workspaces list --fields teams
# → teams[0].id = "12345678"

# 2. Get spaces
clickup spaces list --team-id 12345678

# 3. Get folders in a space
clickup folders list --space-id 98765

# 4. Get lists in a folder
clickup lists list --folder-id 54321

# 5. Get tasks in a list
clickup tasks list --list-id 11111
```

### Create a task with full details

```bash
clickup tasks create --list-id 123 \
  --name "Implement OAuth flow" \
  --description "Add OAuth 2.0 support for third-party login" \
  --priority 2 \
  --status "in progress" \
  --assignees "456,789" \
  --due-date "1711929600000" \
  --tags "backend,auth" \
  --time-estimate 14400000
```

### Track time on a task

```bash
# Start a timer
clickup time-tracking start --team-id 123 --task-id abc --description "Working on OAuth"

# Check current timer
clickup time-tracking current --team-id 123

# Stop the timer
clickup time-tracking stop --team-id 123

# Or log time manually
clickup time-tracking create --team-id 123 --task-id abc \
  --start "1711929600000" --duration 3600000 --description "Code review"
```

### Set up a webhook

```bash
clickup webhooks create --team-id 123 \
  --endpoint "https://example.com/webhooks/clickup" \
  --events "taskCreated,taskUpdated,taskStatusUpdated,taskCommentPosted"
```

### Manage goals and OKRs

```bash
# Create a goal
clickup goals create --team-id 123 --name "Q1 Revenue Target" \
  --due-date "1711929600000" --owners "456"

# Add a key result
clickup goals create-key-result --goal-id abc \
  --name "Close 50 deals" --type number --steps-start 0 --steps-end 50

# Update progress
clickup goals update-key-result kr_123 --steps-current 27 --note "Strong pipeline"
```

### Work with dependencies

```bash
# Task B depends on Task A (B waits for A)
clickup dependencies add --task-id taskB --depends-on taskA

# Link related tasks (non-directional)
clickup dependencies add-link --task-id task1 --links-to task2
```

### Filter tasks across a workspace

```bash
# Get all tasks assigned to a user
clickup tasks filtered --team-id 123 --assignees "456"

# Get overdue tasks
clickup tasks filtered --team-id 123 --due-date-lt "$(date +%s%3N)" --include-closed false

# Get tasks in specific spaces
clickup tasks filtered --team-id 123 --space-ids "111,222" --statuses "in progress"
```

## Pagination

List and filtered task commands support page-based pagination:

```bash
# First page (up to 100 tasks)
clickup tasks list --list-id 123 --page 0

# Next page
clickup tasks list --list-id 123 --page 1
```

Continue incrementing `--page` until the response returns fewer than 100 items.

## MCP Server (for Claude, Cursor, VS Code, OpenClaw)

The CLI includes a built-in MCP server exposing all commands as tools:

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
      "args": ["clickup-cli", "mcp"],
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

All tools are named `{group}_{subcommand}`:
- `tasks_list`, `tasks_get`, `tasks_create`, `tasks_update`, `tasks_delete`, `tasks_filtered`
- `comments_create_task`, `comments_list_task`, ...
- `time_tracking_start`, `time_tracking_stop`, ...
- `goals_create`, `goals_create_key_result`, ...
- `webhooks_create`, `webhooks_list`, ...

## Tips for AI Agents

1. **Always use `--help`** on a group before guessing subcommand names
2. **Parse JSON output** directly — it's the default format, compact, one line
3. **Check exit codes** — 0 = success, 1 = error
4. **Required options** are enforced with clear error messages before API calls
5. **Rate limits** are handled automatically with exponential backoff
6. **Use `--fields`** to reduce output size — supports nested paths like `status.status`
7. **Use `--quiet`** when you only care about success/failure
8. **Use `--pretty`** only when displaying to a human
9. **Dates are Unix milliseconds** — not seconds. Use `Date.now()` or `date +%s%3N`
10. **Priority is 1-4** — 1=urgent, 2=high, 3=normal, 4=low
11. **Get workspace ID first** — most commands need `--team-id`, get it via `clickup workspaces list`
12. **Array params use commas** — `--assignees "123,456"`, `--statuses "open,in progress"`
13. **Custom fields use JSON** — `--custom-fields '[{"id":"field_id","value":"val"}]'`
14. **ClickUp task IDs are strings** — not numbers (e.g., "abc123")
15. **Use `tasks filtered`** for cross-list search — it searches the entire workspace
