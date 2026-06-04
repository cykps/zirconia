/**
 * Share command metadata from a common spot to be used for both runtime
 * and registration.
 */

import { SIMPLE_REPLY_CONFIG, GACHA_CONFIG } from './config.js';
import { JANKEN_CONFIG } from './config.js';

export const JANKEN_COMMAND = {
  name: JANKEN_CONFIG.commandName,
  description: JANKEN_CONFIG.description,
};

export function get_simple_reply_commands() {
  return SIMPLE_REPLY_CONFIG.replies.map(({ name, description }) => {
    return { name: name, description: description };
  });
}

export function get_gacha_commands() {
  return GACHA_CONFIG.gachas.map(({ name, description }) => {
    return { name: name, description: description };
  });
}
