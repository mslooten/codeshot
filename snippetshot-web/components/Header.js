import Head from 'next/head';
import React from 'react';

const Header = ({ image }) => {
  return (
    <Head>
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <meta name="description" content="Create a screenshot from a code snippet" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="Snippet Shot" />
      <meta name="twitter:title" content="Snippet Shot: Beautiful code screenshots" />
      <meta name="twitter:description" content="Create a screenshot from a code snippet" />
      <meta name="twitter:image" content={image || "https://www.snippetshot.com/snippetshot.png"} />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />

      <title>Snippet Shot</title>
      {process.env.NODE_ENV === "production" && (
        <>
          <script async src="https://www.googletagmanager.com/gtag/js?id=UA-20731045-2" />

          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'UA-20731045-2', { anonymize_ip: true });
        `
            }}
          />
        </>
      )}
    </Head>
  );
};

export default Header;
