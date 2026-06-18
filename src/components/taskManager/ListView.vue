<template>
  <div id="list-view-container" class="space-y-6 select-none overflow-x-auto">
    <div v-for="status in statusGroups" :key="status.key"
      class="border border-slate-200/60 rounded-2xl bg-white overflow-hidden shadow-sm">
      <div @click="toggleGroup(status.key)"
        class="flex items-center justify-between p-4 bg-slate-50/70 border-b border-slate-100 cursor-pointer hover:bg-slate-100/40 transition-all select-none">
        <div class="flex items-center gap-3">
          <span :class="[
            'px-2.5 py-1 rounded-lg text-xs font-bold leading-none tracking-wide text-[11px] uppercase border border-slate-200/10 flex items-center gap-1.5',
            statusLabelColors[status.key]
          ]">
            <span :class="['w-1.5 h-1.5 rounded-full inline-block', statusDotColors[status.key]]"></span>
            {{ status.title }}
          </span>
          <span
            class="flex items-center justify-center w-5 h-5 text-xs font-bold bg-slate-200/50 text-slate-500 rounded-lg">
            {{ getGroupTasks(status.key).length }}
          </span>
        </div>

        <ChevronRight class="w-4 h-4 text-slate-400 transition-transform duration-200"
          :class="[!collapsedGroups[status.key] ? 'rotate-90 text-slate-600 ' : '']" />
      </div>
      <div v-show="!collapsedGroups[status.key]" class="overflow-x-auto">
        <table class="w-full text-left text-xs min-w-[900px]">
          <thead
            class="bg-slate-50/30 text-slate-405 font-semibold tracking-wider uppercase text-[10px] border-b border-slate-100 leading-none">
            <tr>
              <th class="py-3.5 px-4 w-[32%] font-semibold text-slate-400 border-r border-dashed border-slate-200/80">
                <div class="flex items-center gap-1.5 capitalize text-[11px] tracking-normal font-bold">
                  <ListTodo class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Task Name</span>
                </div>
              </th>
              <th class="py-3.5 px-4 w-[28%] font-semibold text-slate-400 border-r border-dashed border-slate-200/80">
                <div class="flex items-center gap-1.5 capitalize text-[11px] tracking-normal font-bold">
                  <AlignLeft class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Descriptions</span>
                </div>
              </th>
              <th class="py-3.5 px-4 w-[10%] font-semibold text-slate-400 border-r border-dashed border-slate-200/80">
                <div class="flex items-center gap-1.5 capitalize text-[11px] tracking-normal font-bold">
                  <Users class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>People</span>
                </div>
              </th>
              <th class="py-3.5 px-4 w-[10%] font-semibold text-slate-400 border-r border-dashed border-slate-200/80">
                <div class="flex items-center gap-1.5 capitalize text-[11px] tracking-normal font-bold">
                  <Layers class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Type</span>
                </div>
              </th>
              <th class="py-3.5 px-4 w-[12%] font-semibold text-slate-400 border-r border-dashed border-slate-200/80">
                <div class="flex items-center gap-1.5 capitalize text-[11px] tracking-normal font-bold">
                  <CalendarDays class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Timeline Date</span>
                </div>
              </th>
              <th class="py-3.5 px-4 w-[10%] font-semibold text-slate-400 border-r border-dashed border-slate-200/80">
                <div class="flex items-center gap-1.5 capitalize text-[11px] tracking-normal font-bold">
                  <Flag class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Priority</span>
                </div>
              </th>
              <th class="py-3.5 px-4 w-[5%] text-center font-bold text-slate-400">Actions</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100">
            <tr v-for="task in getGroupTasks(status.key)" :key="task.id" @click="$emit('select-task', task)"
              class="hover:bg-slate-50/80 group transition-colors duration-150 cursor-pointer">
              <td
                class="py-3 px-4 font-semibold text-slate-855 border-r border-dashed border-slate-200/80 whitespace-nowrap">
                <div class="flex items-center gap-1.5">
                  <span class="cursor-grab text-slate-350 opacity-0 group-hover:opacity-100 transition-opacity pr-0.5">
                    <GripVertical class="w-3.5 h-3.5" />
                  </span>

                  <input type="checkbox" :checked="task.checked" @change="toggleTaskCheckedState(task)" @click.stop
                    class="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer transition-all mr-2 shrink-0" />

                  <span class="truncate font-semibold text-[14px] transition-all mr-2 text-slate-900">
                    {{ task.title }}
                  </span>
                </div>
              </td>

              <td
                class="py-3 px-4 text-slate-500 max-w-[250px] truncate leading-relaxed font-normal text-xs border-r border-dashed border-slate-200/80 whitespace-nowrap">
                {{ task.description || '-' }}
              </td>

              <td class="py-3 px-4 border-r border-dashed border-slate-200/80 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex -space-x-1 hover:space-x-0.5 transition-all overflow-hidden">
                    <div :class="[
                      'w-5.5 h-5.5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 capitalize',
                      getAssigneeColor(task.assignee)
                    ]" :title="'Primary: ' + task.assignee">
                      {{ getAssigneeInitials(task.assignee) }}
                    </div>

                    <template v-if="task.secondaryAssignees">
                      <div v-for="sa in task.secondaryAssignees.slice(0, 3)" :key="sa" :class="[
                        'w-5.5 h-5.5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 capitalize',
                        getAssigneeColor(sa)
                      ]" :title="'Contributor: ' + sa">
                        {{ getAssigneeInitials(sa) }}
                      </div>
                    </template>
                  </div>
                </div>
              </td>

              <td class="py-3 px-4 border-r border-dashed border-slate-200/80 whitespace-nowrap">
                <span v-if="task.type" :class="[
                  'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-semibold border select-none leading-none tracking-wide',
                  getTypeBadgeInfo(task.type).classes
                ]">
                  <span class="font-mono text-[11px] font-bold opacity-80">{{ getTypeBadgeInfo(task.type).prefix
                    }}</span>
                  <span>{{ getTypeBadgeInfo(task.type).label }}</span>
                </span>
                <span v-else class="text-slate-400">-</span>
              </td>

              <td class="py-3 px-4 border-r border-dashed border-slate-200/80 whitespace-nowrap">
                <div
                  :class="['flex items-center gap-1.5 text-[11px] font-normal', isOverdue(task) ? 'text-rose-500 font-semibold' : 'text-slate-500']">
                  <AlertCircle v-if="isOverdue(task)" class="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>{{ task.timeline || formatDueDate(task.dueDate) }}</span>
                </div>
              </td>

              <td class="py-3 px-4 border-r border-dashed border-slate-200/80 whitespace-nowrap">
                <span :class="[
                  'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[11px] font-semibold uppercase tracking-wider border',
                  priorityLabelColors[task.priority]
                ]">
                  <Flag class="w-3 h-3 fill-current" />
                  <span>{{ priorityLabelText[task.priority] }}</span>
                </span>
              </td>

              <td class="py-3 px-4 text-slate-400 text-center relative whitespace-nowrap">
                <div class="inline-block text-left">
                  <button type="button" @click.stop="toggleDropdown(task.id, $event)"
                    class="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-700 rounded-lg transition-colors cursor-pointer"
                    title="Task Actions">
                    <MoreHorizontal class="w-4.5 h-4.5" />
                  </button>

                  <div v-if="activeDropdownTaskId === task.id"
                    class="absolute right-4 mt-1 w-28 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-30 animate-fade-in text-left font-sans">
                    <button type="button" @click.stop="$emit('edit', task); activeDropdownTaskId = null;"
                      class="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-bold transition-colors text-left">
                      <Pencil class="w-3 h-3 text-indigo-500" />
                      <span>Edit Task</span>
                    </button>
                    <button type="button" @click.stop="triggerDelete(task.id); activeDropdownTaskId = null;"
                      class="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 font-bold transition-colors text-left">
                      <Trash2 class="w-3 h-3 text-rose-500" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </td>
            </tr>
            <tr v-if="getGroupTasks(status.key).length === 0">
              <td colspan="7" class="py-8 px-4 text-center text-slate-400 font-medium italic">
                No matching tasks in this group.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="taskToDelete"
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
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
          <button type="button" @click="cancelDelete"
            class="flex-1 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors border border-slate-200/50 ">
            Cancel
          </button>
          <button type="button" @click="confirmDeleteAction"
            class="flex-1 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-550 text-white rounded-lg transition-colors shadow-sm">
            Delete Task
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  ChevronRight,
  GripVertical,
  AlertCircle,
  Pencil,
  Trash2,
  Flag,
  ListTodo,
  AlignLeft,
  Users,
  Layers,
  CalendarDays,
  MoreHorizontal
} from '@lucide/vue';
import { Task, TaskPriority, TaskStatus } from '../../BLL/taskManager/types';
import { TaskManager } from '../../BLL/taskManager/TaskManager';

