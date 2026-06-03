export const JANKEN_CONFIG = {
  hands: {
    rock: { name: 'グー', emoji: '✊️' },
    scissors: { name: 'チョキ', emoji: '✌️' },
    paper: { name: 'パー', emoji: '🖐️' },
  },

  messages: {
    start: 'じゃんけん...',
    result: (userHand, botHand, interaction) => {
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

  maxMatchs: 3,
};
