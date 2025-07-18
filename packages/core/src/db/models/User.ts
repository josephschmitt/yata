import { Model } from '@nozbe/watermelondb';

export default class User extends Model {
  static override table = 'users';
  static override associations = {
    tasks: { type: 'has_many', foreignKey: 'user_id' },
    projects: { type: 'has_many', foreignKey: 'user_id' },
    task_types: { type: 'has_many', foreignKey: 'user_id' },
  } as const;

  get email(): string {
    return this._getRaw('email') as string;
  }

  get createdAt(): Date {
    return new Date(this._getRaw('created_at') as number);
  }

  get updatedAt(): Date {
    return new Date(this._getRaw('updated_at') as number);
  }

  get tasks() {
    return this.collections.get('tasks').query();
  }

  get projects() {
    return this.collections.get('projects').query();
  }

  get taskTypes() {
    return this.collections.get('task_types').query();
  }
}