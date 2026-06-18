<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-hidden">
    <div class="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300 pointer-events-auto"
      @click="emitClose"></div>
    <div class="absolute inset-y-0 right-0 max-w-full flex pl-10">
      <div
        class="w-screen max-w-2xl bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out border border-slate-200/80 rounded-2xl relative h-[calc(100%-2rem)] m-4 select-none"
        style="box-shadow: -10px 0 30px -5px rgba(15, 23, 42, 0.08);">
        <div class="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">

          <button type="button" @click="emitClose"
            class="p-2 -ml-2 text-slate-400 hover:text-slate-650 hover:bg-slate-50 rounded-xl transition-all cursor-pointer">
            <X class="w-5 h-5" />
          </button>
          <div class="flex items-center gap-1.5">
            <button type="button"
              class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
              title="Activity Log">
              <Clock class="w-5 h-5" />
            </button>
            <button type="button"
              class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
              title="Add to Favorites">
              <Star class="w-5 h-5" />
            </button>
            <button type="button" @click="triggerEdit"
              class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
              title="Edit Task">
              <Pencil class="w-4.5 h-4.5" />
            </button>
            <button type="button"
              class="p-2 text-slate-400 hover:text-slate-750 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
              title="More Actions">
              <MoreHorizontal class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-6">
          <div>
            <h2 class="text-2xl font-bold text-slate-900 leading-tight tracking-tight text-left">
              {{ task.title }}
            </h2>
          </div>

          <div class="grid grid-cols-[140px_1fr] gap-y-4 text-[13px] border-b border-slate-100 pb-6 text-left">
            <div class="flex items-center gap-2 text-slate-400 font-medium font-sans">
              <Clock class="w-4 h-4 shrink-0 text-slate-350" />
              <span>Created time</span>
            </div>
            <div class="text-slate-700 font-medium">
              {{ formatLongDate(task.createdAt || new Date().toISOString()) }}
            </div>

            <div class="flex items-center gap-2 text-slate-400 font-medium">
              <Layers class="w-4 h-4 shrink-0 text-slate-350" />
              <span>Status</span>
            </div>
            <div>
              <span :class="[
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide border',
                statusStyles[task.status]?.bg || 'bg-slate-150 border-slate-205 text-slate-700'
              ]">
                <span
                  :class="['w-1.5 h-1.5 rounded-full inline-block', statusStyles[task.status]?.dot || 'bg-slate-500']"></span>
                {{ statusStyles[task.status]?.text || task.status }}
              </span>
            </div>

            <div class="flex items-center gap-2 text-slate-400 font-medium">
              <Flag class="w-4 h-4 shrink-0 text-slate-350" />
              <span>Priority</span>
            </div>
            <div>
              <span :class="[
                'inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border leading-none',
                priorityClasses[task.priority]
              ]">
                {{ task.priority }}
              </span>
            </div>

            <div class="flex items-center gap-2 text-slate-400 font-medium font-sans">
              <CalendarDays class="w-4 h-4 shrink-0 text-slate-350" />
              <span>Due Date</span>
            </div>
            <div class="text-slate-700 font-medium">
              {{ formatDueDateString(task.dueDate) }}
            </div>

            <div class="flex items-center gap-2 text-slate-400 font-medium font-sans">
              <Tag class="w-4 h-4 shrink-0 text-slate-350" />
              <span>Tags</span>
            </div>
            <div class="flex flex-wrap gap-1.5 align-middle">
              <span v-if="task.type"
                class="inline-flex items-center px-2 py-0.5 bg-slate-50/80 hover:bg-slate-100 border border-slate-200/50 text-slate-500 text-[10px] font-semibold rounded-md transition-colors leading-none">
                {{ task.type }}
              </span>
              <span v-for="tag in task.tags" :key="tag"
                class="inline-flex items-center px-2 py-0.5 bg-slate-50 hover:bg-slate-100 text-slate-500 text-[10px] border border-slate-200/50 font-semibold rounded-md transition-colors leading-none capitalize">
                {{ tag }}
              </span>
              <span v-if="!task.type && (!task.tags || task.tags.length === 0)" class="text-slate-400 italic">No
                tags</span>
            </div>

            <div class="flex items-center gap-2 text-slate-400 font-medium font-sans">
              <Users class="w-4 h-4 shrink-0 text-slate-350" />
              <span>Assignees</span>
            </div>
            <div class="flex items-center gap-2.5">
              <div class="flex -space-x-1 hover:space-x-0.5 transition-all overflow-hidden py-0.5">

                <div :class="[
                  'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 capitalize',
                  getAssigneeColor(task.assignee)
                ]" :title="'Primary Assignee: ' + task.assignee">
                  {{ getAssigneeInitials(task.assignee) }}
                </div>
                <div v-for="sa in task.secondaryAssignees || []" :key="sa" :class="[
                  'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 capitalize',
                  getAssigneeColor(sa)
                ]" :title="'Contributor: ' + sa">
                  {{ getAssigneeInitials(sa) }}
                </div>
              </div>

            </div>
          </div>

          <div class="bg-[#F8FAFC]/75 border border-slate-100 p-5 rounded-2xl text-left">
            <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Project Description</h4>
            <p class="text-[13px] text-slate-500 leading-relaxed font-normal whitespace-pre-wrap">
              {{ task.description || `Discuss layout parameters, responsive device frames, custom typeface pairings,
              alignments with marketing teams, and secure gateway rules for version 2 specs.` }}
            </p>
          </div>

          <div class="border-b border-slate-100 text-left">
            <div class="flex gap-6 -mb-px">
              <button v-for="tab in tabs" :key="tab" type="button" @click="activeTab = tab" :class="[
                'pb-3 text-xs font-bold transition-all relative shrink-0 cursor-pointer',
                activeTab === tab
                  ? 'text-indigo-600 font-extrabold'
                  : 'text-slate-400 hover:text-slate-600'
              ]">
                {{ tab }}
                <span v-if="activeTab === tab"
                  class="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full animate-fade-in"></span>
              </button>
            </div>
          </div>



          <div v-if="activeTab === 'Activity'" class="space-y-6 text-left">
            <div>
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Today</div>

              <div class="relative pl-11 space-y-5">
                <div class="absolute left-3.5 top-2.5 bottom-2 w-0.5 border-l-2 border-dashed border-slate-100"></div>

                <div class="relative">
                  <div class="absolute -left-11 top-0">
                    <span
                      class="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold bg-indigo-50 text-indigo-700 shrink-0 shadow-xs border border-white">
                      TK
                    </span>
                  </div>
                  <div>
                    <p class="text-xs text-slate-600 leading-snug">
                      <span class="font-bold text-slate-800">Talan Korsgaard</span> changed the status of
                      <span class="font-semibold text-slate-800">"{{ task.title }}"</span> from
                      <span class="font-semibold text-slate-600">Todo</span> to
                      <span class="font-bold text-indigo-600">In Progress</span>
                    </p>
                    <span class="text-[10px] text-slate-400 font-medium">10:45 AM</span>
                  </div>
                </div>

                <div class="relative">
                  <div class="absolute -left-11 top-0">
                    <span
                      class="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold bg-pink-50 text-pink-700 shrink-0 shadow-xs border border-white">
                      HP
                    </span>
                  </div>
                  <div>
                    <p class="text-xs text-slate-600 leading-snug">
                      <span class="font-bold text-slate-800">Hanna Philips</span> added reaction 🚀 in
                      <span class="font-semibold text-slate-800">{{ task.title }}</span>
                    </p>
                    <span class="text-[10px] text-slate-400 font-medium">10:20 AM</span>
                  </div>
                </div>

                <div class="relative">
                  <div class="absolute -left-11 top-0">
                    <span
                      class="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold bg-indigo-50 text-indigo-700 shrink-0 shadow-xs border border-white">
                      TK
                    </span>
                  </div>
                  <div>
                    <p class="text-xs text-slate-600 leading-snug">
                      <span class="font-bold text-slate-800">Talan Korsgaard</span> added a comment in
                      <span class="font-semibold text-slate-800">{{ task.title }}</span>
                    </p>
                    <span class="text-[10px] text-slate-400 font-medium animate-pulse">10:45 AM</span>
                  </div>
                </div>

                <div class="relative">
                  <div class="absolute -left-11 top-0">
                    <span
                      class="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold bg-emerald-50 text-emerald-700 shrink-0 shadow-xs border border-white">
                      DA
                    </span>
                  </div>
                  <div>
                    <p class="text-xs text-slate-600 leading-snug mb-2">
                      <span class="font-bold text-slate-800">Davis Donin</span> uploaded file
                      <span class="font-semibold text-indigo-600">User Flow</span>
                    </p>
                    <span class="text-[10px] text-slate-400 block mb-2 font-medium">10:45 AM</span>


                    <div
                      class="p-3 bg-white border border-slate-200/90 rounded-xl hover:border-slate-300 transition-colors flex items-center justify-between shadow-xs max-w-sm">
                      <div class="flex items-center gap-3">
                        <div
                          class="w-8 h-8 rounded-lg bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center shrink-0">
                          <FileText class="w-4 h-4" />
                        </div>
                        <div class="text-left">
                          <div class="text-xs font-bold text-slate-800">User Flow specs.pdf</div>
                          <div class="text-[10px] text-slate-400">PDF • 2.35 mb</div>
                        </div>
                      </div>
                      <button type="button"
                        class="p-1.5 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
                        title="Download Document">
                        <Download class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <hr class="border-slate-100" />

            <div>
              <div class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Yesterday</div>

              <div class="relative pl-11 space-y-5">

                <div class="absolute left-3.5 top-2.5 bottom-2 w-0.5 border-l-2 border-dashed border-slate-100"></div>

                <div class="relative">
                  <div class="absolute -left-11 top-0">
                    <span
                      class="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold bg-indigo-50 text-indigo-700 shrink-0 shadow-xs border border-white">
                      TK
                    </span>
                  </div>
                  <div>
                    <p class="text-xs text-slate-600 leading-snug">
                      <span class="font-bold text-slate-800">Talan Korsgaard</span> added reaction 👍 in
                      <span class="font-semibold text-slate-800">{{ task.title }}</span>
                    </p>
                    <span class="text-[10px] text-slate-400 font-medium">10:45 AM</span>
                  </div>
                </div>

                <div class="relative">
                  <div class="absolute -left-11 top-0">
                    <span
                      class="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold bg-slate-100 text-slate-700 shrink-0 shadow-xs border border-white">
                      MT
                    </span>
                  </div>
                  <div>
                    <p class="text-xs text-slate-600 leading-snug">
                      <span class="font-semibold text-slate-500">Task was created</span> and added to the board
                    </p>
                    <span class="text-[10px] text-slate-400 font-medium">10:45 AM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="py-12 text-center text-slate-400 text-xs italic">
            No Activity Found.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import {
  X,
  Clock,
  Star,
  MoreHorizontal,
  Pencil,
  Layers,
  Flag,
  CalendarDays,
  Tag,
  Users,
  FileText,
  Download
} from '@lucide/vue';
import { Task, TaskPriority, TaskStatus } from '../../BLL/taskManager/types';

