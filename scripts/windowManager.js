import { BusDataManager } from "./read-bus-data.js";

const WindowManager = (function () {

    const IS_LOCAL = window.location.hostname === 'localhost'

    const DOM_current = document.querySelector('#current-bus');
    const DOM_previous = document.querySelector('#previous-bus');
    const DOM_next = document.querySelector('#next-bus');
    const DOM_nextnext = document.querySelector('#nextnext-bus');

    const DOM_origin = document.querySelector('#originLabel');
    const DOM_destination = document.querySelector('#destinationLabel');


    const DOM_saturdays = document.querySelector('#saturday-label');



    const loadRoute = function () {

        if (!BusDataManager.isDataInitialised()) return;

        const route = document.querySelector('input[name="route"]:checked').value;
        const direction = document.querySelector('input[name="origin"]:checked').value;
        const day = document.querySelector('input[name="day"]:checked').value;

        const data = BusDataManager.parseRoute(route);

        updatePath(route);


        if (BusDataManager.hasSaturday(data, direction)) {

            DOM_saturdays.classList.remove('hidden');
        }
        else {

            if (day === 'sabados') {

                document.querySelector('#festivos').checked = true;
                return loadRoute();
            }

            DOM_saturdays.classList.add('hidden');
        }


        const current = BusDataManager.getNextBus(data, direction, day);
        const previous = BusDataManager.theOneBefore(data, direction, day, current);
        const next = BusDataManager.theOneAfter(data, direction, day, current);
        const nextnext = BusDataManager.theOneAfter(data, direction, day, next);

        DOM_current.textContent = current ? current.toString() : "";
        DOM_previous.textContent = previous ? previous.toString() : "";

        DOM_next.textContent = next ? next.toString() : "";
        DOM_nextnext.textContent = nextnext ? nextnext?.toString() : "";

        DOM_origin.textContent = data.origen;
        DOM_destination.textContent = data.destino;

    }


    document.querySelectorAll('input[type="radio"]').forEach(radio => {

        radio.addEventListener('change', () => {

            loadRoute();
        }
        );
    });


    const updatePath = function (route) {

        if(IS_LOCAL) return;

        window.history.pushState({}, '', route);
    }

    window.addEventListener('DOMContentLoaded', ()=>{

        if(IS_LOCAL) return;

        const path = sessionStorage.getItem('redirectPath');

        if(path){

            const route = path.split('/').pop();

            console.log(route);

            //document.querySelector(route).checked = true;
        }
    });


    window.addEventListener('popstate', () => {

        if(IS_LOCAL) return;

        const path = window.location.pathname;
        const route = path.split('/').pop(); // 'l1', 'l2', etc.

        updatePath(route);
    });

    return { loadRoute, updatePath };
})();

export { WindowManager }