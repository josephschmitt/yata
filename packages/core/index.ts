// Export validation schemas and types
export * from './src/validation';

// Export database schema
export { schema } from './src/db/schema';

// Export database models with different names to avoid conflicts
export {
  User as UserModel,
  Task as TaskModel,
  TaskDependency as TaskDependencyModel,
  Project as ProjectModel,
  TaskType as TaskTypeModel,
} from './src/db/models';