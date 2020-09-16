import '../fonts/monolisa.css';
import '../styles/index.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

import domtoimage from 'dom-to-image';
import LZUTF8 from 'lzutf8';
import React from 'react';

import Editor from '../components/Editor';
import Header from '../components/Header';
import Settings from '../components/Settings';
import CM_MODES from '../data/modes';

require("react-resizable/css/styles.css");

function App() {
  const [modes, setModes] = React.useState([]);
  const [lang, setLang] = React.useState("JavaScript");
  const [mimeType, setMime] = React.useState("application/javascript");
  const [gist, setGist] = React.useState("");
  const [loaded, setLoaded] = React.useState(false);
  const [attribution, setAttribution] = React.useState("snippetshot.com");
  const [hover, setHover] = React.useState(false);
  const [isSafari, setSafari] = React.useState(false);
  const [format, setFormat] = React.useState("png");
  const [url, setUrl] = React.useState("");
  const [image, setImage] = React.useState("");

  const [colors, setColors] = React.useState(["rgb(254, 215, 226)", "rgb(190, 227, 248)"]);
  const [angle, setAngle] = React.useState("150");

  React.useEffect(() => {
    require("codemirror/mode/javascript/javascript.js");
    require("codemirror/mode/clike/clike");
    if (
      navigator.userAgent.indexOf("Safari/") > -1 &&
      navigator.userAgent.indexOf("Chrome/") == -1 &&
      navigator.userAgent.indexOf("Chromium/") == -1
    ) {
      setSafari(true);
    }
    setModes(CM_MODES);
    if (window.location.hash) {
      const codeObj = JSON.parse(LZUTF8.decompress(window.location.hash.split("#")[1], { inputEncoding: "Base64" }));
      setGist(codeObj.gist);
      const { mode, mime, mimes } = CM_MODES.find((mode) => mode.name === codeObj.lang);
      require(`codemirror/mode/${mode}/${mode}.js`);
      setLang(codeObj.lang);
      setMime((mimes && mimes[0]) || mime);
      setColors(codeObj.colors);
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
        const reader = new FileReader();
        reader.addEventListener(
          "load",
          function () {
            setImage(reader.result);
          },
          false
        );
        reader.readAsDataURL(blob);
      });
    }
    setLoaded(true);
  }, []);

  const updateUrl = () => {
    const urlObj = { gist, lang, colors };
    const compressed = LZUTF8.compress(JSON.stringify(urlObj), { outputEncoding: "Base64" });
    if (compressed.length < 2000) {
      setUrl(compressed);
    } else {
      setUrl("");
    }
  };

  React.useEffect(() => {
    updateUrl();
  }, [colors, lang]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      updateUrl();
    }, 800);

    return () => clearTimeout(timer);
  }, [gist]);

  React.useEffect(() => {
    if (url.length > 0 && url.length < 2000) {
      window.location.hash = url;
    } else {
      window.location.hash = "";
    }
  }, [url]);

  const changeLang = (e) => {
    const lang = e.value;
    const { mode, mime, mimes } = modes.find((mode) => mode.name === lang);
    require(`codemirror/mode/${mode}/${mode}.js`);
    setLang(lang);
    setMime((mimes && mimes[0]) || mime);
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

  const downloadBlob = (blob, name = "file.png", svg = false) => {
    // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
    const blobUrl = svg ? blob : URL.createObjectURL(blob);

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
    setHover(false);
    if (typeof gtag !== "undefined") {
      gtag("event", "download", {
        event_category: "settings",
        event_label: lang
      });
    }
    const code = document.getElementById("codeshot");
    const scale = 2;
    let obj = {
      height: code.offsetHeight * scale,
      style: {
        transform: `scale(${scale}) translate(${code.offsetWidth / 2 / scale}px, ${code.offsetHeight / 2 / scale}px)`
      },
      width: code.offsetWidth * scale
    };
    if (isSafari || format === "svg") {
      domtoimage.toSvg(code).then((dataUrl) => {
        downloadBlob(dataUrl, `snippetshot-${new Date().toLocaleDateString()}.svg`, true);
      });
    } else {
      domtoimage.toBlob(code, obj).then((blob) => {
        downloadBlob(blob, `snippetshot-${new Date().toLocaleDateString()}.png`);
      });
    }
  };

  const editorProps = { angle, colors, loaded, gist, mimeType, attribution, hover, setGist };
  const settingsProps = {
    getGist,
    isSafari,
    setFormat,
    format,
    attribution,
    setAttribution,
    lang,
    changeLang,
    modes,
    colors,
    setColors,
    angle,
    setAngle
  };

  return (
    <>
      <Header image={image} />

      <div className="container mx-auto mw-1/2 p-6">
        <div className="flex justify-center items-center mb-4">
          <img src="/snippet-shot.svg" alt="Snippet Shot Logo" className="w-6 h-6" />
          <img src="/snippet-shot-text.svg" alt="Snippet Shot Text Logo" className="ml-4 w-1/3 h-auto" />

          <h1 className="sr-only">Snippet Shot</h1>
        </div>
        <h2 className="text-center font-mono text-gray-600">
          Generate screenshots{" "}
          <span role="img" aria-label="camera with flash">
            📸
          </span>{" "}
          from your code snippets
        </h2>
        <div className="flex items-center justify-center pt-6" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
          <Editor {...editorProps} />
        </div>
        <div className="flex my-6 justify-center">
          <button
            className="shadow border rounded py-2 px-3 text-gray-700 leading-tight hover:shadow-lg transition-all duration-200"
            onClick={download}
          >
            Download your Snippet Shot
          </button>
        </div>
        {url.length > 0 && (
          <label className="block text-gray-600 text-sm font-bold mb-6">
            Share url: <span className="font-normal text-xs text-gray-500">(With this link you can share this exact code snippet!)</span>
            <input
              value={`https://snippetshot.com/#${url}`}
              readOnly
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onClick={(e) => e.target.select()}
              onFocus={(e) => e.target.select()}
            />
          </label>
        )}

        <Settings {...settingsProps} />

        <p className="mt-8 text-center text-gray-600 text-sm">
          A side project made by{" "}
          <a
            className="underline text-pink-500 hover:text-indigo-500 transition-colors duration-200"
            href="https://twitter.com/MarcoSlooten"
          >
            @MarcoSlooten
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
