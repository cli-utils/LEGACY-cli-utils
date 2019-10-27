import chalk from "chalk";
import stringWidth from "string-width";
import { repeat } from "./utils/string";
import UnreachableError from "./error/unreachable";
import { DeepPartial } from "./types";
import { shouldStripColor } from "./utils/color";

export type FmtFunction = (...text: string[]) => string;

export type Styles = {
  box: FmtFunction;
  body: FmtFunction;
  title: FmtFunction;
};

export type PartialStyles = DeepPartial<Styles>;

export interface IBannerOptions {
  styles: Styles;
  plain: boolean;
}

const NO_OP_FMT_FUNCTION: FmtFunction = x => x;

const DEFAULT_BANNER_OPTIONS: IBannerOptions = {
  styles: {
    box: NO_OP_FMT_FUNCTION,
    body: NO_OP_FMT_FUNCTION,
    title: NO_OP_FMT_FUNCTION
  },
  plain: shouldStripColor(process, undefined)
};

function resolveBannerOptions(
  partial: DeepPartial<IBannerOptions>
): IBannerOptions {
  const pStyles = partial.styles;
  if (!pStyles) return DEFAULT_BANNER_OPTIONS;
  const defaults = DEFAULT_BANNER_OPTIONS;
  return {
    ...defaults,
    ...partial,
    styles: {
      ...defaults.styles,
      ...pStyles
    },
    plain: shouldStripColor(process, partial.plain)
  };
}

export function createBanner(emoji: string, title: string);
export function createBanner(
  emoji: string,
  title: string,
  opts?: DeepPartial<IBannerOptions>
);
export function createBanner(
  emoji: string,
  title: string,
  body: string[],
  opts?: DeepPartial<IBannerOptions>
);
export function createBanner(
  emoji: string,
  title: string,
  optsOrBody: string[] | DeepPartial<IBannerOptions> = {},
  opts: DeepPartial<IBannerOptions> = {}
) {
  if (typeof optsOrBody === "undefined" && typeof opts === "undefined") {
    return createBannerImpl(emoji, title, undefined, DEFAULT_BANNER_OPTIONS);
  } else if (typeof optsOrBody === "object" && !(optsOrBody instanceof Array)) {
    return createBannerImpl(
      emoji,
      title,
      undefined,
      resolveBannerOptions(optsOrBody)
    );
  } else if (optsOrBody instanceof Array) {
    return createBannerImpl(
      emoji,
      title,
      optsOrBody,
      resolveBannerOptions(opts)
    );
  } else {
    throw new UnreachableError(
      optsOrBody,
      `The arguments passed to 'createBanner' do not appear to match any of the intended use cases.
createBanner(${[...arguments].map(
        arg => `${JSON.stringify(arg)}: ${typeof arg}`
      )})`
    );
  }
}

function fmt(f: FmtFunction, options: IBannerOptions): (x: string) => string {
  if (options.plain) return x => x;
  return (s: string) => f(s);
}

function buildBoxHorizontalEdge(
  l: string,
  m: string,
  r: string,
  len: number,
  formatter: FmtFunction
) {
  return formatter(`${l}${repeat(m, len)}${r}`);
}

function buildBoxedBanner(
  emoji: string,
  lines: string[],
  opts: IBannerOptions
) {
  const boxF = fmt(opts.styles.box, opts);
  const bodyF = fmt(opts.styles.body, opts);

  const maxL = lines.reduce((max, line, i) => {
    const w = stringWidth(line);
    return w > max ? w : max;
  }, -1);

  const parts = lines.reduce(
    (arr, l, i) => {
      const isFirstLine = i === 0;
      const formatter = isFirstLine ? null : bodyF;
      let spacer = repeat(
        " ",
        maxL -
          stringWidth(l) +
          (i === 0 && emoji.length ? stringWidth(emoji) - 1 : 0)
      );
      if (i === 1) {
        arr.push(buildBoxHorizontalEdge("┠", "─", "┨", maxL + 2, boxF));
      }
      arr.push(
        `${boxF("┃")} ${formatter ? formatter(l) : l}${spacer} ${boxF("┃")}`
      );
      return arr;
    },
    [] as string[]
  );
  parts.unshift(buildBoxHorizontalEdge("┏", "━", "┓", maxL + 2, boxF));
  parts.push(buildBoxHorizontalEdge("┗", "━", "┛", maxL + 2, boxF));
  return parts.join("\n");
}

function createBannerImpl(
  emoji: string,
  title: string,
  body: string[],
  opts: IBannerOptions
) {
  const titleF = fmt(opts.styles.title, opts);

  const firstLineParts = [titleF(title)];
  if (emoji) {
    firstLineParts.unshift(emoji, "  ");
  }
  const lines: string[] = [];

  lines.push(firstLineParts.join(""));

  if (body) {
    lines.push(...body);
  }
  return buildBoxedBanner(emoji, lines, opts);
}
