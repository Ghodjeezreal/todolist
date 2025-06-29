module.exports = {
  pwa: {
    name: 'My Todo App',
    themeColor: '#070707',
    msTileColor: '#070707',
    manifestOptions: {
      background_color: '#070707'
    },
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true
    }
  }
}