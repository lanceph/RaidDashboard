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
      <div class="flex items-center gap-2">
        <div
          class="text-xs font-black px-2.5 py-1 bg-white text-indigo-600 rounded shadow-sm border border-indigo-100"
        >
          {{ meta.t }}
        </div>
        <button
          type="button"
          @click="openGoogleCalendar"
          class="text-xs font-black px-2.5 py-1 rounded shadow-sm border border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-100 transition-colors"
        >
          Google 行事曆
        </button>
        <button
          type="button"
          @click="openMobileCalendar"
          class="text-xs font-black px-2.5 py-1 rounded shadow-sm border border-indigo-200 bg-white text-indigo-700 hover:bg-indigo-100 transition-colors"
        >
          手機行事曆
        </button>
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
  return {
    t: Utils.getCellValue(b[0], 13), // 場次名稱 (例如: 第一場)
    bt: Utils.getCellValue(b[0], 1), // BOSS 名稱
    tr: Utils.getCellValue(b[0], 8), // 屬性類型 (例如: 木討伐、火討伐)
  };
});

const playerTasks = computed(() => {
  return props.match.pMap.get(props.playerName) || [];
});

const SESSION_START_TIME = {
  第一場: "20:00",
  第二場: "21:00",
  第三場: "22:00",
  第四場: "23:00",
};

const toCalendarDateTime = (date) => {
  const pad = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(
    date.getDate()
  )}T${pad(date.getHours())}${pad(date.getMinutes())}${pad(
    date.getSeconds()
  )}`;
};

const parseDateFromMatch = () => {
  const rawDate = Utils.getCellValue(props.match.block[0], 9).trim();
  if (!rawDate) return null;

  const normalized = rawDate.replace(/[年.\-]/g, "/").replace(/月/g, "/");
  const withYear = normalized.match(/(\d{4})\/(\d{1,2})\/(\d{1,2})/);
  if (withYear) {
    return new Date(
      Number(withYear[1]),
      Number(withYear[2]) - 1,
      Number(withYear[3])
    );
  }

  const withoutYear = normalized.match(/(\d{1,2})\/(\d{1,2})/);
  if (!withoutYear) return null;

  const now = new Date();
  return new Date(now.getFullYear(), Number(withoutYear[1]) - 1, Number(withoutYear[2]));
};

const parseStartTime = () => {
  const session = meta.value.t || "";
  const matchedTime = session.match(/(\d{1,2})[:：](\d{2})/);
  if (matchedTime) return { h: Number(matchedTime[1]), m: Number(matchedTime[2]) };

  const fallback = SESSION_START_TIME[session] || "20:00";
  const [h, m] = fallback.split(":").map(Number);
  return { h, m };
};

const buildDescription = () => {
  const tasks = playerTasks.value
    .map((task) => {
      const status = task.status?.toLowerCase() === "o" ? "出席" : "缺席";
      const holyText = task.holies.length > 0 ? task.holies.join("、") : "無";
      const petText = task.pets.length > 0 ? task.pets.join("、") : "無";
      return `${task.teamName} / ${task.role} / ${status}\n聖光清單: ${holyText}\n幻獸清單: ${petText}`;
    })
    .join("\n\n");

  return `玩家: ${props.playerName}\n場次: ${props.match.dk}\n\n任務明細:\n${tasks}`;
};

const buildEventPayload = () => {
  const baseDate = parseDateFromMatch();
  if (!baseDate) {
    window.alert("無法解析日期，請確認排程資料中的日期格式。");
    return null;
  }

  const { h, m } = parseStartTime();
  const start = new Date(baseDate);
  start.setHours(h, m, 0, 0);
  const end = new Date(start);
  end.setHours(end.getHours() + 1);

  const title = `${props.playerName} - ${props.match.dk} [${meta.value.bt}] [${meta.value.tr}] 討伐提醒`;
  const description = buildDescription();

  return { start, end, title, description };
};

const buildGoogleCalendarUrl = ({ start, end, title, description }) => {
  const query = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    details: description,
    dates: `${toCalendarDateTime(start)}/${toCalendarDateTime(end)}`,
    ctz: "Asia/Taipei",
  });
  return `https://calendar.google.com/calendar/render?${query.toString()}`;
};

const openGoogleCalendar = () => {
  const payload = buildEventPayload();
  if (!payload) return;

  const url = buildGoogleCalendarUrl(payload);
  window.open(url, "_blank", "noopener,noreferrer");
};

const openMobileCalendar = async () => {
  const payload = buildEventPayload();
  if (!payload) return;

  const url = buildGoogleCalendarUrl(payload);

  if (navigator.share) {
    try {
      await navigator.share({
        title: payload.title,
        text: "點開此連結可快速加入行事曆",
        url,
      });
      return;
    } catch {
      // 使用者取消分享時改用一般開啟方式
    }
  }

  window.open(url, "_blank", "noopener,noreferrer");
};

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
