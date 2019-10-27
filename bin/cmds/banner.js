#!/usr/bin/env node
// @ts-check

const { createBanner } = require("../../dist/cjs/banner");
const chalk = require("chalk").default;

/**
 *
 * @param {string} str
 * @returns {typeof chalk}
 */
function styleListToFormatter(str) {
  return str.split(".").reduce(function(c, s) {
    return /** @type { typeof chalk} */ (c[s]);
  }, chalk);
}
/**
 * @type { import('yargs').CommandModule<any>}
 */
const cmd = {
  command: "banner <emoji> <title> <bodyLines...>",
  handler: function(argv) {
    const styles = {};
    const { title, bodyLines, emoji, titleStyle, boxStyle, bodyStyle } = argv;
    if (boxStyle && typeof boxStyle === "string") {
      styles.box = styleListToFormatter(boxStyle);
    }
    if (titleStyle && typeof titleStyle === "string") {
      styles.title = styleListToFormatter(titleStyle);
    }
    if (bodyStyle && typeof bodyStyle === "string") {
      styles.body = styleListToFormatter(bodyStyle);
    }

    process.stdout.write(
      createBanner(emoji, title, bodyLines, { styles }) + "\n"
    );
  },
  builder: {
    emoji: {
      default: "💡",
      demandOption: true,
      type: "string"
    },
    title: {
      default: "💡  Information",
      demandOption: true,
      type: "string"
    },
    bodyLines: {
      array: true,
      type: "string",
      desc:
        "'lines' that are concatenated together to form the body of the banner"
    },
    boxStyle: {
      desc: "styles to apply to the border of the banner\nexample: 'yellow'\n"
    },
    bodyStyle: {
      desc: "styles to apply to the body of the banner\nexample: 'dim.italic'\n"
    },
    titleStyle: {
      desc:
        "styles to apply to the title of the banner\nexample: 'bold.underline.green'\n"
    }
  },
  describe: "Print a banner to the console"
};
module.exports = cmd;
