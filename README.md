# Fantasy Languages by Language Library

Explore Toki Pona, Lojban, Volapük, Lingua Ignota, and Solresol. Learn your first words, search the dictionaries, and help improve this collection of existing constructed languages through learner feedback and source-backed corrections.

**[Explore the Language Library](https://garlicbreadwebant.github.io/Fantasy_Languages/)** · [Start contributing](CONTRIBUTING.md) · [Share feedback](https://github.com/garlicbreadwebant/Fantasy_Languages/issues)

## Pick a language

Licensed under the [MIT License](LICENSE). Website changes are recorded in the [website changelog](website/changelog.md).

- [Toki Pona](Toki%20Pona/README.md): a minimalist living constructed language with broad word meanings and contextual expressions.
- [Lojban](Lojban/README.md): a language built around predicates, logical structure, and ordered argument places.
- [Volapük](Volap%C3%BCk/README.md): a pioneering international auxiliary language with distinctive vowels and regular inflection.
- [Lingua Ignota](Lingua%20Ignota/README.md): Hildegard of Bingen’s historical glossary, explored through documented words and surviving glosses.
- [Solresol](Solresol/README.md): François Sudre’s musical language, built from seven note syllables.
- [Language library website](website/index.html): browse all five languages, search their dictionaries, and read their guides. Open directly in a browser.

## Vocabulary and accuracy

Every language contains the exact same 397 English lookup labels as Universal_Languages, including its variants and language-specific grammar lookup labels. Supplied forms and unresolved equivalents are distinguished in each CSV’s notes. A dash means no verified form has been supplied or no direct equivalent exists; it is not a target-language word. The collection is a starter reference requiring further language-specialist review. See each language’s DESIGN.md and [coverage counts](tools/coverage.json).

Lingua Ignota is taught as a historical glossary, without an invented conversational grammar. The title Fantasy Languages is a collection identity; these are existing constructed languages with differing aims.

## File structure

All five language folders share README.md, PRONUNCIATION.md, GRAMMAR.md, LESSONS.md, DESIGN.md, CHANGELOG.md, lexicon.csv, two generated dictionaries, and tools/check_language.cjs. See [website instructions](website/README.md) to refresh browser content after editing source files.

## Learn, practice, contribute

- **Learners:** begin with [Toki Pona lessons](https://garlicbreadwebant.github.io/Fantasy_Languages/#toki-pona/lessons), [Lojban lessons](https://garlicbreadwebant.github.io/Fantasy_Languages/#lojban/lessons), [Volapük lessons](https://garlicbreadwebant.github.io/Fantasy_Languages/#volapuk/lessons), [Lingua Ignota lessons](https://garlicbreadwebant.github.io/Fantasy_Languages/#lingua-ignota/lessons), or [Solresol lessons](https://garlicbreadwebant.github.io/Fantasy_Languages/#solresol/lessons), then explore the searchable dictionaries and flashcards.
- **Speakers and educators:** compare examples and pronunciation guides, and share what needs a clearer explanation.
- **Language contributors:** suggest corrections with sources, precise English senses, and any historical qualifications.
- **Maintainers:** help with accessible interfaces, data validation, documentation, and issue review. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Run locally

Open `website/index.html` in a browser. No installation or server is needed to explore. To refresh, validate, or build the publication, use Node.js 22 or later:

```sh
node tools/check-vocabulary.cjs
node website/build-data.cjs
node website/check-site.cjs
node website/build-site.cjs
```

After editing a CSV run its language’s checker with --write to regenerate dictionaries. Build output is .site-build/. GitHub Actions validates changes and deploys that directory from main when GitHub Pages is configured to use GitHub Actions.

The website uses system fonts and has no tracking, external runtime dependencies, or accounts. Optional AI tools require internet access and your own provider API keys.
