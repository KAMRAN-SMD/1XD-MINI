const { cmd } = require('../inconnuboy');

cmd({
    pattern: "demote",
    alias: ["unadmin", "depromote"],
    react: "🔽",
    desc: "Demote an admin to a regular member (LID & JID support).",
    category: "group",
    use: ".demote @user",
    filename: __filename
}, async (conn, mek, m, { from, reply, isGroup, isBotAdmins, isAdmins, isOwner }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");
        if (!isAdmins && !isOwner) return reply("❌ Only group admins or owner can use this command.");
        if (!isBotAdmins) return reply("⚠️ Make me admin first to perform this action.");

        // --- PHASE 1: IDENTIFY USER (JID OR LID) ---
        let targetUser = null;

        if (m.mentionedJid && m.mentionedJid.length > 0) {
            targetUser = m.mentionedJid[0];
        } else if (m.quoted) {
            // Priority to LID if available in quoted context
            targetUser = m.quoted.sender;
        }

        if (!targetUser) return reply("❌ Please mention or reply to an admin to demote.");

        // --- PHASE 2: ADMIN CHECK (INCLUDING LID COMPARISON) ---
        const groupMetadata = await conn.groupMetadata(from);
        const participants = groupMetadata.participants;
        
        // Find the participant to check if they are actually an admin
        const participant = participants.find(p => p.id === targetUser || (p.lid && p.lid === targetUser));

        if (!participant) {
            return reply("❌ User not found in this group.");
        }

        if (!participant.admin) {
            return reply("❌ This user is already a normal member (not an admin).");
        }

        // --- PHASE 3: EXECUTION ---
        // groupParticipantsUpdate works with both JID and LID
        await conn.groupParticipantsUpdate(from, [targetUser], "demote");

        await conn.sendMessage(from, { 
            text: `✅ User @${targetUser.split('@')[0]} has been successfully *Demoted*.\n\n*Type:* ${targetUser.includes('lid') ? 'LID Account' : 'Standard JID'}`,
            mentions: [targetUser]
        }, { quoted: mek });

        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (e) {
        console.error("Demote Error:", e);
        reply("❌ *KAMRAN-MD ERROR:* " + e.message);
    }
});
