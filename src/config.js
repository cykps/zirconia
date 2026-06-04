export const JANKEN_CONFIG = {
  commandName: 'janken',
  description: 'Botとじゃんけんで対戦!',

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
        `\`${userHand.emoji}${userHand.name}を出したよ\``,
      ].join('\n');
    },
    draw: 'あいこで...',
    botWin: ['Bot の勝ち！', 'あなたの負け'],
    userWin: ['Bot の負け！', 'あなたの勝ち！'],

    notGameOwner: '他人のマッチです！`/janken` で自分のマッチを始めましょう',
    invalidButton: '不正なボタンです',
  },

  // maxMatches: 3, //todo
};

export const SIMPLE_REPLY_CONFIG = {
  replies: [
    { name: 'hallo', description: 'general reply', message: 'hallo' },
    {
      name: 'dice6',
      description: 'random 1~6',
      message: ['1', '2', '3', '4', '5', '6'],
    },
  ],
};

export const GACHA_CONFIG = {
  gachas: [
    {
      name: 'omikuji',
      description: 'おみくじ',
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
};

export const DICE_CONFIG = {
  commandName: 'dice',
  description: '🎲さいころをふる',

  countOptionDescription: 'サイコロの個数',
  maxDiceCount: 1000,

  sidesOptionDescription: 'サイコロの面数',
  maxDiceSides: 100_000_000,

  // 表示される個々の出目の最大数
  maxVisibleRolls: 100,

  messages: {
    result: ({ rolls, areRollsTruncated, total, diceSides, diceCount }) => {
      return [
        `${diceCount}d${diceSides} 🎲`,
        `> ${rolls.join(',')}${areRollsTruncated ? ', ...' : ''}`,
        `合計: ${total}`,
      ].join('\n');
    },

    invalidOption: '不正なオプションです',
  },
};
