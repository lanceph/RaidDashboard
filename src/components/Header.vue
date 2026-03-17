<template>
  <div
    class="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-6"
  >
    <div class="flex items-start gap-4">
      <div
        class="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center shadow-inner border-2 border-amber-200 shrink-0"
      >
        <svg viewBox="0 0 100 100" class="w-12 h-12">
          <path
            d="M50,10 C25,10 10,25 10,50 C10,75 25,90 50,90 C75,90 90,75 90,50 C90,25 75,10 50,10 Z"
            fill="#FCD34D"
            stroke="#D97706"
            stroke-width="3"
          />
          <line
            x1="25"
            y1="20"
            x2="75"
            y2="80"
            stroke="#D97706"
            stroke-width="2"
            stroke-linecap="round"
          />
          <line
            x1="15"
            y1="40"
            x2="60"
            y2="85"
            stroke="#D97706"
            stroke-width="2"
            stroke-linecap="round"
          />
          <line
            x1="40"
            y1="15"
            x2="85"
            y2="60"
            stroke="#D97706"
            stroke-width="2"
            stroke-linecap="round"
          />
          <line
            x1="75"
            y1="20"
            x2="25"
            y2="80"
            stroke="#D97706"
            stroke-width="2"
            stroke-linecap="round"
          />
          <line
            x1="85"
            y1="40"
            x2="40"
            y2="85"
            stroke="#D97706"
            stroke-width="2"
            stroke-linecap="round"
          />
          <line
            x1="60"
            y1="15"
            x2="15"
            y2="60"
            stroke="#D97706"
            stroke-width="2"
            stroke-linecap="round"
          />
          <circle cx="35" cy="45" r="4" fill="#334155" />
          <circle cx="65" cy="45" r="4" fill="#334155" />
          <path
            d="M40,65 Q50,75 60,65"
            fill="none"
            stroke="#334155"
            stroke-width="3"
            stroke-linecap="round"
          />
        </svg>
      </div>
      <div>
        <h1
          class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 tracking-tight mb-1"
        >
          菠蘿油討伐Dashboard
        </h1>
        <div class="flex flex-wrap items-center gap-2">
          <p class="text-slate-500 text-sm font-medium">請確認自己的任務分配</p>
          <span
            class="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold"
            >by ZoneSky(阿宏)</span
          >
        </div>
      </div>
    </div>

    <div class="flex gap-3 w-full md:w-auto">
      <button
        @click="$emit('refresh')"
        class="flex-1 md:flex-none px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-sm font-bold shadow-sm transition-all flex items-center justify-center gap-2"
      >
        <span>🔄</span> 刷新
      </button>
      <button
        @click="$emit('share')"
        class="flex-1 md:flex-none px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
      >
        <span>📸</span> 分享
      </button>
    </div>
  </div>
</template>

<script setup>
// 定義這個元件會往外傳遞哪些事件
defineEmits(["refresh", "share"]);
</script>
