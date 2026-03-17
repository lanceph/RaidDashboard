<template>
  <div
    class="bg-white border border-slate-200 rounded-xl p-4 mb-8 shadow-sm flex flex-col md:flex-row gap-4 items-end"
  >
    <div class="flex-1 w-full">
      <label class="block text-xs font-bold text-slate-500 mb-1"
        >📅 場次分流</label
      >
      <select
        :value="selectedTime"
        @change="$emit('update:selectedTime', $event.target.value)"
        class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold outline-none text-slate-700"
      >
        <option value="ALL">顯示全部</option>
        <option v-for="t in times" :key="t" :value="t">{{ t }}</option>
      </select>
    </div>

    <div class="flex-1 w-full relative">
      <label class="block text-xs font-bold text-slate-500 mb-1"
        >🔍 尋找成員</label
      >
      <input
        type="text"
        :value="searchQuery"
        @input="$emit('update:searchQuery', $event.target.value)"
        list="player-list"
        autocomplete="off"
        placeholder="輸入名稱..."
        class="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold outline-none text-slate-700"
      />
      <datalist id="player-list">
        <option v-for="p in players" :key="p" :value="p"></option>
      </datalist>
    </div>

    <div class="w-full md:w-auto">
      <button
        @click="clearFilters"
        class="w-full px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 rounded-lg text-sm font-bold transition-all"
      >
        清除
      </button>
    </div>
  </div>
</template>

<script setup>
// 接收來自上層的資料
defineProps({
  selectedTime: String,
  searchQuery: String,
  times: Array,
  players: Array,
});

// 定義往外傳遞的事件
const emit = defineEmits(["update:selectedTime", "update:searchQuery"]);

// 清除過濾器的函數
const clearFilters = () => {
  emit("update:selectedTime", "ALL");
  emit("update:searchQuery", "");
};
</script>
