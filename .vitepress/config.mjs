import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "CS Connect Documentation Hub",
  description: "Requirements and documentation for self-hosting CS Connect",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Frontend Setup', link: '/setup-guide' },
      { text: 'Supabase Setup', link: '/supabase-setup' }
    ],

    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Overview', link: '/' },
          { text: 'Frontend Setup', link: '/setup-guide' },
          { text: 'Supabase Setup', link: '/supabase-setup' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/your-organization/cs-connect' }
    ]
  }
})
