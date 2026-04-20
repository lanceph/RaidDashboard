<template>
  <div class="relative w-full" ref="dropdownRef">
    <div
      class="relative flex items-center w-full bg-slate-50 border border-slate-300 rounded-lg transition-all focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 shadow-inner overflow-hidden"
      :class="inputClasses"
    >
      <div class="pl-3.5 flex items-center justify-center text-slate-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clip-rule="evenodd"
          />
        </svg>
      </div>

      <input
        type="text"
        v-model="internalValue"
        @focus="isOpen = true"
        @input="handleInput"
        :placeholder="placeholder"
        class="w-full bg-transparent px-3 py-2.5 outline-none text-slate-800 font-bold"
      />

      <button
        v-if="internalValue"
        @click="clear"
        class="pr-3 text-slate-300 hover:text-slate-500 transition-colors focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>

    <transition name="dropdown">
      <ul
        v-if="isOpen && filteredOptions.length > 0"
        class="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto custom-scrollbar"
      >
        <li
          v-for="option in filteredOptions"
          :key="option"
          @click="selectOption(option)"
          class="px-4 py-2.5 hover:bg-indigo-50 cursor-pointer text-slate-700 font-bold transition-colors border-b border-slate-50 last:border-0 flex items-center gap-2"
        >
          <span
            class="w-2 h-2 rounded-full bg-indigo-500 opacity-0 transition-opacity"
            :class="{ 'opacity-100': internalValue === option }"
          ></span>
          {{ option }}
        </li>
      </ul>
    </transition>

    <transition name="dropdown">
      <div
        v-if="isOpen && internalValue && filteredOptions.length === 0"
        class="absolute z-50 w-full mt-1.5 bg-white border border-slate-200 rounded-lg shadow-xl p-4 text-center text-slate-500 font-bold"
      >
        找不到符合的玩家
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
  modelValue: String,
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: "搜尋玩家..." },
  inputClasses: { type: String, default: "" }, // 允許外部微調大小
});

const emit = defineEmits(["update:modelValue"]);

const internalValue = ref(props.modelValue || "");
const isOpen = ref(false);
const dropdownRef = ref(null);

// 同步外部的 v-model
watch(
  () => props.modelValue,
  (newVal) => {
    internalValue.value = newVal || "";
  }
);

// 過濾邏輯
const filteredOptions = computed(() => {
  if (!internalValue.value) return props.options;
  const lower = internalValue.value.toLowerCase();
  return props.options.filter((opt) => opt.toLowerCase().includes(lower));
});

const handleInput = () => {
  isOpen.value = true;
  emit("update:modelValue", internalValue.value);
};

const selectOption = (option) => {
  internalValue.value = option;
  emit("update:modelValue", option);
  isOpen.value = false; // 選取後自動收起
};

const clear = () => {
  internalValue.value = "";
  emit("update:modelValue", "");
  isOpen.value = true;
};

// 點擊空白處自動關閉選單
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => document.addEventListener("mousedown", handleClickOutside));
onBeforeUnmount(() =>
  document.removeEventListener("mousedown", handleClickOutside)
);
</script>

<style scoped>
/* 彈出動畫 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

/* 漂亮的客製化捲軸 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
