const axios = require('axios');
const moment = require('moment');
const qs = require('querystring');

class Domusa {
    mydomo = {
        api_root: null,
        token: null,
        user_id: null,
        wifi_box_id: null,
        thermostat_id: null,
        port: null,
        host: null,
    }
    constructor() {

    }
    async login(host, user, password) {
        this.mydomo.api_root = `http://${host}/MyDOMO/v1/api/Android`;
        try {
            const response = await axios.get(this.mydomo.api_root + `/users/login/username/${user}/password/${password}/odm_code/190`);
            if (response.data.status == true) {
                this.mydomo.token = response.data.message.user.token;
                this.mydomo.user_id = response.data.message.user.id;
                this.mydomo.wifi_box_id = response.data.message.wifi_boxes[0].id;
                this.mydomo.thermostat_id = response.data.message.wifi_boxes[0].thermostats[0].id;
                this.mydomo.port = response.data.message.wifi_boxes[0].port;
                this.mydomo.host = response.data.message.wifi_boxes[0].host;
                console.log(this.mydomo);
                await this.bindClientUser();
                return true;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }
    async bindClientUser() {
        try {
            const data = { token: this.mydomo.token, user_id: this.mydomo.user_id, client_id: null };
            const response = await axios.put(this.mydomo.api_root + `/users/bind_client_user`, qs.stringify(data));
            if (response.data.status == true) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }
    async thermostatsData() {
        try {
            const response = await axios.get(this.mydomo.api_root + `/thermostats/data/user_id/${this.mydomo.user_id}/token/${this.mydomo.token}/wifi_box_id/${this.mydomo.wifi_box_id}/thermostat_id/${this.mydomo.thermostat_id}/port/${this.mydomo.port}/host/${this.mydomo.host}`);
            if (response.data.status == true) {
                return response.data.message;
            } else {
                return false;
            }
        } catch (err) {
            //console.log(err);
            return false;
        }
    }
    async boilerStatus() {
        try {
            const response = await axios.get(this.mydomo.api_root + `/boilers/data/user_id/${this.mydomo.user_id}/token/${this.mydomo.token}/wifi_box_id/${this.mydomo.wifi_box_id}/port/${this.mydomo.port}/host/${this.mydomo.host}`);
            if (response.data.status == true) {
                return response.data.message;
            } else {
                return false;
            }
        } catch (err) {
            //console.log(err);
            return false;
        }
    }
    async historicalData(date) {
        const d = moment(date, "YYYYMMDD");
        console.log(d.isValid());
        if (d.isValid() == true) {
            const from = d.format('YYYY-MM-DD') + ' 00:00:00';
            const to = d.add(1, 'days').format('YYYY-MM-DD') + ' 00:00:00';
            try {
                const response = await axios.get(this.mydomo.api_root + `/thermostats/heating_history/user_id/${this.mydomo.user_id}/token/${this.mydomo.token}/wifi_box_id/${this.mydomo.wifi_box_id}/thermostat_id/${this.mydomo.thermostat_id}/start_time/${from}/end_time/${to}/port/${this.mydomo.port}/host/${this.mydomo.host}`);
                if (response.data.status == true) {
                    return response.data.message;
                } else {
                    return false;
                }
            } catch (err) {
                return false;
            }
        } else {
            return false;
        }
    }
    async thermostatsProgram() {
        try {
            const response = await axios.get(this.mydomo.api_root + `/thermostats/program/user_id/${this.mydomo.user_id}/token/${this.mydomo.token}/wifi_box_id/${this.mydomo.wifi_box_id}/thermostat_id/${this.mydomo.thermostat_id}/day/6/port/${this.mydomo.port}/host/${this.mydomo.host}`);
            if (response.data.status == true) {
                return response.data.message;
            } else {
                return false;
            }
        } catch (err) {
            //console.log(err);
            return false;
        }
    }
    async setTemperatureMode(mode) {
        //mode values
        // 0 - Off
        // 1 - Program
        // 2 - Manual
        try {
            const data = {
                port: this.mydomo.port,
                host: this.mydomo.host,
                wifi_box_id: this.mydomo.wifi_box_id,
                token: this.mydomo.token,
                user_id: this.mydomo.user_id,
                thermostat_id: this.mydomo.thermostat_id,
                mode: mode
            };
            const response = await axios.put(this.mydomo.api_root + `/thermostats/mode`, qs.stringify(data));
            if (response.data.status == true) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }
    async setTemperatureValue(value) {
        try {
            const data = {
                port: this.mydomo.port,
                host: this.mydomo.host,
                wifi_box_id: this.mydomo.wifi_box_id,
                token: this.mydomo.token,
                user_id: this.mydomo.user_id,
                thermostat_id: this.mydomo.thermostat_id,
                temp_mode: -1,
                temperature: value
            };
            const response = await axios.put(this.mydomo.api_root + `/thermostats/temperature`, qs.stringify(data));
            if (response.data.status == true) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    }
}

module.exports = {
    Domusa
}