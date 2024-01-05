const express = require('express');
const path = require('path');
const app = express();
const axios = require("axios");
const WebSocket = require('ws');

// Маршрут для отображения карты
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера на порте 3000
app.listen(3000, () => {
    console.log('Сервер запущен на порте 3000!');
});

const wss = new WebSocket.Server({ port: 1820 }); // Порт вашего сервера

// Установка директории с файлами стилей и скриптов Leaflet
app.use(express.static(path.join(__dirname, 'node_modules/leaflet/dist')));
const endpoint =
    "https://us-central1-chat-for-chatgpt.cloudfunctions.net/basicUserRequestBeta";


wss.on('connection', function connection(ws) {
    ws.on('message',async function incoming(message) {
        const instructionText = message;

        try {
            const response = await axios.post(
                endpoint,
                {
                    data: {
                        message:
                            'В навигаторе инструкция "' +
                            instructionText +
                            '" Преподнесите эту инструкцию с юмором и интересом, но так же кратко, если вы ИИ помощник по  имени 42, созданный Максимом. НАПИШИТЕ ТОЛЬКО ПЕРЕДЕЛАННУЮ ИНСТРУКЦИЮ ТАК ЖЕ КРАТКО, КАК И ОРИГИНАЛЬНАЯ И ТАКОЙ ЖЕ ИНФОРМАТИВНОЙ',
                    },
                },
                {
                    headers: {
                        Host: 'us-central1-chat-for-chatgpt.cloudfunctions.net',
                        Connection: 'keep-alive',
                        Accept: '*/*',
                        'User-Agent': 'com.tappz.aichat/1.2.2 iPhone/16.3.1 hw/iPhone12_5',
                        'Accept-Language': 'en',
                        'Content-Type': 'application/json; charset=UTF-8',
                    },
                }
            );

            const result = response.data.result.choices[0].text;
            console.log(result);
            ws.send(result);
        } catch (error) {
            console.error('Ошибка:', error);
        }
    });
});