const props = defineProps<{
  isOpen: boolean;
  task: Task | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'edit', task: Task): void;
}>();

const emitClose = () => {
  emit('close');
};

const triggerEdit = () => {
  if (props.task) {
    emit('edit', props.task);
  }
};

const tabs = ['Activity', 'My Work', 'Assigned', 'Comments'];
const activeTab = ref('Activity');

const statusStyles: Record<TaskStatus, { text: string; bg: string; dot: string }> = {
  todo: {
    text: 'To do',
    bg: 'bg-indigo-50 border-indigo-100 text-indigo-600',
    dot: 'bg-indigo-600'
  },
  'in-progress': {
    text: 'In Progress',
    bg: 'bg-amber-50 border-amber-100 text-amber-600',
    dot: 'bg-amber-600'
  },
  done: {
    text: 'Done',
    bg: 'bg-emerald-50 border-emerald-110 text-emerald-600',
    dot: 'bg-emerald-600'
  }
};

const priorityClasses: Record<TaskPriority, string> = {
  high: 'bg-rose-50 text-rose-500 border border-rose-100',
  medium: 'bg-amber-50 text-amber-500 border border-amber-100',
  low: 'bg-indigo-50 text-indigo-500 border border-indigo-100'
};

const formatLongDate = (isoStr: string) => {
  if (!isoStr) return '';
  try {
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }) + ' ' + d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return isoStr;
  }
};

const formatDueDateString = (dueDate: string) => {
  if (!dueDate) return 'No due date';
  try {
    const d = new Date(dueDate + 'T00:00:00');
    const start = d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    return start;
  } catch {
    return dueDate;
  }
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
  return colors[Math.abs(hash) % colors.length];
};

watch(
  () => props.task,
  () => {
    activeTab.value = 'Activity';
  }
);
</script>
