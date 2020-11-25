try {
    require('./config/config');
} catch (e) {}


const { Domusa } = require('./classes/domusa');

const dm = new Domusa();

const CFG_USER = process.env.CFG_USER || "MyDomoUser";
const CFG_PASS = process.env.CFG_PASS || "MyDomoPassword";

test();

async function test() {
    if (await dm.login(CFG_USER, CFG_PASS) == true) {
        const td = await dm.thermostatsData();
        console.log(td);
        const bs = await dm.boilerStatus();
        console.log(bs);
        const tp = await dm.thermostatsProgram();
        console.log(tp);
        const res = await dm.historicalData(20201124);
        console.log(res);
    } else {
        console.log("Error en login");
    }
}