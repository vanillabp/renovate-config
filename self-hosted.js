// The configuration of the RUNNER, not of a repository.
//
// 'default.json' next to this file is the shareable preset every repository extends. This
// file is the other half: it tells one Renovate process which repositories to look at and
// how to behave while doing it. Renovate calls this the global configuration, and it never
// belongs into a repository's own renovate.json.
//
// Why we run Renovate ourselves: the hosted app of Mend needs an account there, and this
// needs a token. Both are legitimate, and the token is the one we can grant, revoke and
// read the logs of.
module.exports = {
  platform: 'github',

  // Every repository the token can reach is a candidate, which is the point: a new
  // repository is picked up without anybody editing this file.
  autodiscover: true,

  // ... but only inside this organisation. The blueprints live in an organisation of their
  // own and have a runner of their own, so a token which happens to reach both does not
  // process anything twice.
  autodiscoverFilter: ['vanillabp/*'],

  // A repository joins by committing a renovate.json which extends the preset. Without one
  // it is skipped instead of being offered an onboarding pull request nobody asked for -
  // this organisation holds archived experiments and the read-only mirrors of released
  // artifacts, and neither wants dependency updates.
  onboarding: false,
  requireConfig: 'required',

  // The preset decides WHEN a pull request may appear (Monday before 7am) and how old a
  // release has to be. This runner therefore only has to come by often enough to hit that
  // window; it does not schedule anything itself.
  // Nothing here repeats the preset: a rule written twice is a rule that drifts.

  // What the log has to answer when something did not show up: which repositories were
  // seen, and what was decided about each dependency.
  logLevel: 'info',
};
