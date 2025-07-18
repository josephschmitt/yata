import { Model } from '@nozbe/watermelondb';

export default class Task extends Model {
  static override table = 'tasks';
  static override associations = {
    user: { type: 'belongs_to', key: 'user_id' },
    project: { type: 'belongs_to', key: 'project_id' },
    type: { type: 'belongs_to', key: 'type_id' },
    parent: { type: 'belongs_to', key: 'parent_id' },
    subtasks: { type: 'has_many', foreignKey: 'parent_id' },
  } as const;

  get title(): string {
    return this._getRaw('title') as string;
  }

  get content(): string | null {
    return this._getRaw('content') as string | null;
  }

  get status(): string {
    return this._getRaw('status') as string;
  }

  get section(): string {
    return this._getRaw('section') as string;
  }

  get order(): number {
    return this._getRaw('order') as number;
  }

  get urls(): string[] {
    const urlsString = this._getRaw('urls') as string;
    return urlsString ? JSON.parse(urlsString) : [];
  }

  get createdAt(): Date {
    return new Date(this._getRaw('created_at') as number);
  }

  get updatedAt(): Date {
    return new Date(this._getRaw('updated_at') as number);
  }

  get dueDate(): Date | null {
    const timestamp = this._getRaw('due_date') as number | null;
    return timestamp ? new Date(timestamp) : null;
  }

  get whenDate(): Date | null {
    const timestamp = this._getRaw('when_date') as number | null;
    return timestamp ? new Date(timestamp) : null;
  }

  get startedDate(): Date | null {
    const timestamp = this._getRaw('started_date') as number | null;
    return timestamp ? new Date(timestamp) : null;
  }

  get completedDate(): Date | null {
    const timestamp = this._getRaw('completed_date') as number | null;
    return timestamp ? new Date(timestamp) : null;
  }

  get userId(): string {
    return this._getRaw('user_id') as string;
  }

  get projectId(): string | null {
    return this._getRaw('project_id') as string | null;
  }

  get typeId(): string | null {
    return this._getRaw('type_id') as string | null;
  }

  get parentId(): string | null {
    return this._getRaw('parent_id') as string | null;
  }

  get user() {
    return this.collections.get('users').find(this.userId);
  }

  get project() {
    return this.projectId ? this.collections.get('projects').find(this.projectId) : null;
  }

  get type() {
    return this.typeId ? this.collections.get('task_types').find(this.typeId) : null;
  }

  get parent() {
    return this.parentId ? this.collections.get('tasks').find(this.parentId) : null;
  }

  get subtasks() {
    return this.collections.get('tasks').query();
  }
}