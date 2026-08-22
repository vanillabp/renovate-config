# Renovate Shared Config

Shared [Renovate](https://docs.renovatebot.com/) preset for all VanillaBP repositories. This ensures consistent dependency update grouping and scheduling across projects.

## Usage

Reference this preset in a project's `renovate.json`:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": ["github>vanillabp/renovate-config"]
}
```

## What it does

- **Schedule**: Dependency update PRs are created weekly (Monday before 7am)
- **Grouping**: Related dependencies are grouped into single PRs:
  - Quarkus (all `io.quarkus` packages)
  - Spring (all `org.springframework` packages)
  - Camunda 7 (all `org.camunda.bpm` packages)
  - Camunda 8 (all `io.camunda` packages)
  - Testing (JUnit, Mockito, TestContainers)
  - Maven plugins (Spotless, JaCoCo, etc.)
  - Lombok
- **Major versions**: Major updates get separate PRs from minor/patch updates
- **Age**: an update is proposed once its release is five days old, so a version pulled back
  shortly after publication never reaches a repository

## What merges itself

Confirming a Maven plugin bump by hand teaches nobody anything, so the noisy part of the stream
merges itself once the required checks passed:

- every patch, whatever it belongs to
- tools and test libraries (JUnit, Mockito, Testcontainers, the Maven plugins, Spotless, JaCoCo,
  Lombok) for a minor as well, since they never reach a released artifact
- GitHub Actions for a minor, a patch and a digest

Three kinds of update stay with a person, and each for its own reason:

- **Spring Boot and Quarkus**, because the README of every repository names the platform versions
  it is built against. Moving one changes what is supported, and that is a decision rather than an
  update.
- **The BPMS**, meaning `org.camunda.bpm` and `io.camunda`. The engine respectively the client a
  build was compiled against decides which servers the artifact accepts, so this bump reaches every
  application consuming it. The Camunda 8 adapter refines the rule per release line in its own
  configuration.
- **Majors**, where a green build proves the least.

### What automerge needs to be safe

Renovate merges when the branch is green, and "green" is whatever the repository requires. Without
**required status checks** in the branch protection of `main` there is nothing to fail, and
automerge degrades into merging everything. Configure the build workflow of each repository as a
required check before relying on this.

One residual risk is worth knowing: a pull request builds the current release line, while the whole
matrix runs nightly. A patch that only breaks another line is merged and shows up in the night.

## Who runs it

Renovate does not appear by itself. Two ways exist: the app Mend hosts, and a Renovate process of
our own. Right now the hosted app is installed on this organisation, and it is what opens the pull
requests. Its scope, meaning which repositories it may touch, is set in GitHub rather than at Mend:
organisation settings, GitHub Apps, Renovate, Configure. An account at Mend is not needed for that,
their portal link in every dependency dashboard is an offer and not a requirement.

The process of our own lives in `.github/workflows/renovate.yaml` and is DORMANT: it has no
schedule and starts only when somebody dispatches it. It exists because the hosted app had reached
exactly one of six repositories for months, and because a token we grant and revoke ourselves is
the fallback if the app stops covering everything. Whichever of the two stays, the other has to go:
both use the same `renovate/*` branches and the same dashboard, and the one running last overwrites
the other.

That workflow runs daily and processes the whole organisation, so a new repository joins by
committing a `renovate.json` which extends this preset. A repository without one is skipped rather
than offered an onboarding pull request, which keeps archived experiments and read-only mirrors out.
The runner brings no rules of its own; `self-hosted.js` says which repositories to look at, and
everything about WHAT is updated stays in the preset.

Two things it needs from a person:

- the secret `RENOVATE_TOKEN`, a token with `repo` and `workflow`. The second scope is what allows
  Renovate to fix a pinned GitHub Action; without it a deprecated action is reported and never
  touched.
- a first run with the `dryRun` input of the workflow set. It logs every decision and writes
  nothing, which is the cheapest way to see whether the preset does what its description claims
  before twenty pull requests appear at once.

The blueprints live in an organisation of their own and have their own runner, for one repository
only: `vanillabp-blueprints/blueprints`. The blueprint repositories next to it are read-only
mirrors, force-pushed from that monorepo by its split job, so a pull request against one of them
would be overwritten by the next split.
