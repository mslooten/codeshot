import React from 'react';
import Select from 'react-select';

import selectModes from '../data/selectModes';
import ColorPicker from './ColorPicker';

const Settings = (props) => {
  const { getGist, isSafari, setFormat, format, attribution, setAttribution, lang, changeLang, colors, setColors, angle, setAngle } = props;

  return (
    <>
      <div className="mb-4 grid grid-cols-5 gap-4">
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
        <label className="text-gray-600 text-sm font-bold block">
          Font:
          <div className="block relative w-full mb-4">
            <div className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline font-mono font-normal text-gray-700">
              MonoLisa{" "}
              <a
                className="text-xs text-gray-500 hover:underline hover:text-pink-500 transition-colors duration-300"
                href={process.env.AFF}
              >
                (buy here)
              </a>
            </div>
          </div>
        </label>

        <label className="text-gray-600 text-sm font-bold block">
          File format:
          {isSafari && <p className="font-normal text-gray-500 text-xs">Unfortunately, at the moment Safari only gets SVG export</p>}
          {!isSafari && (
            <div className="block relative w-full mb-4">
              <select
                onChange={(e) => setFormat(e.target.value)}
                value={format}
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="png">PNG</option>
                <option value="svg">SVG</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          )}
        </label>
        <label className="block text-gray-600 text-sm font-bold mb-2">
          Attribution
          <input
            type="text"
            value={attribution}
            onChange={(e) => setAttribution(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </label>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {/* <label className="text-gray-600 text-sm font-bold block"> */}

        <label className="block text-gray-600 text-sm font-bold">
          Language:
          <Select
            onChange={changeLang}
            value={{ value: lang, label: lang }}
            options={selectModes}
            classNamePrefix="select"
            menuPlacement="auto"
          />
        </label>
        <label className="text-gray-600 text-sm font-bold block col-span-3">
          Select gradient colors:
          <br />
          <ColorPicker colors={colors} setColors={setColors} />
        </label>
        <label className="text-gray-600 text-sm font-bold block whitespace-no-wrap">
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
    </>
  );
};

export default Settings;
