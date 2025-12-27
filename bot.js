const wppconnect = require('@wppconnect-team/wppconnect');
const axios = require('axios');

// These will be set in Render Environment Variables
const SUPABASE_URL = process.env.SUPABASE_FUNCTION_URL;
const AUTH_TOKEN = process.env.SUPABASE_ANON_KEY;
const TARGET_GROUP_NAME = "Reservas Chalé"; // Change to your group name

wppconnect.create({
  session: 'reservation-session',
  catchQR: (base64Qr, asciiQR) => {
    console.log(asciiQR); // This prints the QR code in Render's logs!
  },
  puppeteerOptions: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'] // Required for Render/Docker
  }
}).then((client) => {
  console.log('Bot is online and listening...');

  client.onMessage(async (message) => {
    // Only process messages from the specific group
    if (message.isGroupMsg && message.chatId.includes('YOUR_GROUP_ID')) {
      console.log(`Message received: ${message.body}`);

      try {
        // Forward to the "Brain" (Supabase)
        await axios.post(SUPABASE_URL, {
          text: message.body,
          sender: message.sender.pushname || "Employee",
        }, {
          headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` }
        });
        
        await client.react(message.id, '✅'); 
      } catch (err) {
        console.error('Failed to send to Supabase:', err.message);
      }
    }
  });
});
