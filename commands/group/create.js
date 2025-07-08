const { normalizeNumber } = require("./../../core/utils");

module.exports = async function createGroup() {
	try {
		const nameGroupMatch = text.match(/•(.*?)•/i);
		const rawNumbers = text.match(/(?:\+?\d{9,15})/g) || [];
		const groupName = nameGroupMatch[1];
		let numbersToAdd = [];
		let warningNumbers = [];
		numbersToAdd.push(senderJid);
		if (text.toLowerCase().includes("tambahkan") && rawNumbers.length > 0) {
			for (const number of rawNumbers) {
				if (number.startsWith("+")) {
					const jid = number.replace("+", "") + "@s.whatsapp.net";
					if (!numbersToAdd.includes(jid)) {
						numbersToAdd.push(jid);
					}
				} else {
					warningNumbers.push(number);
				}
			}
		}
		if (
			!nameGroupMatch ||
			nameGroupMatch[1].length < 1 ||
			!rawNumbers ||
			rawNumbers.length < 1
		) {
			await sock.sendMessage(
				sender,
				{
					text: botLabel(
						"Untuk membuat grup, buat nama grup dengan format •nama grup•. dan gunakan *tambahkan* untuk menambah nomor lain. Contoh\n*buat grup •nama grup• (jika ingin langsung menambahkan orang masukan juga 'tambahkan +628xxxx')*"
					)
				},
				{ quoted: msg }
			);
			return;
		}
		if (warningNumbers.length > 0) {
			await sock.sendMessage(
				sender,
				{
					text: botLabel(
						`Nomor *${warningNumbers.join(
							", "
						)}* tidak bisa di tambahkan, karena tidak sesuai format. Pastikan menggunakan format awalan \'+\', tanpa spasi, tanpa tanda \'-\' dan menggunakan format nasional 628`
					)
				},
				{ quoted: msg }
			);
			if (numbersToAdd.length < 1) return;
		}
		const result = await sock.groupCreate(groupName, numbersToAdd);
		const groupId = result.id;
		const inviteCode = await sock.groupInviteCode(groupId);
		const groupLink = `https://chat.whatsapp.com/${inviteCode}`;
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					`Grup berhasil dibuat \nNama: *${groupName}* ${
						numbersToAdd.length > 1
							? `\nBerhasil Menambahkan: ${numbersToAdd
									.map((n) => `${normalizeNumber(n)}`)
									.join(", ")}`
							: ""
					} \nLink Grup: *${groupLink}*`
				)
			},
			{ quoted: msg }
		);
	} catch (err) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					"Gagal membuat grup. Pastikan tidak ada yang salah atau coba cek console error"
				)
			},
			{ quoted: msg }
		);
		log.error(err);
	}
};
