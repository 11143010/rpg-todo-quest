<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useQuestStore } from "@/stores/questStore";
import { runDailyTick } from "@/services/dailyService";
import QuestItem from "@/components/QuestItem.vue";
import CreateQuestModal from "@/components/CreateQuestModal.vue";
import AvatarDisplay from "@/components/AvatarDisplay.vue";
import { useHeroStore } from "@/stores/heroStore";

const heroStore = useHeroStore();
const questStore = useQuestStore();
const showModal = ref(false);

const handleCreate = (payload: {
  title: string;
  difficulty: "S" | "M" | "L";
  attribute: "STR" | "INT" | "VIT";
}) => {
  questStore.addQuest(payload.title, payload.difficulty, payload.attribute);
};

onMounted(() => {
  // 每日結算只在 Dashboard 觸發比較合理
  const result = runDailyTick();
  if (result && (result.damage > 0 || result.dead)) {
    alert(result.messages.join("\n"));
  }
});
</script>

<template>
  <div class="w-full max-w-xl mx-auto p-4 pb-24">
    <div class="my-8">
      <AvatarDisplay />

      <div class="text-center mt-2 text-xs text-gray-500 font-pixel">
        <span v-if="heroStore.equipment.weapon || heroStore.equipment.armor"
          >Ready for Battle!</span
        >
        <span v-else>Equip items in Shop to get stronger.</span>
      </div>
    </div>

    <h2 class="text-gray-400 text-sm mb-4 border-b border-gray-800 pb-2">
      Active Quests ({{ questStore.activeQuests.length }})
    </h2>

    <div class="space-y-3">
      <QuestItem
        v-for="quest in questStore.activeQuests"
        :key="quest.id"
        :quest="quest"
        @complete="questStore.completeQuest"
        @delete="questStore.deleteQuest"
      />

      <div
        v-if="questStore.activeQuests.length === 0"
        class="text-center py-10 text-gray-600"
      >
        No monsters found...<br />
        <span class="text-xs mt-2 block"
          >Tap the + button to summon new tasks.</span
        >
      </div>
    </div>

    <button
      @click="showModal = true"
      class="fixed bottom-24 right-6 w-14 h-14 bg-gold border-b-4 border-yellow-700 rounded-full flex items-center justify-center text-dungeon-black text-2xl shadow-lg hover:scale-110 transition-transform active:scale-95 z-40"
    >
      +
    </button>

    <CreateQuestModal
      v-if="showModal"
      @close="showModal = false"
      @confirm="handleCreate"
    />
  </div>
</template>
