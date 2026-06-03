import { SIMPLE_GREETING_CONFIG as CONFIG } from '../config.js';
import { genelateMessage } from '../utils.js';
import { InteractionResponseType } from 'discord-interactions';

export const SIMPLE_GREETINGS = Object.fromEntries(
  CONFIG.greetings.map((greeting) => {
    return [greeting.name, greeting];
  }),
);

export function simpleGreeting(commandName, intraction) {
  const message = genelateMessage(SIMPLE_GREETINGS[commandName].message);

  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: message,
    },
  };
}
