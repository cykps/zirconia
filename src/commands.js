/**
 * Share command metadata from a common spot to be used for both runtime
 * and registration.
 */

import {
  SIMPLE_REPLY_CONFIG,
  GACHA_CONFIG,
  JANKEN_CONFIG,
  DICE_CONFIG,
} from './config.js';

export const JANKEN_COMMAND = {
  name: JANKEN_CONFIG.commandName,
  description: JANKEN_CONFIG.description,
};

export const DICE_COMMAND = {
  name: DICE_CONFIG.commandName,
  description: DICE_CONFIG.description,
  options: [
    {
      type: 4,
      name: DICE_CONFIG.countOption,
      description: DICE_CONFIG.countOptionDescription,
      required: true,
      min_value: 1,
      max_value: DICE_CONFIG.maxDiceCount,
    },
    {
      type: 4,
      name: DICE_CONFIG.sidesOption,
      description: DICE_CONFIG.sidesOptionDescription,
      required: true,
      min_value: 2,
      max_value: DICE_CONFIG.maxDiceSides,
    },
  ],
};

export function get_simple_reply_commands() {
  return SIMPLE_REPLY_CONFIG.replies.map(({ name, description, options }) => {
    return { name, description, options };
  });
}

export function get_gacha_commands() {
  return GACHA_CONFIG.gachas.map(({ name, description }) => {
    return { name, description };
  });
}
