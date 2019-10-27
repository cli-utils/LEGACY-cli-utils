import { createBanner } from "../src/banner";
import chalk from "chalk";

QUnit.module("console banners", () => {
  QUnit.test("title only", assert => {
    assert.equal(
      createBanner("🤯", "My mind is blown", { plain: true }),
      `
┏━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🤯  My mind is blown  ┃
┗━━━━━━━━━━━━━━━━━━━━━━┛`.trim()
    );
  });
  QUnit.test("title with body", assert => {
    assert.equal(
      createBanner(
        "🌮",
        "I want a taco",
        ["- carnitas", "- cheese", "- salsa"],
        { plain: true }
      ),
      `
┏━━━━━━━━━━━━━━━━━━━┓
┃ 🌮  I want a taco  ┃
┠───────────────────┨
┃ - carnitas        ┃
┃ - cheese          ┃
┃ - salsa           ┃
┗━━━━━━━━━━━━━━━━━━━┛`.trim()
    );
  });
  QUnit.test("width accomodates longest string", assert => {
    assert.equal(
      createBanner(
        "🥟",
        "Things I ate for lunch",
        [
          "- some potstickers that I ordered yesterday but did not eat",
          "- bubble tea with no ice, no sugar"
        ],
        { plain: true }
      ),
      `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🥟  Things I ate for lunch                                   ┃
┠─────────────────────────────────────────────────────────────┨
┃ - some potstickers that I ordered yesterday but did not eat ┃
┃ - bubble tea with no ice, no sugar                          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.trim()
    );
  });
  QUnit.test("customizing title format", assert => {
    const oldCi = process.env.CI;
    delete process.env.CI;
    assert.equal(
      createBanner(
        "🥟",
        "Things I ate for lunch",
        [
          "- some potstickers that I ordered yesterday but did not eat",
          "- bubble tea with no ice, no sugar"
        ],
        { styles: { title: chalk.red }, plain: false }
      ),
      `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🥟  \u001b[31mThings I ate for lunch\u001b[39m                                   ┃
┠─────────────────────────────────────────────────────────────┨
┃ - some potstickers that I ordered yesterday but did not eat ┃
┃ - bubble tea with no ice, no sugar                          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.trim()
    );
    process.env.CI = oldCi;
  });
  QUnit.test("omits formatting if plain option is set to 'true'", assert => {
    assert.equal(
      createBanner(
        "🥟",
        "Things I ate for lunch",
        [
          "- some potstickers that I ordered yesterday but did not eat",
          "- bubble tea with no ice, no sugar"
        ],
        {
          styles: {
            title: chalk.underline,
            body: chalk.italic,
            box: chalk.green
          },
          plain: true
        }
      ),
      `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🥟  Things I ate for lunch                                   ┃
┠─────────────────────────────────────────────────────────────┨
┃ - some potstickers that I ordered yesterday but did not eat ┃
┃ - bubble tea with no ice, no sugar                          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.trim()
    );
  });
});
