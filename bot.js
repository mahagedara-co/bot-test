const Balveis = require('balveis-sonline');
const express = require('express');
const qrcode = require('qrcode');
const path = require('path');

const app = express();
let qrCodeData = ''; // Store QR code

const bot = new Balveis.Client();

// Generate QR code when prompted
bot.on('qr', (qr) => {
    console.log('QR Code generated, displaying on the web page...');
    qrcode.toDataURL(qr, (err, url) => {
        if (err) throw err;
        qrCodeData = url; // Store the QR code data as a base64 image
    });
});

// WhatsApp bot ready
bot.on('ready', () => {
    console.log('Bot is ready and connected to WhatsApp!');
});

// Respond with 'Hello' to every message
bot.on('message', (msg) => {
    bot.sendMessage(msg.from, 'Hello!');
});

// Serve a webpage to show the QR code for scanning
app.get('/', (req, res) => {
    if (qrCodeData) {
        res.send(`
            <html>
                <body>
                    <h1>Scan the WhatsApp QR code</h1>
                    <img src="${qrCodeData}" alt="QR Code">
                </body>
            </html>
        `);
    } else {
        res.send(`
            <html>
                <body>
                    <h1>Waiting for QR code...</h1>
                </body>
            </html>
        `);
    }
});

// Static files serving
app.use(express.static(path.join(__dirname, 'public')));

// Start the bot and web server
(async () => {
    await bot.initialize(); // Initialize the bot
    console.log('WhatsApp bot initialized successfully.');
    
    // Start the web server on port 3000
    app.listen(3000, () => {
        console.log('Web server running on http://localhost:3000');
    });
})();
