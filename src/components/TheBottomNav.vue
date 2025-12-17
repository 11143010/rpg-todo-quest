<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

// 判斷當前頁面是否活躍
const isActive = (path: string) => route.path === path;
</script>

<template>
  <nav
    class="fixed bottom-0 left-0 w-full bg-gray-900 border-t-4 border-gray-700 z-50 pb-safe"
  >
    <div class="max-w-xl mx-auto flex">
      <button
        @click="router.push('/')"
        class="flex-1 py-3 flex flex-col items-center justify-center transition-colors"
        :class="
          isActive('/')
            ? 'text-white bg-gray-800'
            : 'text-gray-500 hover:text-gray-300'
        "
      >
        <span class="text-xl mb-1">⚔️</span>
        <span class="text-[10px] uppercase tracking-widest">Battle</span>
      </button>

      <button
        @click="router.push('/shop')"
        class="flex-1 py-3 flex flex-col items-center justify-center transition-colors"
        :class="
          isActive('/shop')
            ? 'text-gold bg-gray-800'
            : 'text-gray-500 hover:text-gray-300'
        "
      >
        <span class="text-xl mb-1">🛒</span>
        <span class="text-[10px] uppercase tracking-widest">Shop</span>
      </button>

      <button
        class="flex-1 py-3 flex flex-col items-center justify-center text-gray-700 cursor-not-allowed"
      >
        <span class="text-xl mb-1">⚙️</span>
        <span class="text-[10px] uppercase tracking-widest">Menu</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
/* 為了適應 iPhone 底部橫條 */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom, 20px);
}
</style>
