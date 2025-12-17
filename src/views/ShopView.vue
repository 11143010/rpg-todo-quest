<script setup lang="ts">
import { useShopStore } from "@/stores/shopStore";
import { useHeroStore } from "@/stores/heroStore";

const shopStore = useShopStore();
const heroStore = useHeroStore();

const handleBuy = (item: any) => {
  if (confirm(`Buy ${item.name} for ${item.price} G?`)) {
    const success = shopStore.buyItem(item);
    if (success) {
      // 這裡之後可以用漂亮的 Toast，先用 Alert
      // alert('Purchase successful!')
      // 為了體驗流暢，成功就不跳視窗了，只看金幣減少
    }
  }
};

// 檢查是否已擁有 (針對裝備，藥水可以重複買)
const isOwned = (itemId: string) => {
  return heroStore.inventory.includes(itemId);
};
// 🟢 [新增] 查詢物品詳情 helper
const getItemDetail = (itemId: string) => {
  return shopStore.items.find((i) => i.id === itemId);
};

// 🟢 [新增] 判斷是否已裝備
const isEquipped = (itemId: string) => {
  return Object.values(heroStore.equipment).includes(itemId);
};

// 🟢 [新增] 點擊背包物品
const handleInventoryClick = (itemId: string) => {
  const item = getItemDetail(itemId);
  if (!item) return;

  if (item.type === "POTION") {
    // 喝水邏輯
    if (confirm(`Drink ${item.name}? (+${item.effect?.value} HP)`)) {
      shopStore.useItem(item);
    }
  } else {
    // 裝備邏輯
    heroStore.toggleEquip(itemId);
  }
};
</script>

<template>
  <div class="w-full max-w-xl mx-auto p-4 pb-24">
    <div class="text-center mt-6 mb-8">
      <h2 class="text-gold text-2xl font-pixel mb-2">Goblin Market</h2>
      <p class="text-gray-400 text-xs italic">"No refunds. No receipts."</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="item in shopStore.items"
        :key="item.id"
        class="bg-gray-900 border-2 border-gray-700 p-4 flex flex-col justify-between group hover:border-gold transition-colors relative overflow-hidden"
      >
        <div
          v-if="item.type !== 'POTION' && isOwned(item.id)"
          class="absolute inset-0 bg-black/60 z-10 flex items-center justify-center"
        >
          <span
            class="text-gray-400 font-bold border-2 border-gray-400 p-1 transform -rotate-12"
            >OWNED</span
          >
        </div>

        <div class="flex items-start gap-4 mb-4">
          <div
            class="w-16 h-16 bg-gray-800 flex items-center justify-center border-2 border-gray-600 rounded p-2 shrink-0"
          >
            <img
              :src="item.icon"
              :alt="item.name"
              class="w-full h-full object-contain pixelated"
            />
          </div>
          <div>
            <h3 class="text-white font-bold">{{ item.name }}</h3>
            <div
              class="text-[10px] text-gray-400 bg-gray-800 inline-block px-1 rounded mt-1"
            >
              {{ item.type }}
            </div>
            <p
              class="text-xs text-gray-500 mt-2 leading-relaxed h-10 overflow-hidden"
            >
              {{ item.description }}
            </p>
          </div>
        </div>

        <button
          @click="handleBuy(item)"
          :disabled="
            heroStore.gold < item.price ||
            (item.type !== 'POTION' && isOwned(item.id))
          "
          class="w-full py-2 border-b-4 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2 transition-all"
          :class="
            heroStore.gold >= item.price
              ? 'bg-blue-600 border-blue-800 hover:bg-blue-500 text-white'
              : 'bg-gray-700 border-gray-800 text-gray-500 cursor-not-allowed'
          "
        >
          <span>{{ item.price }} G</span>
        </button>
      </div>
    </div>

    <div class="mt-12 border-t border-gray-800 pt-4">
      <h3 class="text-gray-500 text-sm mb-4">
        Your Inventory (Tap to Equip/Use)
      </h3>

      <div class="flex flex-wrap gap-3">
        <button
          v-for="(itemId, index) in heroStore.inventory"
          :key="index"
          @click="handleInventoryClick(itemId)"
          class="w-12 h-12 bg-gray-800 border-2 flex items-center justify-center relative hover:scale-110 transition-transform shrink-0"
          :class="
            isEquipped(itemId)
              ? 'border-gold shadow-[0_0_10px_rgba(255,204,0,0.5)]'
              : 'border-gray-600 hover:border-gray-400'
          "
          :title="getItemDetail(itemId)?.name"
        >
          <img
            v-if="getItemDetail(itemId)"
            :src="getItemDetail(itemId)?.icon"
            class="w-8 h-8 object-contain pixelated"
            style="max-width: none"
          />
          <span v-else>📦</span>

          <span
            v-if="isEquipped(itemId)"
            class="absolute -top-2 -right-2 bg-gold text-dungeon-black text-[8px] px-1 font-bold rounded border border-white"
            >E</span
          >
        </button>

        <div
          v-if="heroStore.inventory.length === 0"
          class="text-gray-600 text-xs w-full text-center py-4"
        >
          Inventory is empty. Buy something!
        </div>
      </div>

      <div
        v-if="heroStore.inventory.length > 0"
        class="mt-4 text-xs text-gray-500 grid grid-cols-2 gap-2"
      >
        <div>
          Bonus XP:
          <span class="text-xp-blue"
            >+{{ Math.round((heroStore.totalStats.expRate - 1) * 100) }}%</span
          >
        </div>
        <div>
          Max HP: <span class="text-hp-red">{{ heroStore.maxHp }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.pixelated {
  image-rendering: pixelated; /* 讓圖片縮放時保持像素顆粒感 */
}
</style>
