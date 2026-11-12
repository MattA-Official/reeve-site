# Vendored skills

These skills are copied from upstream repositories at a pinned commit, so they load in every session, including cloud sessions where plugin installs don't carry over. Don't edit them in place (the pre-edit hook blocks it). To update one, re-copy the folder from upstream at a newer commit, update the table, and say so in the PR.

Neither the Nuxt nor the Vue organisation publishes official agent skills yet (the Nuxt RFC for bundling skills in modules, nuxt/nuxt discussion 34059, closed in September 2026). These are the closest sources.

| Skill | Upstream | Commit | Licence | Notes |
| --- | --- | --- | --- | --- |
| `vue`, `nuxt`, `vitest` | https://github.com/antfu/skills | `d524ed287eef22757297827ce42e3cad88abd20c` | MIT (`.claude/licences/antfu-skills.md`) | Generated from the official `vuejs/docs`, `nuxt/nuxt` and `vitest-dev/vitest` docs by Anthony Fu (Vue and Nuxt core teams) |
| `vue-best-practices`, `vue-testing-best-practices`, `vue-debug-guides` | https://github.com/vuejs-ai/skills | `198f0cd8f7f9c0a3d9b566ccc16de6677519ee78` | MIT (`.claude/licences/vuejs-ai-skills.md`) | Community, self-described early experiment |
| `nuxt-content`, `nuxt-i18n`, `nuxt-seo` | https://github.com/onmax/nuxt-skills | `7c157c8e1d1756287914c0a8f3b2dc081d6a780a` | MIT (per its README and `plugin.json`; the repo has no licence file) | Written by onmax, a Nuxt collaborator. The `agents/` folders (OpenAI agent metadata) were left out |

Copied on 12 November 2026.

Our own skills, edited freely: `reeve-design-system`, `reeve-copy`, `page-from-board`.
