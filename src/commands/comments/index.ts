import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

const listTaskCommentsCommand: CommandDefinition = {
  name: 'comments_list_task',
  group: 'comments',
  subcommand: 'list-task',
  description: 'Get comments on a task.',
  examples: ['clickup comments list-task --task-id abc'],

  inputSchema: z.object({
    task_id: z.string().describe('Task ID'),
    start: z.string().optional().describe('Start date (Unix ms)'),
    start_id: z.string().optional().describe('Start comment ID for pagination'),
  }),

  cliMappings: {
    options: [
      { field: 'task_id', flags: '--task-id <id>', description: 'Task ID' },
      { field: 'start', flags: '--start <ms>', description: 'Start date (Unix ms)' },
      { field: 'start_id', flags: '--start-id <id>', description: 'Start comment ID' },
    ],
  },

  endpoint: { method: 'GET', path: '/task/{task_id}/comment' },
  fieldMappings: { task_id: 'path', start: 'query', start_id: 'query' },

  handler: (input, client) => executeCommand(listTaskCommentsCommand, input, client),
};

const createTaskCommentCommand: CommandDefinition = {
  name: 'comments_create_task',
  group: 'comments',
  subcommand: 'create-task',
  description: 'Create a comment on a task.',
  examples: ['clickup comments create-task --task-id abc --comment-text "Looks good!"'],

  inputSchema: z.object({
    task_id: z.string().describe('Task ID'),
    comment_text: z.string().describe('Comment text'),
    assignee: z.coerce.number().optional().describe('Assignee user ID (creates assigned comment)'),
    notify_all: z.boolean().optional().describe('Notify all assignees'),
  }),

  cliMappings: {
    options: [
      { field: 'task_id', flags: '--task-id <id>', description: 'Task ID' },
      { field: 'comment_text', flags: '--comment-text <text>', description: 'Comment text' },
      { field: 'assignee', flags: '--assignee <id>', description: 'Assignee user ID' },
      { field: 'notify_all', flags: '--notify-all', description: 'Notify all' },
    ],
  },

  endpoint: { method: 'POST', path: '/task/{task_id}/comment' },
  fieldMappings: { task_id: 'path', comment_text: 'body', assignee: 'body', notify_all: 'body' },

  handler: (input, client) => executeCommand(createTaskCommentCommand, input, client),
};

const listListCommentsCommand: CommandDefinition = {
  name: 'comments_list_list',
  group: 'comments',
  subcommand: 'list-list',
  description: 'Get comments on a list.',
  examples: ['clickup comments list-list --list-id 123'],

  inputSchema: z.object({
    list_id: z.string().describe('List ID'),
    start: z.string().optional().describe('Start date (Unix ms)'),
    start_id: z.string().optional().describe('Start comment ID'),
  }),

  cliMappings: {
    options: [
      { field: 'list_id', flags: '--list-id <id>', description: 'List ID' },
      { field: 'start', flags: '--start <ms>', description: 'Start date (Unix ms)' },
      { field: 'start_id', flags: '--start-id <id>', description: 'Start comment ID' },
    ],
  },

  endpoint: { method: 'GET', path: '/list/{list_id}/comment' },
  fieldMappings: { list_id: 'path', start: 'query', start_id: 'query' },

  handler: (input, client) => executeCommand(listListCommentsCommand, input, client),
};

const createListCommentCommand: CommandDefinition = {
  name: 'comments_create_list',
  group: 'comments',
  subcommand: 'create-list',
  description: 'Create a comment on a list.',
  examples: ['clickup comments create-list --list-id 123 --comment-text "Sprint notes"'],

  inputSchema: z.object({
    list_id: z.string().describe('List ID'),
    comment_text: z.string().describe('Comment text'),
    assignee: z.coerce.number().optional().describe('Assignee user ID'),
    notify_all: z.boolean().optional().describe('Notify all'),
  }),

  cliMappings: {
    options: [
      { field: 'list_id', flags: '--list-id <id>', description: 'List ID' },
      { field: 'comment_text', flags: '--comment-text <text>', description: 'Comment text' },
      { field: 'assignee', flags: '--assignee <id>', description: 'Assignee user ID' },
      { field: 'notify_all', flags: '--notify-all', description: 'Notify all' },
    ],
  },

  endpoint: { method: 'POST', path: '/list/{list_id}/comment' },
  fieldMappings: { list_id: 'path', comment_text: 'body', assignee: 'body', notify_all: 'body' },

  handler: (input, client) => executeCommand(createListCommentCommand, input, client),
};

const listViewCommentsCommand: CommandDefinition = {
  name: 'comments_list_view',
  group: 'comments',
  subcommand: 'list-view',
  description: 'Get comments on a chat view.',
  examples: ['clickup comments list-view --view-id abc'],

  inputSchema: z.object({
    view_id: z.string().describe('View ID'),
    start: z.string().optional().describe('Start date (Unix ms)'),
    start_id: z.string().optional().describe('Start comment ID'),
  }),

  cliMappings: {
    options: [
      { field: 'view_id', flags: '--view-id <id>', description: 'View ID' },
      { field: 'start', flags: '--start <ms>', description: 'Start date (Unix ms)' },
      { field: 'start_id', flags: '--start-id <id>', description: 'Start comment ID' },
    ],
  },

  endpoint: { method: 'GET', path: '/view/{view_id}/comment' },
  fieldMappings: { view_id: 'path', start: 'query', start_id: 'query' },

  handler: (input, client) => executeCommand(listViewCommentsCommand, input, client),
};

