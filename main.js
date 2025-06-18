//https://www.crtm.es/widgets/#/line/9__1__013_

import { BusDataManager } from './scripts/read-bus-data.js'
import { WindowManager } from './scripts/windowManager.js';

await BusDataManager.loadJson();

WindowManager.loadRoute();
