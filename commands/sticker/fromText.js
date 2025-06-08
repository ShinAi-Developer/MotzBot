const Jimp = require("jimp");
const sharp = require("sharp");
const { botLabel } = require("./../../core/utils");
const emojiRegex = require("emoji-regex");
const log = require("./../../core/logger/logger");

module.exports = async function fromTextToSticker(context) {
	const { sock, sender, msg, text } = context;

	const match = text.match(/•(.*?)•/);
	if (!match || match[1].length < 1) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					"Untuk membuat teks menjadi stiker gunakan format ••. Contoh\n*ubah teks •teksnya• jadi stiker*"
				)
			},
			{ quoted: msg }
		);
		return;
	}
	if (match[1].length >= 450) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					"Teks terlalu panjang. Pastikan teks tidak lebih dari 450 huruf"
				)
			},
			{ quoted: msg }
		);
		return;
	}
	const isEmoji = emojiRegex();
	if (isEmoji.test(match[1].trim())) {
	  await sock.sendMessage(
			sender,
			{
				text: botLabel(
					"Emoji tidak bisa dijadikan stiker"
				)
			},
			{ quoted: msg }
		);
		return;
	}
	try {
		const messageText = match[1].trim();
		const width = 512;
		const height = 512;
		const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
		const image = new Jimp(width, height, "#FFFFFF");
		const textOptions = {
			text: messageText,
			alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
			alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
			maxWidth: width,
			maxHeight: height
		};
		width, image.print(font, 0, 0, textOptions, width, height);
		const rawBuffer = await image.getBufferAsync(Jimp.MIME_PNG);
		const stickerBuffer = await sharp(rawBuffer)
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
	} catch (error) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					`Tidak bisa membuat teks menjadi stiker. Pastikan teks tidak terlalu panjang dan tidak mengandung emoji atau coba lapor ke admin bot`
				)
			},
			{ quoted: msg }
		);
		log.error(error);
	}
};
