import { InteractionResponseType } from 'discord-interactions';
import { InteractionResponseFlags } from 'discord-interactions';
import { JANKEN_CONFIG as CONFIG } from '../config';
import { genelateMessage, normalizeEmoji } from '../utils';

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
export function jankenStart(interaction) {
  const userId = interaction.member.user.id;
  const startMessage = genelateMessage(CONFIG.messages.start, interaction);
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: startMessage,
      components: [
        {
          type: 1,
          components: [
            {
              type: 2,
              custom_id: `janken:${userId}:rock`,
              label: HANDS.rock.name,
              emoji: { name: HANDS.rock.normalizedEmoji },
              style: 1,
            },
            {
              type: 2,
              custom_id: `janken:${userId}:scissors`,
              label: HANDS.scissors.name,
              emoji: { name: HANDS.scissors.normalizedEmoji },
              style: 1,
            },
            {
              type: 2,
              custom_id: `janken:${userId}:paper`,
              label: HANDS.paper.name,
              emoji: { name: HANDS.paper.normalizedEmoji },
              style: 1,
            },
          ],
        },
      ],
    },
  };
}

// ユーザーがグー・チョキ・パーのボタンを押したときに呼び出される関数
export function jankenPon(interaction) {
  // じゃんけんを始めた人と、手を選んだ人が同一かのチェック
  const [, ownerId, hand] = interaction.data.custom_id.split(':');
  const clickedUserId = interaction.member.user.id;

  if (clickedUserId !== ownerId) {
    const errorMessage = genelateMessage(CONFIG.messages.notGameOwner);
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: errorMessage,
        flags: InteractionResponseFlags.EPHEMERAL,
      },
    };
  }

  // 勝敗判定
  const userHand = HANDS[hand];
  const botHand = HANDS_LIST[Math.floor(Math.random() * 3)];
  console.log(userHand, botHand);
  const result = judge(userHand, botHand);

  // メッセージ生成
  const resultMessage = genelateMessage(
    CONFIG.messages.result,
    userHand,
    botHand,
    interaction,
  );

  //// あいこの場合
  if (result === 0) {
    const drawMessage = genelateMessage(
      CONFIG.messages.draw,
      userHand,
      botHand,
      interaction,
    );
    return {
      type: InteractionResponseType.UPDATE_MESSAGE,
      data: {
        content: `${interaction.message.content}\n${resultMessage}\n${drawMessage}`,
      },
    };
  }

  //// 勝負がついた場合
  const formatter = result === 1 ? CONFIG.messages.win : CONFIG.messages.lose;
  const message = genelateMessage(formatter, userHand, botHand, interaction);
  return {
    type: InteractionResponseType.UPDATE_MESSAGE,
    data: {
      content: `${interaction.message.content}\n${resultMessage}\n${message}`,
      components: [],
    },
  };
}

// 勝敗判定用関数
function judge(userHand, botHand) {
  return (botHand.value - userHand.value + 3) % 3;
  // 0: あいこ
  // 1: Botの勝ち
  // 2: プレイヤーの勝ち
}
