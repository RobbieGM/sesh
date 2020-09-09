module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: `"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
        Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
        "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,
      },
      minWidth: {
        16: "4rem",
      },
      colors: {
        purple: {
          "050": "#E6E6FF",
          100: "#C4C6FF",
          200: "#A2A5FC",
          300: "#8888FC",
          400: "#7069FA",
          500: "#5D55FA",
          600: "#4D3DF7",
          700: "#3525E6",
          800: "#1D0EBE",
          900: "#0C008C",
        },
        teal: {
          "050": "#EFFCF6",
          100: "#C6F7E2",
          200: "#8EEDC7",
          300: "#65D6AD",
          400: "#3EBD93",
          500: "#27AB83",
          600: "#199473",
          700: "#147D64",
          800: "#0C6B58",
          900: "#014D40",
        },
        gray: {
          "050": "#F0F4F8",
          100: "#D9E2EC",
          200: "#BCCCDC",
          300: "#9FB3C8",
          400: "#829AB1",
          500: "#627D98",
          600: "#486581",
          700: "#334E68",
          800: "#243B53",
          900: "#102A43",
        },
        "light-blue-vivid": {
          "050": "#E3F8FF",
          100: "#B3ECFF",
          200: "#81DEFD",
          300: "#5ED0FA",
          400: "#40C3F7",
          500: "#2BB0ED",
          600: "#1992D4",
          700: "#127FBF",
          800: "#0B69A3",
          900: "#035388",
        },
        "red-vivid": {
          "050": "#FFE3E3",
          100: "#FFBDBD",
          200: "#FF9B9B",
          300: "#F86A6A",
          400: "#EF4E4E",
          500: "#E12D39",
          600: "#CF1124",
          700: "#AB091E",
          800: "#8A041A",
          900: "#610316",
        },
        "yellow-vivid": {
          "050": "#FFFBEA",
          100: "#FFF3C4",
          200: "#FCE588",
          300: "#FADB5F",
          400: "#F7C948",
          500: "#F0B429",
          600: "#DE911D",
          700: "#CB6E17",
          800: "#B44D12",
          900: "#8D2B0B",
        },
      },
    },
  },
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    enabled: false, // nothing is generated with twin.macro, only preflight is used
  },
};