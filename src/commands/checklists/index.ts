import { z } from 'zod';
import type { CommandDefinition } from '../../core/types.js';
import { executeCommand } from '../../core/handler.js';

const createCommand: CommandDefinition = {
  name: 'checklists_create',
  group: 'checklists',
  subcommand: 'create',
  description: 'Create a checklist on a task.',
  examples: ['clickup checklists create --task-id abc --name "QA Steps"'],

  inputSchema: z.object({
    task_id: z.string().describe('Task ID'),
    name: z.string().describe('Checklist name'),
  }),

  cliMappings: {
    options: [
      { field: 'task_id', flags: '--task-id <id>', description: 'Task ID' },
      { field: 'name', flags: '--name <name>', description: 'Checklist name' },
    ],
  },

  endpoint: { method: 'POST', path: '/task/{task_id}/checklist' },
  fieldMappings: { task_id: 'path', name: 'body' },

  handler: (input, client) => executeCommand(createCommand, input, client),
};

const updateCommand: CommandDefinition = {
  name: 'checklists_update',
  group: 'checklists',
  subcommand: 'update',
  description: 'Update a checklist (rename or reorder).',
  examples: ['clickup checklists update <checklist_id> --name "Updated QA"'],

  inputSchema: z.object({
    checklist_id: z.string().describe('Checklist ID'),
    name: z.string().optional().describe('New checklist name'),
    position: z.coerce.number().optional().describe('Position (0-indexed)'),
  }),

  cliMappings: {
    args: [{ field: 'checklist_id', name: 'checklist_id', required: true }],
    options: [
      { field: 'name', flags: '--name <name>', description: 'Checklist name' },
      { field: 'position', flags: '--position <n>', description: 'Position' },
    ],
  },

  endpoint: { method: 'PUT', path: '/checklist/{checklist_id}' },
  fieldMappings: { checklist_id: 'path', name: 'body', position: 'body' },

  handler: (input, client) => executeCommand(updateCommand, input, client),
};

const deleteCommand: CommandDefinition = {
  name: 'checklists_delete',
  group: 'checklists',
  subcommand: 'delete',
  description: 'Delete a checklist.',
  examples: ['clickup checklists delete <checklist_id>'],

  inputSchema: z.object({
    checklist_id: z.string().describe('Checklist ID'),
  }),

  cliMappings: {
    args: [{ field: 'checklist_id', name: 'checklist_id', required: true }],
  },

  endpoint: { method: 'DELETE', path: '/checklist/{checklist_id}' },
  fieldMappings: { checklist_id: 'path' },

  handler: (input, client) => executeCommand(deleteCommand, input, client),
};

const createItemCommand: CommandDefinition = {
  name: 'checklists_create_item',
  group: 'checklists',
  subcommand: 'create-item',
  description: 'Add an item to a checklist.',
  examples: ['clickup checklists create-item --checklist-id abc --name "Step 1"'],

  inputSchema: z.object({
    checklist_id: z.string().describe('Checklist ID'),
    name: z.string().describe('Item name'),
    assignee: z.coerce.number().optional().describe('Assignee user ID'),
  }),

  cliMappings: {
    options: [
      { field: 'checklist_id', flags: '--checklist-id <id>', description: 'Checklist ID' },
      { field: 'name', flags: '--name <name>', description: 'Item name' },
      { field: 'assignee', flags: '--assignee <id>', description: 'Assignee user ID' },
    ],
  },

  endpoint: { method: 'POST', path: '/checklist/{checklist_id}/checklist_item' },
  fieldMappings: { checklist_id: 'path', name: 'body', assignee: 'body' },

  handler: (input, client) => executeCommand(createItemCommand, input, client),
};

const updateItemCommand: CommandDefinition = {
  name: 'checklists_update_item',
  group: 'checklists',
  subcommand: 'update-item',
  description: 'Update a checklist item (rename, resolve, assign).',
  examples: ['clickup checklists update-item --checklist-id abc --item-id def --resolved true'],

  inputSchema: z.object({
    checklist_id: z.string().describe('Checklist ID'),
    checklist_item_id: z.string().describe('Checklist item ID'),
    name: z.string().optional().describe('Item name'),
    resolved: z.boolean().optional().describe('Mark resolved'),
    assignee: z.coerce.number().optional().describe('Assignee user ID'),
    parent: z.string().optional().describe('Parent checklist item ID (nest under)'),
  }),

  cliMappings: {
    options: [
      { field: 'checklist_id', flags: '--checklist-id <id>', description: 'Checklist ID' },
      { field: 'checklist_item_id', flags: '--item-id <id>', description: 'Item ID' },
      { field: 'name', flags: '--name <name>', description: 'Item name' },
      { field: 'resolved', flags: '--resolved', description: 'Mark resolved' },
      { field: 'assignee', flags: '--assignee <id>', description: 'Assignee user ID' },
      { field: 'parent', flags: '--parent <id>', description: 'Parent item ID' },
    ],
  },

  endpoint: { method: 'PUT', path: '/checklist/{checklist_id}/checklist_item/{checklist_item_id}' },
  fieldMappings: { checklist_id: 'path', checklist_item_id: 'path', name: 'body', resolved: 'body', assignee: 'body', parent: 'body' },

  handler: (input, client) => executeCommand(updateItemCommand, input, client),
};

const deleteItemCommand: CommandDefinition = {
  name: 'checklists_delete_item',
  group: 'checklists',
  subcommand: 'delete-item',
  description: 'Delete a checklist item.',
  examples: ['clickup checklists delete-item --checklist-id abc --item-id def'],

  inputSchema: z.object({
    checklist_id: z.string().describe('Checklist ID'),
    checklist_item_id: z.string().describe('Checklist item ID'),
  }),

  cliMappings: {
    options: [
      { field: 'checklist_id', flags: '--checklist-id <id>', description: 'Checklist ID' },
      { field: 'checklist_item_id', flags: '--item-id <id>', description: 'Item ID' },
    ],
  },

  endpoint: { method: 'DELETE', path: '/checklist/{checklist_id}/checklist_item/{checklist_item_id}' },
  fieldMappings: { checklist_id: 'path', checklist_item_id: 'path' },

  handler: (input, client) => executeCommand(deleteItemCommand, input, client),
};

export const allChecklistsCommands: CommandDefinition[] = [
  createCommand,
  updateCommand,
  deleteCommand,
  createItemCommand,
  updateItemCommand,
  deleteItemCommand,
];
