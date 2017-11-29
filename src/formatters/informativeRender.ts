import { IInformative } from '../interfaces/informative';
import { dateFormatter } from './date';

export function informativeRender(informative: IInformative): string {
  return `
    <html>
      <head>
        <meta name="viewport" content="initial-scale=1">
        <meta charset="UTF-8">

        <style>
          html, body {
            padding: 0 0 20px 0;
            margin: 0;
            -webkit-font-smoothing: antialiased;
            font-smoothing: antialiased;
            text-rendering: optimizeLegibility;
            -webkit-user-drag: none;
            -ms-content-zooming: none;
            -ms-touch-action: manipulation;
            touch-action: manipulation;
            word-wrap: break-word;
            -webkit-text-size-adjust: none;
            -ms-text-size-adjust: none;
            text-size-adjust: none;
            font-family: -apple-system, "Roboto", "Helvetica Neue", sans-serif;
            font-size: 16px;
          }

          header {
            padding: 10px 20px;
            background-color: #86bd90;
            color: white;
            font-size: 20px;
          }

          header small {
            display: block;
            font-size: 14px;
            margin-top: 5px;
          }

          .content {
            padding: 10px 20px;
          }

          h1 {
            margin-top: 4rem;
            margin-bottom: 1rem;
            font-size: 24px;
            color: #86bd90;
          }

          h2 {
            margin-top: 2rem;
            font-size: 20px;
          }

          h1 + h2 {
            margin-top: 0;
          }

          .content > h1:first-child,
          .content > h2:first-child {
            margin-top: 0;
          }

          ul, ol {
            padding-left: 18px;
          }

          ul li, ol li {
            padding-left: 0;
            margin-left: 0;
          }

          p {
            margin: 0;
          }
        </style>
      </head>
      <body>
        <header>
          ${informative.title}
          <small>${dateFormatter.format(informative.date, 'dddd, DD [de] MMMM [de] YYYY')}</small>
        </header>
        <br />
        <div class="content">
          ${informative.message}
        </div>

        <script>
          function waitForBridge() {

            if (window.postMessage.length !== 1) {
              return setTimeout(waitForBridge, 100);
            }

            window.postMessage(document.body.innerText);
          }

        window.onload = waitForBridge;
        </script>
      </body>
    </html>
    `;
}