<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  (e: "close"): void;
  (
    e: "confirm",
    payload: {
      title: string;
      difficulty: "S" | "M" | "L";
      attribute: "STR" | "INT" | "VIT";
    }
  ): void;
}>();

const title = ref("");
const difficulty = ref<"S" | "M" | "L">("S");
const attribute = ref<"STR" | "INT" | "VIT">("STR");

const handleSubmit = () => {
  if (!title.value.trim()) return;
  emit("confirm", {
    title: title.value,
    difficulty: difficulty.value,
    attribute: attribute.value,
  });
  emit("close");
};
</script>

<template>
  <div
    class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
    @click.self="emit('close')"
  >
    <div
      class="bg-gray-900 border-4 border-white w-full max-w-md p-6 relative shadow-2xl animate-bounce-in"
    >
      <h2 class="text-center text-gold text-xl mb-6">Summon Monster</h2>
      <div class="mb-4">
        <label class="block text-xs text-gray-400 mb-1">Quest Title</label>
        <input
          v-model="title"
          type="text"
          class="w-full bg-black border-2 border-gray-600 p-2 text-white focus:border-gold outline-none font-pixel"
          placeholder="e.g. Refactor Codebase..."
          autoFocus
        />
      </div>

      <div class="mb-4">
        <label class="block text-xs text-gray-400 mb-2"
          >Difficulty (Reward Multiplier)</label
        >
        <div class="flex gap-2">
          <button
            v-for="d in ['S', 'M', 'L'] as const"
            :key="d"
            @click="difficulty = d"
            class="flex-1 border-2 p-2 text-center transition-colors text-xs md:text-sm"
            :class="
              difficulty === d
                ? 'border-gold bg-gold/20 text-gold'
                : 'border-gray-700 text-gray-500 hover:border-gray-500'
            "
          >
            {{ d === "S" ? "Minion" : d === "M" ? "Elite" : "BOSS" }}
          </button>
        </div>
      </div>

      <div class="mb-6">
        <label class="block text-xs text-gray-400 mb-2">Attribute</label>
        <div class="flex gap-2">
          <button
            v-for="a in ['STR', 'INT', 'VIT'] as const"
            :key="a"
            @click="attribute = a"
            class="flex-1 border-2 p-2 text-center transition-colors text-xl"
            :class="
              attribute === a
                ? 'border-white bg-gray-800'
                : 'border-gray-800 text-gray-600 hover:border-gray-600'
            "
          >
            {{ a === "STR" ? "⚔️" : a === "INT" ? "🔮" : "❤️" }}
          </button>
        </div>
      </div>

      <div class="flex gap-4 mt-8">
        <button
          @click="emit('close')"
          class="flex-1 py-2 text-gray-400 hover:text-white hover:underline"
        >
          Cancel
        </button>
        <button
          @click="handleSubmit"
          class="flex-1 py-2 bg-blue-600 border-b-4 border-blue-800 active:border-b-0 active:translate-y-1 text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!title"
        >
          SUMMON
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes bounce-in {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
.animate-bounce-in {
  animation: bounce-in 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
</style>
