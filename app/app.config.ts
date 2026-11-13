export default defineAppConfig({
  reeve: {
    // Soon (before launch) or Live (after). Switches the header action, the badge and the footer links.
    launched: false,
    // Pages that exist. The header and footer link only to these, so the prerender never meets a missing
    // page. Add a page's path here in the PR that builds it.
    builtPages: [] as string[],
    // The beta sign-up form. Off until the sign-up API, its notice at the point of collection and the
    // privacy page exist; until then the beta card says why places are limited and shows no fields.
    betaSignup: false,
    // The Discord install link for Add to Discord on the launched site. Empty until the bot is public.
    discordInstallUrl: '',
    // The footer's company line. Left empty until the company is registered; the line is hidden until then.
    // `name` is without "Ltd", which the line adds.
    company: { name: '', number: '' },
  },
})
