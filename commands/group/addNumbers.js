const { normalizeNumber } = require("./../../core/utils");

module.exports = async function addUsersGroup() {
	async function isAdminBot(jid) {
		const groupId = jid;
		const groupData = await sock.groupMetadata(groupId);
		const botParticipant = groupData.participants.find(
			(n) => n.id === process.env.BOT_NUMBER
		);
		const isBotAdmin =
			botParticipant?.admin === "admin" ||
			botParticipant?.admin === "superadmin";
		if (!isBotAdmin) {
			await sock.sendMessage(
				sender,
				{
					text: botLabel(`Bot bukan admin. Tidak bisa menambah user`)
				},
				{ quoted: msg }
			);
			return;
		}
		return groupId;
	}
	try {
		let numbersToAdd = [];
		let warningNumbers = [];
		const rawNumbers = text.match(/(?:\+?\d{9,15})/g) || [];
		const matchGroupLink = text.match(
			/chat\.whatsapp\.com\/([A-Za-z0-9]+)/
		);
		if (!rawNumbers || rawNumbers.length > 0) {
			for (const number of rawNumbers) {
				if (/^\+?628\d{6,13}$/.test(number)) {
					const jid = number.replace("+", "") + "@s.whatsapp.net";
					if (!numbersToAdd.includes(jid)) {
						numbersToAdd.push(jid);
					}
				} else {
					warningNumbers.push(number);
				}
			}
		}
		if (!rawNumbers || rawNumbers.length < 0) {
			await sock.sendMessage(
				sender,
				{
					text: botLabel(
						"Untuk menambahkan nomor ketikkan\n*tambahkan nomor +628xxx ke grup*"
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
		if (isGroup) {
			if (matchGroupLink) {
				await sock.sendMessage(
					sender,
					{
						text: botLabel(
							"Sudah di grup. Tidak perlu memasukan link lagi"
						)
					},
					{ quoted: msg }
				);
				return;
			}
			const groupId = await isAdminBot(msg.key.remoteJid);
			if (!groupId) return;
			try {
				await sock.groupParticipantsUpdate(
					groupId,
					numbersToAdd,
					"add"
				);
			} catch (error) {
				log.error(error.stack);
			}
			await sock.sendMessage(
				sender,
				{
					text: botLabel(
						`Nomor berhasil ditambahkan\nBerhasil menambahkan: ${numbersToAdd
							.map((n) => `${normalizeNumber(n)}`)
							.join(", ")}`
					)
				},
				{ quoted: msg }
			);
		} else {
			await sock.sendMessage(
				sender,
				{
					text: botLabel(
						`Tidak berada di grup. Tidak bisa menambahkan nomor`
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
					`Tidak bisa menambahkan nomor. Pastikan tidak ada yang salah atau coba cek console error`
				)
			},
			{ quoted: msg }
		);
		log.error(error.stack);
	}
};
