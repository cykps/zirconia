export function genelateMessage(formatter, ...args) {
  if (typeof formatter === 'function') {
    return formatter(...args);
  }
  if (typeof formatter === 'string') {
    return formatter;
  }
  if (Array.isArray(formatter)) {
    let r = Math.floor(Math.random() * formatter.length);
    return genelateMessage(formatter[r], ...args);
  }

  return 'メッセージ未登録';
}

export function normalizeEmoji(emoji) {
  // remove `uFE0F` (Variation Selector-16)
  return emoji.normalize('NFC').replace(/\uFE0F/g, '');
}
