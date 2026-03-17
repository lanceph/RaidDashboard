<template>
  <div
    class="bg-white border-2 border-indigo-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
  >
    <div
      class="bg-indigo-50/80 px-5 py-3 border-b border-indigo-100 flex justify-between items-center"
    >
      <div class="font-black text-indigo-800 text-lg tracking-wide">
        {{ match.dk }}
      </div>
      <div
        class="text-xs font-black px-2.5 py-1 bg-white text-indigo-600 rounded shadow-sm border border-indigo-100"
      >
        {{ meta.t }}
      </div>
    </div>

    <div class="p-4 flex flex-col gap-3">
      <div
        v-for="(task, idx) in playerTasks"
        :key="idx"
        class="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-50 p-3.5 rounded-lg border border-slate-200/60 gap-3"
      >
        <div class="flex items-center gap-4">
          <span class="text-2xl drop-shadow-sm">
            {{ task.status.toLowerCase() === "o" ? "✅" : "❌" }}
          </span>
          <div class="flex flex-col">
            <span class="text-xs text-slate-500 font-bold mb-0.5">{{
              task.teamName
            }}</span>
            <span
              class="text-base font-black text-slate-700 flex items-center gap-1.5"
            >
              <span
                class="w-1.5 h-4 bg-indigo-500 rounded-full inline-block"
              ></span>
              {{ task.role }}
            </span>
          </div>
        </div>

        <div class="flex flex-wrap gap-1.5 justify-start sm:justify-end">
          <span
            v-if="task.holies.length === 0 && task.pets.length === 0"
            class="text-xs text-slate-400 font-bold bg-slate-100 px-2 py-1 rounded"
          >
            無特殊裝備要求
          </span>
          <span
            v-for="item in [...task.holies, ...task.pets]"
            :key="item"
            :class="[
              'text-xs px-2.5 py-1 rounded-md border font-bold shadow-sm',
              getElementClass(item),
            ]"
          >
            {{ item }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { Utils } from "../utils/parser";
import { store } from "../composables/useSchedule";

const props = defineProps({
  match: Object,
  playerName: String,
});

// 解析出場次的基本資訊 (BOSS、時間)
const meta = computed(() => {
  const b = props.match.block;
  return {
    t: Utils.getCellValue(b[0], 13), // 場次名稱 (例如: 第一場)
  };
});

// 拿出該玩家在這場的所有任務 (使用 ScheduleParser 做好的 pMap)
const playerTasks = computed(() => {
  return props.match.pMap.get(props.playerName) || [];
});

// 沿用之前的屬性顏色邏輯
const getElementClass = (item) => {
  const attr = store.getAttr(item);
  if (attr.includes("木"))
    return "bg-green-100 text-green-800 border-green-300";
  if (attr.includes("火")) return "bg-red-100 text-red-800 border-red-300";
  if (attr.includes("水")) return "bg-blue-100 text-blue-800 border-blue-300";
  if (attr.includes("光"))
    return "bg-yellow-100 text-yellow-800 border-yellow-300";
  if (attr.includes("暗"))
    return "bg-purple-100 text-purple-800 border-purple-300";
  return "bg-white text-slate-600 border-slate-300";
};
</script>
