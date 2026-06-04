import { InteractionResponseType } from 'discord-interactions';
import { JANKEN_CONFIG as CONFIG } from '../config.js';
import {
  createEphemeralResponse,
  generateMessage,
  normalizeEmoji,
} from '../utils.js';

// 手の定義
const HANDS = {
  rock: {
    value: 0,
    name: CONFIG.hands.rock.name,
    emoji: CONFIG.hands.rock.emoji,
    normalizedEmoji: normalizeEmoji(CONFIG.hands.rock.emoji),
  },
  paper: {
    value: 1,
    name: CONFIG.hands.paper.name,
    emoji: CONFIG.hands.paper.emoji,
    normalizedEmoji: normalizeEmoji(CONFIG.hands.paper.emoji),
  },
  scissors: {
    value: 2,
    name: CONFIG.hands.scissors.name,
    emoji: CONFIG.hands.scissors.emoji,
    normalizedEmoji: normalizeEmoji(CONFIG.hands.scissors.emoji),
  },
};
const HANDS_LIST = [HANDS.rock, HANDS.paper, HANDS.scissors];

// `/janken` コマンドが実行されたときに呼び出される関数
export function handleJankenCommand(interaction) {
  const userId = interaction.member.user.id;
  const startMessage = generateMessage(CONFIG.messages.start, {
    interaction: interaction,
  });
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: startMessage,
      components: createHandButtons(userId),
    },
  };
}

// ユーザーがグー・チョキ・パーのボタンを押したときに呼び出される関数
export function handleJankenButton(interaction) {
  // ボタンの `custom_id` の妥当性チェック
  const parsedCustomId = parseHandCustomId(interaction.data.custom_id);
  if (parsedCustomId === null) {
    const errorMessage = generateMessage(CONFIG.messages.invalidButton, {
      interaction: interaction,
    });
    return createEphemeralResponse(errorMessage);
  }
  const { ownerId, hand } = parsedCustomId;

  // じゃんけんを始めた人とボタンを押した人の同一性チェック
  const clickedUserId = interaction.member.user.id;
  if (clickedUserId !== ownerId) {
    const errorMessage = generateMessage(CONFIG.messages.notGameOwner, {
      interaction: interaction,
    });
    return createEphemeralResponse(errorMessage);
  }

  // 勝敗判定
  const userHand = HANDS[hand];
  const botHand = HANDS_LIST[Math.floor(Math.random() * 3)];
  const result = judge(userHand, botHand);

  // メッセージ生成
  const resultMessage = generateMessage(CONFIG.messages.result, {
    userHand: userHand,
    botHand: botHand,
    interaction: interaction,
  });

  //// あいこの場合
  if (result === 0) {
    const drawMessage = generateMessage(CONFIG.messages.draw, {
      userHand: userHand,
      botHand: botHand,
      interaction: interaction,
    });
    return {
      type: InteractionResponseType.UPDATE_MESSAGE,
      data: {
        content: `${interaction.message.content}\n${resultMessage}\n${drawMessage}`,
        components: createHandButtons(ownerId),
      },
    };
  }

  //// 決着がついた場合
  const formatter =
    result === 1 ? CONFIG.messages.botWin : CONFIG.messages.userWin;
  const message = generateMessage(formatter, {
    userHand: userHand,
    botHand: botHand,
    interaction: interaction,
  });
  return {
    type: InteractionResponseType.UPDATE_MESSAGE,
    data: {
      content: `${interaction.message.content}\n${resultMessage}\n${message}`,
      components: [],
    },
  };
}

function createHandButtons(userId) {
  return [
    {
      type: 1,
      components: [
        createHandButton('rock', userId),
        createHandButton('scissors', userId),
        createHandButton('paper', userId),
      ],
    },
  ];
}

function createHandButton(handId, userId) {
  const hand = HANDS[handId];
  return {
    type: 2,
    custom_id: `janken:${userId}:${handId}`,
    label: hand.name,
    emoji: { name: hand.normalizedEmoji },
    style: 1,
  };
}

function parseHandCustomId(customId) {
  const parts = customId.split(':');
  if (parts.length !== 3) {
    return null;
  }

  const [prefix, ownerId, hand] = parts;
  if (prefix !== 'janken') {
    return null;
  }
  if (!(hand in HANDS)) {
    return null;
  }

  return { ownerId, hand };
}

// 勝敗判定用関数
function judge(userHand, botHand) {
  return (botHand.value - userHand.value + 3) % 3;
  // 0: あいこ
  // 1: Botの勝ち
  // 2: ユーザーの勝ち
}
