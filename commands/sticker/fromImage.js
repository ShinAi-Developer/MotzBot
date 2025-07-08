const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const sharp = require("sharp");
const fs = require("fs");
const { extractImageMessage } = require("./../../core/utils");

module.exports = async function sendStickerFromRoot() {
	const { imageMsg, msgKey } = extractImageMessage(msg, sender);
	if (!imageMsg || !msgKey) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					"Reply atau kirim gambar yang mau di jadikan stiker"
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
					"Tidak bisa mengkonversi gambar. Gunakan gambar yang lain atau coba lapor ke admin bot"
				)
			},
			{ quoted: msg }
		);
		log.error(err);
	}
};
