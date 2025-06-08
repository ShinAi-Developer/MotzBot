const log = require("./../../core/logger/logger");
const { botLabel, normalizeNumber } = require("./../../core/utils");

module.exports = async function checkNumber(context) {
	const { sock, sender, msg, text } = context;
	const rawNumbers = text.match(/(?:\+?\d{9,15})/g) || [];
	if (!rawNumbers || rawNumbers.length < 1) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					"Nomor tidak ada. Jalankan\n*ambil poto profile +628xxx*\nUntuk mengambil poto profile dari nomor itu"
				)
			},
			{ quoted: msg }
		);
		return;
	}
	if (rawNumbers.length > 1) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel("Maksimal nomor yang bisa dimasukan 1")
			},
			{ quoted: msg }
		);
		return;
	}
	if (!rawNumbers[0].includes("+")) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					"Format nomor salah. Pastikan awalannya menggunakan '+'"
				)
			},
			{ quoted: msg }
		);
		return;
	}
	const raw = rawNumbers[0];
	const jid = raw.replace("+", "") + "@s.whatsapp.net";
	try {
		const profileUrl = await sock.profilePictureUrl(jid, "image");
		await sock.sendMessage(
			sender,
			{
				image: { url: profileUrl },
				caption: botLabel(
					`Berhasil menagmbil poto profile daei nomor *${normalizeNumber(
						jid
					)}*`
				)
			},
			{ quoted: msg }
		);
	} catch (error) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					`Nomor *${normalizeNumber(
						jid
					)}* tidak memasang poto profile`
				)
			},
			{ quoted: msg }
		);
		log.error(error);
	}
};
