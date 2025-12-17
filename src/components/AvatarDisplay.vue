<script setup lang="ts">
import { computed } from "vue";
import { useHeroStore } from "@/stores/heroStore";
import { useShopStore } from "@/stores/shopStore";

const heroStore = useHeroStore();
const shopStore = useShopStore();

const weaponIcon = computed(() => {
  const itemId = heroStore.equipment.weapon;
  if (!itemId) return null;
  return shopStore.items.find((i) => i.id === itemId)?.icon;
});

const armorIcon = computed(() => {
  const itemId = heroStore.equipment.armor;
  if (!itemId) return null;
  return shopStore.items.find((i) => i.id === itemId)?.icon;
});

const baseBodyUrl = computed(() => {
  if (heroStore.isDead)
    return "https://icons.iconarchive.com/icons/chanut/role-playing/128/Skull-icon.png";
  if (heroStore.hp < heroStore.maxHp * 0.3)
    return "https://icons.iconarchive.com/icons/chanut/role-playing/128/Villager-icon.png";
  return "https://icons.iconarchive.com/icons/chanut/role-playing/128/Elf-icon.png";
});
</script>

<template>
  <div class="flex items-center justify-center gap-6 py-4">
    <div class="flex flex-col items-center gap-1">
      <span class="text-[10px] text-gray-500 uppercase tracking-wider"
        >Weapon</span
      >
      <div
        class="w-16 h-16 bg-gray-900 border-2 flex items-center justify-center relative shadow-inner transition-colors"
        :class="weaponIcon ? 'border-gold bg-gold/10' : 'border-gray-700'"
      >
        <transition name="pop" mode="out-in" appear>
          <img
            v-if="weaponIcon"
            :src="weaponIcon"
            class="w-10 h-10 object-contain pixelated drop-shadow-md"
          />
          <span v-else class="text-gray-700 text-2xl opacity-50">⚔️</span>
        </transition>
      </div>
    </div>

    <div class="relative w-32 h-32 flex items-center justify-center">
      <div
        v-if="!heroStore.isDead"
        class="absolute inset-0 bg-gold/5 blur-xl rounded-full animate-pulse"
      ></div>

      <img
        :src="baseBodyUrl"
        class="w-full h-full object-contain pixelated z-10 drop-shadow-2xl"
        :class="{ 'grayscale opacity-50': heroStore.isDead }"
      />

      <div
        class="absolute bottom-2 w-20 h-3 bg-black/40 rounded-full blur-sm"
      ></div>
    </div>

    <div class="flex flex-col items-center gap-1">
      <span class="text-[10px] text-gray-500 uppercase tracking-wider"
        >Armor</span
      >
      <div
        class="w-16 h-16 bg-gray-900 border-2 flex items-center justify-center relative shadow-inner transition-colors"
        :class="armorIcon ? 'border-hp-red bg-hp-red/10' : 'border-gray-700'"
      >
        <transition name="pop" mode="out-in" appear>
          <img
            v-if="armorIcon"
            :src="armorIcon"
            class="w-10 h-10 object-contain pixelated drop-shadow-md"
          />
          <span v-else class="text-gray-700 text-2xl opacity-50">🛡️</span>
        </transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pixelated {
  image-rendering: pixelated;
  max-width: unset;
}

/* 彈出動畫 */
.pop-enter-active {
  animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* 稍微調慢一點點讓你看得清楚 */
}
.pop-leave-active {
  animation: pop-in 0.2s reverse;
}

@keyframes pop-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
