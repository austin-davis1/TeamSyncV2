/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/*.jsx",
    "./src/components/*.jsx",
    "./src/*"
  ],
  theme: {
    textColor: {
      primary: "#000",
      blue: "#004aad",
      green: "#3caa5f",
      red: "#cf3434",
      white: "#FFF"
    },
    fontFamily: {
      'sans': 'Arial'
    },
    extend: {
      colors: {
        "black": "#000000",
        "white": "#ffffff",
        "gray": "#2a2a2a",
        "off-white": "#e8e8e8",
        "blue": "#004aad",
        "hover-gray": "#9c9c9c",
        "purple": "#7846b9",
        "hover-purple": "#936bc7",
        "red": "#cf3434",
        "hover-red": "#d85a5a",
        "green": "#3caa5f",
        "hover-green": "#68ca87",
        "orange": "#e8820e",
        "yellow": "#f7df05",
        "blue-gray": "#1f2147"
      }
    },
  },
  plugins: [],
}
