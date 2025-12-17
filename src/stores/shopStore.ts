// src/stores/shopStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { useHeroStore } from "./heroStore";

// 定義商品介面
export interface ShopItem {
  id: string;
  name: string;
  price: number;
  description: string;
  type: "WEAPON" | "ARMOR" | "POTION";
  icon: string;
  effect?: {
    type: "HEAL" | "MAX_HP" | "XP_BOOST" | "GOLD_BOOST"; // <--- 加入 MAX_HP 等類型
    value: number;
  };
}

export const useShopStore = defineStore("shop", () => {
  const hero = useHeroStore();

  const items = ref<ShopItem[]>([
    {
      id: "potion_small",
      name: "Red Potion",
      price: 50,
      description: "Restores 50 HP. Tastes like strawberries.",
      type: "POTION",
      // 紅色藥水
      icon: "https://icons.iconarchive.com/icons/chanut/role-playing/64/Potion-icon.png",
      effect: { type: "HEAL", value: 50 },
    },
    {
      id: "sword_wood",
      name: "Wooden Sword",
      price: 200,
      description: "Better than a stick. Increases XP gain slightly.",
      type: "WEAPON",
      // 劍
      icon: "/items/sword.png",
      effect: { type: "XP_BOOST", value: 0.1 },
    },
    {
      id: "armor_leather",
      name: "Leather Armor",
      price: 500,
      description: "Basic protection. Increases Max HP.",
      type: "ARMOR",
      // 盔甲 (這裡用一件衣服代替)
      icon: "/items/armor.png",
      effect: { type: "MAX_HP", value: 20 },
    },
    {
      id: "ring_gold",
      name: "Greedy Ring",
      price: 1000,
      description: "A cursed ring that attracts wealth.",
      type: "ARMOR",
      // 戒指
      icon: "/items/ring.png",
      effect: { type: "GOLD_BOOST", value: 0.1 },
    },
  ]);

  // 購買功能
  function buyItem(item: ShopItem) {
    // 1. 檢查錢夠不夠
    if (hero.gold < item.price) {
      alert("Goblin: 'Not enough shiny coins! Get out!'");
      return false;
    }

    // 2. 扣錢
    hero.updateGold(-item.price);

    // 3. 給東西 (如果是藥水，直接進背包；如果是裝備，也進背包)
    hero.addItem(item.id);

    // 4. (選用) 如果是藥水，這版本允許「購買即飲用」嗎？
    // 目前邏輯：買了就進背包。之後在背包介面使用。

    return true;
  }

  // 使用道具 (目前主要用於藥水)
  function useItem(item: ShopItem) {
    if (!hero.inventory.includes(item.id)) return;

    if (item.type === "POTION" && item.effect?.type === "HEAL") {
      hero.heal(item.effect.value);
      hero.removeItem(item.id); // 消耗掉
      return true;
    }

    return false;
  }

  return { items, buyItem, useItem };
});
