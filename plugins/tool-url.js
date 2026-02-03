const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { cmd } = require("../inconnuboy");

cmd({
    pattern: "tourl",
    alias: ["imgtourl", "imgurl", "url", "geturl", "upload"],
    react: "🖇️",
    desc: "Upload replied media to Catbox and get URL",
    category: "utility",
    use: ".tourl (reply to media)",
    filename: __filename
}, async (client, message, args, { reply }) => {
    try {
        // ================= MD QUOTED FIX =================
        const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quoted) {
            return reply("❌ Reply to an image, video, audio, or document file");
        }

        const type = Object.keys(quoted)[0];
        const mimeType = quoted[type]?.mimetype || "";

        if (!mimeType) {
            return reply("❌ Invalid media. Please reply properly.");
        }

        // ============== DOWNLOAD MEDIA (MD WAY) ============
        const buffer = await client.downloadMediaMessage({ message: quoted });

        // ============== TEMP FILE ===========================
        const ext = mimeType.split("/")[1]?.split(";")[0] || "bin";
        const tempPath = path.join(os.tmpdir(), `catbox_${Date.now()}.${ext}`);
        fs.writeFileSync(tempPath, buffer);

        // ============== CATBOX UPLOAD =======================
        const form = new FormData();
        form.append("reqtype", "fileupload");
        form.append("fileToUpload", fs.createReadStream(tempPath));

        const res = await axios.post("https://catbox.moe/user/api.php", form, {
            headers: form.getHeaders()
        });

        fs.unlinkSync(tempPath);

        if (!res.data || !res.data.startsWith("https")) {
            return reply("❌ Upload failed. Try again.");
        }

        // ============== SUCCESS MESSAGE =====================
        const size = formatBytes(buffer.length);

        await reply(
`*✅ Media Uploaded to Catbox*

*Type:* ${type}
*Size:* ${size}

*URL:* ${res.data}

> © Uploaded by DR-MD-MINI 💜`
        );

    } catch (err) {
        console.error(err);
        reply(`❌ Error: ${err.message || err}`);
    }
});

// ============== HELPER =====================
function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
          }
