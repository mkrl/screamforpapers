const tailwindcss = require("tailwindcss");
const nested = require("postcss-nested");
const autoprefixer = require("autoprefixer");

const config = {
  plugins: [
    nested(),
    //Some plugins, like tailwindcss/nesting, need to run before Tailwind,
    tailwindcss(),
    //But others, like autoprefixer, need to run after,
    autoprefixer,
  ],
};

module.exports = config;
