const log = require("./../../core/logger/logger");
const { botLabel, normalizeNumber } = require("./../../core/utils");

module.exports = async function createGroup(context) {
	const { sock, sender, msg, text } = context;
	const nameGroupMatch = text.match(/•(.*?)•/i);
	const rawNumbers = text.match(/(?:\+?\d{9,15})/g) || [];
	if (
		!nameGroupMatch ||
		nameGroupMatch < 1 ||
		!rawNumbers ||
		rawNumbers < 1
	) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					"Untuk membuat nama grup, gunakan format •nama grup•. dan gunakan tambahkan untuk menambah nomor lain. Contoh\n *buat grup •nama grup• \n(jika ingin langsung menambahkan orang masukan juga 'tambahkan +628xxxx')*"
				)
			},
			{ quoted: msg }
		);
		return;
	}
	try {
		const groupName = nameGroupMatch[1].trim();
		const numbersToAdd = [];
		const requester = sender.startsWith("62")
			? sender
			: sender.replace(/^08/, "628");
		numbersToAdd.push(requester);
		let warningText = "";
		if (rawNumbers.length > 0) {
			for (const number of rawNumbers) {
				if (number.startsWith("+")) {
					const jid = number.replace("+", "") + "@s.whatsapp.net";
					if (!numbersToAdd.includes(jid)) {
						numbersToAdd.push(
							number.replace("+", "") + "@s.whatsapp.net"
						);
					}
				} else if (
					number.startsWith("08") ||
					number.startsWith("628")
				) {
					warningText += `Nomor *${number}* tidak bisa di masukan karena tidak memakai awalan '+'`;
				}
			}
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
						numbersToAdd.length > 0
							? `\nBerhasil Menambahkan: ${normalizeNumber(
									numbersToAdd
							  )}`
							: ""
					} \nLink Grup: *${groupLink}*`
				)
			},
			{ quoted: msg }
		);
		if (warningText) {
			await sock.sendMessage(
				sender,
				{
					text: botLabel(warningText)
				},
				{ quoted: msg }
			);
		}
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
