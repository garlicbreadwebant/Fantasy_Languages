const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
function checkLanguage(name, write = false) {
  require('./check-vocabulary.cjs').checkVocabulary();
  const folder = path.resolve(__dirname, '..', name);
  const rows = fs.readFileSync(path.join(folder, 'lexicon.csv'), 'utf8').trim().split(/\r?\n/).slice(1).map(line => line.split(','));
  for (const reverse of [false, true]) {
    const title = reverse ? `${name} to English Dictionary` : `English to ${name} Dictionary`;
    const sorted = [...rows].sort((a,b) => a[reverse ? 1 : 0].localeCompare(b[reverse ? 1 : 0], 'en'));
    const content = [`# ${title}`, '', 'Learning collection 0.1.0 · October 18, 2026', '',
      'Generated from [lexicon.csv](lexicon.csv). A dash means an unresolved equivalent or no direct correspondence; it is not a target-language word. Read all sense and source notes.', '',
      'See [grammar](GRAMMAR.md) and [source policy](DESIGN.md).', '',
      `| ${reverse ? name + ' | English' : 'English | ' + name} | Category | Notes |`, '|---|---|---|---|',
      ...sorted.map(([english,word,category,notes]) => '| ' + [...(reverse ? [word,english] : [english,word]), category, notes].map(s=>s.replaceAll('|','\\|')).join(' | ') + ' |')].join('\n') + '\n';
    const file = path.join(folder, title + '.md');
    if (write) fs.writeFileSync(file, content);
    else assert.equal(fs.readFileSync(file,'utf8'),content, `${name}: stale dictionary; run checker with --write`);
  }
  for (const file of fs.readdirSync(folder).filter(f=>f.endsWith('.md'))) {
    for (const match of fs.readFileSync(path.join(folder,file),'utf8').matchAll(/\]\(([^)]+)\)/g)) {
      if (/^(https?:|#)/.test(match[1])) continue;
      assert(fs.existsSync(path.resolve(folder,decodeURIComponent(match[1]))), `${name}/${file}: broken link ${match[1]}`);
    }
  }
  console.log(`OK: ${name}: ${rows.length} headwords; CSV structure, local links, and generated dictionaries checked.`);
}
module.exports = {checkLanguage};
