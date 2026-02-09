const { cmd } = require('../inconnuboy')
const { downloadContentFromMessage } = require('@whiskeysockets/baileys')

cmd({
    pattern: "vv",
    alias: ["viewonce", "view", "open"],
    react: "🥺",
    desc: "Retrieve view-once media (Owner only)",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, isCreator, reply }) => {
    try {
        if (!isCreator)
            return reply("*YEH COMMAND SIRF BOT OWNER KE LIYE HAI 😎*")

        if (!m.quoted)
            return reply("*🥺 View Once media ko reply karo phir `.vv` likho*")

        let quoted = m.quoted
        let msg = quoted.message

        // 🔥 unwrap viewOnce
        if (msg?.viewOnceMessageV2) {
            msg = msg.viewOnceMessageV2.message
        } else if (msg?.viewOnceMessage) {
            msg = msg.viewOnceMessage.message
        } else if (msg?.viewOnceMessageV2Extension) {
            msg = msg.viewOnceMessageV2Extension.message
        }

        const type = Object.keys(msg)[0]
        const media = msg[type]

        // ✅ real download
        const stream = await downloadContentFromMessage(media, type.replace('Message', ''))
        let buffer = Buffer.from([])

        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }

        if (type === 'imageMessage') {
            await conn.sendMessage(from, { image: buffer, caption: "✅ View Once Opened" }, { quoted: mek })
        } 
        else if (type === 'videoMessage') {
            await conn.sendMessage(from, { video: buffer, caption: "✅ View Once Opened" }, { quoted: mek })
        } 
        else if (type === 'audioMessage') {
            await conn.sendMessage(from, { audio: buffer, mimetype: 'audio/mp4' }, { quoted: mek })
        } 
        else {
            reply("*❌ Unsupported View Once type*")
        }

    } catch (e) {
        console.log("VV ERROR:", e)
        reply("*❌ Error opening View Once*")
    }
})
