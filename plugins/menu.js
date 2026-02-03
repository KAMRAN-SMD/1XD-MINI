const { cmd } = require('../inconnuboy');
const config = require('../config');
const os = require('os');
const process = require('process');

cmd({
  pattern: "menu",
  alias: ["help", "m", "list"],
  react: "👑",
  category: "menu",
  desc: "Show full stylish menu",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const sender = m.sender || 'unknown@s.whatsapp.net';

    const prefix = config.PREFIX || ".";
    const mode = config.WORK_TYPE?.toUpperCase() || "PUBLIC";

    // Uptime
    const uptime = () => {
      let sec = process.uptime();
      let h = Math.floor(sec / 3600);
      let mns = Math.floor((sec % 3600) / 60);
      let s = Math.floor(sec % 60);
      return `${h}H ${mns}M ${s}S`;
    };

    // Ping
    const start = Date.now();
    await conn.sendPresenceUpdate('composing', from);
    const ping = Date.now() - start;

    const customMenu = `
╔══════════════════════╗
        👑 *DR-MD BOT MENU* 👑
╚══════════════════════╝

👤 *User*   : @${sender.split("@")[0]}
⚙️ *Prefix* : ${prefix}
🌐 *Mode*   : ${mode}
⏳ *Uptime* : ${uptime()}
📡 *Ping*   : ${ping} ms

──────────────────────

╔═══〔 👑 OWNER / SETTINGS 👑 〕═══╗
║ ➤ setprefix
║ ➤ mode
║ ➤ autorecording
║ ➤ autotyping
║ ➤ autovoice
║ ➤ autoread
║ ➤ autoviewsview
║ ➤ autolikestatus
║ ➤ mentionreply
║ ➤ welcome
║ ➤ goodbye
║ ➤ anticall
║ ➤ autobio
║ ➤ block
║ ➤ unblock
╚════════════════════════╝

╔═══〔 👥 GROUP COMMANDS 👥 〕═══╗
║ ➤ tagall
║ ➤ online
║ ➤ kick
║ ➤ kickall
║ ➤ add
║ ➤ promote
║ ➤ demote
╚════════════════════════╝

╔═══〔 ⬇️ DOWNLOAD MENU ⬇️ 〕═══╗
║ ➤ video
║ ➤ tiktok
║ ➤ fb
║ ➤ play
║ ➤ song
╚════════════════════════╝

╔═══〔 🤖 AI COMMANDS 🤖 〕═══╗
║ ➤ gpt
║ ➤ imagine
╚════════════════════════╝

╔═══〔 ✨ EXTRA TOOLS ✨ 〕═══╗
║ ➤ trt
║ ➤ attp
║ ➤ ss
║ ➤ tts
║ ➤ img
╚════════════════════════╝

──────────────────────
🔗 *Developer*  
https://minidr-7100b4161de8.herokuapp.com/

📢 *Support Channel*  
https://whatsapp.com/channel/0029VbAhxYY90x2vgwhXJV3O

👥 *Support Group*  
https://chat.whatsapp.com/HiOa8f0G7yHHGjZBUv4iA6?mode=gi_t

👑 *DR-MD WhatsApp Bot*
`;

    await conn.sendMessage(from, {
      image: { url: config.IMAGE_PATH || 'https://files.catbox.moe/g6odib.jpg' },
      caption: customMenu,
      contextInfo: { mentionedJid: [sender] }
    }, { quoted: m });

  } catch (err) {
    console.log("MENU ERROR:", err);
    reply("❌ Error aa gaya");
  }
});
