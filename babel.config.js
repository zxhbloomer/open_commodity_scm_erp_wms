module.exports = {
  presets: [
    ['@vue/app',
      {
        useBuiltIns: 'entry',
        'corejs': 3,
        polyfills: [
          'es6.array.iterator',
          'es6.promise',
          'es6.symbol'
        ]
      }
    ]
  ],
  'env': {
    'development': {
      'plugins': ['dynamic-import-node']
    }
  }
}
