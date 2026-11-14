export default defineAppConfig({
  reeve: {
    // Soon (before launch) or Live (after). Switches the header action, the badge and the footer links.
    launched: false,
    // Pages that exist. The header and footer link only to these, so the prerender never meets a missing
    // page. Add a page's path here in the PR that builds it.
    builtPages: ['/how-it-works'] as string[],
    // The beta sign-up form. Off until the sign-up API, its notice at the point of collection and the
    // privacy page exist; until then the beta card says why places are limited and shows no fields.
    betaSignup: false,
    // Who is responsible for sign-up data, and where to write to see or delete it. Both are named in the
    // notice beside the form; tests/unit/site-settings.test.ts refuses betaSignup without them and the
    // privacy page.
    privacy: { controller: '', contact: '' },
    // The Discord install link for Add to Discord on the launched site. Empty until the bot is public.
    discordInstallUrl: '',
    // The footer's company line. Left empty until the company is registered; the line is hidden until then.
    // `name` is without "Ltd", which the line adds.
    company: { name: '', number: '' },
  },
})
