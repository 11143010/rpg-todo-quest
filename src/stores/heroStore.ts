// src/stores/heroStore.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useShopStore } from "./shopStore";

export const useHeroStore = defineStore(
  "hero",
  () => {
    // --- State (資料) ---
    const level = ref(1);
    const currentExp = ref(0);
    const hp = ref(100);
    const gold = ref(0);
    const name = ref("Hero User");

    // 🟢 [新增] 上次登入時間，預設為當下
    const lastLoginDate = ref(Date.now());
    const inventory = ref<string[]>([]);
    const equipment = ref<{
      weapon: string | null;
      armor: string | null;
      accessory: string | null;
    }>({
      weapon: null,
      armor: null,
      accessory: null,
    });

    // --- Getters ---

    // 🟢 [新增] 計算總屬性 (基礎 + 裝備)
    // 🟢 [新增] 計算總屬性 (基礎 + 裝備)
    const totalStats = computed(() => {
      const shopStore = useShopStore();
      // 基礎數值
      let bonusHp = 0;
      let bonusExpRate = 1.0; // 100%
      let bonusGoldRate = 1.0;

      // 遍歷所有裝備
      Object.values(equipment.value).forEach((itemId) => {
        if (!itemId) return;
        const item = shopStore.items.find((i) => i.id === itemId);
        if (item && item.effect) {
          if (item.effect.type === "MAX_HP") bonusHp += item.effect.value;
          // 這裡可以根據您的設計擴充更多效果 (例如 STR 增加 XP)
        }
        // 簡單範例：武器增加 XP 獲取，防具增加 HP
        if (item?.type === "WEAPON") bonusExpRate += 0.1; // 武器 +10% XP
        if (item?.type === "ARMOR") bonusHp += 20; // 防具 +20 HP
      });

      return {
        maxHp: 100 + (level.value - 1) * 20 + bonusHp,
        expRate: bonusExpRate,
        goldRate: bonusGoldRate,
      };
    });

    // --- Getters (計算屬性) ---
    const maxHp = computed(() => totalStats.value.maxHp);
    const isDead = computed(() => hp.value <= 0);
    // MaxExp 暫時不變
    const maxExp = computed(() => Math.floor(level.value * 100 * 1.5));

    // --- Actions (邏輯操作) ---
    function gainExp(amount: number) {
      // 套用經驗值倍率
      const finalExp = Math.floor(amount * totalStats.value.expRate);
      currentExp.value += finalExp;
      while (currentExp.value >= maxExp.value) {
        currentExp.value -= maxExp.value;
        levelUp();
      }
    }

    function levelUp() {
      level.value++;
      hp.value = maxHp.value;
    }

    function updateGold(amount: number) {
      gold.value += amount;
    }

    function takeDamage(amount: number) {
      hp.value = Math.max(0, hp.value - amount);
      if (hp.value <= 0) {
        handleDeath();
      }
    }

    function handleDeath() {
      level.value = Math.max(1, level.value - 1);
      gold.value = 0;
      hp.value = Math.floor(maxHp.value * 0.5);
    }

    function addItem(itemId: string) {
      inventory.value.push(itemId);
    }

    // 🟢 [新增] 移除物品 (喝水或賣掉時用)
    function removeItem(itemId: string) {
      const index = inventory.value.indexOf(itemId);
      if (index > -1) {
        inventory.value.splice(index, 1);
      }
    }

    // 🟢 [新增] 補血 (喝藥水用)
    function heal(amount: number) {
      hp.value = Math.min(maxHp.value, hp.value + amount);
    }
    function toggleEquip(itemId: string) {
      const shopStore = useShopStore();
      const item = shopStore.items.find((i) => i.id === itemId);
      if (!item || item.type === "POTION") return; // 藥水不能裝備

      const slotMap: Record<string, "weapon" | "armor" | "accessory"> = {
        WEAPON: "weapon",
        ARMOR: "armor",
        // 'RING': 'accessory'
      };

      const slot = slotMap[item.type];
      if (!slot) return;

      // 如果已經裝備這個，就卸下
      if (equipment.value[slot] === itemId) {
        equipment.value[slot] = null;
      } else {
        // 否則穿上 (替換掉原本的)
        equipment.value[slot] = itemId;
      }
    }

    return {
      level,
      currentExp,
      hp,
      gold,
      name,
      lastLoginDate,
      inventory,
      equipment, // 匯出 equipment
      maxExp,
      maxHp,
      isDead,
      totalStats, // 匯出 totalStats
      gainExp,
      updateGold,
      takeDamage,
      addItem,
      removeItem,
      heal,
      toggleEquip, // 匯出 toggleEquip
    };
  },
  {
    persist: true,
  }
);
