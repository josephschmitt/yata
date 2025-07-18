import { Model } from '@nozbe/watermelondb';

export default class Project extends Model {
  static override table = 'projects';
  static override associations = {
    user: { type: 'belongs_to', key: 'user_id' },
    tasks: { type: 'has_many', foreignKey: 'project_id' },
  } as const;

  get name(): string {
    return this._getRaw('name') as string;
  }

  get createdAt(): Date {
    return new Date(this._getRaw('created_at') as number);
  }

  get updatedAt(): Date {
    return new Date(this._getRaw('updated_at') as number);
  }

  get userId(): string {
    return this._getRaw('user_id') as string;
  }

  get user() {
    return this.collections.get('users').find(this.userId);
  }

  get tasks() {
    return this.collections.get('tasks').query();
  }
}