const log = require("./../../core/logger/logger");
const { botLabel, normalizeNumber } = require("./../../core/utils");

module.exports = async function addUsersGroup(context) {
	const { sock, sender, msg, text, isGroup } = context;
	async function isAdminBot(jid) {
		const groupId = jid;
		const groupData = await sock.groupMetadata(groupId);
		const botNumber = sock.user.id.split(":")[0] + "@s.whatsapp.net";
		const botParticipant = groupData.participants.find(
			(n) => n.id === botNumber
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
		const numbersToAdd = [];
		let warningText = "";
		const rawNumbers = text.match(/(?:\+?\d{9,15})/g) || [];
		const matchGroupLink = text.match(
			/chat\.whatsapp\.com\/([A-Za-z0-9]+)/
		);
		if (!rawNumbers || rawNumbers.length > 0) {
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
		if (!rawNumbers || rawNumbers === 0) {
			await sock.sendMessage(
				sender,
				{
					text: botLabel(
						"Untuk menambahkan nomor ketikan +628xxx. Contoh\n*tambahkan nomor +628xxx ke grup*"
					)
				},
				{ quoted: msg }
			);
			return;
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
						`Nomor berhasil ditambahkan\n${`Berhasil menambahkan: ${normalizeNumber(
							numbersToAdd
						)}`}`
					)
				},
				{ quoted: msg }
			);
		} else {
		  if (!matchGroupLink) {
		    await sock.sendMessage(
					sender,
					{
						text: botLabel(
							"Tidak ada link grup. Silahkan masukan link grup"
						)
					},
					{ quoted: msg }
				);
				return;
		  }
			const allGroups = await sock.groupFetchAllParticipating();
			const inviteCode = matchGroupLink[1];
			let targetGroupId = "";
			let groupInviteId = "";
			for (const groupId of Object.keys(allGroups)) {
				try {
					const currCode = await sock.groupInviteCode(groupId);
					if (currCode === inviteCode) {
						targetGroupId = groupId;
						groupInviteId = currCode;
						break;
					}
				} catch (error) {
					log.error(error.stack);
				}
			}
			if (!targetGroupId) {
				await sock.sendMessage(
					sender,
					{
						text: botLabel(`Bot belum masuk di link grup tersebut`)
					},
					{ quoted: msg }
				);
				return;
			}
			const confirmAdmin = await isAdminBot(targetGroupId);
			if (!confirmAdmin) return;
			try {
				await sock.groupParticipantsUpdate(
					targetGroupId,
					numbersToAdd,
					"add"
				);
			} catch (error) {
				log.error(error.stack);
			}
			const groupInviteLink = `https://chat.whatsapp.com/${groupInviteId}`;
			await sock.sendMessage(
				sender,
				{
					text: botLabel(
						`Nomor berhasil ditambahin\n${`Berhasil menambahkan: ${normalizeNumber(
							numbersToAdd
						)}`}\nLink grup: ${groupInviteLink}`
					)
				},
				{ quoted: msg }
			);
		}
		if (warningText) {
			await sock.sendMessage(sender, {
				text: botLabel(warningText)
			});
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
