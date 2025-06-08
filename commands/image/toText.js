const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const Tesseract = require("tesseract.js");
const { extractImageMessage } = require("./../../core/utils");
const log = require("./../../core/logger/logger");
const { botLabel } = require("./../../core/utils");

function imageText(buffer) {
	return Tesseract.recognize(buffer, "eng+ind").then((res) => res.data.text);
}

module.exports = async function imageToText(context) {
	const { sock, sender, msg, text } = context;
	const { imageMsg, msgKey } = extractImageMessage(msg, sender);
	if (!imageMsg && !msgKey) {
	  await sock.sendMessage(
			sender,
			{
				text: botLabel(
					`Reply atau kirim gambar untuk mengekstrak / mengambil teksnya`
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
		const textResult = await imageText(buffer);
		const cleanedText = textResult?.replace(/\s+/g, " ").trim();

		if (!cleanedText || cleanedText < 3) {
			await sock.sendMessage(
				sender,
				{
					text: botLabel(
						`Gambar tidak mengandung teks. Coba kirim kembali gambar yang ada mengandung teks`
					)
				},
				{ quoted: msg }
			);
			return;
		}
		await sock.sendMessage(
			sender,
			{
				text: botLabel(`Teks image: \n*${cleanedText}*`)
			},
			{ quoted: msg }
		);
	} catch (err) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					`Tidak bisa mengkonveri gambar ke teks. Pastikan yang dikirim adalah gambar atau coba lapor ke admin bot`
				)
			},
			{ quoted: msg }
		);
		log.error(err);
	}
};
