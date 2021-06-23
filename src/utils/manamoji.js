// adapted from https://github.com/scryfall/servo/blob/master/lib/middleware/manamoji.js

let substitutions = {};

let COLORS = ['W', 'U', 'B', 'R', 'G'];
let NUMBERS = [...Array(16).keys()];
let ADDTL = ['C', 'E', 'T', 'Q', 'S', 'X', 'Y', 'Z'];

function _(before, after) {
  if (typeof after === 'undefined') {
    after = before;
  }
  substitutions[`{${before}}`] = `mana${after.toString().toLowerCase()}`;
}

ADDTL.forEach(a => { _(a) });
COLORS.forEach(c => { _(c) });
COLORS.forEach(c => { _(`2/${c}`, `2${c}`) });
COLORS.forEach(c => { _(`${c}/P`, `${c}p`) });
COLORS.forEach(c => { COLORS.forEach(d => {
  if (c != d) _(`${c}/${d}`, `${c}${d}`);
}) });
NUMBERS.forEach(n => { _(n) });

function manamoji(client, string) {
  const re = new RegExp(Object.keys(substitutions).map(v => {
    return v.replace('{', '\\{').replace('}', '\\}');
  }).join('|'), 'gi');
  return string.replace(re, matched => {
    const emoji = client.emojis.cache?.find(emoji => emoji.name === substitutions[matched]);
    return emoji ? emoji.toString() : matched;
  });
}

module.exports = {
  manamoji,
};
