<template>
  <div class="h-screen bg-[#F8FAFC] text-slate-800 flex font-sans overflow-hidden">
    <aside class="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200/60 p-5 shrink-0 select-none">
      <div class="flex items-center justify-between gap-2.5 mb-2 w-full">
        <div class="flex items-center gap-2.5">
          <div
            class="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <Layers class="w-4 h-4" />
          </div>
          <span
            class="font-bold text-base tracking-tight bg-gradient-to-r from-slate-900 to-indigo-600 bg-clip-text text-transparent">Task.Co</span>
        </div>

        <button type="button"
          class="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-all flex items-center justify-center"
          title="Toggle Fullscreen">
          <Expand class="w-4 h-4" />
        </button>
      </div>


      <hr class="border-slate-300 mb-6 mt-4" />

      <div class="relative mb-6 flex items-center justify-center">
        <Search class="absolute left-3 w-4 h-4 text-slate-400" />
        <input v-model="searchQuery" type="text" placeholder="Quick search..."
          class="w-full pl-9 pr-3 py-1.5 bg-slate-100 border border-transparent focus:border-slate-350 focus:outline-none text-xs rounded-xl transition-all" />
      </div>

      <nav class="space-y-6 flex-1">
        <div>
          <span
            class="block px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Workspace</span>
          <ul class="space-y-1">
            <li>
              <a href="#"
                class="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all">
                <LayoutDashboard class="w-4 h-4 text-slate-400" />
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="#"
                class="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all">
                <div class="flex items-center gap-3">
                  <Bell class="w-4 h-4 text-slate-400" />
                  <span>Notifications</span>
                </div>
              </a>
            </li>
            <li>
              <a href="#"
                class="flex items-center gap-3 px-3 py-2 text-xs font-bold text-indigo-600 bg-indigo-50/70 rounded-xl">
                <CheckSquare class="w-4 h-4 text-indigo-500 " />
                <span>Tasks Logs</span>
              </a>
            </li>
            <li>
              <a href="#"
                class="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all">
                <CalendarDays class="w-4 h-4 text-slate-400" />
                <span>Calendar</span>
              </a>
            </li>
            <li>
              <a href="#"
                class="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all">
                <Users class="w-4 h-4 text-slate-400" />
                <span>Members</span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <span
            class="block px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Teamspaces</span>
          <ul class="space-y-1">
            <li>
              <a href="#"
                class="flex items-center gap-3 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all">

                <FolderClosed class="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Gasvla Folder</span>
              </a>
            </li>
            <li>
              <a href="#"
                class="flex items-center gap-3 px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all">

                <FolderClosed class="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Kalburn Project</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>


      <div class="pt-4 border-t border-slate-100 space-y-1">
        <a href="#"
          class="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-all">
          <Settings class="w-4 h-4 text-slate-400" />
          <span>Settings</span>
        </a>
        <a href="#"
          class="flex items-center gap-3 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-rose-600 hover:bg-rose-50/50 rounded-xl transition-all">
          <LogOut class="w-4 h-4 text-slate-400 hover:text-rose-600 shrink-0" />
          <span>Logout</span>
        </a>
      </div>
    </aside>


    <main class="flex-grow flex flex-col min-w-0 p-4 lg:p-6 overflow-y-auto">

      <div
        class="bg-white border border-slate-200/70 rounded-[28px] md:rounded-[36px] flex-1 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.015)] overflow-hidden">

        <div
          class="px-6 lg:px-8 pt-6 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none shrink-0 border-b border-slate-100/80">
          <div class="text-left">
            <h1 class="text-2xl font-bold text-slate-900 mb-0.5 tracking-tight">Good Morning, Devrizal ☀️</h1>
            <p class="text-xs text-slate-400 font-medium font-mono">It's {{ currentFormattedDate }}</p>
          </div>

          <div class="flex items-center gap-3">
            <button type="button"
              class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-all border border-slate-200/40">
              <Bell class="w-3.5 h-3.5" fill="#000" />
            </button>
            <button type="button"
              class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-all border border-slate-200/40">
              <UserPlus class="w-3.5 h-3.5" fill="#000" />
              <span>Invite</span>
            </button>
            <button type="button"
              class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition-all border border-slate-200/40"
              title="Quick Settings">
              <Settings class="w-4 h-4" color='white' fill="#000" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        <div class="p-6 lg:p-8 flex-1 flex flex-col justify-stretch overflow-scroll">

          <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">

            <ViewToggle :model-value="viewMode" @update:model-value="setViewMode" />

            <div class="flex items-center gap-2.5 w-full md:w-auto">
              <button type="button"
                class="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700 bg-white border border-slate-200/80 text-xs font-bold rounded-xl transition-all cursor-pointer">
                <Upload class="w-4 h-4 stroke-[3]" />
                <span>Share</span>
              </button>

              <button id="add-task-btn" type="button" @click="triggerCreate"
                class="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-550 active:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-600/10 hover:shadow-lg cursor-pointer">
                <Plus class="w-4 h-4 stroke-[3]" />
                <span>Add Task</span>
              </button>
            </div>
          </div>

          <div
            class="bg-indigo-50/20 border border-slate-200/50 rounded-2xl p-5 mb-6 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="space-y-1">
              <h2 class="text-base font-bold text-slate-800 tracking-tight leading-none">Daily Back-End Tasks</h2>
              <div class="flex flex-wrap items-center gap-2.5 pt-1">
                <span class="inline-flex items-center gap-1 text-[12px] font-bold text-slate-500">
                  <UsersRound class="w-3 h-3" color='#808080' fill='#808080' />
                  <span>Developer Team</span>
                </span>
                <span class="inline-flex items-center gap-1 text-[12px] font-bold text-slate-500">
                  <Info class="w-3 h-3 text-slate-400" color='white' fill='#808080' />
                  <span>Important</span>
                </span>
                <span class="inline-flex items-center gap-1 text-[12px] font-bold text-slate-500">
                  <Paperclip class="w-3 h-3 text-slate-400" color='white' fill='#808080' />
                  {{ totalTasksCount }} Tasks
                </span>
              </div>
            </div>
          </div>

          <div
            class="flex flex-col md:flex-row gap-3 bg-slate-50/50 p-4 border border-slate-200/40 rounded-2xl shadow-xs mb-6">

            <div class="flex-1 min-w-[200px] relative">
              <Search class="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input v-model="searchQuery" type="text" placeholder="Search by title, description or tags..."
                class="w-full pl-9 pr-3 py-2 border border-slate-200 bg-white rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 text-xs text-slate-800 placeholder-slate-400 transition-all" />
            </div>

            <div class="w-full md:w-52 relative">
              <SlidersHorizontal class="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <select v-model="priorityFilter"
                class="w-full pl-9 pr-6 py-2 border border-slate-200 bg-white rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 text-xs text-slate-800 transition-all appearance-none cursor-pointer">
                <option value="all">All Levels</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div class="w-full md:w-52 relative">
              <UserCircle2 class="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <select v-model="assigneeFilter"
                class="w-full pl-9 pr-6 py-2 border border-slate-200 bg-white rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 text-xs text-slate-800 transition-all appearance-none cursor-pointer">
                <option value="all">All Team</option>
                <option v-for="name in assignees" :key="name" :value="name">
                  {{ name }}
                </option>
              </select>
            </div>

            <div class="w-full md:w-52 relative">
              <ArrowUpDown class="absolute left-3 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <select v-model="sortBy"
                class="w-full pl-9 pr-6 py-2 border border-slate-200 bg-white rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100 text-xs text-slate-800 transition-all appearance-none cursor-pointer">
                <option value="dueDate-asc">Due Date (Asc)</option>
                <option value="dueDate-desc">Due Date (Desc)</option>
                <option value="priority-desc">Priority (High First)</option>
                <option value="priority-asc">Priority (Low First)</option>
              </select>
            </div>
          </div>

          <div id="view-mounting-zone" class="flex-1 flex flex-col justify-stretch">
            <transition name="view-fade" mode="out-in">
              <div :key="viewMode" class="w-full flex-1 flex flex-col justify-stretch">
                <KanbanBoard v-if="viewMode === 'kanban'" :manager="manager" :priority-filter="priorityFilter"
                  :assignee-filter="assigneeFilter" :search-query="searchQuery" :sort-by="sortBy" @edit="triggerEdit"
                  @add-task-to-status="triggerCreateWithStatus" @select-task="openTaskDetailDrawer" />
                <ListView v-else-if="viewMode === 'list'" :manager="manager" :priority-filter="priorityFilter"
                  :assignee-filter="assigneeFilter" :search-query="searchQuery" :sort-by="sortBy" @edit="triggerEdit"
                  @select-task="openTaskDetailDrawer" />
                <p v-else-if="viewMode === 'grid' || viewMode === 'calendar'"
                  class="text-center text-slate-400 mt-10 text-sm"> View is not ready yet. </p>
              </div>
            </transition>
          </div>

        </div>
      </div>
    </main>


    <TaskModal :is-open="isModalOpen" :task-to-edit="taskToEdit" :default-status="modalDefaultStatus" :manager="manager"
      @close="isModalOpen = false" @saved="handleModalSaved" />

    <TaskDetailDrawer :is-open="isDrawerOpen" :task="selectedTaskForDrawer" @close="isDrawerOpen = false"
      @edit="triggerEditFromDrawer" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  Layers,
  Search,
  LayoutDashboard,
  Bell,
  CheckSquare,
  CalendarDays,
  Users,
  Settings,
  UserPlus,
  Plus,
  SlidersHorizontal,
  UserCircle2,
  ArrowUpDown,
  FolderClosed,
  LogOut,
  Upload,
  Info,
  Paperclip,
  UsersRound,
  Expand
} from '@lucide/vue';

