import { z } from 'zod';

// Base schemas for common types
export const uuidSchema = z.string().uuid();
export const emailSchema = z.string().email();
export const dateSchema = z.date();

// User schema
export const userSchema = z.object({
  id: uuidSchema,
  email: emailSchema,
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

export const createUserSchema = z.object({
  email: emailSchema,
});

export const updateUserSchema = z.object({
  email: emailSchema.optional(),
});

// Task schema
export const taskSchema = z.object({
  id: uuidSchema,
  title: z.string().min(1),
  content: z.string().nullable(),
  status: z.string(),
  section: z.string(),
  order: z.number(),
  urls: z.array(z.string().url()),
  createdAt: dateSchema,
  updatedAt: dateSchema,
  dueDate: dateSchema.nullable(),
  whenDate: dateSchema.nullable(),
  startedDate: dateSchema.nullable(),
  completedDate: dateSchema.nullable(),
  userId: uuidSchema,
  projectId: uuidSchema.nullable(),
  typeId: uuidSchema.nullable(),
  parentId: uuidSchema.nullable(),
});

export const createTaskSchema = z.object({
  title: z.string().min(1),
  content: z.string().optional(),
  status: z.string().default('todo'),
  section: z.string().default('Inbox'),
  order: z.number().default(0),
  urls: z.array(z.string().url()).default([]),
  dueDate: dateSchema.optional(),
  whenDate: dateSchema.optional(),
  startedDate: dateSchema.optional(),
  completedDate: dateSchema.optional(),
  userId: uuidSchema,
  projectId: uuidSchema.optional(),
  typeId: uuidSchema.optional(),
  parentId: uuidSchema.optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().nullable().optional(),
  status: z.string().optional(),
  section: z.string().optional(),
  order: z.number().optional(),
  urls: z.array(z.string().url()).optional(),
  dueDate: dateSchema.nullable().optional(),
  whenDate: dateSchema.nullable().optional(),
  startedDate: dateSchema.nullable().optional(),
  completedDate: dateSchema.nullable().optional(),
  projectId: uuidSchema.nullable().optional(),
  typeId: uuidSchema.nullable().optional(),
  parentId: uuidSchema.nullable().optional(),
});

// Task Dependency schema
export const taskDependencySchema = z.object({
  id: uuidSchema,
  blockingId: uuidSchema,
  blockedById: uuidSchema,
  createdAt: dateSchema,
});

export const createTaskDependencySchema = z.object({
  blockingId: uuidSchema,
  blockedById: uuidSchema,
});

// Project schema
export const projectSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1),
  createdAt: dateSchema,
  updatedAt: dateSchema,
  userId: uuidSchema,
});

export const createProjectSchema = z.object({
  name: z.string().min(1),
  userId: uuidSchema,
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).optional(),
});

// TaskType schema
export const taskTypeSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1),
  icon: z.string(),
  createdAt: dateSchema,
  updatedAt: dateSchema,
  userId: uuidSchema,
});

export const createTaskTypeSchema = z.object({
  name: z.string().min(1),
  icon: z.string(),
  userId: uuidSchema,
});

export const updateTaskTypeSchema = z.object({
  name: z.string().min(1).optional(),
  icon: z.string().optional(),
});

// Sync schemas
export const syncChangesSchema = z.object({
  tasks: z.object({
    created: z.array(createTaskSchema).default([]),
    updated: z.array(z.object({
      id: uuidSchema,
      changes: updateTaskSchema,
    })).default([]),
    deleted: z.array(uuidSchema).default([]),
  }).optional(),
  projects: z.object({
    created: z.array(createProjectSchema).default([]),
    updated: z.array(z.object({
      id: uuidSchema,
      changes: updateProjectSchema,
    })).default([]),
    deleted: z.array(uuidSchema).default([]),
  }).optional(),
  taskTypes: z.object({
    created: z.array(createTaskTypeSchema).default([]),
    updated: z.array(z.object({
      id: uuidSchema,
      changes: updateTaskTypeSchema,
    })).default([]),
    deleted: z.array(uuidSchema).default([]),
  }).optional(),
});

export const syncRequestSchema = z.object({
  lastPulledAt: dateSchema.optional(),
  changes: syncChangesSchema.optional(),
});

export const syncResponseSchema = z.object({
  changes: z.object({
    tasks: z.object({
      created: z.array(taskSchema).default([]),
      updated: z.array(taskSchema).default([]),
    }).optional(),
    projects: z.object({
      created: z.array(projectSchema).default([]),
      updated: z.array(projectSchema).default([]),
    }).optional(),
    taskTypes: z.object({
      created: z.array(taskTypeSchema).default([]),
      updated: z.array(taskTypeSchema).default([]),
    }).optional(),
  }),
});

// Type exports
export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;

export type Task = z.infer<typeof taskSchema>;
export type CreateTask = z.infer<typeof createTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;

export type TaskDependency = z.infer<typeof taskDependencySchema>;
export type CreateTaskDependency = z.infer<typeof createTaskDependencySchema>;

export type Project = z.infer<typeof projectSchema>;
export type CreateProject = z.infer<typeof createProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;

export type TaskType = z.infer<typeof taskTypeSchema>;
export type CreateTaskType = z.infer<typeof createTaskTypeSchema>;
export type UpdateTaskType = z.infer<typeof updateTaskTypeSchema>;

export type SyncRequest = z.infer<typeof syncRequestSchema>;
export type SyncResponse = z.infer<typeof syncResponseSchema>;
export type SyncChanges = z.infer<typeof syncChangesSchema>;