/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-var */
type Nullable<T> = T | null;
type Any = Parameters<Generator['return']>[0];

type ClassNameProp = {
  className?: string;
};

declare var dataLayer: any;

interface Request {
  user?: { id: number };
}

type Prettify<T> = {
  [K in keyof T]: T[K];
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {};

declare namespace JSX {
  interface IntrinsicElements {
    changefreq: any;
    lastmod: any;
    loc: any;
    priority: any;
    sitemap: any;
    sitemapindex: any;
    url: any;
    urlset: any;
  }
}
