const { downloadMediaMessage } = require("@whiskeysockets/baileys");
const qrcodeReader = require("qrcode-reader");
const Jimp = require("jimp");
const { extractImageMessage } = require("./../../core/utils");
const log = require("./../../core/logger/logger");
const { botLabel } = require("./../../core/utils");

async function decodeQrCode(buffer) {
	const image = await Jimp.read(buffer);
	const qr = new qrcodeReader();
	return new Promise((resolve, reject) => {
		qr.callback = function (err, result) {
			if (err) reject(err);
			else resolve(result.result);
		};
		qr.decode(image.bitmap);
	});
}

module.exports = async function handleQrRead(context) {
	const { sock, sender, msg, text } = context;
	const { imageMsg, msgKey } = extractImageMessage(msg, sender);
	if (!imageMsg || !msgKey) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					`Reply atau kirim qr code untuk menampilkan isi qr code`
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
		const value = await decodeQrCode(buffer);
		await sock.sendMessage(
			sender,
			{
				text: botLabel(`Isi dari qr code: \n*${value}*`)
			},
			{ quoted: msg }
		);
	} catch (err) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					`Tidak bisa membaca qr code. Pastikan gambar mengandung qr code, dan jelas`
				)
			},
			{ quoted: msg }
		);
		log.error(err);
	}
};
