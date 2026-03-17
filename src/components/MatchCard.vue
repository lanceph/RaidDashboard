<template>
  <div class="match-container">
    <div
      @click="isCollapsed = !isCollapsed"
      class="header-clickable bg-slate-100 border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
    >
      <div class="flex flex-wrap items-center gap-3">
        <span class="collapse-icon text-slate-400 font-bold w-6">{{
          isCollapsed ? "➕" : "➖"
        }}</span>
        <span :class="['text-3xl font-black tracking-tight', meta.tc]">{{
          meta.bt
        }}</span>
        <span
          :class="[
            'px-3 py-1 rounded-md text-sm font-black border-2 tracking-widest shadow-sm',
            meta.bc,
          ]"
        >
          {{ meta.tr }}
        </span>
      </div>
      <div class="flex items-center gap-3 text-sm font-bold">
        <div
          class="text-indigo-700 font-mono bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm"
        >
          {{ meta.d }} ({{ meta.cd }})
        </div>
        <div class="bg-indigo-600 text-white px-4 py-1.5 rounded-lg shadow-md">
          {{ meta.t }}
        </div>
      </div>
    </div>

    <div
      v-show="!isCollapsed"
      class="match-content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
    >
      <TeamColumn
        v-for="i in 4"
        :key="i"
        :teamName="Utils.getCellValue(block[1], 1 + (i - 1) * 4)"
        :teamData="ScheduleParser.parseTeam(block, i - 1)"
        :searchQuery="searchQuery"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { Utils, ScheduleParser } from "../utils/parser";
import TeamColumn from "./TeamColumn.vue";

const props = defineProps({
  block: Array,
  searchQuery: String,
});

const isCollapsed = ref(false);

const meta = computed(() => {
  const b = props.block;
  const bt = Utils.getCellValue(b[0], 1),
    tr = Utils.getCellValue(b[0], 8),
    d = Utils.getCellValue(b[0], 9),
    cd = Utils.cleanDay(Utils.getCellValue(b[0], 11)),
    t = Utils.getCellValue(b[0], 13);

  let bc = "bg-slate-100 text-slate-700 border-slate-300",
    tc = "text-slate-800";
  if (tr.includes("木") || bt.includes("鳥")) {
    bc = "bg-green-100 text-green-800 border-green-400";
    tc = "text-green-600";
  } else if (tr.includes("光") || bt.includes("雷")) {
    bc = "bg-yellow-100 text-yellow-800 border-yellow-400";
    tc = "text-yellow-600";
  } else if (tr.includes("暗") || bt.includes("地下")) {
    bc = "bg-purple-100 text-purple-800 border-purple-400";
    tc = "text-purple-600";
  } else if (tr.includes("火") || bt.includes("魔女")) {
    bc = "bg-red-100 text-red-800 border-red-400";
    tc = "text-red-600";
  }

  return { bt, tr, d, cd, t, bc, tc };
});
</script>
