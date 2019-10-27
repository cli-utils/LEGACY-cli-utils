import { createBanner } from "../src/banner";
import chalk from "chalk";

QUnit.module("console banners", () => {
  QUnit.test("title only", assert => {
    assert.equal(
      createBanner("🤯", "My mind is blown"),
      `
┏━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🤯  My mind is blown  ┃
┗━━━━━━━━━━━━━━━━━━━━━━┛`.trim()
    );
  });
  QUnit.test("title with body", assert => {
    assert.equal(
      createBanner("🌮", "I want a taco", [
        "- carnitas",
        "- cheese",
        "- salsa"
      ]),
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
      createBanner("🥟", "Things I ate for lunch", [
        "- some potstickers that I ordered yesterday but did not eat",
        "- bubble tea with no ice, no sugar"
      ]),
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
    assert.equal(
      createBanner(
        "🥟",
        "Things I ate for lunch",
        [
          "- some potstickers that I ordered yesterday but did not eat",
          "- bubble tea with no ice, no sugar"
        ],
        { styles: { title: chalk.red } }
      ),
      `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🥟  \u001b[31mThings I ate for lunch\u001b[39m                                   ┃
┠─────────────────────────────────────────────────────────────┨
┃ - some potstickers that I ordered yesterday but did not eat ┃
┃ - bubble tea with no ice, no sugar                          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.trim()
    );
  });
});