const props = defineProps<{
  manager: TaskManager;
  priorityFilter: TaskPriority | 'all';
  assigneeFilter: string | 'all';
  searchQuery: string;
  sortBy: string;
}>();

defineEmits<{
  (e: 'edit', task: Task): void;
  (e: 'select-task', task: Task): void;
}>();

const collapsedGroups = ref<Record<TaskStatus, boolean>>({
  todo: false,
  'in-progress': false,
  done: false
});

const taskToDelete = ref<string | null>(null);
const activeDropdownTaskId = ref<string | null>(null);

const statusGroups: Array<{ key: TaskStatus; title: string }> = [
  { key: 'todo', title: 'Not Started' },
  { key: 'in-progress', title: 'In Progress' },
  { key: 'done', title: 'Done' }
];

const priorityLabelText: Record<TaskPriority, string> = {
  high: 'Urgent',
  medium: 'Normal',
  low: 'Lowest'
};

const priorityLabelColors: Record<TaskPriority, string> = {
  high: 'bg-rose-50 text-rose-500 border-rose-200/55 ',
  medium: 'bg-amber-50 text-amber-500 border-amber-200/55 ',
  low: 'bg-blue-50 text-blue-500 border-blue-200/55 '
};

const statusLabelColors: Record<TaskStatus, string> = {
  todo: 'bg-[#FEECEB] text-[#F45B4B] border border-red-200/20',
  'in-progress': 'bg-[#FEF5E5] text-[#DFA129] border border-amber-200/20',
  done: 'bg-[#E5F9F1] text-[#24C27D] border border-emerald-250/20'
};

