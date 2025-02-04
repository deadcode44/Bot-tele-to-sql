const TelegramBot = require('node-telegram-bot-api');
const mysql = require('mysql2');
const token = process.env.TELEGRAM_BOT_TOKEN;
require('dotenv').config();

// Koneksi ke database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'nama_database'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database!');
});

// Token bot Telegram
const token = 'TOKEN_BOT_ANDA'; // Ganti dengan token bot Anda
const bot = new TelegramBot(token, { polling: true });

// Daftar whitelist (ID user yang diizinkan)
const whitelist = [
    123456789, // ID user 1
    987654321  // ID user 2
];

// Perintah /start
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Selamat datang! Gunakan /users untuk melihat data pengguna.');
});

// Perintah /myid
bot.onText(/\/myid/, (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `ID Anda adalah: ${chatId}`);
});

// Perintah /users
bot.onText(/\/users/, (msg) => {
    const chatId = msg.chat.id;

    // Periksa apakah user ada dalam whitelist
    if (!whitelist.includes(chatId)) {
        bot.sendMessage(chatId, 'Maaf, Anda tidak memiliki akses untuk perintah ini.');
        return;
    }

    // Jika user diizinkan, lanjutkan dengan mengambil data dari database
    connection.query('SELECT * FROM users', (err, results) => {
        if (err) {
            bot.sendMessage(chatId, 'Terjadi kesalahan saat mengambil data.');
            console.error('Error querying database:', err);
            return;
        }

        if (results.length > 0) {
            let response = 'Daftar Pengguna:\n';
            results.forEach((user) => {
                response += `ID: ${user.id}, Nama: ${user.name}, Umur: ${user.age}\n`;
            });
            bot.sendMessage(chatId, response);
        } else {
            bot.sendMessage(chatId, 'Tidak ada data pengguna.');
        }
    });
});
