<template>
  <div class="p-4 md:p-8">
    <div class="max-w-7xl mx-auto pb-12">
      <Header @refresh="fetchData" @share="handleShare" />

      <TabNav v-model="currentTab" />

      <div v-if="isLoading" class="text-center py-24 animate-fade-in">
        <div
          class="inline-block w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"
        ></div>
        <p class="mt-4 text-slate-500 font-bold tracking-widest">
          資料同步中...
        </p>
      </div>

      <div
        v-else-if="errorMsg"
        class="text-center py-12 bg-red-50 rounded-xl border border-red-200 mt-6"
      >
        <p class="text-red-500 font-bold text-lg">⚠️ {{ errorMsg }}</p>
      </div>

      <template v-else>
        <div v-if="currentTab === 'team'" class="animate-fade-in">
          <FilterBar
            v-model:selectedTime="selectedTime"
            v-model:searchQuery="searchQuery"
            :times="availableTimes"
            :players="players"
          />

          <div
            id="capture-area"
            class="capture-bg -mx-4 px-4 sm:mx-0 sm:px-0 flex flex-col gap-4"
          >
            <div
              v-if="filteredMatches.length === 0"
              class="text-center py-16 bg-white border border-slate-200 rounded-xl shadow-sm font-bold text-slate-500"
            >
              找不到相符場次
            </div>

            <MatchCard
              v-for="(match, idx) in filteredMatches"
              :key="match.dk"
              :block="match.block"
              :searchQuery="searchQuery"
              :captureId="idx"
              @discord="handleDiscordByMatch(match, idx)"
            />
          </div>
        </div>

        <div v-if="currentTab === 'personal'" class="animate-fade-in">
          <div
            class="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm"
          >
            <label class="block text-sm font-black text-indigo-700 mb-2"
              >請輸入您的名字：</label
            >
            <input
              type="text"
              v-model="personalSearch"
              list="personal-player-list"
              placeholder="🔍 點此尋找..."
              class="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-3 text-lg outline-none text-slate-800 font-bold shadow-inner"
            />
            <datalist id="personal-player-list">
              <option v-for="p in players" :key="p" :value="p"></option>
            </datalist>
          </div>

          <div
            id="personal-capture-area"
            class="personal-capture-bg -mx-4 px-4 sm:mx-0 sm:px-6"
          >
            <div
              v-if="!personalSearch"
              class="text-center py-16 text-slate-400 font-bold"
            >
              請先於上方選擇您的名字
            </div>
            <div
              v-else-if="personalMatches.length === 0"
              class="text-center py-16 bg-white border border-slate-200 rounded-xl shadow-sm font-bold text-slate-500"
            >
              本週查無行程
            </div>
            <div v-else class="flex flex-col gap-5">
              <PersonalCard
                v-for="m in personalMatches"
                :key="m.dk"
                :match="m"
                :playerName="personalSearch"
              />
            </div>
          </div>
        </div>
      </template>

      <footer
        class="mt-12 pt-6 border-t border-slate-200 text-center text-slate-400 text-xs font-medium"
      >
        <p>© 2026 菠蘿油王國討伐小組. All Rights Reserved.</p>
        <p class="mt-1">
          Tool Modernized with Vue 3 by ZoneSky(阿宏) & Gemini Assistant
        </p>
      </footer>

      <button
        @click="showChangelog = true"
        class="fixed bottom-6 right-6 w-12 h-12 bg-white border border-slate-200 rounded-full shadow-lg flex items-center justify-center text-xl hover:scale-110 transition-transform z-40"
      >
        📜
      </button>

      <ChangelogModal :show="showChangelog" @close="showChangelog = false" />

      <div
        id="toast"
        class="fixed bottom-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-8 py-3 rounded-full font-bold shadow-2xl opacity-0 transition-opacity pointer-events-none z-50"
      >
        ✅ 截圖已生成
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import html2canvas from "html2canvas";

// 引入元件
import Header from "./components/Header.vue";
import TabNav from "./components/TabNav.vue";
import FilterBar from "./components/FilterBar.vue";
import MatchCard from "./components/MatchCard.vue";
import PersonalCard from "./components/PersonalCard.vue";
import ChangelogModal from "./components/ChangelogModal.vue"; // 引入 Changelog 元件

// 引入 Composable 大腦
import { useSchedule } from "./composables/useSchedule";

// 狀態管理
const currentTab = ref("team");
const selectedTime = ref("ALL");
const searchQuery = ref("");
const personalSearch = ref("");
const showChangelog = ref(false); // 控制 Changelog 顯示的狀態

