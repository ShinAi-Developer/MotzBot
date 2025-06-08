const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const sharp = require("sharp");
const log = require("./../../core/logger/logger");
const { extractImageMessage } = require("./../../core/utils");
const { botLabel } = require("./../../core/utils");

module.exports = async function fromImageToSticker(context) {
	const { sock, sender, msg, text } = context;
	const { imageMsg, msgKey } = extractImageMessage(msg, sender);
	if (!imageMsg || !msgKey) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					"Reply atau kirim gambar yang akan dijadikan stiker"
				)
			},
			{ quoted: msg }
		);
		return;
	}
	try {
		const buffer = await downloadMediaMessage(
			{ key: msgKey, message: { imageMessage: imageMsg } },
			"buffer",
			{},
			{ logger: console }
		);
		const stickerBuffer = await sharp(buffer)
			.resize(512, 512, {
				fit: "contain",
				background: { r: 0, g: 0, b: 0, alpha: 0 }
			})
			.webp({ quality: 100, effort: 3 })
			.toBuffer();
		await sock.sendMessage(
			sender,
			{
				sticker: stickerBuffer
			},
			{ quoted: msg }
		);
	} catch (err) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					`Tidak bisa mengkonversi gambar. Coba gunakan gambar yang lain atau coba lapor ke admin bot`
				)
			},
			{ quoted: msg }
		);
		log.error(err);
	}
};
