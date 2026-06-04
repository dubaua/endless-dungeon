# Project Notes

- Non-component source files use kebab-case file names.
- Component files keep PascalCase names.
- Do not add barrel `index.ts` files; import directly from the source module.
- Constants use PascalCase, not SCREAMING_SNAKE_CASE.
- Do not use nested ternary expressions.

## Code clarity

- No inline “this does that” comments.
- Avoid readability cleanups that do not change behaviour.

## Obey explicit commands

- Never refactor, rename, or change signatures unless the user says so.
- When asked to move a function, copy it exactly—same name, signature, and body.
- No structural or stylistic edits (imports, ordering, formatting) unless told to.
- Never alter formatting mid-file. Repeat the existing pattern.
- All “improvements” require direct user approval.

## No re-export

No reexports in new code

# Runtime

- Never start the app or dev server. The user runs the project manually when needed.
