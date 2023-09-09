require('dotenv').config()
const hosts = require('./config/hosts');
const { Server, mail } = require('./helpers');

const EMAIL_ENABLE = Boolean(process.env.SMTP_ENABLE) || false;
const TIME_INTERVAL = process.env.TIME_INTERVAL || 60000;


async function main() {
    let msg = ''
    for(const host of hosts){
        const server = new Server(host);
        const status = await server.status()
        if(!status){
            console.log(`Status: ${status}, restart service at host: ${server.name}`);
            server.restartService()
            msg += `${server.name} \n`
        }
    }
    if((EMAIL_ENABLE === true) && (msg!='')){
        await mail(msg);
    }
};

setInterval(main,TIME_INTERVAL);
