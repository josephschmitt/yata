import { Model } from '@nozbe/watermelondb';

export default class TaskDependency extends Model {
  static override table = 'task_dependencies';
  static override associations = {
    blocking: { type: 'belongs_to', key: 'blocking_id' },
    blockedBy: { type: 'belongs_to', key: 'blocked_by_id' },
  } as const;

  get blockingId(): string {
    return this._getRaw('blocking_id') as string;
  }

  get blockedById(): string {
    return this._getRaw('blocked_by_id') as string;
  }

  get createdAt(): Date {
    return new Date(this._getRaw('created_at') as number);
  }

  get blocking() {
    return this.collections.get('tasks').find(this.blockingId);
  }

  get blockedBy() {
    return this.collections.get('tasks').find(this.blockedById);
  }
}