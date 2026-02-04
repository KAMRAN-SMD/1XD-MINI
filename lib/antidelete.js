const { getAntideleteStatus } = require('../data/Antidelete');
const config = require('../config');
const { jidDecode } = require('@whiskeysockets/baileys');

// 🔥 UNIVERSAL CLEANER (LID + DEVICE + DOMAIN FIX)
const cleanId = (jid = '') => {
    if (!jid) return '';

    try {
        jid = jid.toString();

        if (jid.includes(':')) jid = jid.split(':')[0];

        const d = jidDecode(jid);
        if (d?.user) jid = d.user;

        jid = jid.replace(/@s\.whatsapp\.net/g, '')
                 .replace(/@g\.us/g, '')
                 .replace(/@lid/g, '')
                 .replace(/@newsletter/g, '')
                 .replace(/[^0-9]/g, '');

        return jid;
    } catch {
        return jid.replace(/[^0-9]/g, '');
    }
};

const handleAntidelete = async (conn, updates, store) => {
    try {
        for (const update of updates) {
            if (update.key.fromMe) continue;

            const isRevoke =
                update.update.messageStubType === 68 ||
                (update.update.message &&
                 update.update.message.protocolMessage &&
                 update.update.message.protocolMessage.type === 0);

            if (!isRevoke) continue;

            const chatId = update.key.remoteJid;
            const messageId = update.key.id;

            // 🔥 LID SAFE PARTICIPANT
            const rawParticipant = update.key.participant || chatId;
            const participantNumber = cleanId(rawParticipant);
            const mentionJid = participantNumber + '@s.whatsapp.net';

            const isEnabled = await getAntideleteStatus(chatId);
            if (!isEnabled) continue;

            if (!store || !store.messages?.[chatId]) continue;

            // 🔥 STORE LOOKUP SAFE
            const msg = await store.loadMessage(chatId, messageId);
            if (!msg) continue;

            const alertText = `
🚫 *ANTI-DELETE DETECTED* 🚫
👤 *User:* @${participantNumber}
📅 *Date:* ${new Date().toLocaleString()}
> ${config.BOT_FOOTER}
`;

            await conn.sendMessage(chatId, {
                text: alertText,
                mentions: [mentionJid]
            });

            await conn.sendMessage(
                chatId,
                { forward: msg },
                { quoted: msg }
            );
        }
    } catch (e) {
        console.error("Antidelete Error:", e);
    }
};

module.exports = { handleAntidelete };
