<template>
  <div id="kanban-board-wrapper" class="w-full overflow-x-auto pb-4">
    <div class="flex gap-5 min-w-[1024px] lg:min-w-full">
      <KanbanColumn status="todo" :manager="manager" :priority-filter="priorityFilter" :assignee-filter="assigneeFilter"
        :search-query="searchQuery" :sort-by="sortBy" @edit="emitEdit" @add-task-to-status="emitAddTask"
        @select-task="emitSelect" />
      <KanbanColumn status="in-progress" :manager="manager" :priority-filter="priorityFilter"
        :assignee-filter="assigneeFilter" :search-query="searchQuery" :sort-by="sortBy" @edit="emitEdit"
        @add-task-to-status="emitAddTask" @select-task="emitSelect" />
      <KanbanColumn status="done" :manager="manager" :priority-filter="priorityFilter" :assignee-filter="assigneeFilter"
        :search-query="searchQuery" :sort-by="sortBy" @edit="emitEdit" @add-task-to-status="emitAddTask"
        @select-task="emitSelect" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Task, TaskPriority, TaskStatus } from '../../BLL/taskManager/types';
import { TaskManager } from '../../BLL/taskManager/TaskManager';
import KanbanColumn from './KanbanColumn.vue';

defineProps<{
  manager: TaskManager;
  priorityFilter: TaskPriority | 'all';
  assigneeFilter: string | 'all';
  searchQuery: string;
  sortBy: string;
}>();

const emit = defineEmits<{
  (e: 'edit', task: Task): void;
  (e: 'add-task-to-status', status: TaskStatus): void;
  (e: 'select-task', task: Task): void;
}>();

const emitEdit = (task: Task) => {
  emit('edit', task);
};

const emitAddTask = (status: TaskStatus) => {
  emit('add-task-to-status', status);
};

const emitSelect = (task: Task) => {
  emit('select-task', task);
};
</script>
