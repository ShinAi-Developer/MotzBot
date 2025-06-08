const QRCode = require("qrcode");
const log = require("./../../core/logger/logger");
const { botLabel } = require("./../../core/utils");

function generateQrCode(text) {
	return new Promise((resolve, reject) => {
		QRCode.toDataURL(text, function (err, url) {
			if (err) reject(err);
			else resolve(url);
		});
	});
}

module.exports = async function handleQrCreate(context) {
	const { sock, sender, msg, text } = context;
	const qrValue = text.toLowerCase().match(/•(.*?)•/i);
	if (!qrValue || qrValue[1].length < 1) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(`Untuk membuat qr code gunakan format ••. Contoh\n*buat qr code •ini isi untuk qr code•*`)
			},
			{ quoted: msg }
		);
		return;
	}
	try {
	const value = qrValue[1];
	const base64 = await generateQrCode(value);
	const base64Data = base64.split(",")[1];

	const output = Buffer.from(base64Data, "base64");
	await sock.sendMessage(
		sender,
		{
			image: output,
			caption: botLabel(`Qr code berhasil dibuat`)
		},
		{ quoted: msg }
	);
	} catch (err) {
	  await sock.sendMessage(
		sender,
		{
			text: botLabel(`Qr code gagal dibuat. Coba lapor ke admin bot`)
		},
		{ quoted: msg }
	);
	log.error(err);
	}
};
