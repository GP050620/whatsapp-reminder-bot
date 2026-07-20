const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const cron = require('node-cron');
const fs = require('fs');


const client = new Client({

    authStrategy: new LocalAuth({
        clientId: 'personal-bot'
    }),

    puppeteer: {
        headless: false
    }

});


function cargarRecordatorios(){

    const data = fs.readFileSync(
        './reminders.json',
        'utf8'
    );

    return JSON.parse(data);

}


client.on('qr', qr => {

    qrcode.generate(qr,{
        small:true
    });

});


client.on('authenticated',()=>{

    console.log('✅ Sesión autenticada');

});


client.on('ready',()=>{

    console.log('🚀 Bot conectado');


    cron.schedule('* * * * *', async ()=>{


        const ahora = new Date();

        const horaActual =
            ahora.toTimeString()
            .substring(0,5);


        const reminders = cargarRecordatorios();


        for(const reminder of reminders){


            if(reminder.time === horaActual){


                try{


                    await client.sendMessage(

                        reminder.chatId,

                        reminder.message

                    );


                    console.log(
                        `✅ Mensaje enviado a ${reminder.chatId}`
                    );


                }
                catch(error){


                    console.error(
                        '❌ Error enviando mensaje:',
                        error
                    );


                }

            }


        }


    });


});


client.initialize();