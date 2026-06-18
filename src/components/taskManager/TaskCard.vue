<template>
  <div :id="`task-card-${task.id}`" draggable="true" @dragstart="onDragStart" @dragend="onDragEnd"
    @click="$emit('select-task', task)"
    class="group bg-white rounded-2xl p-5 shadow-[0_4px_16px_rgba(15,23,42,0.04)] border border-slate-100 hover:border-slate-200 hover:shadow-[0_6px_24px_rgba(15,23,42,0.07)] transition-all duration-200 cursor-pointer hover:-translate-y-0.5 select-none text-left relative"
    :class="[isDraggingLocal ? 'opacity-40 animate-pulse border-blue-400' : '']">
    <div class="flex items-center justify-between mb-3.5">
      <span :class="[
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-semibold leading-none uppercase tracking-wide border',
        badgeStyle.bg
      ]">
        <span :class="['w-1.5 h-1.5 rounded-full inline-block', badgeStyle.dot]"></span>
        {{ badgeStyle.text }}
      </span>
      <div class="relative">
        <button type="button" @click.stop="toggleMenu"
          class="p-1 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer">
          <MoreHorizontal class="w-4 h-4" />
        </button>
        <div v-if="showDropdown"
          class="absolute right-0 mt-1 w-28 bg-white border border-slate-150 rounded-xl shadow-lg py-1 z-30  text-left font-sans">
          <button type="button" @click.stop="triggerEdit"
            class="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-medium transition-colors cursor-pointer">
            <Pencil class="w-3 h-3 text-indigo-500" />
            <span>Edit Task</span>
          </button>
          <button type="button" @click.stop="triggerDelete"
            class="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 font-medium transition-colors cursor-pointer">
            <Trash2 class="w-3 h-3 text-rose-500" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
    <div v-if="confirmDelete"
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" @click.stop>
      <div
        class="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm border border-slate-200 text-center animate-scale-up">
        <div class="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 class="w-6 h-6" />
        </div>
        <h3 class="text-base font-bold text-slate-800 mb-2">Are you sure?</h3>
        <p class="text-xs text-slate-500 mb-5">
          This operation is permanent. It will permanently remove this task from your tracking logs.
        </p>
        <div class="flex gap-3">
          <button type="button" @click.stop.prevent="cancelDelete"
            class="flex-1 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors border border-slate-200/50 ">
            Cancel
          </button>
          <button type="button" @click.stop.prevent="handleDelete"
            class="flex-1 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-550 text-white rounded-lg transition-colors shadow-sm">
            Delete Task
          </button>
        </div>
      </div>
    </div>
    <h4 class="text-[14px] font-semibold text-slate-900 mb-1 leading-snug tracking-tight text-left truncate"
      :title="task.title">
      {{ task.title }}
    </h4>

    <p class="text-[12px] text-slate-400 font-normal leading-normal line-clamp-2 min-h-[36px] mb-4 text-left overflow-hidden break-words"
      :title="task.description">
      {{ task.description || 'No description provided.' }}
    </p>

    <div class="flex items-center justify-between mb-4 pb-3.5">
      <span class="text-xs font-medium text-slate-500">Assignees :</span>
      <div class="flex items-center">
        <div class="flex -space-x-1.5 overflow-hidden">
          <div :class="[
            'w-5.5 h-5.5 rounded-full flex items-center justify-center text-[9px] font-bold shadow-sm ring-2 ring-white shrink-0 capitalize',
            getAssigneeColor(task.assignee)
          ]" :title="'Primary: ' + task.assignee">
            {{ getAssigneeInitials(task.assignee) }}
          </div>

          <template v-if="task.secondaryAssignees">
            <div v-for="sa in task.secondaryAssignees" :key="sa" :class="[
              'w-5.5 h-5.5 rounded-full flex items-center justify-center text-[9px] font-bold shadow-sm ring-2 ring-white shrink-0 capitalize',
              getAssigneeColor(sa)
            ]" :title="'Contributor: ' + sa">
              {{ getAssigneeInitials(sa) }}
            </div>
          </template>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between gap-2 mb-4">
      <div :class="[
        'flex items-center gap-1.5 text-[11px] font-normal transition-colors duration-150',
        overdue ? 'text-rose-500 font-semibold' : 'text-slate-400'
      ]">
        <AlertCircle v-if="overdue" class="w-3.5 h-3.5 text-rose-500 shrink-0" />
        <Flag v-else class="w-3.5 h-3.5 text-slate-400" />
        <span>{{ formattedDueDate || task.timeline }}</span>
      </div>

      <span :class="[
        'inline-flex px-2 py-0.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider',
        priorityClasses[task.priority]
      ]">
        {{ priorityLabels[task.priority] }}
      </span>
    </div>

    <div
      class="flex items-center gap-4 text-slate-400 font-medium text-[11px] pt-2 border-t border-solid border-slate-200">
      <div class="flex items-center gap-1">
        <MessageSquare class="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>{{ task.commentsCount || 12 }} Comments</span>
      </div>
      <div class="flex items-center gap-1">
        <Link2 class="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>{{ task.linksCount || 1 }} Links</span>
      </div>
      <div class="flex items-center gap-1">
        <FileText class="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>{{ task.subtasksCompleted || 0 }}/{{ task.subtasksTotal || 3 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Flag, Pencil, Trash2, MoreHorizontal, MessageSquare, Link2, FileText, AlertCircle } from '@lucide/vue';
