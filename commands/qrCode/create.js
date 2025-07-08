const QRCode = require("qrcode");

function generateQrCode(text) {
	return new Promise((resolve, reject) => {
		QRCode.toDataURL(
			text,
			{
				errorCorrectionLevel: "H"
			},
			function (err, url) {
				if (err) reject(err);
				else resolve(url);
			}
		);
	});
}

module.exports = async function handleQrCreate() {
	const qrValue = text.toLowerCase().match(/•(.*?)•/i);
	if (!qrValue || qrValue[1].length < 1) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					`Untuk membuat qr code gunakan format •isi qr code•. Contoh\n*buat qr code •isi qr code•*`
				)
			},
			{ quoted: msg }
		);
		return;
	}
	if (qrValue[1].length > 1000) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(`Teks terlalu panjang. Coba masukan hurufnya kurang dari 1000`)
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
