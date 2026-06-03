import { InteractionResponseType } from 'discord-interactions';

export function greet() {
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: '# おはよう',
    },
  };
}
