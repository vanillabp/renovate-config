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
