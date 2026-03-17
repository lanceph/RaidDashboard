// src/composables/useSchedule.js
import { ref } from "vue";
import { DataStore, ScheduleParser, Utils, CONFIG } from "../utils/parser";

// 建立一個全域的 store 實例
export const store = new DataStore();

export function useSchedule() {
  // 定義響應式變數 (Vue 會自動監聽它們的變化來更新畫面)
  const isLoading = ref(false);
  const errorMsg = ref("");
  const matches = ref([]);
  const players = ref([]);

  // 獲取資料的主函數
  const fetchData = async () => {
    isLoading.value = true;
    errorMsg.value = "";

    try {
      // 呼叫我們在 Phase 2 寫好的 Serverless API
      const fetchSheet = async (sheetName) => {
        const res = await fetch(
          `/api/schedule?sheetName=${encodeURIComponent(sheetName)}`
        );
        if (!res.ok) throw new Error(`API 錯誤: ${res.status}`);
        return await res.json();
      };

      const [sr, sur, pr] = await Promise.all([
        fetchSheet(CONFIG.SHEETS.SCHEDULE),
        fetchSheet(CONFIG.SHEETS.SURVEY),
        fetchSheet(CONFIG.SHEETS.PETS),
      ]);

      // 解析資料
      store.buildRoles(sur);
      store.buildElements(pr);

      const parsedMatches = ScheduleParser.extract(sr)
        .filter(
          (b) =>
            !Utils.getCellValue(b[0], 8).includes("空場") &&
            !Utils.getCellValue(b[0], 1).includes("空場")
        )
        .map((b) => {
          const dk = `${Utils.getCellValue(b[0], 9)} (${Utils.cleanDay(
            Utils.getCellValue(b[0], 11)
          )}) ${Utils.getCellValue(b[0], 13)}`;
          const pMap = new Map();
          for (let i = 0; i < 4; i++) {
            const tn = Utils.getCellValue(b[1], 1 + i * 4),
              td = ScheduleParser.parseTeam(b, i);
            CONFIG.ROLES.forEach((r) =>
              td[r].forEach((m) => {
                if (m.name && m.name !== "--" && m.name !== "-") {
                  if (!pMap.has(m.name)) pMap.set(m.name, []);
                  pMap.get(m.name).push({ teamName: tn, role: r, ...m });
                }
              })
            );
          }
          return { block: b, dk, pMap };
        });

      // 更新響應式變數
      matches.value = parsedMatches;

      // 收集所有玩家名單
      const playerSet = new Set();
      parsedMatches.forEach((m) => m.pMap.forEach((v, k) => playerSet.add(k)));
      players.value = [...playerSet].sort();
    } catch (err) {
      console.error(err);
      errorMsg.value = "資料加載失敗，請檢查網路狀態或 API 權限。";
    } finally {
      isLoading.value = false;
    }
  };

  // 將需要讓外面使用的變數與函數暴露出去
  return {
    isLoading,
    errorMsg,
    matches,
    players,
    fetchData,
  };
}
