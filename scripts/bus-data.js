
const BusDataManager = (function () {

    let busData = null;

    const loadJson = async function () {

        const jsonData = await fetch(window.location.pathname + '/data/bus.json');
        busData = await jsonData.json();
    }


    const parseDay = function (day) {

        /**
         * @type {Hour[]}
         */
        const buses = [];

        for (const bus of day) {

            if (bus.esIntervalo) {

                const beginning = bus.inicio;
                const ending = bus.fin;

                const interval = bus.intervalo;

                const current = new Hour(beginning[0], beginning[1]);
                const limit = new Hour(ending[0], ending[1]);

                while (current.isEarlier(limit)) {

                    buses.push(current.clone());
                    current.increment(interval);
                }

            }

            else {

                const hour = bus.hora;
                buses.push(new Hour(hour[0], hour[1]));
            }
        }

        return buses;
    }

    const parseDirection = function (direction) {

        const weekdays = parseDay(direction['laborales']);
        const weekend = parseDay(direction['festivos']);

        return { laborales: weekdays, festivos: weekend };
    }

    const parseRoute = function (routeName) {

        const route = busData[routeName];

        const outbound = parseDirection(route['ida']);
        const inbound = parseDirection(route['vuelta']);

        return { origen: route['ida'].origen,destino: route['vuelta'].origen, ida: outbound, vuelta: inbound };
    }


    /**
     * 
     * @param {*} data 
     * @param {*} direction 
     * @param {*} day 
     * @returns {Hour}
     */
    const getNextBus = function (data, direction, day) {

        return getNextBusFromHour(data, direction, day, Hour.Current());
    }


    /**
     * 
     * @param {Object} data 
     * @param {string} direction 
     * @param {string} day 
     * @param {Hour} hour 
     */
    const getNextBusFromHour = function (data, direction, day, hour) {

        for (const bus of data[direction][day]) {

            if(hour.isEarlier(bus)) return bus;
        }

        return null;
    }


    const theOneBefore = function(data, direction, day, hour){

        const idx = data[direction][day].indexOf(hour);
        return data[direction][day][idx - 1];
    }

    const theOneAfter = function(data, direction, day, hour){

        const idx = data[direction][day].indexOf(hour);

        return data[direction][day][idx + 1];
    }

    return { loadJson, parseRoute, getNextBus, getNextBusFromHour, theOneBefore, theOneAfter };
})();

class Hour {

    constructor(hour, minutes) {

        this.hour = hour;
        this.minutes = minutes;
    }

    increment(minutes) {

        this.minutes += minutes;

        if (this.minutes > 60) {

            this.minutes -= 60;
            this.hour++;
        }

        return this;
    }

    toString() {

        const hour24format = this.hour < 24 ? this.hour : this.hour - 24;

        let h = this.hour.toString();

        if (hour24format < 10) h = '0' + h;

        let m = this.minutes;

        if (this.minutes < 10) m = '0' + m;

        return `${h}:${m}`;
    }

    /**
     * @param {Hour} other 
     * @returns {boolean}
     */
    isEarlier(other) {

        if (this.hour > other.hour) return false;
        if (this.hour < other.hour) return true;

        if (this.minutes > other.minutes) return false;

        return true;
    }

    clone() {

        return new Hour(this.hour, this.minutes);
    }

    static Current() {

        const now = new Date();
        return new Hour(now.getHours(), now.getMinutes());
    }
}


export { BusDataManager, Hour };