import { TaskManager } from '../../BLL/taskManager/TaskManager';
import { ViewType, TaskPriority, Task, TaskStatus } from '../../BLL/taskManager/types';

import ViewToggle from '../../components/taskManager/ViewToggle.vue';
import KanbanBoard from '../../components/taskManager/KanbanBoard.vue';
import ListView from '../../components/taskManager/ListView.vue';
import TaskModal from '../../components/taskManager/TaskModal.vue';
import TaskDetailDrawer from '../../components/taskManager/TaskDetailDrawer.vue';

const manager = new TaskManager();

const viewMode = ref<ViewType>('kanban');
const priorityFilter = ref<TaskPriority | 'all'>('all');
const assigneeFilter = ref<string | 'all'>('all');
const searchQuery = ref('');
const sortBy = ref('dueDate-asc');

const isModalOpen = ref(false);
const taskToEdit = ref<Task | null>(null);
const modalDefaultStatus = ref<TaskStatus>('todo');

const selectedTaskForDrawer = ref<Task | null>(null);
const isDrawerOpen = ref(false);

const openTaskDetailDrawer = (task: Task) => {
  selectedTaskForDrawer.value = task;
  isDrawerOpen.value = true;
};

const triggerEditFromDrawer = (task: Task) => {
  isDrawerOpen.value = false;
  triggerEdit(task);
};

const assignees = ref<string[]>(manager.getAssignees());

const totalTasksCount = computed(() => {
  return manager.tasks.value.length;
});

const currentFormattedDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
});


onMounted(() => {
  const savedView = localStorage.getItem('task_manager_view');
  if (savedView === 'kanban' || savedView === 'list' || savedView === 'grid' || savedView === 'calendar') {
    viewMode.value = savedView;
  }
  assignees.value = manager.getAssignees();
});

const setViewMode = (newView: ViewType) => {
  viewMode.value = newView;
  localStorage.setItem('task_manager_view', newView);
};

const triggerCreate = () => {
  taskToEdit.value = null;
  modalDefaultStatus.value = 'todo';
  isModalOpen.value = true;
};

const triggerCreateWithStatus = (status: TaskStatus) => {
  taskToEdit.value = null;
  modalDefaultStatus.value = status;
  isModalOpen.value = true;
};

const triggerEdit = (task: Task) => {
  taskToEdit.value = task;
  isModalOpen.value = true;
};

const handleModalSaved = () => {
  isModalOpen.value = false;
  taskToEdit.value = null;
  assignees.value = manager.getAssignees();
};
</script>
