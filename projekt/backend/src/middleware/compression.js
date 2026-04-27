import compression from 'compression'

/**
 * Compression middleware - kompresuje responses (gzip)
 */
export const compress = compression({
  level: 6,
  threshold: 1024,  // kompresuj tylko powyżej 1KB
  filter: (req, res) => {
    if (res.headersSent) return false
    return compression.filter(req, res)
  }
})
