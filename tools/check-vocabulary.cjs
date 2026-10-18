const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const config = require('./languages.json');
const expected = require('./english-headwords.json').map(row => row.english).sort();
function checkVocabulary() {
  assert.equal(expected.length, 397);
  assert.equal(new Set(expected).size, expected.length);
  for (const {name} of Object.values(config)) {
    const rows = fs.readFileSync(path.join(root, name, 'lexicon.csv'), 'utf8').trim().split(/\r?\n/);
    assert.equal(rows.shift(), `english,${name.toLowerCase()},category,notes`);
    const words = rows.map((line, i) => {
      const values = line.split(',');
      assert(values.length === 4 && values.every(v => v.trim() && !v.includes('"')), `${name}: malformed CSV line ${i + 2}`);
      assert(!line.includes('\ufffd'), `${name}: invalid character encoding`);
      return values[0];
    });
    assert.equal(new Set(words).size, words.length, `${name}: duplicate headwords`);
    assert.deepEqual(words.sort(), expected, `${name}: shared English vocabulary changed`);
  }
  return expected.length;
}
module.exports = {checkVocabulary};
if (require.main === module) console.log(`OK: ${checkVocabulary()} original English headwords in all five languages.`);
