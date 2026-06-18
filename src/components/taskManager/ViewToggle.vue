<template>
    <div class="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl shadow-inner border border-slate-200/50 ">
        <button id="toggle-grid" type="button" @click="$emit('update:modelValue', 'grid')" :class="[
            'flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200',
            modelValue === 'grid'
                ? 'bg-white text-slate-900 shadow-sm scale-100'
                : 'text-slate-500 hover:text-slate-850 hover:bg-slate-200/40 '
        ]">
            <LayoutGrid class="w-3.5 h-3.5" />
            <span>Grid</span>
        </button>
        <button id="toggle-list" type="button" @click="$emit('update:modelValue', 'list')" :class="[
            'flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200',
            modelValue === 'list'
                ? 'bg-white text-slate-900 shadow-sm scale-100'
                : 'text-slate-500 hover:text-slate-850 hover:bg-slate-200/40 '
        ]">
            <List class="w-3.5 h-3.5" />
            <span>List</span>
        </button>
        <button id="toggle-calendar" type="button" @click="$emit('update:modelValue', 'calendar')" :class="[
            'flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200',
            modelValue === 'calendar'
                ? 'bg-white text-slate-900 shadow-sm scale-100'
                : 'text-slate-500 hover:text-slate-850 hover:bg-slate-200/40 '
        ]">
            <CalendarDays class="w-3.5 h-3.5" />
            <span>Calendar</span>
        </button>
        <button id="toggle-kanban" type="button" @click="$emit('update:modelValue', 'kanban')" :class="[
            'flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200',
            modelValue === 'kanban'
                ? 'bg-white text-slate-900 shadow-sm scale-100'
                : 'text-slate-500 hover:text-slate-850 hover:bg-slate-200/40 '
        ]">
            <Columns3 class="w-3.5 h-3.5" />
            <span>Board</span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { LayoutGrid, List, CalendarDays, Columns3 } from '@lucide/vue';
import { ViewType } from '../../BLL/taskManager/types';

defineProps<{
    modelValue: ViewType;
}>();

defineEmits<{
    (e: 'update:modelValue', value: ViewType): void;
}>();
</script>
