# Fantasy Languages by Language Library

Explore Toki Pona, Lojban, Volapük, Lingua Ignota, and Solresol. This companion to Universal_Languages preserves its format, file structure, offline website, dictionaries, flashcards, guides, and optional AI tools with a new plum, lavender, and copper theme.

Open [the website](website/index.html) directly in a browser. No installation is required.

## Languages

- [Toki Pona](Toki%20Pona/README.md)
- [Lojban](Lojban/README.md)
- [Volapük](Volap%C3%BCk/README.md)
- [Lingua Ignota](Lingua%20Ignota/README.md)
- [Solresol](Solresol/README.md)

## Vocabulary and accuracy

Every language contains the exact same 397 English lookup labels as Universal_Languages, including its variants and language-specific grammar lookup labels. Supplied forms and unresolved equivalents are distinguished in each CSV’s notes. A dash means no verified form has been supplied or no direct equivalent exists; it is not a target-language word. The collection is a starter reference requiring further language-specialist review. See each language’s DESIGN.md and [coverage counts](tools/coverage.json).

Lingua Ignota is taught as a historical glossary, without an invented conversational grammar. The title Fantasy Languages is a collection identity; these are existing constructed languages with differing aims.

## File structure

Each language folder contains README.md, PRONUNCIATION.md, GRAMMAR.md, LESSONS.md, DESIGN.md, CHANGELOG.md, lexicon.csv, two generated dictionaries, and tools/check_language.cjs, matching the sibling project. website/ contains the same offline HTML/CSS/JS application structure.

## Validate and build

Requires Node.js 22 or newer.

```sh
node tools/check-vocabulary.cjs
node website/build-data.cjs
node website/check-site.cjs
node website/build-site.cjs
```

After editing a CSV run its language’s checker with --write to regenerate dictionaries. Build output is .site-build/. GitHub Actions validates changes and deploys that directory from main when GitHub Pages is configured to use GitHub Actions.

[Website instructions](website/README.md) · [Contributing](CONTRIBUTING.md) · [MIT License](LICENSE)
