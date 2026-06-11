import {
  InteractionResponseType,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
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

// `/janken`コマンドのハンドル関数
export function handleJankenCommand(interaction) {
  const userId = interaction.member.user.id;
  console.log(1);
  const startMessage = generateMessage(CONFIG.messages.start, {
    interaction: interaction,
  });
  console.log(1.5);
  const round = 1;
  console.log(2);
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: startMessage,
      components: createHandButtons(userId, round),
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
  const { ownerId, round, hand } = parsedCustomId;

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
  const { botHand, result } = playRound(userHand, round, CONFIG.maxRound);

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
        components: createHandButtons(ownerId, round + 1),
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

// ボタンの生成関数
function createHandButtons(userId, round) {
  return [
    {
      type: MessageComponentTypes.ACTION_ROW,
      components: [
        createHandButton(userId, round, 'rock'),
        createHandButton(userId, round, 'scissors'),
        createHandButton(userId, round, 'paper'),
      ],
    },
  ];
}

function createHandButton(userId, round, handId) {
  const hand = HANDS[handId];
  return {
    type: MessageComponentTypes.BUTTON,
    custom_id: `janken:${userId}:${round}:${handId}`,
    label: hand.name,
    emoji: { name: hand.normalizedEmoji },
    style: ButtonStyleTypes.PRIMARY,
  };
}

// ボタンのカスタムIDのパース用関数
function parseHandCustomId(customId) {
  const parts = customId.split(':');
  if (parts.length !== 4) {
    return null;
  }

  const [prefix, ownerId, round, hand] = parts;
  if (prefix !== 'janken') {
    return null;
  }
  const roundCount = Number(round);
  if (!Number.isInteger(roundCount)) {
    return null;
  }
  if (!(hand in HANDS)) {
    return null;
  }

  return { ownerId, round: roundCount, hand };
}

// 勝敗判定用関数
function judge(userHand, botHand) {
  return (botHand.value - userHand.value + 3) % 3;
  // 0: あいこ
  // 1: Botの勝ち
  // 2: ユーザーの勝ち
}

function playRound(userHand, round, maxRound) {
  let botHand;
  if (maxRound < 0 || round < maxRound) {
    botHand = HANDS_LIST[Math.floor(Math.random() * 3)];
  } else {
    botHand =
      HANDS_LIST[(userHand.value + 1 + Math.floor(Math.random() * 2)) % 3];
  }

  const result = judge(userHand, botHand);
  return { botHand, result };
}
