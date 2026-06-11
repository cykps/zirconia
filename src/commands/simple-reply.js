import { SIMPLE_REPLY_CONFIG as CONFIG } from '../config.js';
import { generateMessage } from '../utils.js';
import { InteractionResponseType } from 'discord-interactions';

export const SIMPLE_REPLIES = Object.fromEntries(
  CONFIG.replies.map((reply) => {
    return [reply.name, reply];
  }),
);

// スラッシュコマンドのハンドル関数
export function simpleReply(commandName, interaction) {
  const message = generateMessage(SIMPLE_REPLIES[commandName].message, {
    interaction,
  });

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: message,
    },
  };
}