const statusDotColors: Record<TaskStatus, string> = {
  todo: 'bg-[#F45B4B]',
  'in-progress': 'bg-[#DFA129]',
  done: 'bg-[#24C27D]'
};

const getTypeBadgeInfo = (typeStr: string) => {
  const t = (typeStr || '').trim().toLowerCase();
  if (t === 'bug') {
    return {
      prefix: '(x)',
      label: 'bug',
      classes: 'bg-slate-50 text-slate-500 border border-slate-200/50'
    };
  }
  if (t === 'review' || t === 'in research') {
    return {
      prefix: '(...)',
      label: 'Review',
      classes: 'bg-slate-50 text-slate-500 border border-slate-200/50'
    };
  }
  if (t === 'testing' || t === 'on track' || t === 'complete') {
    return {
      prefix: '(✓)',
      label: 'Testing',
      classes: 'bg-slate-50 text-slate-500 border border-slate-200/50'
    };
  }
  if (t === 'feature' || t === 'not started') {
    return {
      prefix: '(✦)',
      label: 'Feature',
      classes: 'bg-slate-50 text-slate-500 border border-slate-200/50'
    };
  }
  return {
    prefix: '(✦)',
    label: 'Feature',
    classes: 'bg-slate-50 text-slate-500 border border-slate-200/50'
  };
};

const toggleGroup = (key: TaskStatus) => {
  collapsedGroups.value[key] = !collapsedGroups.value[key];
};

const getGroupTasks = (status: TaskStatus) => {
  return props.manager.getFilteredAndSortedTasks(
    props.priorityFilter,
    props.assigneeFilter,
    props.searchQuery,
    props.sortBy,
    status
  );
};

const toggleTaskCheckedState = (task: Task) => {
  props.manager.toggleChecked(task.id);
};

const toggleDropdown = (taskId: string, event: Event) => {
  if (activeDropdownTaskId.value === taskId) {
    activeDropdownTaskId.value = null;
  } else {
    activeDropdownTaskId.value = taskId;
  }
};

const closeAllDropdowns = () => {
  activeDropdownTaskId.value = null;
};

onMounted(() => {
  document.addEventListener('click', closeAllDropdowns);
});

onUnmounted(() => {
  document.removeEventListener('click', closeAllDropdowns);
});

const formatDueDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const isOverdue = (task: Task): boolean => {
  if (task.status === 'done') return false;
  if (!task.dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(task.dueDate + 'T00:00:00');
  due.setHours(0, 0, 0, 0);
  return due.getTime() < today.getTime();
};

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
    'bg-[#EBF5FF] text-[#1E56A0]',
    'bg-[#FDF2F8] text-[#9D174D]',
    'bg-[#F0FDF4] text-[#166534]',
    'bg-[#FEFCE8] text-[#854D0E]',
    'bg-[#FAF5FF] text-[#6B21A8]',
    'bg-[#F0FDFA] text-[#115E59]',
    'bg-[#FFF7ED] text-[#9A3412] font-bold'
  ];
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const triggerDelete = (id: string) => {
  taskToDelete.value = id;
};

const cancelDelete = () => {
  taskToDelete.value = null;
};

const confirmDeleteAction = () => {
  if (taskToDelete.value) {
    props.manager.deleteTask(taskToDelete.value);
    taskToDelete.value = null;
  }
};
</script>

<style scoped>
.bg-slate-55\/40 {
  background-color: rgba(241, 245, 249, 0.4);
}

th,
td {
  white-space: nowrap;
}
</style>
