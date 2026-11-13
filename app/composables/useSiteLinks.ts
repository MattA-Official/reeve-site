// The header and footer links, from the bento citation boards. Labels are i18n keys.
export interface SiteLink {
  label: string
  to: string
}

export interface FooterColumn {
  key: 'product' | 'resources' | 'company'
  links: SiteLink[]
}

const headerLinks: SiteLink[] = [
  { label: 'nav.howItWorks', to: '/how-it-works' },
  { label: 'nav.ai', to: '/ai-moderation' },
  { label: 'nav.privacy', to: '/privacy' },
  { label: 'nav.pricing', to: '/pricing' },
  { label: 'nav.docs', to: '/docs' },
]

function footerColumns(launched: boolean): FooterColumn[] {
  return [
    {
      key: 'product',
      links: [
        { label: 'nav.howItWorks', to: '/how-it-works' },
        { label: 'nav.ai', to: '/ai-moderation' },
        { label: 'nav.privacyAndTrust', to: '/privacy' },
        { label: 'nav.pricing', to: '/pricing' },
      ],
    },
    {
      key: 'resources',
      links: [
        { label: 'nav.docs', to: '/docs' },
        { label: 'nav.changelog', to: '/changelog' },
        { label: 'nav.status', to: '/status' },
        launched ? { label: 'nav.pilotWriteUp', to: '/pilot' } : { label: 'nav.pilot', to: '/pilot' },
      ],
    },
    {
      key: 'company',
      links: [
        { label: 'nav.about', to: '/about' },
        { label: 'nav.support', to: '/support' },
        { label: 'nav.legal', to: '/legal' },
        ...(launched ? [{ label: 'nav.signIn', to: '/dashboard' }] : []),
      ],
    },
  ]
}

export function useSiteLinks() {
  const { reeve } = useAppConfig()
  const built = (link: SiteLink) => reeve.builtPages.includes(link.to)

  return {
    isBuilt: (path: string) => reeve.builtPages.includes(path),
    launched: computed(() => reeve.launched),
    header: computed(() => headerLinks.filter(built)),
    footer: computed(() => footerColumns(reeve.launched)
      .map(column => ({ ...column, links: column.links.filter(built) }))
      .filter(column => column.links.length > 0)),
    // The header's one primary action: Join the beta before launch, Add to Discord after.
    action: computed<SiteLink | null>(() => {
      const link = reeve.launched
        ? { label: 'header.addToDiscord', to: '/sign-up' }
        : { label: 'header.joinBeta', to: '/sign-up' }
      return built(link) ? link : null
    }),
    signIn: computed<SiteLink | null>(() => {
      const link = { label: 'nav.signIn', to: '/dashboard' }
      return reeve.launched && built(link) ? link : null
    }),
  }
}
