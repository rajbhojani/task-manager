import { ref, Ref } from 'vue';
import { Task, TaskPriority, TaskStatus } from './types';
import { mockTasks } from './mockData';

export class TaskManager {
  public tasks: Ref<Task[]>;

  constructor() {
    const saved = localStorage.getItem('task_manager_tasks');
    if (saved) {
      try {
        this.tasks = ref(JSON.parse(saved));
      } catch (e) {
        this.tasks = ref([...mockTasks]);
      }
    } else {
      this.tasks = ref([...mockTasks]);
    }
  }

  private save(): void {
    localStorage.setItem('task_manager_tasks', JSON.stringify(this.tasks.value));
  }

  public getAssignees(): string[] {
    const set = new Set<string>();
    this.tasks.value.forEach(t => {
      if (t.assignee) {
        set.add(t.assignee);
      }
    });
    return Array.from(set);
  }

  public getFilteredAndSortedTasks(
    priority: TaskPriority | 'all',
    assignee: string | 'all',
    searchQuery: string,
    sortBy: string = 'dueDate-asc',
    status?: TaskStatus
  ): Task[] {
    let list = [...this.tasks.value];

    if (status) {
      list = list.filter(t => t.status === status);
    }

    if (priority !== 'all') {
      list = list.filter(t => t.priority === priority);
    }

    if (assignee !== 'all') {
      list = list.filter(t => t.assignee.toLowerCase() === assignee.toLowerCase());
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        t =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      if (sortBy === 'dueDate-asc') {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortBy === 'dueDate-desc') {
        return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      } else if (sortBy === 'priority-asc' || sortBy === 'priority-desc') {
        const priorityOrder: Record<TaskPriority, number> = { low: 1, medium: 2, high: 3 };
        const valA = priorityOrder[a.priority] || 0;
        const valB = priorityOrder[b.priority] || 0;
        return sortBy === 'priority-asc' ? valA - valB : valB - valA;
      }
      return 0;
    });

    return list;
  }

  public addTask(taskData: {
    title: string;
    description: string;
    priority: TaskPriority;
    dueDate: string;
    assignee: string;
    status: TaskStatus;
    tags: string[];
    type?: string;
    timeline?: string;
    checked?: boolean;
    secondaryAssignees?: string[];
    commentsCount?: number;
    linksCount?: number;
    subtasksCompleted?: number;
    subtasksTotal?: number;
  }): Task {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskData.title.trim(),
      description: taskData.description.trim(),
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      assignee: taskData.assignee.trim(),
      status: taskData.status,
      tags: taskData.tags.map(t => t.trim()).filter(Boolean),
      type: taskData.type,
      timeline: taskData.timeline,
      checked: taskData.checked || false,
      secondaryAssignees: taskData.secondaryAssignees || [],
      commentsCount: taskData.commentsCount !== undefined ? taskData.commentsCount : 12,
      linksCount: taskData.linksCount !== undefined ? taskData.linksCount : 1,
      subtasksCompleted: taskData.subtasksCompleted !== undefined ? taskData.subtasksCompleted : 0,
      subtasksTotal: taskData.subtasksTotal !== undefined ? taskData.subtasksTotal : 3,
      createdAt: new Date().toISOString()
    };
    this.tasks.value.push(newTask);
    this.save();
    return newTask;
  }

  public updateTask(taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): void {
    const taskIndex = this.tasks.value.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      this.tasks.value[taskIndex] = {
        ...this.tasks.value[taskIndex],
        ...updates,
        title: updates.title !== undefined ? updates.title.trim() : this.tasks.value[taskIndex].title,
        description: updates.description !== undefined ? updates.description.trim() : this.tasks.value[taskIndex].description,
        assignee: updates.assignee !== undefined ? updates.assignee.trim() : this.tasks.value[taskIndex].assignee,
        tags: updates.tags !== undefined ? updates.tags.map(t => t.trim()).filter(Boolean) : this.tasks.value[taskIndex].tags
      };
      this.save();
    }
  }

  public deleteTask(taskId: string): void {
    this.tasks.value = this.tasks.value.filter(t => t.id !== taskId);
    this.save();
  }

  public moveTo(taskId: string, newStatus: TaskStatus): void {
    const taskIndex = this.tasks.value.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      this.tasks.value[taskIndex] = {
        ...this.tasks.value[taskIndex],
        status: newStatus
      };
      this.save();
    }
  }

  public toggleChecked(taskId: string): void {
    const taskIndex = this.tasks.value.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
      this.tasks.value[taskIndex] = {
        ...this.tasks.value[taskIndex],
        checked: !this.tasks.value[taskIndex].checked
      };
      this.save();
    }
  }
}
