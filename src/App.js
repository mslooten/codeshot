import './tailwind.output.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

import domtoimage from 'dom-to-image';
import React from 'react';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { ResizableBox } from 'react-resizable';

import ColorPicker from './ColorPicker';

require("codemirror/mode/javascript/javascript");
require("codemirror/mode/htmlmixed/htmlmixed");
require("codemirror/mode/css/css");
require("react-resizable/css/styles.css");

function App() {
  const [lang, langSelect] = React.useState("javascript");
  const [gist, setGist] = React.useState("");
  const [colors, setColors] = React.useState(["rgb(129, 230, 217)", "rgb(251, 182, 206)"]);
  const [angle, setAngle] = React.useState("150");

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
      downloadBlob(blob, `codeshot-${new Date().toLocaleDateString()}`);
    });
  };

  return (
    <div className="container mx-auto mw-1/2 p-8">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gist">
          Github gist url
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="gist"
          type="url"
          placeholder="url"
          onChange={getGist}
        />
      </div>
      <div className="flex items-start">
        <label className="text-gray-700 text-sm font-bold block">
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
        <label className="text-gray-700 text-sm font-bold block">
          Select gradient colors:
          <br />
          <ColorPicker colors={colors} setColors={setColors} />
        </label>
        <label className="text-gray-700 text-sm font-bold block ml-4 whitespace-no-wrap">
          Gradient rotation:
          <br />
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="gist"
            type="number"
            placeholder="Gradient rotation"
            min="0"
            max="360"
            value={angle}
            onChange={(e) => setAngle(e.target.value)}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold block ml-4">
          Save image:
          <br />
          <button className="shadow border rounded py-2 px-3 text-gray-700 leading-tight" onClick={download}>
            Download
          </button>
        </label>
      </div>
      <div className="flex items-center justify-center pt-12">
        <ResizableBox width={800} height={460} minConstraints={[600, 460]} axis="x">
          <div id="codeshot">
            <div
              className="p-20"
              style={{
                background: `linear-gradient(${angle}deg, ${colors[0]}, ${colors[1]})`
              }}
            >
              <div className="overflow-hidden rounded-md shadow-xl">
                <CodeMirror
                  value={gist}
                  options={{
                    mode: lang,
                    theme: "material",
                    lineNumbers: false
                  }}
                />
              </div>
            </div>
          </div>
        </ResizableBox>
      </div>
      <p className="mt-8 text-center text-gray-700 text-sm">
        A side project made by{" "}
        <a className="underline text-indigo-600 hover:text-indigo-400" href="https://marcoslooten.com/">
          Marco Slooten
        </a>
      </p>
    </div>
  );
}

export default App;
