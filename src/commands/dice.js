import { DICE_CONFIG as CONFIG } from '../config.js';
import {
  createEphemeralResponse,
  generateMessage,
  getOption,
} from '../utils.js';
import { InteractionResponseType } from 'discord-interactions';

export function dice(interaction) {
  // ndn オプションの解釈
  const countOption = getOption(interaction, 'count');
  const sidesOption = getOption(interaction, 'sides');
  const diceCount = countOption?.value;
  const diceSides = sidesOption?.value;

  if (typeof diceCount !== 'number' || typeof diceSides !== 'number') {
    const errorMessage = generateMessage(CONFIG.messages.invalidOption, {
      interaction: interaction,
    });
    return createEphemeralResponse(errorMessage);
  }

  // rolls が長すぎる場合は省略
  const rolls = rollDiceMany(diceCount, diceSides);
  const total = calculateTotal(rolls);
  let truncatedRolls = rolls;
  let areRollsTruncated = false;
  if (rolls.length > CONFIG.maxVisibleRolls) {
    truncatedRolls = rolls.slice(0, CONFIG.maxVisibleRolls);
    areRollsTruncated = true;
  }

  // メッセージ生成
  const message = generateMessage(CONFIG.messages.result, {
    rolls: truncatedRolls,
    areRollsTruncated: areRollsTruncated,
    total: total,
    diceCount: diceCount,
    diceSides: diceSides,
    rollsRaw: rolls,
  });

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: message,
    },
  };
}

function rollDiceMany(count, sides) {
  const results = [];
  for (let i = 0; i < count; i++) {
    results.push(rollDie(sides));
  }
  return results;
}

function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function calculateTotal(rolls) {
  return rolls.reduce((sum, roll) => sum + roll, 0);
}
