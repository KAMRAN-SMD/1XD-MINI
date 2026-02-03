const config = require('../config');

function getRandomEmoji() {
    const list = String(config.CUSTOM_REACT_EMOJIS).split(',');
    return list[Math.floor(Math.random() * list.length)].trim();
}

async function autoReact(conn, m, isOwner) {
    try {
        if (!m?.key?.remoteJid) return;

        // OWNER REACT
        if (String(config.OWNER_REACT) === 'true' && isOwner) {
            await conn.sendMessage(m.key.remoteJid, {
                react: {
                    text: config.OWNER_REACT_EMOJI || '👑',
                    key: m.key
                }
            });
            return;
        }

        // CUSTOM REACT
        if (String(config.CUSTOM_REACT) === 'true') {
            await conn.sendMessage(m.key.remoteJid, {
                react: {
                    text: getRandomEmoji(),
                    key: m.key
                }
            });
        }

    } catch (e) {}
}

module.exports = { autoReact };
