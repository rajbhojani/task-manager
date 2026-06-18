<template>
  <div :id="`kanban-column-${status}`" @dragover.prevent @dragenter.prevent="isDragOver = true"
    @dragleave="isDragOver = false" @drop="onDrop"
    class="flex flex-col flex-1 min-w-[325px] bg-[#f8fafc]/80 rounded-2xl p-5 border border-slate-100 transition-colors duration-250"
    :class="[isDragOver ? 'bg-blue-50/80 border-blue-200' : '']">
    <div class="flex items-center justify-between mb-4.5 select-none px-1">
      <div class="flex items-center gap-2">
        <span :class="['w-2 h-2 rounded-full inline-block', headerDotClass]"></span>
        <h3 class="text-[13px] font-semibold text-slate-800 leading-none uppercase tracking-wider">
          {{ displayTitle }}
        </h3>
        <span
          class="w-5 h-5 flex items-center justify-center rounded-full bg-[#2f6ced] text-white text-[11px] font-bold font-sans">
          {{ tasks.length }}
        </span>
      </div>
      <div class="flex items-center gap-1.5 text-slate-400">
        <button type="button" @click="emitAddTask"
          class="p-1 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          title="Add task to this column">
          <Plus class="w-4 h-4" />
        </button>
        <button type="button"
          class="p-1 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          title="Column options">
          <MoreHorizontal class="w-4 h-4" />
        </button>
      </div>
    </div>
    <div class="flex-1 flex flex-col gap-4.5 min-h-[500px] scrollbar-thin rounded-xl">
      <TaskCard v-for="task in tasks" :key="task.id" :task="task" :manager="manager" @edit="emitTaskEdit"
        @select-task="$emit('select-task', task)" />
      <div v-if="tasks.length === 0"
        class="flex-1 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-2xl p-6 text-center select-none min-h-[220px] bg-white/40 transition-all"
        :class="[isDragOver ? 'border-blue-300 bg-blue-50/20' : '']">
        <component :is="emptyStateContent.icon" class="w-8 h-8 text-slate-300 mb-3" />
        <p class="text-xs font-semibold text-slate-600 mb-1">
          {{ emptyStateContent.title }}
        </p>
        <p class="text-[11px] text-slate-400 max-w-[180px] leading-relaxed">
          {{ emptyStateContent.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ClipboardList, Flame, CheckCircle2, Plus, MoreHorizontal } from '@lucide/vue';
import { Task, TaskPriority, TaskStatus } from '../../BLL/taskManager/types';
import { TaskManager } from '../../BLL/taskManager/TaskManager';
import TaskCard from './TaskCard.vue';

interface EmptyDetail {
  icon: any;
  title: string;
  description: string;
}

const props = defineProps<{
  manager: TaskManager;
  status: TaskStatus;
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

const isDragOver = ref(false);

const displayTitle = computed(() => {
  if (props.status === 'todo') return 'To do';
  if (props.status === 'in-progress') return 'In Progress';
  if (props.status === 'done') return 'Done';
  return props.status;
});

const headerDotClass = computed(() => {
  if (props.status === 'todo') return 'bg-amber-500';
  if (props.status === 'in-progress') return 'bg-[#3b82f6]';
  return 'bg-pink-500';
});

const tasks = computed(() => {
  return props.manager.getFilteredAndSortedTasks(
    props.priorityFilter,
    props.assigneeFilter,
    props.searchQuery,
    props.sortBy,
    props.status
  );
});

const emptyStateContent = computed<EmptyDetail>(() => {
  if (props.status === 'todo') {
    return {
      icon: ClipboardList,
      title: 'No pending tasks',
      description: 'Your backlog of items is currently empty. Tap the + button to add a task.'
    };
  } else if (props.status === 'in-progress') {
    return {
      icon: Flame,
      title: 'Column is empty',
      description: 'Drag a card here to set its status to In Progress.'
    };
  } else {
    return {
      icon: CheckCircle2,
      title: 'Nothing completed yet',
      description: 'Finish lingering assignments and drop them here to claim victory.'
    };
  }
});

const onDrop = (e: DragEvent) => {
  isDragOver.value = false;
  if (e.dataTransfer) {
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      props.manager.moveTo(taskId, props.status);
    }
  }
};

const emitTaskEdit = (task: Task) => {
  emit('edit', task);
};

const emitAddTask = () => {
  emit('add-task-to-status', props.status);
};
</script>
