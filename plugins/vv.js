const { cmd } = require('../inconnuboy')
const { downloadContentFromMessage } = require('@whiskeysockets/baileys')

cmd({
    pattern: "vv",
    alias: ["viewonce", "view", "open"],
    react: "🥺",
    desc: "Open view-once media",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { from, isCreator, reply }) => {
    try {
        if (!isCreator)
            return reply("Owner only command 😎")

        if (!m.quoted)
            return reply("⚠️ Please reply to a view once message")

        // 🔥 IMPORTANT — use msg not message
        let quotedMsg = m.quoted.msg

        // unwrap all types of viewOnce
        if (quotedMsg?.viewOnceMessageV2)
            quotedMsg = quotedMsg.viewOnceMessageV2.message
        else if (quotedMsg?.viewOnceMessage)
            quotedMsg = quotedMsg.viewOnceMessage.message
        else if (quotedMsg?.viewOnceMessageV2Extension)
            quotedMsg = quotedMsg.viewOnceMessageV2Extension.message

        const type = Object.keys(quotedMsg)[0]

        if (!['imageMessage', 'videoMessage', 'audioMessage'].includes(type))
            return reply("⚠️ This is not a view once media")

        const media = quotedMsg[type]

        // ✅ real download
        const stream = await downloadContentFromMessage(
            media,
            type.replace('Message', '')
        )

        let buffer = Buffer.from([])
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk])
        }

        if (type === "imageMessage") {
            await conn.sendMessage(from, { image: buffer, caption: "✅ View Once Opened" }, { quoted: mek })
        } else if (type === "videoMessage") {
            await conn.sendMessage(from, { video: buffer, caption: "✅ View Once Opened" }, { quoted: mek })
        } else if (type === "audioMessage") {
            await conn.sendMessage(from, { audio: buffer, mimetype: 'audio/mp4' }, { quoted: mek })
        }

    } catch (e) {
        console.log("VV ERROR:", e)
        reply("❌ Error opening view once")
    }
})