import { Task, TaskPriority } from '../../BLL/taskManager/types';
import { TaskManager } from '../../BLL/taskManager/TaskManager';

const props = defineProps<{
  task: Task;
  manager: TaskManager;
}>();

const emit = defineEmits<{
  (e: 'edit', task: Task): void;
  (e: 'select-task', task: Task): void;
}>();

const confirmDelete = ref(false);
const isDraggingLocal = ref(false);
const showDropdown = ref(false);

const priorityLabels: Record<TaskPriority, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low'
};

const priorityClasses: Record<TaskPriority, string> = {
  high: 'bg-rose-50 text-rose-500 border border-rose-100',
  medium: 'bg-amber-50 text-amber-500 border border-amber-100',
  low: 'bg-blue-50 text-blue-500 border border-blue-100'
};

const badgeStyle = computed(() => {
  const status = props.task.status;
  const id = props.task.id;

  let designText = 'not started';
  let bg = 'bg-indigo-50 border-indigo-100 text-indigo-600';
  let dot = 'bg-indigo-600';

  if (status === 'done') {
    designText = 'completed';
    bg = 'bg-emerald-50 border-emerald-100 text-emerald-600';
    dot = 'bg-emerald-600';
  } else if (status === 'in-progress') {
    if (id === 'task-5') {
      designText = 'in research';
      bg = 'bg-amber-50 border-amber-100 text-amber-600';
      dot = 'bg-amber-600';
    } else {
      designText = 'on track';
      bg = 'bg-pink-50 border-pink-100 text-pink-600';
      dot = 'bg-pink-600';
    }
  } else {
    if (id === 'task-2') {
      designText = 'in research';
      bg = 'bg-amber-50 border-amber-100 text-amber-600';
      dot = 'bg-amber-600';
    } else {
      designText = 'not started';
      bg = 'bg-indigo-50 border-indigo-100 text-indigo-600';
      dot = 'bg-indigo-600';
    }
  }

  return { text: designText, bg, dot };
});

const formattedDueDate = computed(() => {
  if (!props.task.dueDate) return '';
  const date = new Date(props.task.dueDate + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
});

const overdue = computed(() => {
  if (props.task.status === 'done') return false;
  if (!props.task.dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(props.task.dueDate + 'T00:00:00');
  due.setHours(0, 0, 0, 0);
  return due.getTime() < today.getTime();
});

const getAssigneeInitials = (name: string): string => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

const getAssigneeColor = (name: string): string => {
  if (!name) return 'bg-slate-200 text-slate-700';
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    'bg-[#EBF5FF] text-[#1E56A0] border border-blue-100/20',
    'bg-[#FDF2F8] text-[#9D174D] border border-pink-100/20',
    'bg-[#F0FDF4] text-[#166534] border border-emerald-100/20',
    'bg-[#FEFCE8] text-[#854D0E] border border-yellow-100/20',
    'bg-[#FAF5FF] text-[#6B21A8] border border-purple-100/20',
    'bg-[#F0FDFA] text-[#115E59] border border-teal-100/20',
    'bg-[#FFF7ED] text-[#9A3412] border border-orange-100/20'
  ];
  return colors[Math.abs(hash) % colors.length];
};

const onDragStart = (e: DragEvent) => {
  isDraggingLocal.value = true;
  if (e.dataTransfer) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', props.task.id);
  }
};

const onDragEnd = () => {
  isDraggingLocal.value = false;
};

const toggleMenu = () => {
  showDropdown.value = !showDropdown.value;
};

const closeMenu = () => {
  showDropdown.value = false;
};

onMounted(() => {
  document.addEventListener('click', closeMenu);
});

onUnmounted(() => {
  document.removeEventListener('click', closeMenu);
});

const triggerEdit = () => {
  emit('edit', props.task);
  showDropdown.value = false;
};

const triggerDelete = () => {
  confirmDelete.value = true;
  showDropdown.value = false;
};

const cancelDelete = () => {
  confirmDelete.value = false;
};

const handleDelete = () => {
  props.manager.deleteTask(props.task.id);
  confirmDelete.value = false;
};

</script>