const { isLoading, errorMsg, matches, players, fetchData } = useSchedule();

// 計算屬性：可用時間選單
const availableTimes = computed(() => {
  return [...new Set(matches.value.map((m) => m.dk))];
});

// 計算屬性：團隊過濾結果
const filteredMatches = computed(() => {
  return matches.value.filter((m) => {
    const timeMatch =
      selectedTime.value === "ALL" || m.dk === selectedTime.value;
    const playerMatch =
      !searchQuery.value.trim() || m.pMap.has(searchQuery.value.trim());
    return timeMatch && playerMatch;
  });
});

// 計算屬性：個人行程結果
const personalMatches = computed(() => {
  const name = personalSearch.value.trim();
  if (!name) return [];
  return matches.value.filter((m) => m.pMap.has(name));
});

// 截圖功能
const handleShare = async () => {
  const isP = currentTab.value === "personal";
  const areaId = isP ? "personal-capture-area" : "capture-area";
  const element = document.getElementById(areaId);
  const toast = document.getElementById("toast");

  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: isP ? "#f6f8ff" : "#f8fafc",
      scale: 2,
      useCORS: true,
    });

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const fileName = `菠蘿油討伐表_${
        isP ? "個人" : "團隊"
      }_${new Date().getTime()}.png`;
      const file = new File([blob], fileName, { type: "image/png" });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "討伐任務表" });
      } else {
        const link = document.createElement("a");
        link.download = fileName;
        link.href = canvas.toDataURL("image/png");
        link.click();
      }

      // 顯示 Toast
      toast.classList.remove("opacity-0");
      setTimeout(() => toast.classList.add("opacity-0"), 3000);
    });
  } catch (err) {
    console.error("截圖失敗:", err);
  }
};

// 讀取用於通知頻道的 Discord webhook url 及需要通知的群組 ID
const DISCORD_WEBHOOK_URL = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
const DISCORD_ROLE_ID = import.meta.env.VITE_DISCORD_ROLE_ID;

// Discord 通知功能 (依場次發送)
const handleDiscordByMatch = async (match, idx) => {
  const toast = document.getElementById("toast");

  if (!DISCORD_WEBHOOK_URL) {
    console.error("Discord webhook URL 未設定");
    if (toast) {
      toast.textContent = "❌ 未設定 Discord Webhook";
      toast.classList.remove("opacity-0");
      setTimeout(() => {
        toast.classList.add("opacity-0");
        toast.textContent = "✅ 截圖已生成";
      }, 3000);
    }
    return;
  }

  const element = document.getElementById(`match-capture-${idx}`);
  const matchContent = element?.querySelector(".match-content");
  const isCurrentlyHidden =
    matchContent && window.getComputedStyle(matchContent).display === "none";

  if (!element || !toast) {
    return;
  }

  try {
    if (isCurrentlyHidden) {
      // Ensure collapsed cards still capture full team/member details for Discord.
      matchContent.style.display = "grid";
    }

    const canvas = await html2canvas(element, {
      backgroundColor: "#f8fafc",
      scale: 2,
      useCORS: true,
    });

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const safeMatchName = (match?.dk || "團隊")
        .replace(/[\\/:*?"<>|]/g, "-")
        .trim();
      const fileName = `菠蘿油討伐表_${safeMatchName}_${new Date().getTime()}.png`;
      const bossType =
        match?.block?.[0]?.c?.[8]?.f ||
        match?.block?.[0]?.c?.[8]?.v ||
        "未知類型";

      const roleMention = DISCORD_ROLE_ID ? `<@&${DISCORD_ROLE_ID}> ` : "";

      try {
        const formData = new FormData();
        formData.append("file", blob, fileName);
        formData.append(
          "content",
          `${roleMention}📣壞人討伐表出爐囉 - ${match?.dk || "未知場次"} (${bossType})`
        );

        const response = await fetch(DISCORD_WEBHOOK_URL, {
          method: "POST",
          body: formData,
        });

        toast.textContent = response.ok ? "✅ Discord 通知已發送" : "❌ Discord 發送失敗";
      } catch (err) {
        console.error("Discord 上傳失敗:", err);
        toast.textContent = "❌ Discord 發送失敗";
      }

      toast.classList.remove("opacity-0");
      setTimeout(() => {
        toast.classList.add("opacity-0");
        toast.textContent = "✅ 截圖已生成";
      }, 3000);
    });
  } catch (err) {
    console.error("截圖失敗:", err);
  }
};

// 初始載入
onMounted(() => {
  fetchData();
});
</script>

<style>
/* 確保字體正確 */
body {
  font-family: "Noto Sans TC", sans-serif;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
