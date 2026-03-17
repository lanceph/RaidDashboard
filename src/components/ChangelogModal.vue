<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity"
  >
    <div
      class="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col shadow-2xl modal-animate"
    >
      <div
        class="p-5 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50"
      >
        <h2 class="text-xl font-black text-slate-800">🛠️ 版本更新日誌</h2>
        <button
          @click="$emit('close')"
          class="text-slate-400 hover:text-slate-600 text-3xl leading-none"
        >
          &times;
        </button>
      </div>

      <div class="p-6 overflow-y-auto">
        <div class="border-l-2 border-slate-200 pl-4 relative pb-2">
          <div
            class="absolute w-2.5 h-2.5 bg-indigo-500 rounded-full -left-[5px] top-1.5"
          ></div>

          <h3 class="font-black text-slate-800 text-lg">
            v1.0 (Vue 3 重構版) - 全新啟航
          </h3>
          <p class="text-xs text-slate-400 mb-3">2026.03.17</p>

          <ul
            class="text-sm text-slate-600 list-disc ml-4 space-y-1.5 font-medium"
          >
            <li>
              <strong class="text-indigo-600">【架構】</strong>全面升級為 Vue 3
              現代化前端框架，帶來極致流暢的操作體驗。
            </li>
            <li>
              <strong class="text-indigo-600">【資安】</strong>導入 Serverless
              API 中介層，表單徹底轉為私人權限，保護公會資料。
            </li>
            <li>
              <strong class="text-indigo-600">【功能】</strong
              >團隊總覽模式：支援依據「場次時間」與「玩家名稱」進行即時過濾。
            </li>
            <li>
              <strong class="text-indigo-600">【功能】</strong
              >個人行程模式：輸入名字即可快速查看專屬的討伐排程與裝備需求。
            </li>
            <li>
              <strong class="text-indigo-600">【視覺】</strong
              >自動辨識四大職業與屬性（木、火、水、光、暗）並套用專屬視覺上色。
            </li>
            <li>
              <strong class="text-indigo-600">【分享】</strong
              >內建高畫質截圖與行動裝置原生分享功能 (Share API)。
            </li>
          </ul>
        </div>
      </div>

      <div class="p-4 border-t border-slate-100 text-center">
        <button
          @click="$emit('close')"
          class="w-full py-2.5 bg-slate-100 rounded-lg font-bold text-slate-600 hover:bg-slate-200 transition-colors"
        >
          關閉
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
});

defineEmits(["close"]);
</script>

<style scoped>
.modal-animate {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
