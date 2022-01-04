/**
 * vite plugin
 */

import legacy from '@vitejs/plugin-legacy';
import reactRefresh from '@vitejs/plugin-react-refresh';
import type { Plugin } from 'vite';
import viteCompression from 'vite-plugin-compression';

import {
  VITE_APP_ANALYZE,
  VITE_APP_COMPRESS_GZIP,
  VITE_APP_COMPRESS_GZIP_DELETE_FILE,
  VITE_APP_LEGACY,
  VITE_APP_MOCK,
} from '../../constant';
import configMockPlugin from './mock';
import configVisualizerPlugin from './visualizer';

//===============================================================================
function randomString(length) {
  const code = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
  let result = '';
  for (let index = 0; index < length; index++) {
    result += code[Math.floor(Math.random() * code.length)];
  }
  return result;
}
function isString(text) {
  try {
    return typeof eval(text) === 'string';
  } catch (err) {
    return false;
  }
}
const requireRegex = /_{0,2}require\s*\(\s*(["'].*["'])\s*\)/g;
const IMPORT_STRING_PREFIX = '__require_for_vite';
function transformRequire(code, id) {
  const requireMatches = code.matchAll(requireRegex);
  let importsString = '';
  let packageName = '';
  let replaced = false;
  for (let item of requireMatches) {
    if (!isString(item[1])) {
      console.warn(`Not supported dynamic import, file:${id}`);
      continue;
    }
    replaced = true;
    packageName = `${IMPORT_STRING_PREFIX}_${randomString(6)}`;
    importsString += `import * as ${packageName} from ${item[1]};\n`;
    code = code.replace(item[0], `${packageName}.default || ${packageName}`);
  }
  if (replaced) {
    code = importsString + code;
  }
  code = code.replace('module.exports =', 'export default');
  return code;
}
//==============================================================

export function createVitePlugins(viteEnv: string, isBuild: boolean) {
  const vitePlugins: (Plugin | Plugin[])[] = [
    // have to
    reactRefresh(),
  ];

  // @vitejs/plugin-legacy
  VITE_APP_LEGACY && isBuild && vitePlugins.push(legacy());

  // vite-plugin-mock
  VITE_APP_MOCK && vitePlugins.push(configMockPlugin(isBuild));

  // vite-plugin-style-import
  // vitePlugins.push(configStyleImportPlugin(isBuild));

  // rollup-plugin-visualizer
  VITE_APP_ANALYZE && vitePlugins.push(configVisualizerPlugin());

  //vite-plugin-theme
  // vitePlugins.push(configThemePlugin(isBuild));

  //=======================
  vitePlugins.push({
    name: 'originjs:commonjs',
    apply: 'serve',
    transform(code, id) {
      let result = code;
      //console.log('ggggggggggggggg,',id);
      if (/antd\/lib\/button\/style/.test(id)) {
        result = transformRequire(code, id);
      }
      return {
        code: result,
        map: null,
        warnings: null,
      };
    },
  });
  //=================

  // The following plugins only work in the production environment
  if (isBuild) {
    // rollup-plugin-gzip
    VITE_APP_COMPRESS_GZIP &&
      vitePlugins.push(
        viteCompression({ deleteOriginFile: VITE_APP_COMPRESS_GZIP_DELETE_FILE }),
      );
  }

  return vitePlugins;
}
