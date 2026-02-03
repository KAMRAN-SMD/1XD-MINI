const config = require('../config');

async function groupEvents(conn, update) {
    const isWelcomeEnabled = String(config.WELCOME_ENABLE) === 'true';
    const isGoodbyeEnabled = String(config.GOODBYE_ENABLE) === 'true';
    if (!isWelcomeEnabled && !isGoodbyeEnabled) return;

    try {
        const metadata = await conn.groupMetadata(update.id);
        const groupName = metadata.subject;
        const membersCount = metadata.participants.length;

        for (const jid of update.participants) {

            // ===== USER NAME + DP =====
            let userName;
            try {
                userName = await conn.getName(jid);
            } catch {
                userName = jid.split('@')[0];
            }

            let dpUrl;
            try {
                dpUrl = await conn.profilePictureUrl(jid, 'image');
            } catch {
                dpUrl = 'https://i.ibb.co/6BRfQqM/no-dp.png';
            }

            const mention = `@${jid.split('@')[0]}`;

            // ================= WELCOME =================
            if ((update.action === 'add' || update.action === 'invite') && isWelcomeEnabled) {

                const text = `╭─〔 *WELCOME* 〕─◆

❖ HEY ${mention}
❖ NAME: ${userName}
❖ GROUP: ${groupName}

• Stay safe and follow rules!
• Joined: ${membersCount}

© Powered by Kamran MD`;

                await conn.sendMessage(update.id, {
                    text: text,
                    contextInfo: {
                        mentionedJid: [jid],
                        externalAdReply: {
                            title: userName,
                            body: "New Member Joined The Group",
                            thumbnailUrl: dpUrl,
                            sourceUrl: "https://whatsapp.com/channel/0029VbAhxYY90x2vgwhXJV3O",
                            mediaType: 1,
                            renderLargerThumbnail: true,
                            showAdAttribution: true
                        }
                    }
                });
            }

            // ================= GOODBYE =================
            if (update.action === 'remove' && isGoodbyeEnabled) {

                const text = `╭─〔 *GOODBYE* 〕─◆

❖ USER: ${mention}
❖ NAME: ${userName}

• Member left the group
• Members: ${membersCount}

© Powered by Kamran MD`;

                await conn.sendMessage(update.id, {
                    text: text,
                    contextInfo: {
                        mentionedJid: [jid],
                        externalAdReply: {
                            title: userName,
                            body: "Member Left The Group",
                            thumbnailUrl: dpUrl,
                            sourceUrl: "https://whatsapp.com/channel/0029VbAhxYY90x2vgwhXJV3O",
                            mediaType: 1,
                            renderLargerThumbnail: true,
                            showAdAttribution: true
                        }
                    }
                });
            }
        }

    } catch (e) {
        console.log("GroupEvents Error:", e);
    }
}

module.exports = { groupEvents };
