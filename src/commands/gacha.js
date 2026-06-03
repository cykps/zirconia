import { GACHA_CONFIG as CONFIG } from '../config.js';
import { genelateMessage } from '../utils.js';
import { InteractionResponseType } from 'discord-interactions';

export const GACHAS = Object.fromEntries(
  CONFIG.gachas.map((gacha) => {
    return [gacha.name, { ...gacha, totalWeight: calculateTotalWeight(gacha) }];
  }),
);

export function gacha(commandName, interaction) {
  const gacha = GACHAS[commandName];
  const r = Math.floor(Math.random() * gacha.totalWeight);
  const drawnChoice = judge(r, gacha.choices);
  const message = genelateMessage(drawnChoice.message, {
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

function calculateTotalWeight(gacha) {
  return gacha.choices.reduce((sum, item) => sum + item.weight, 0);
}

function judge(number, choices) {
  for (const choice of choices) {
    number -= choice.weight;
    if (number < 0) {
      return choice;
    }
  }
}
