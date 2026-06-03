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
    win: ['Bot の勝ち！', 'あなたの負け'],
    lose: ['Bot の負け！', 'あなたの勝ち！'],

    notGameOwner: '他人のマッチです！`/janken` で自分のマッチを始めましょう',
  },

  // maxMatches: 3, //todo
};

export const SIMPLE_GREETING_CONFIG = {
  greetings: [
    { name: 'hallo', description: 'genneral greeting', message: 'hallo' },
    {
      name: 'dice',
      description: 'random 1~6',
      message: ['1', '2', '3', '4', '5', '6'],
    },
  ],
};
