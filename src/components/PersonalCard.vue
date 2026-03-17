<template>
  <div
    class="bg-white border-2 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
    :class="meta.borderClass"
  >
    <div
      :class="[
        'px-5 py-3 border-b flex justify-between items-start sm:items-center flex-col sm:flex-row gap-2',
        meta.bgClass,
      ]"
    >
      <div class="flex flex-col">
        <div :class="['font-black text-lg tracking-wide', meta.textClass]">
          {{ match.dk }}
        </div>

        <div class="flex items-center gap-2 mt-1">
          <span class="text-sm font-bold text-slate-700">{{
            meta.bossType
          }}</span>
          <span
            v-if="meta.bossAttr && meta.bossAttr !== '-'"
            class="text-xs font-black px-2 py-0.5 bg-white/80 rounded border shadow-sm"
            :class="meta.textClass"
          >
            {{ meta.bossAttr }}
          </span>
        </div>
      </div>

      <div
        class="text-xs font-black px-2.5 py-1 bg-white rounded shadow-sm border border-slate-200"
        :class="meta.textClass"
      >
        {{ meta.matchName }}
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

// 解析出場次的基本資訊 (BOSS、時間、屬性)，並加入顏色邏輯
const meta = computed(() => {
  const b = props.match.block;
  // 加上 || "" 防止因為空值報錯
  const bossType = Utils.getCellValue(b[0], 1) || "";
  const bossAttr = Utils.getCellValue(b[0], 8) || "";
  const matchName = Utils.getCellValue(b[0], 13) || "";

  // 預設樣式 (與 MatchCard 同步的灰色調)
  let bgClass = "bg-slate-100 border-slate-300";
  let borderClass = "border-slate-300";
  let textClass = "text-slate-700";

  // 🌟 使用與 MatchCard 完全一模一樣的 Tailwind Class，保證編譯器能抓到！
  if (bossAttr.includes("木") || bossType.includes("鳥")) {
    bgClass = "bg-green-100 border-green-400";
    borderClass = "border-green-400";
    textClass = "text-green-800";
  } else if (bossAttr.includes("光") || bossType.includes("雷")) {
    bgClass = "bg-yellow-100 border-yellow-400";
    borderClass = "border-yellow-400";
    textClass = "text-yellow-800";
  } else if (bossAttr.includes("暗") || bossType.includes("地下")) {
    bgClass = "bg-purple-100 border-purple-400";
    borderClass = "border-purple-400";
    textClass = "text-purple-800";
  } else if (bossAttr.includes("火") || bossType.includes("魔女")) {
    bgClass = "bg-red-100 border-red-400";
    borderClass = "border-red-400";
    textClass = "text-red-800";
  }

  return { bossType, bossAttr, matchName, bgClass, borderClass, textClass };
});

const playerTasks = computed(() => {
  return props.match.pMap.get(props.playerName) || [];
});

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