const createViewCommentCommand: CommandDefinition = {
  name: 'comments_create_view',
  group: 'comments',
  subcommand: 'create-view',
  description: 'Create a comment on a chat view.',
  examples: ['clickup comments create-view --view-id abc --comment-text "Discussion"'],

  inputSchema: z.object({
    view_id: z.string().describe('View ID'),
    comment_text: z.string().describe('Comment text'),
    assignee: z.coerce.number().optional().describe('Assignee user ID'),
    notify_all: z.boolean().optional().describe('Notify all'),
  }),

  cliMappings: {
    options: [
      { field: 'view_id', flags: '--view-id <id>', description: 'View ID' },
      { field: 'comment_text', flags: '--comment-text <text>', description: 'Comment text' },
      { field: 'assignee', flags: '--assignee <id>', description: 'Assignee user ID' },
      { field: 'notify_all', flags: '--notify-all', description: 'Notify all' },
    ],
  },

  endpoint: { method: 'POST', path: '/view/{view_id}/comment' },
  fieldMappings: { view_id: 'path', comment_text: 'body', assignee: 'body', notify_all: 'body' },

  handler: (input, client) => executeCommand(createViewCommentCommand, input, client),
};

const updateCommand: CommandDefinition = {
  name: 'comments_update',
  group: 'comments',
  subcommand: 'update',
  description: 'Update a comment.',
  examples: ['clickup comments update <comment_id> --comment-text "Updated text"'],

  inputSchema: z.object({
    comment_id: z.string().describe('Comment ID'),
    comment_text: z.string().describe('New comment text'),
    assignee: z.coerce.number().optional().describe('New assignee user ID'),
    resolved: z.boolean().optional().describe('Resolve/unresolve the comment'),
  }),

  cliMappings: {
    args: [{ field: 'comment_id', name: 'comment_id', required: true }],
    options: [
      { field: 'comment_text', flags: '--comment-text <text>', description: 'Comment text' },
      { field: 'assignee', flags: '--assignee <id>', description: 'Assignee user ID' },
      { field: 'resolved', flags: '--resolved', description: 'Resolve comment' },
    ],
  },

  endpoint: { method: 'PUT', path: '/comment/{comment_id}' },
  fieldMappings: { comment_id: 'path', comment_text: 'body', assignee: 'body', resolved: 'body' },

  handler: (input, client) => executeCommand(updateCommand, input, client),
};

const deleteCommand: CommandDefinition = {
  name: 'comments_delete',
  group: 'comments',
  subcommand: 'delete',
  description: 'Delete a comment.',
  examples: ['clickup comments delete <comment_id>'],

  inputSchema: z.object({
    comment_id: z.string().describe('Comment ID'),
  }),

  cliMappings: {
    args: [{ field: 'comment_id', name: 'comment_id', required: true }],
  },

  endpoint: { method: 'DELETE', path: '/comment/{comment_id}' },
  fieldMappings: { comment_id: 'path' },

  handler: (input, client) => executeCommand(deleteCommand, input, client),
};

const listThreadedCommand: CommandDefinition = {
  name: 'comments_list_replies',
  group: 'comments',
  subcommand: 'list-replies',
  description: 'Get threaded replies on a comment.',
  examples: ['clickup comments list-replies <comment_id>'],

  inputSchema: z.object({
    comment_id: z.string().describe('Comment ID'),
  }),

  cliMappings: {
    args: [{ field: 'comment_id', name: 'comment_id', required: true }],
  },

  endpoint: { method: 'GET', path: '/comment/{comment_id}/reply' },
  fieldMappings: { comment_id: 'path' },

  handler: (input, client) => executeCommand(listThreadedCommand, input, client),
};

const createReplyCommand: CommandDefinition = {
  name: 'comments_create_reply',
  group: 'comments',
  subcommand: 'create-reply',
  description: 'Create a threaded reply on a comment.',
  examples: ['clickup comments create-reply <comment_id> --comment-text "Reply text"'],

  inputSchema: z.object({
    comment_id: z.string().describe('Comment ID'),
    comment_text: z.string().describe('Reply text'),
  }),

  cliMappings: {
    args: [{ field: 'comment_id', name: 'comment_id', required: true }],
    options: [
      { field: 'comment_text', flags: '--comment-text <text>', description: 'Reply text' },
    ],
  },

  endpoint: { method: 'POST', path: '/comment/{comment_id}/reply' },
  fieldMappings: { comment_id: 'path', comment_text: 'body' },

  handler: (input, client) => executeCommand(createReplyCommand, input, client),
};

export const allCommentsCommands: CommandDefinition[] = [
  listTaskCommentsCommand,
  createTaskCommentCommand,
  listListCommentsCommand,
  createListCommentCommand,
  listViewCommentsCommand,
  createViewCommentCommand,
  updateCommand,
  deleteCommand,
  listThreadedCommand,
  createReplyCommand,
];
