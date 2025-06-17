//https://www.crtm.es/widgets/#/line/9__1__013_

import { BusDataManager } from './scripts/bus-data.js'

//import { BusDataManager } from "./scripts/bus-data.js"

const DOM_current = document.querySelector('#current-bus');
const DOM_previous = document.querySelector('#previous-bus');
const DOM_next = document.querySelector('#next-bus');
const DOM_nextnext = document.querySelector('#nextnext-bus');

const DOM_origin = document.querySelector('#originLabel');
const DOM_destination = document.querySelector('#destinationLabel');

await BusDataManager.loadJson();


const loadRoute = function () {

    const route = document.querySelector('input[name="route"]:checked').value;
    const direction = document.querySelector('input[name="origin"]:checked').value;
    const day = document.querySelector('input[name="day"]:checked').value;

    const data = BusDataManager.parseRoute(route);

    const current = BusDataManager.getNextBus(data, direction, day);
    const previous = BusDataManager.theOneBefore(data, direction, day, current);
    const next = BusDataManager.theOneAfter(data, direction, day, current);
    const nextnext = BusDataManager.theOneAfter(data, direction, day, next);

    DOM_current.textContent = current.toString();
    DOM_previous.textContent = previous.toString();

    DOM_next.textContent = next.toString();
    DOM_nextnext.textContent = nextnext.toString();

    DOM_origin.textContent = data.origen;
    DOM_destination.textContent = data.destino;

    console.log(DOM_origin);
}

loadRoute();




document.querySelectorAll('input[type="radio"]').forEach(radio => {

    radio.addEventListener('change', loadRoute);
});
