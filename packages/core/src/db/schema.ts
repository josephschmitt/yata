import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'users',
      columns: [
        { name: 'email', type: 'string', isIndexed: true },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'tasks',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'content', type: 'string', isOptional: true },
        { name: 'status', type: 'string', isIndexed: true },
        { name: 'section', type: 'string', isIndexed: true },
        { name: 'order', type: 'number' },
        { name: 'urls', type: 'string' }, // JSON string array
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'due_date', type: 'number', isOptional: true },
        { name: 'when_date', type: 'number', isOptional: true },
        { name: 'started_date', type: 'number', isOptional: true },
        { name: 'completed_date', type: 'number', isOptional: true },
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'project_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'type_id', type: 'string', isOptional: true, isIndexed: true },
        { name: 'parent_id', type: 'string', isOptional: true, isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'task_dependencies',
      columns: [
        { name: 'blocking_id', type: 'string', isIndexed: true },
        { name: 'blocked_by_id', type: 'string', isIndexed: true },
        { name: 'created_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'projects',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'user_id', type: 'string', isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'task_types',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'icon', type: 'string' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'user_id', type: 'string', isIndexed: true },
      ],
    }),
  ],
});