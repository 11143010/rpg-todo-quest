// src/stores/questStore.ts
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useHeroStore } from "./heroStore";

// 定義任務介面
export interface Quest {
  id: string;
  title: string;
  difficulty: "S" | "M" | "L";
  attribute: "STR" | "INT" | "VIT";
  status: "ACTIVE" | "COMPLETED";
  createdAt: number; // 用於防刷判定
  dueAt: number | null;
}

export const useQuestStore = defineStore(
  "quest",
  () => {
    const quests = ref<Quest[]>([]);
    const heroStore = useHeroStore();

    // 取得活躍任務
    const activeQuests = computed(() =>
      quests.value.filter((q) => q.status === "ACTIVE")
    );

    // 新增任務 (召喚怪物)
    function addQuest(
      title: string,
      difficulty: "S" | "M" | "L",
      attribute: "STR" | "INT" | "VIT"
    ) {
      const newQuest: Quest = {
        id: crypto.randomUUID(), // 自動產生唯一 ID
        title,
        difficulty,
        attribute,
        status: "ACTIVE",
        createdAt: Date.now(),
        dueAt: null, // MVP 先暫時不設期限
      };
      quests.value.push(newQuest);
    }

    // 完成任務 (戰鬥結算)
    function completeQuest(id: string) {
      const quest = quests.value.find((q) => q.id === id);
      if (!quest || quest.status !== "ACTIVE") return;

      // 1. 標記為完成
      quest.status = "COMPLETED";

      // 2. 計算獎勵基數
      let xpReward = 0;
      let goldReward = 0;

      switch (quest.difficulty) {
        case "S":
          xpReward = 50;
          goldReward = 10;
          break;
        case "M":
          xpReward = 150;
          goldReward = 50;
          break;
        case "L":
          xpReward = 500;
          goldReward = 200;
          break;
      }

      // 3. 防刷機制 (Anti-Farming Logic)
      // 如果任務存活時間小於 1 分鐘 (60000ms)，獎勵打 1 折
      const timeAlive = Date.now() - quest.createdAt;
      if (timeAlive < 60000) {
        xpReward = Math.floor(xpReward * 0.1);
        goldReward = Math.floor(goldReward * 0.1);
        console.log("⚡️ 秒殺懲罰生效！獎勵大幅減少。");
      }

      // 4. 發放獎勵
      heroStore.gainExp(xpReward);
      heroStore.updateGold(goldReward);
    }

    // 刪除任務
    function deleteQuest(id: string) {
      quests.value = quests.value.filter((q) => q.id !== id);
    }

    return {
      quests,
      activeQuests,
      addQuest,
      completeQuest,
      deleteQuest,
    };
  },
  {
    persist: true,
  }
);
