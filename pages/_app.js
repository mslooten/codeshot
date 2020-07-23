import '../styles/index.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

import domtoimage from 'dom-to-image';
import Head from 'next/head';
import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { ResizableBox } from 'react-resizable';

import ColorPicker from '../components/ColorPicker';

require("react-resizable/css/styles.css");

function App() {
  const [lang, langSelect] = React.useState("javascript");
  const [gist, setGist] = React.useState("");
  const [loaded, setLoaded] = React.useState(false);
  const [attribution, setAttribution] = React.useState("snippetshot.com");
  const [hover, setHover] = React.useState(false);

  // const [colors, setColors] = React.useState(["rgb(129, 230, 217)", "rgb(251, 182, 206)"]);
  const [colors, setColors] = React.useState(["rgb(254, 215, 226)", "rgb(190, 227, 248)"]);
  const [angle, setAngle] = React.useState("150");

  React.useEffect(() => {
    require("codemirror/mode/javascript/javascript");
    require("codemirror/mode/htmlmixed/htmlmixed");
    require("codemirror/mode/css/css");
    setLoaded(true);
  }, []);

  const changeLang = (e) => {
    langSelect(e.target.value);
  };

  const getGist = (e) => {
    const inputUrl = e.target.value;
    let url = "";
    if (inputUrl.includes("githubusercontent.com")) {
      url = inputUrl;
    } else if (inputUrl.includes("github.com")) {
      url = inputUrl.replace("github.com", "githubusercontent.com") + "/raw";
    } else {
      return;
    }
    fetch(url)
      .then((res) => {
        return res.text();
      })
      .then((rawRes) => {
        setGist(rawRes);
      });
  };

  const downloadBlob = (blob, name = "file.png") => {
    // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
    const blobUrl = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement("a");

    // Set link's href to point to the Blob URL
    link.href = blobUrl;
    link.download = name;

    // Append link to the body
    document.body.appendChild(link);

    // Dispatch click event on the link
    // This is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
      new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window
      })
    );

    // Remove link from body
    document.body.removeChild(link);
  };

  const download = () => {
    const code = document.getElementById("codeshot");
    const scale = 2;
    let obj = {
      height: code.offsetHeight * scale,
      style: {
        transform: `scale(${scale}) translate(${code.offsetWidth / 2 / scale}px, ${code.offsetHeight / 2 / scale}px)`
      },
      width: code.offsetWidth * scale
    };
    domtoimage.toBlob(code, obj).then((blob) => {
      downloadBlob(blob, `snippetshot-${new Date().toLocaleDateString()}`);
    });
  };

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Create a screenshot from a code snippet" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="Snippet Shot" />
        <meta name="twitter:title" content="Snippet Shot: Beautiful code screenshots" />
        <meta name="twitter:description" content="Create a screenshot from a code snippet" />
        <meta name="twitter:image" content="https://www.snippetshot.com/snippetshot.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />

        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&display=swap" />

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;600&display=swap"
          media={loaded ? "all" : "print"}
        />
        <title>Snippet Shot</title>
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
      </Head>
      <div className="container mx-auto mw-1/2 p-6">
        <div className="flex justify-center items-stretch">
          <img src="/snippet-shot.svg" alt="Snippet Shot Logo" className="w-6" />
          <h1 id="title" className="ml-4 text-center text-gray-700 text-5xl font-mono font-bold uppercase">
            Snippet Shot
          </h1>
        </div>
        <h2 className="text-center font-mono text-gray-600">
          Generate screenshots{" "}
          <span role="img" aria-label="camera with flash">
            📸
          </span>{" "}
          from your code snippets
        </h2>
        <div className="flex items-center justify-center pt-6" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
          <ResizableBox width={800} height={460} minConstraints={[600, 460]} axis="x">
            <div id="codeshot" className="relative">
              <div
                className="p-20"
                style={{
                  background: `linear-gradient(${angle}deg, ${colors[0]}, ${colors[1]})`
                }}
              >
                <div className="overflow-hidden rounded-md shadow-xl">
                  {loaded && (
                    <CodeMirror
                      value={gist}
                      options={{
                        mode: lang,
                        theme: "material",
                        lineNumbers: false,
                        lineWrapping: true,
                        scrollbarStyle: null
                      }}
                    />
                  )}
                </div>
                {attribution.length > 0 && (
                  <div className="flex justify-center absolute bottom-0 mb-4 opacity-75 right-0 left-0 w-full">
                    <div className="px-2 bg-white text-gray-600 rounded-full text-xs whitespace-no-wrap">{attribution}</div>
                  </div>
                )}
              </div>
              {hover && (
                <div className="absolute flex text-xs text-gray-500 right-0 mt-2">
                  Resize me
                  <svg
                    className="w-4 text-pink-500 ml-2"
                    fillRule="evenodd"
                    strokeLinejoin="round"
                    strokeMiterlimit="2"
                    clipRule="evenodd"
                    viewBox="0 0 265 206"
                  >
                    <path
                      fill="currentColor"
                      fillRule="nonzero"
                      d="M3.10187 119.56816c4.8707-3.1367 10.09114-5.34153 16.07366-4.26602 3.19864.57367 5.1159 2.07123 1.65237 4.81116-2.28274 1.80276-1.65595 3.27308-.2311 4.9616 2.19783 2.60965 4.25037 5.38116 6.71297 7.72768 23.89222 22.79556 51.33583 39.58688 83.36953 48.25361 12.95967 3.50715 26.23188 4.94168 39.72573 3.73949 8.20392-.73586 9.73288-.9961 10.8093-9.09754 1.60136-12.05157 3.24662-24.40576 2.29696-36.42862-2.04745-26.08283-5.61252-52.05667-8.81403-78.04173-.34052-2.7632-.87044-5.49583-1.4575-8.21666-.28763-1.33185-.6055-2.66597-.9217-3.99193-.29177-1.20762-1.29974-4.60739-1.37608-5.86372-.37126.4893-5.27469 18.8255-6.26085 21.386-.67002 1.74221-1.34413 3.48527-1.83156 5.28766-.42033 1.55028-.53409 3.1224-1.02321 4.64858-2.16743 6.75245-7.3306 11.77043-13.57254 14.90083-3.40124 1.70174-7.58646 2.2847-11.46195 2.47187-3.44987.1674-5.27632-3.71438-2.68533-5.7552 7.32073-5.77808 7.31095-14.44243 9.70973-22.11479 4.33446-13.83666 8.2047-27.82001 12.42943-41.69359 4.52661-14.88462 15.8086-20.4549 30.2476-22.10742 6.82426-.78298 12.46778.9794 17.1872 5.56175 5.29981 5.14755 10.57565 10.38513 15.283 16.06337 12.71096 15.33061 24.99262 31.0136 37.71822 46.33267 3.37362 4.06026 22.00877 16.67917 27.56599 19.69315-6.09233 7.54545-14.52844 9.19714-22.74307 11.386-5.6692 1.51461-10.85464.36394-15.33812-3.05458-3.81443-2.91843-7.49855-6.17433-10.61223-9.82024-7.38546-8.65675-14.3685-17.65183-21.56944-26.46579-1.31979-1.61235-2.899-3.018-5.4622-5.64584 1.86216 18.11415 3.82649 34.49692 5.12022 50.92873.84955 10.75442 1.28047 21.60375.90354 32.37303-.4841 13.81634-3.69082 26.99481-11.99088 38.5824-5.60198 7.81865-13.1756 13.13414-20.77537 18.71454-10.83181 7.95773-22.74404 11.36067-35.94587 11.00927-20.03687-.52771-38.24674-7.08668-56.3163-15.41893-24.72376-11.4049-44.3842-28.51766-61.19195-49.37172-2.99644-3.7169-5.28104-8.087-7.38065-12.40594-1.60303-3.29398-1.34353-6.81919 2.15648-9.07313"
                    />
                  </svg>
                </div>
              )}
            </div>
          </ResizableBox>
        </div>
        <div className="flex my-6 justify-center">
          <button
            className="shadow border rounded py-2 px-3 text-gray-700 leading-tight hover:shadow-lg transition-all duration-200"
            onClick={download}
          >
            Download your Snippet Shot
          </button>
        </div>
        <div className="mb-4 grid grid-cols-3">
          <label className="block text-gray-600 text-sm font-bold mb-2 col-span-2" htmlFor="gist">
            Github gist url <span className="font-normal text-xs text-gray-500">(or just paste your code in the edit window above)</span>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="gist"
              type="url"
              placeholder="url"
              onChange={getGist}
            />
          </label>
          <label className="block text-gray-600 text-sm font-bold mb-2 ml-2">
            Attribution
            <input
              type="text"
              value={attribution}
              onChange={(e) => setAttribution(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </label>
        </div>
        <div className="flex items-start">
          <label className="text-gray-600 text-sm font-bold block">
            Language:
            <div className="block relative w-64 mb-4 mr-6">
              <select
                onChange={changeLang}
                value={lang}
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="htmlmixed">HTML</option>
                <option value="css">CSS</option>
                <option value="javascript">JavaScript</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </label>
          <label className="text-gray-600 text-sm font-bold block">
            Select gradient colors:
            <br />
            <ColorPicker colors={colors} setColors={setColors} />
          </label>
          <label className="text-gray-600 text-sm font-bold block ml-4 whitespace-no-wrap">
            Gradient rotation:
            <br />
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="number"
              placeholder="Gradient rotation"
              min="0"
              max="360"
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
            />
          </label>
        </div>
        <p className="mt-8 text-center text-gray-600 text-sm">
          A side project made by{" "}
          <a className="underline text-pink-500 hover:text-indigo-500 transition-colors duration-200" href="https://marcoslooten.com/">
            Marco Slooten
          </a>
          <br />
          <a
            className="text-xs underline text-gray-600 hover:text-indigo-500 transition-colors duration-200"
            href="https://marcoslooten.com/privacy/"
          >
            Privacy
          </a>
        </p>
      </div>
    </>
  );
}

export default App;
