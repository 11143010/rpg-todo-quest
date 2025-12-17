// src/services/dailyService.ts
import { useHeroStore } from "@/stores/heroStore";
import { useQuestStore } from "@/stores/questStore";

export function runDailyTick() {
  const heroStore = useHeroStore();
  const questStore = useQuestStore();

  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  // 1. 讀取上次登入時間
  const lastLogin = heroStore.lastLoginDate;

  // 如果是第一次玩，或是同一天登入，就不做結算
  if (now - lastLogin < oneDay) {
    // 雖然不到一天，但還是更新一下登入時間
    heroStore.lastLoginDate = now;
    return { damage: 0, dead: false, messages: [] };
  }

  // --- 進入結算流程 ---

  const messages: string[] = [];
  let totalDamage = 0;

  // 2. 檢查過期任務 (這裡暫時模擬：只要是 ACTIVE 的任務，每過一天扣 10% 血)
  // 在完整版中，我們會檢查 quest.dueAt
  const activeCount = questStore.activeQuests.length;

  if (activeCount > 0) {
    // 每個未完成任務扣 10% 最大血量
    const damagePerQuest = Math.floor(heroStore.maxHp * 0.1);
    totalDamage = activeCount * damagePerQuest;

    heroStore.takeDamage(totalDamage);
    messages.push(
      `The night was dangerous. ${activeCount} monsters attacked you! You took ${totalDamage} DMG.`
    );
  } else {
    messages.push("You rested peacefully. No active quests yesterday.");
  }

  // 3. 檢查是否死亡
  const isDead = heroStore.isDead;
  if (isDead) {
    messages.push("🔴 YOU DIED! Level decreased. Gold lost.");
  }

  // 4. 更新最後登入時間
  heroStore.lastLoginDate = now;

  return { damage: totalDamage, dead: isDead, messages };
}
