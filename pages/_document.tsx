import { ReactElement } from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import type { DocumentInitialProps, DocumentContext } from 'next/document';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return {...initialProps};
  }

  render(): ReactElement {
    return(
      <Html>
        <Head>
          <link
            rel="preconnect"
            href="https://fonts.googleapis.com"
          />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin='anonymous'
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Concert+One&display=swap"
            rel="stylesheet"
          />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin='anonymous'
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;600;700;800&display=swap"
            rel="stylesheet"
          />
          <meta name="author" content="Reuben Price" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }

}
