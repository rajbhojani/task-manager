<template>
  <div v-if="isOpen"
    class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in select-none">
    <div
      class="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-200 overflow-hidden transform transition-all animate-scale-up">
      <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h3 class="text-base font-bold text-slate-800">
          {{ taskToEdit ? 'Edit Task Details' : 'Create New Task' }}
        </h3>
        <button type="button" @click="closeModal"
          class="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer">
          <X class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="saveForm" class="p-6 space-y-5 max-h-[80vh] overflow-y-auto scrollbar-thin">
        <div>
          <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 text-left">
            Task Title <span class="text-rose-500">*</span>
          </label>
          <input v-model="form.title" type="text" placeholder="e.g., Design Homepage Wireframe"
            class="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none transition-all text-slate-800" :class="[
              errors.title
                ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-200'
                : 'border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-120'
            ]" />
          <span v-if="errors.title" class="block mt-1 text-[11px] text-rose-500 font-semibold text-left">
            {{ errors.title }}
          </span>
        </div>
        <div>
          <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 text-left">
            Task Description
          </label>
          <textarea v-model="form.description" rows="2"
            placeholder="Add detailed task instructions, scope, and parameters..."
            class="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-120 text-slate-800 transition-all resize-none"></textarea>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 text-left">
            Assignees <span class="text-slate-400 font-normal">(Select 1 or more people)</span>
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button v-for="name in defaultTeam" :key="name" type="button" @click="toggleFormAssignee(name)" :class="[
              'flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all duration-150 text-left cursor-pointer',
              isAssigneeSelected(name)
                ? 'bg-indigo-50/70 border-indigo-200 text-indigo-700 font-semibold shadow-xs ring-1 ring-indigo-200/50'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
            ]">
              <span
                class="w-5.5 h-5.5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 shadow-xs"
                :class="getAssigneeColor(name)">
                {{ getAssigneeInitials(name) }}
              </span>
              <span class="truncate">{{ name }}</span>
            </button>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 text-left">
              Priority Level
            </label>
            <select v-model="form.priority"
              class="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-120 text-slate-800 transition-all cursor-pointer bg-white">
              <option value="low">Low Priority (Lowest)</option>
              <option value="medium">Medium Priority (Normal)</option>
              <option value="high">High Priority (Urgent)</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 text-left">
              Due Date <span class="text-rose-500">*</span>
            </label>
            <input v-model="form.dueDate" type="date"
              class="w-full px-3 py-2 text-xs border rounded-lg focus:outline-none transition-all text-slate-800 cursor-pointer"
              :class="[
                errors.dueDate
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-200'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-120'
              ]" />
            <span v-if="errors.dueDate" class="block mt-1 text-[11px] text-rose-500 font-semibold text-left">
              {{ errors.dueDate }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 text-left">
              Task Type / Tag Status
            </label>
            <select v-model="form.type"
              class="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-120 text-slate-800 transition-all cursor-pointer bg-white">
              <option value="Feature">Feature</option>
              <option value="Bug">Bug</option>
              <option value="Testing">Testing</option>
              <option value="Review">Review</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 text-left">
              Timeline Range
            </label>
            <input v-model="form.timeline" type="text" placeholder="e.g., 02 Nov 2023"
              class="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-120 text-slate-800 transition-all" />
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 text-left">
              Workflow Status
            </label>
            <select v-model="form.status"
              class="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-120 text-slate-800 transition-all cursor-pointer bg-white">
              <option value="todo">To do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 text-left">
              Subtasks Progress (done / total)
            </label>
            <div class="flex gap-2">
              <input v-model.number="form.subtasksCompleted" type="number" min="0" placeholder="0"
                class="w-1/2 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 text-slate-800 transition-all" />
              <span class="text-xs text-slate-400 self-center">/</span>
              <input v-model.number="form.subtasksTotal" type="number" min="0" placeholder="3"
                class="w-1/2 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 text-slate-800 transition-all" />
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 text-left">
              Comments Count
            </label>
            <input v-model.number="form.commentsCount" type="number" min="0"
              class="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-slate-800 transition-all" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 text-left">
              Links Count
            </label>
            <input v-model.number="form.linksCount" type="number" min="0"
              class="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 text-slate-800 transition-all" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 text-left">
            Tags / Labels (comma separated)
          </label>
          <div class="flex gap-2">
            <input v-model="tagInput" type="text" placeholder="auth, ux, backend... then press add"
              @keydown.enter.prevent="addTagsFromInput"
              class="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-120 text-slate-800 transition-all" />
            <button type="button" @click="addTagsFromInput"
              class="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200/40 transition-colors cursor-pointer">
              Add
            </button>
          </div>

          <div v-if="form.tags.length > 0" class="flex flex-wrap gap-1.5 mt-2.5">
            <span v-for="(tag, idx) in form.tags" :key="idx"
              class="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
              #{{ tag }}
              <button type="button" @click="removeTag(idx)"
                class="text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer">
                <X class="w-3" />
              </button>
            </span>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <button type="button" @click="closeModal"
            class="px-4 py-2 text-xs font-semibold bg-white hover:bg-slate-50 text-slate-500 rounded-xl transition-all border border-slate-200 cursor-pointer">
            Cancel
          </button>
          <button type="submit"
            class="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl transition-all shadow-md shadow-indigo-500/10 hover:shadow-lg hover:shadow-indigo-500/15 cursor-pointer">
            {{ taskToEdit ? 'Save Changes' : 'Create Task' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { X } from '@lucide/vue';
import { Task, TaskPriority, TaskStatus } from '../../BLL/taskManager/types';
import { TaskManager } from '../../BLL/taskManager/TaskManager';

const props = defineProps<{
  isOpen: boolean;
  taskToEdit: Task | null;
  manager: TaskManager;
  defaultStatus?: TaskStatus;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saved'): void;
}>();

const defaultTeam = ['Devrizal Akbar', 'Talan Korsgaard', 'Hanna Philips', 'Davis Donin'];

const form = ref<{
  title: string;
  description: string;
  priority: TaskPriority;
  dueDate: string;
  assignee: string;
  secondaryAssignees: string[];
  status: TaskStatus;
  tags: string[];
  type?: string;
  timeline?: string;
  commentsCount?: number;
  linksCount?: number;
  subtasksCompleted?: number;
  subtasksTotal?: number;
}>({
  title: '',
  description: '',
  priority: 'low',
  dueDate: '',
  assignee: '',
  secondaryAssignees: [],
  status: 'todo',
  tags: [],
  type: 'Feature',
  timeline: '',
  commentsCount: 12,
  linksCount: 1,
  subtasksCompleted: 0,
  subtasksTotal: 3
});

const tagInput = ref('');
const errors = ref({
  title: '',
  dueDate: ''
});

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      if (props.taskToEdit) {
        form.value = {
          title: props.taskToEdit.title,
          description: props.taskToEdit.description,
          priority: props.taskToEdit.priority,
          dueDate: props.taskToEdit.dueDate,
          assignee: props.taskToEdit.assignee,
          secondaryAssignees: [...(props.taskToEdit.secondaryAssignees || [])],
          status: props.taskToEdit.status,
          tags: [...props.taskToEdit.tags],
          type: props.taskToEdit.type || 'Feature',
          timeline: props.taskToEdit.timeline || '',
          commentsCount: props.taskToEdit.commentsCount !== undefined ? props.taskToEdit.commentsCount : 12,
          linksCount: props.taskToEdit.linksCount !== undefined ? props.taskToEdit.linksCount : 1,
          subtasksCompleted: props.taskToEdit.subtasksCompleted !== undefined ? props.taskToEdit.subtasksCompleted : 0,
          subtasksTotal: props.taskToEdit.subtasksTotal !== undefined ? props.taskToEdit.subtasksTotal : 3
        };
      } else {
        form.value = {
          title: '',
          description: '',
          priority: 'low',
          dueDate: new Date().toISOString().split('T')[0],
          assignee: 'Devrizal Akbar',
          secondaryAssignees: [],
          status: props.defaultStatus || 'todo',
          tags: [],
          type: 'Feature',
          timeline: '',
          commentsCount: 12,
          linksCount: 1,
          subtasksCompleted: 0,
          subtasksTotal: 3
        };
      }
      tagInput.value = '';
      errors.value = { title: '', dueDate: '' };
    }
  },
  { immediate: true }
);

