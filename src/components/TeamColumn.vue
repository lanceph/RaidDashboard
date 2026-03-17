<template>
  <div class="team-col bg-slate-50/50">
    <div
      class="bg-slate-100 text-slate-700 text-center py-2.5 text-sm font-black border-b border-slate-200"
    >
      {{ teamName }}
    </div>
    <div class="p-3 flex flex-col gap-1 flex-1">
      <div
        v-for="role in CONFIG.ROLES"
        :key="role"
        :class="[
          'role-card',
          `theme-${role}`,
          isRoleEmpty(role) ? 'empty-slot' : '',
          isHighlighted(role) ? 'highlight-card' : '',
        ]"
      >
        <div
          class="flex items-center justify-between border-b border-black/5 pb-2 mb-2 flex-shrink-0"
        >
          <span class="role-badge">{{ role }}</span>
        </div>

        <div class="flex-1 flex flex-col justify-start">
          <div
            v-if="isRoleEmpty(role)"
            class="text-center text-slate-400 text-sm py-2"
          >
            無資料
          </div>
          <div
            v-else
            v-for="member in teamData[role]"
            :key="member.name"
            :class="[
              'flex flex-col mb-2 last:mb-0',
              isPlayerHighlighted(member.name) ? 'highlight-row p-1 -mx-1' : '',
            ]"
          >
            <div class="flex items-center gap-1.5">
              <span
                :class="[
                  getRoleStatusClass(member.name, member.status),
                  'font-black text-xl w-5 text-center',
                ]"
              >
                {{ member.status.toLowerCase() === "o" ? "O" : "X" }}
              </span>
              <span
                :class="[
                  'name-text',
                  isOutsider(member.name) ? 'text-slate-500' : 'text-slate-800',
                ]"
              >
                {{ member.name }}
                <span v-if="isOutsider(member.name)" class="outsider-badge"
                  >外援</span
                >
              </span>
            </div>
            <div class="flex flex-wrap gap-1.5 ml-6 mt-1">
              <span
                v-for="item in [...member.holies, ...member.pets]"
                :key="item"
                :class="['tag-base', getElementClass(item)]"
              >
                {{ item }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { CONFIG } from "../utils/parser";
import { store } from "../composables/useSchedule";

const props = defineProps({
  teamName: String,
  teamData: Object,
  searchQuery: String,
});

const isRoleEmpty = (role) =>
  !props.teamData[role] ||
  props.teamData[role].length === 0 ||
  props.teamData[role][0].name === "--";
const isOutsider = (name) => !store.getRole(name);
const isPlayerHighlighted = (name) =>
  props.searchQuery && name === props.searchQuery.trim();
const isHighlighted = (role) =>
  role !== "輸出" &&
  props.teamData[role]?.[0]?.name === props.searchQuery?.trim();

const getElementClass = (item) => {
  const attr = store.getAttr(item);
  if (attr.includes("木"))
    return "bg-green-100 text-green-800 border-green-400";
  if (attr.includes("火")) return "bg-red-100 text-red-800 border-red-400";
  if (attr.includes("水")) return "bg-blue-100 text-blue-800 border-blue-400";
  if (attr.includes("光"))
    return "bg-yellow-100 text-yellow-800 border-yellow-400";
  if (attr.includes("暗"))
    return "bg-purple-100 text-purple-800 border-purple-400";
  return "bg-slate-100 text-slate-700 border-slate-300";
};

const getRoleStatusClass = (name, status) => {
  if (!name || name === "--") return "text-slate-300";
  const roleInfo = store.getRole(name);
  if (!roleInfo) return "text-slate-400";
  if (roleInfo.includes("巫師")) return "text-purple-600";
  if (roleInfo.includes("流氓")) return "text-blue-600";
  if (roleInfo.includes("技師")) return "text-pink-500";
  if (roleInfo.includes("劍")) return "text-green-600";
  if (roleInfo.includes("破壞")) return "text-yellow-600";
  return "text-red-600";
};
</script>
