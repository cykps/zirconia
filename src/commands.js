/**
 * Share command metadata from a common spot to be used for both runtime
 * and registration.
 */

import { SIMPLE_GREETING_CONFIG } from './config.js';
import { JANKEN_CONFIG } from './config.js';

export const JANKEN_COMMAND = {
  name: JANKEN_CONFIG.commandName,
  description: JANKEN_CONFIG.description,
};

export function get_simple_greeting_commands() {
  return SIMPLE_GREETING_CONFIG.greetings.map(({ name, description }) => {
    return { name: name, description: description };
  });
}