const toggleFormAssignee = (name: string) => {
  const isPrimary = form.value.assignee === name;
  const inSecondary = form.value.secondaryAssignees.includes(name);

  if (isPrimary) {
    if (form.value.secondaryAssignees.length > 0) {
      form.value.assignee = form.value.secondaryAssignees[0];
      form.value.secondaryAssignees.shift();
    } else {
      form.value.assignee = '';
    }
  } else if (inSecondary) {
    form.value.secondaryAssignees = form.value.secondaryAssignees.filter((n) => n !== name);
  } else {
    if (!form.value.assignee) {
      form.value.assignee = name;
    } else {
      form.value.secondaryAssignees.push(name);
    }
  }
};

const isAssigneeSelected = (name: string): boolean => {
  return form.value.assignee === name || form.value.secondaryAssignees.includes(name);
};

const addTagsFromInput = () => {
  if (!tagInput.value.trim()) return;
  const parts = tagInput.value.split(',');
  parts.forEach((p) => {
    const cleaned = p.trim().toLowerCase();
    if (cleaned && !form.value.tags.includes(cleaned)) {
      form.value.tags.push(cleaned);
    }
  });
  tagInput.value = '';
};

const removeTag = (index: number) => {
  form.value.tags.splice(index, 1);
};

const validateForm = (): boolean => {
  let isValid = true;
  errors.value.title = '';
  errors.value.dueDate = '';

  if (!form.value.title || !form.value.title.trim()) {
    errors.value.title = 'Task title cannot be empty.';
    isValid = false;
  }

  if (!form.value.dueDate) {
    errors.value.dueDate = 'Due date is required.';
    isValid = false;
  }

  return isValid;
};

const saveForm = () => {
  if (!validateForm()) return;

  addTagsFromInput();

  if (props.taskToEdit) {
    props.manager.updateTask(props.taskToEdit.id, form.value);
  } else {
    props.manager.addTask(form.value);
  }

  emit('saved');
  closeModal();
};

const closeModal = () => {
  emit('close');
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
    'bg-[#EBF5FF] text-[#1E56A0] border border-blue-200/20',
    'bg-[#FDF2F8] text-[#9D174D] border border-pink-200/20',
    'bg-[#F0FDF4] text-[#166534] border border-emerald-200/20',
    'bg-[#FEFCE8] text-[#854D0E] border border-yellow-200/20',
    'bg-[#FAF5FF] text-[#6B21A8] border border-purple-200/20',
    'bg-[#F0FDFA] text-[#115E59] border border-teal-200/20',
    'bg-[#FFF7ED] text-[#9A3412] border border-orange-200/20'
  ];
  return colors[Math.abs(hash) % colors.length];
};
</script>
