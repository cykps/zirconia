import {
  InteractionResponseFlags,
  InteractionResponseType,
} from 'discord-interactions';

export function generateMessage(formatter, props) {
  if (typeof formatter === 'function') {
    return formatter(props);
  }
  if (typeof formatter === 'string') {
    return formatter;
  }
  if (Array.isArray(formatter)) {
    let random = Math.floor(Math.random() * formatter.length);
    return generateMessage(formatter[random], props);
  }

  return 'メッセージ未登録';
}

export function normalizeEmoji(emoji) {
  // remove `uFE0F` (Variation Selector-16)
  return emoji.normalize('NFC').replace(/\uFE0F/g, '');
}

export function getOption(interaction, name) {
  return interaction.data.options?.find((option) => option.name === name);
}

export function createEphemeralResponse(content) {
  return {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: content,
      flags: InteractionResponseFlags.EPHEMERAL,
    },
  };
}
