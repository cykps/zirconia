import { GACHA_CONFIG as CONFIG } from '../config.js';
import { generateMessage, createEphemeralResponse } from '../utils.js';
import { InteractionResponseType } from 'discord-interactions';

export const GACHAS = Object.fromEntries(
  CONFIG.gachas.map((gacha) => {
    return [gacha.name, { ...gacha, totalWeight: calculateTotalWeight(gacha) }];
  }),
);

// スラッシュコマンドのハンドル関数
export function gacha(commandName, interaction) {
  const gacha = GACHAS[commandName];
  if (gacha.totalWeight <= 0) {
    return createEphemeralResponse(CONFIG.invalidWeight);
  }
  const drawnChoice = drawChoice(gacha);
  const message = generateMessage(drawnChoice.message, {
    interaction: interaction,
    gacha: gacha,
    drawnChoice: drawnChoice,
  });

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: message,
    },
  };
}

// 抽選を行う関数
function drawChoice(gacha) {
  let random = Math.floor(Math.random() * gacha.totalWeight);
  for (const choice of gacha.choices) {
    random -= choice.weight;
    if (random < 0) {
      return choice;
    }
  }
}

// 重みの合計を計算する関数
function calculateTotalWeight(gacha) {
  return gacha.choices.reduce((sum, item) => sum + item.weight, 0);
}
