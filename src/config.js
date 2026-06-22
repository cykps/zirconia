export const SIMPLE_REPLY_CONFIG = {
  enable: true,
  replies: [
    { name: 'hello', description: '💬general reply', message: 'hello' },
    {
      name: 'coin',
      description: '🪙コイントス',
      message: ['表', '裏'],
    },
  ],
};

export const JANKEN_CONFIG = {
  enable: true,

  commandName: 'janken',
  description: '✊️じゃんけん',

  hands: {
    rock: { name: 'グー', emoji: '✊️' },
    scissors: { name: 'チョキ', emoji: '✌️' },
    paper: { name: 'パー', emoji: '🖐️' },
  },

  messages: {
    start: 'じゃんけん...',
    result: ({ userHand, botHand, interaction }) => {
      const isFirstMatch =
        interaction.message.content.endsWith('じゃんけん...');
      return [
        `${isFirstMatch ? 'ぽん！' : 'しょ！'}${botHand.emoji}`,
        `\`${userHand.emoji}${userHand.name}\``,
      ].join('\n');
    },
    draw: 'あいこで...',
    botWin: 'Zirconiaの勝ち！',
    userWin: ({ interaction }) => {
      return `<@${interaction.member.user.id}> の勝ち！`;
    },

    notGameOwner: '他の人のじゃんけんです `/janken` でじゃんけんを始めましょう',
    invalidButton: 'エラー: 不正なボタンです',
  },

  maxRound: 3,
};

export const DICE_CONFIG = {
  enable: true,

  commandName: 'dice',
  description: '🎲さいころ',

  countOption: '個',
  countOptionDescription: 'サイコロの個数',
  maxDiceCount: 1000,

  sidesOption: '面',
  sidesOptionDescription: 'サイコロの面数',
  maxDiceSides: 100_000_000,

  // 表示される出目の最大数
  maxVisibleRolls: 100,

  messages: {
    result: ({ rolls, areRollsTruncated, total, diceSides, diceCount }) => {
      return [
        `${diceCount}d${diceSides} 🎲`,
        `> ${rolls.join(',')}${areRollsTruncated ? ', ...' : ''}`,
        `合計: ${total}`,
      ].join('\n');
    },

    invalidOption: 'エラー: 不正なオプションです',
  },
};

export const GACHA_CONFIG = {
  enable: true,
  gachas: [
    {
      name: 'omikuji',
      description: '🥠おみくじ',
      choices: [
        { message: '大吉', weight: 3 },
        { message: '吉', weight: 10 },
        { message: '中吉', weight: 9 },
        { message: '小吉', weight: 8 },
        { message: '末吉', weight: 7 },
        { message: '凶', weight: 2 },
      ],
    },
  ],

  messages: {
    invalidWeight:
      'エラー: 不正なガチャ設定です ウェイトの合計は正の整数となる必要があります',
  },
};
