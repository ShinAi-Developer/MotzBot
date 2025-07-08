const { normalizeNumber } = require("./../../core/utils");

module.exports = async function checkNumber() {
	const rawNumbers = text.match(/(?:\+?\d{9,15})/g) || [];
	if (!rawNumbers || rawNumbers.length < 1) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					"Nomor tidak ada. Jalankan\n*ambil poto profil +628xxx*"
				)
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
	const raw = rawNumbers[0];
	const jid = raw.replace("+", "") + "@s.whatsapp.net";
	try {
		let profile;
		try {
			const profileUrl = await sock.profilePictureUrl(jid, "image");
			profile = profileUrl;
		} catch {
			profile = null;
		}

		if (profile) {
			await sock.sendMessage(
				sender,
				{
					image: { url: profile },
					caption: botLabel(
						`Berhasil menagmbil poto profile daei nomor *${normalizeNumber(
							jid
						)}*`
					)
				},
				{ quoted: msg }
			);
		} else {
			await sock.sendMessage(
				sender,
				{
					text: botLabel(
						`Nomor *${normalizeNumber(
							jid
						)}* tidak memasang poto profile / profile nya private`
					)
				},
				{ quoted: msg }
			);
		}
	} catch (error) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					`Tidak bisa mengambil poto profile. Pastikan tidak ada yang salah atau coba lapor ke admin bot`
				)
			},
			{ quoted: msg }
		);
		log.error(error);
	}
};
