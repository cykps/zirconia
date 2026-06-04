import { DICE_CONFIG as CONFIG } from '../config';
import { generateMessage, getOption } from '../utils';
import { InteractionResponseType } from 'discord-interactions';

export function dice(interaction) {
  console.log('d:called');

  // ndn オプションの解釈
  const countOption = getOption(interaction, 'count');
  const sidesOption = getOption(interaction, 'sides');
  const diceSides = sidesOption?.value;
  const diceCount = countOption?.value;

  console.log('d:option', diceSides, diceCount);
  if (typeof diceSides != 'number' || typeof diceCount != 'number') {
    const errorMessage = generateMessage(CONFIG.messages.invalidDiceText, {
      interaction: interaction,
    });
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: errorMessage,
        flags: InteractionResponseFlags.EPHEMERAL,
      },
    };
  }

  console.log('d: count and size', diceCount, diceSides);

  // rolls が長すぎる場合は省略
  const rolls = rollDices(diceSides, diceCount);
  const total = calculateTotal(rolls);
  let truncatedRolls = rolls;
  let areRollsTruncated = false;
  if (rolls.length > CONFIG.maxVisibleRolls) {
    truncatedRolls = rolls.slice(0, CONFIG.maxVisibleRolls);
    areRollsTruncated = true;
  }

  console.log('d:truncate', truncatedRolls, areRollsTruncated);

  // メッセージ生成
  const message = generateMessage(CONFIG.messages.result, {
    rolls: truncatedRolls,
    areRollsTruncated: areRollsTruncated,
    total: total,
    diceCount: diceCount,
    diceSides: diceSides,
    rollsRaw: rolls,
  });

  console.log('d:msg', message);
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: message,
    },
  };
}

function parseDiceNotation(text) {
  const match = text.match(/^(\d+)d(\d+)$/i);
  if (!match) {
    return null;
  }

  const count = Number(match[1]);
  const sides = Number(match[2]);

  if (!Number.isInteger(count) || !Number.isInteger(sides)) {
    return null;
  }

  return { count, sides };
}

function rollDices(sides, count) {
  const results = [];
  for (let i = 0; i < count; i++) {
    results.push(rollDice(sides));
  }
  return results;
}

function rollDice(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function calculateTotal(rolls) {
  return rolls.reduce((sum, roll) => sum + roll, 0);
}
