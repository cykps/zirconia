export function genelateMessage(formatter, props) {
  if (typeof formatter === 'function') {
    return formatter(props);
  }
  if (typeof formatter === 'string') {
    return formatter;
  }
  if (Array.isArray(formatter)) {
    let r = Math.floor(Math.random() * formatter.length);
    return genelateMessage(formatter[r], props);
  }

  return 'メッセージ未登録';
}

export function normalizeEmoji(emoji) {
  // remove `uFE0F` (Variation Selector-16)
  return emoji.normalize('NFC').replace(/\uFE0F/g, '');
}
