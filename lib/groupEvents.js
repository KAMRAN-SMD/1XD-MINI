const config = require('../config');

async function groupEvents(conn, update) {
    const isWelcomeEnabled = String(config.WELCOME_ENABLE) === 'true';
    const isGoodbyeEnabled = String(config.GOODBYE_ENABLE) === 'true';

    if (!isWelcomeEnabled && !isGoodbyeEnabled) return;

    try {
        const metadata = await conn.groupMetadata(update.id);
        const groupName = metadata.subject;

        for (const participantJid of update.participants) {
            const number = participantJid.split('@')[0];
            const mentionTag = `@${number}`;

            // ===== Fetch DP =====
            let dpUrl;
            try {
                dpUrl = await conn.profilePictureUrl(participantJid, 'image');
            } catch {
                dpUrl = 'https://i.ibb.co/6BRfQqM/no-dp.png'; // fallback
            }

            // ================= WELCOME =================
            if ((update.action === 'add' || update.action === 'invite') && isWelcomeEnabled) {

                const defaultWelcomeMsg = `*╭─「 WELCOME TO THE CREW 」─◇*
*│* 🌟 New member arrived!
*│* 👋 Hello: @user
*│* 🏰 Group: @group
*│* 📰 Channel: @channel
*│* 📝 Please read rules in description.
*╰────────────────────○*`;

                const text = (config.WELCOME_MSG || defaultWelcomeMsg)
                    .replace(/@user/g, mentionTag)
                    .replace(/@group/g, groupName)
                    .replace(/@channel/g, '120363418144382782@newsletter');

                await conn.sendMessage(update.id, {
                    image: { url: dpUrl },
                    caption: text,
                    mentions: [participantJid, '120363418144382782@newsletter']
                });
            }

            // ================= GOODBYE =================
            if (update.action === 'remove' && isGoodbyeEnabled) {

                const defaultGoodbyeMsg = `*╭─「 FAREWELL LEGEND 」─◇*
*│* 😔 Member left the chat
*│* 👤 Bye: @user
*│* 📰 Channel: @channel
*╰────────────────────○*`;

                const text = (config.GOODBYE_MSG || defaultGoodbyeMsg)
                    .replace(/@user/g, mentionTag)
                    .replace(/@group/g, groupName)
                    .replace(/@channel/g, '120363418144382782@newsletter');

                await conn.sendMessage(update.id, {
                    image: { url: dpUrl },
                    caption: text,
                    mentions: [participantJid, '120363418144382782@newsletter']
                });
            }
        }

    } catch (err) {
        console.log("GroupEvents Error:", err);
    }
}

module.exports = { groupEvents };
