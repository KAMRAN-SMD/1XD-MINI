const config = require('../config');

/**
 * Group Welcome / Goodbye Handler
 */
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

            // ================= WELCOME =================
            if (update.action === 'add' && isWelcomeEnabled) {

                const defaultWelcomeMsg = `*╭─「 WELCOME TO THE CREW 」─◇*
*│* 🌟 New member arrived!
*│* 👋 Hello: @user
*│* 🏰 Group: @group
*│* 📝 Please read rules in description.
*╰────────────────────○*`;

                const text = (config.WELCOME_MSG || defaultWelcomeMsg)
                    .replace(/@user/g, mentionTag)
                    .replace(/@group/g, groupName);

                if (config.WELCOME_IMAGE && config.WELCOME_IMAGE.length > 5) {
                    await conn.sendMessage(update.id, {
                        image: { url: config.WELCOME_IMAGE },
                        caption: text,
                        mentions: [participantJid]
                    });
                } else {
                    await conn.sendMessage(update.id, {
                        text: text,
                        mentions: [participantJid]
                    });
                }
            }

            // ================= GOODBYE =================
            if (update.action === 'remove' && isGoodbyeEnabled) {

                const defaultGoodbyeMsg = `*╭─「 FAREWELL LEGEND 」─◇*
*│* 😔 Member left the chat
*│* 👤 Bye: @user
*│* 📢 Hope to see you again!
*╰────────────────────○*`;

                const text = (config.GOODBYE_MSG || defaultGoodbyeMsg)
                    .replace(/@user/g, mentionTag)
                    .replace(/@group/g, groupName);

                if (config.GOODBYE_IMAGE && config.GOODBYE_IMAGE.length > 5) {
                    await conn.sendMessage(update.id, {
                        image: { url: config.GOODBYE_IMAGE },
                        caption: text,
                        mentions: [participantJid]
                    });
                } else {
                    await conn.sendMessage(update.id, {
                        text: text,
                        mentions: [participantJid]
                    });
                }
            }
        }

    } catch (err) {
        console.log("Welcome/Goodbye Error:", err);
    }
}

module.exports = { groupEvents };
