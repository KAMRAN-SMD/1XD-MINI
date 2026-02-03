const config = require('../config');

/**
 * Create Context Info for Newsletter + DP Card
 */
const getContextInfo = (jid, dpUrl, title, body) => {
    return {
        mentionedJid: [jid],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363403380688821@newsletter',
            newsletterName: 'ᴅʀ-ᴍᴅ-ᴍɪɴɪ',
            serverMessageId: 143,
        },
        externalAdReply: {
            title: title,
            body: body,
            thumbnailUrl: dpUrl,
            mediaType: 1,
            renderLargerThumbnail: true,
            showAdAttribution: true,
            sourceUrl: 'https://whatsapp.com/channel/0029VbAhxYY90x2vgwhXJV3O'
        }
    };
};

/**
 * Group Welcome / Goodbye Handler
 */
async function groupEvents(conn, update) {
    try {
        const metadata = await conn.groupMetadata(update.id);
        const groupName = metadata.subject;

        for (const jid of update.participants) {

            const number = jid.split('@')[0];
            const mentionTag = `@${number}`;

            // ✅ Fetch DP
            let dpUrl;
            try {
                dpUrl = await conn.profilePictureUrl(jid, 'image');
            } catch {
                dpUrl = 'https://i.ibb.co/3Fh9V6p/user.png';
            }

            // ✅ Fetch Real Name
            let userName = number;
            try {
                const contact = metadata.participants.find(p => p.id === jid);
                if (contact && contact.name) userName = contact.name;
            } catch {}

            // ================= WELCOME =================
            if (update.action === 'add' && String(config.WELCOME_ENABLE) === 'true') {

                const text = `╭───〔 *WELCOME* 〕───⬣
❀ Hey ${mentionTag}

🏷️ *Name:* ${userName}
🏰 *Group:* ${groupName}

⚠️ Please read group rules!
╰────────────────⬣`;

                await conn.sendMessage(update.id, {
                    text: text,
                    contextInfo: getContextInfo(
                        jid,
                        dpUrl,
                        userName,
                        "New Member Joined The Group"
                    )
                });
            }

            // ================= GOODBYE =================
            if (update.action === 'remove' && String(config.GOODBYE_ENABLE) === 'true') {

                const text = `╭───〔 *GOODBYE* 〕───⬣
😔 ${mentionTag} left the group

🏷️ *Name:* ${userName}
📢 Hope to see you again!
╰────────────────⬣`;

                await conn.sendMessage(update.id, {
                    text: text,
                    contextInfo: getContextInfo(
                        jid,
                        dpUrl,
                        userName,
                        "Member Left The Group"
                    )
                });
            }
        }

    } catch (err) {
        console.log("GroupEvents Error:", err);
    }
}

module.exports = { groupEvents };
