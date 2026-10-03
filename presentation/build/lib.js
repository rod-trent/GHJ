// Shared helpers for both decks: theme, icon rasterization, common slide pieces.
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");

// ---- Theme -----------------------------------------------------------------
// "GitHub Security" palette: near-black canvas, GitHub green accent, soft
// off-white text, a danger red for "the problem" and a blue for calm facts.
const THEME = {
  name: "GitHubSecurity",
  headFontFace: "Century Schoolbook",
  bodyFontFace: "Calibri",
  colors: {
    dk1: "0D1117", // GitHub dark canvas (text1 on light / bg on dark)
    lt1: "FFFFFF",
    dk2: "161B22", // panel
    lt2: "F2F4F8",
    accent1: "2DA44E", // GitHub green
    accent2: "1F6FEB", // GitHub blue
    accent3: "CF222E", // danger red
    accent4: "D29922", // amber / caution
    accent5: "8250DF", // purple (CodeQL-ish)
    accent6: "57606A", // muted slate
    hlink: "2DA44E",
    folHlink: "1F6FEB",
  },
};

// Convenience raw hex (for places that need srgb, not scheme colors)
const HEX = {
  canvas: "0D1117",
  panel: "161B22",
  panel2: "21262D",
  ink: "FFFFFF",
  sub: "C9D1D9",
  muted: "8B949E",
  green: "2DA44E",
  greenLt: "3FB950",
  blue: "1F6FEB",
  red: "CF222E",
  redLt: "F85149",
  amber: "D29922",
  purple: "8250DF",
  line: "30363D",
};

// ---- Icons -----------------------------------------------------------------
// Render a react-icons component to a PNG data URI at high res.
async function icon(IconCmp, hexColor = "FFFFFF", px = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(
    React.createElement(IconCmp, { color: "#" + hexColor, size: px })
  );
  const buf = await sharp(Buffer.from(svg)).resize(px, px).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

// ---- Layout constants ------------------------------------------------------
const W = 13.333;
const H = 7.5;
const M = 0.6; // outer margin

module.exports = { THEME, HEX, icon, W, H, M, React };
