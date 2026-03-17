<template>
  <div
    class="flex border-b border-slate-200 mb-6 bg-white rounded-t-xl overflow-hidden shadow-sm"
  >
    <button
      @click="$emit('update:modelValue', 'team')"
      class="flex-1 px-4 py-3 font-bold focus:outline-none text-center transition-all"
      :class="
        modelValue === 'team'
          ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50 font-black'
          : 'text-slate-500 border-b-2 border-transparent hover:text-slate-700 hover:bg-slate-50'
      "
    >
      👥 團隊總覽
    </button>

    <button
      @click="$emit('update:modelValue', 'personal')"
      class="flex-1 px-4 py-3 font-bold focus:outline-none text-center transition-all"
      :class="
        modelValue === 'personal'
          ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50 font-black'
          : 'text-slate-500 border-b-2 border-transparent hover:text-slate-700 hover:bg-slate-50'
      "
    >
      👤 個人行程
    </button>
  </div>
</template>

<script setup>
// 定義接收的屬性 (目前選中的 tab)
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
});

// 定義可以往外傳的事件 (更新 tab)
defineEmits(["update:modelValue"]);
</script>
