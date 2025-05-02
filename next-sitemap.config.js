/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'http://localhost:3000',
    generateRobotsTxt: true,
    exclude: ['/admin/*', '/server-sitemap.xml'],
    robotsTxtOptions: {
      policies: [
        { userAgent: '*', allow: '/' },
        { userAgent: 'black-listed-bot', disallow: ['/admin'] }
      ],
      additionalSitemaps: [
        'https://jaipurmurtibhandar.com/server-sitemap.xml'
      ]
    },
    transform: async (config, path) => {
      // Customize lastmod for dynamic pages
      if (path.startsWith('/products/')) {
        const slug = path.split('/products/')[1]
        const product = await prisma.product.findUnique({
          where: { slug },
          select: { updatedAt: true }
        })
        return {
          loc: path,
          lastmod: product?.updatedAt.toISOString() || new Date().toISOString()
        }
      }
      return {
        loc: path,
        changefreq: config.changefreq,
        priority: config.priority,
        lastmod: config.autoLastmod ? new Date().toISOString() : undefined
      }
    }
  }