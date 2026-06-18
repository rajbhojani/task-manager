export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  assignee: string;
  status: TaskStatus;
  tags: string[];
  createdAt: string;
  type?: string;
  timeline?: string;
  secondaryAssignees?: string[];
  checked?: boolean;
  commentsCount?: number;
  linksCount?: number;
  subtasksCompleted?: number;
  subtasksTotal?: number;
}

export type ViewType = 'grid' | 'list' | 'calendar' | 'kanban';

export interface FilterState {
  priority: TaskPriority | 'all';
  assignee: string | 'all';
  searchQuery: string;
}

export type SortField = 'dueDate-asc' | 'dueDate-desc' | 'priority-asc' | 'priority-desc';
