module.exports = {
  future: {
    // removeDeprecatedGapUtilities: true,
     purgeLayersByDefault: true,
    // defaultLineHeights: true,
    // standardFontWeights: true
  },
  purge: [

  ],
  theme: {
    extend: {},
    colors: {
      primary: 'var(--primary-background-color)',
      secondary: 'var(--secondary-background-color)',
      tertiary: 'var(--tertiary-background-color)',
      color1: 'var(--color1-background-color)',

      btnClose: 'var(--btnClose-background-color)',
      btnDelete: 'var(--btnDelete-background-color)',
      btnSubmit: 'var(--btnSubmit-background-color)',

      default: 'var(--text-default-color)',

    }
  },
  variants: {},
  plugins: [],


}
