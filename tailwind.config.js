const colors = require(`tailwindcss/colors`);
const forms = require(`@tailwindcss/forms`);

module.exports = {
  purge: {
    mode: `all`,
    content: [
      `node_modules/@fortawesome/**/*.js`,
      `pages/**/*.{js,ts,jsx,tsx}`,
      `components/**/*.{js,ts,jsx,tsx}`
    ],
    options: {
      keyframes: true
    }
  },
  darkMode: `class`,
  theme: {
    colors,
    extend: {
      spacing: {
        "88": `22rem`
      },
      cursor: {
        grab: `grab`,
        grabbing: `grabbing`
      },
      width: {
        "full-4": `calc(100% - 1rem)`
      },
      maxHeight: {
        "full-8": `calc(100% - 2rem)`
      }
    }
  },
  variants: {
    extend: {
      backgroundColor: [ `disabled` ],
      textColor: [ `disabled` ],
      borderWidth: [ `disabled` ],
      borderColor: [ `disabled` ],
      cursor: [ `disabled` ]
    }
  },
  plugins: [
    forms
  ],
  corePlugins: {}
};
