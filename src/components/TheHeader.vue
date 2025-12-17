<script setup lang="ts">
import { useHeroStore } from "@/stores/heroStore";

const hero = useHeroStore();
</script>

<template>
  <header
    class="w-full bg-gray-900 border-b-4 border-gray-700 p-4 sticky top-0 z-50 shadow-lg"
  >
    <div class="max-w-xl mx-auto flex justify-between items-end">
      <div class="flex-1">
        <div class="flex items-baseline gap-2 mb-1">
          <h1 class="text-gold text-lg md:text-xl drop-shadow-md">
            {{ hero.name }}
          </h1>
          <span class="text-xs text-gray-400">LV.{{ hero.level }}</span>
        </div>

        <div
          class="w-full max-w-[200px] h-4 bg-gray-800 border-2 border-gray-600 relative"
        >
          <div
            class="h-full bg-hp-red transition-all duration-500 ease-out"
            :style="{ width: (hero.hp / hero.maxHp) * 100 + '%' }"
          ></div>
          <span
            class="absolute inset-0 flex items-center justify-center text-[10px] text-white drop-shadow-md"
          >
            {{ hero.hp }} / {{ hero.maxHp }}
          </span>
        </div>
      </div>

      <div class="text-right flex flex-col items-end">
        <div class="w-32 text-right mb-1">
          <div class="text-[10px] text-xp-blue mb-0.5">
            XP {{ hero.currentExp }}/{{ hero.maxExp }}
          </div>
          <div class="w-full h-1.5 bg-gray-800">
            <div
              class="h-full bg-xp-blue transition-all duration-300"
              :style="{ width: (hero.currentExp / hero.maxExp) * 100 + '%' }"
            ></div>
          </div>
        </div>

        <div
          class="text-gold text-sm md:text-base mt-1 flex items-center gap-1"
        >
          <span>{{ hero.gold.toLocaleString() }} G</span>
        </div>
      </div>
    </div>
  </header>
</template>
