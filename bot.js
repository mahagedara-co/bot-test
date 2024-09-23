const { default: makeWASocket, useSingleFileAuthState } = require('@adiwajshing/baileys');
const express = require('express');
const qrcode = require('qrcode');
const { unlinkSync } = require('fs');

// WhatsApp authentication setup
const { state, saveState } = useSingleFileAuthState('./auth_info.json');

// Express app to serve the QR code
const app = express();
let qrCodeData = ''; // Store QR code

// Function to start the WhatsApp bot
const startBot = async () => {
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
    });

    // Event listener to capture and serve the QR code
    sock.ev.on('connection.update', async (update) => {
        const { connection, qr } = update;
        if (qr) {
            console.log('New QR code generated');
            qrCodeData = await qrcode.toDataURL(qr);
        }
        if (connection === 'open') {
            console.log('Connected to WhatsApp!');
            qrCodeData = ''; // Clear QR code after successful login
        }
    });

    // Automatically save the authentication state when it changes
    sock.ev.on('creds.update', saveState);

    // Respond to all messages with "Hello"
    sock.ev.on('messages.upsert', (m) => {
        const msg = m.messages[0];
        if (!msg.key.fromMe) {
            sock.sendMessage(msg.key.remoteJid, { text: 'Hello!' });
        }
    });
};

// Start the WhatsApp bot
startBot();

// Web server to show the QR code
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
        res.send('<h1>Bot is connected, no QR code available.</h1>');
    }
});

// Start the web server
app.listen(3000, () => {
    console.log('Web server running on http://localhost:3000');
});
