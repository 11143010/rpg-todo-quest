<script setup lang="ts">
import { computed } from "vue";
import type { Quest } from "@/stores/questStore";

const props = defineProps<{
  quest: Quest;
}>();

const emit = defineEmits<{
  (e: "complete", id: string): void;
  (e: "delete", id: string): void;
}>();

// 根據屬性顯示不同圖示
const iconMap: Record<string, string> = {
  STR: "⚔️",
  INT: "🔮",
  VIT: "❤️",
};

// 根據難度顯示不同顏色標籤
const difficultyColor = computed(() => {
  switch (props.quest.difficulty) {
    case "S":
      return "text-gray-400";
    case "M":
      return "text-xp-blue";
    case "L":
      return "text-hp-red";
    default:
      return "text-gray-400";
  }
});
</script>

<template>
  <div
    class="bg-gray-900 border-2 border-gray-700 p-3 flex justify-between items-center group hover:border-white transition-all duration-200"
  >
    <div class="flex items-center gap-3">
      <button
        @click="emit('complete', quest.id)"
        class="w-6 h-6 border-2 border-gray-500 hover:bg-gray-700 active:bg-gold flex items-center justify-center transition-colors"
      >
        <span
          v-if="quest.status === 'COMPLETED'"
          class="bg-gold w-3 h-3 block"
        ></span>
      </button>

      <div class="flex flex-col">
        <span class="text-sm md:text-base leading-tight font-pixel">{{
          quest.title
        }}</span>
        <div class="flex gap-2 text-[10px] mt-1">
          <span class="text-gray-500">{{
            iconMap[quest.attribute] || "👾"
          }}</span>
          <span :class="difficultyColor">Rank {{ quest.difficulty }}</span>
        </div>
      </div>
    </div>

    <button
      @click="emit('delete', quest.id)"
      class="text-gray-600 hover:text-red-500 transition-colors px-2"
    >
      ✖
    </button>
  </div>
</template>
