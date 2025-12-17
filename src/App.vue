<script setup lang="ts">
import TheHeader from "@/components/TheHeader.vue";
import TheBottomNav from "@/components/TheBottomNav.vue";
</script>

<template>
  <div
    class="min-h-screen bg-dungeon-black text-white font-pixel flex flex-col relative"
  >
    <TheHeader />

    <main class="flex-1 overflow-y-auto">
      <RouterView />
    </main>

    <TheBottomNav />
  </div>
</template>
