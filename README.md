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
