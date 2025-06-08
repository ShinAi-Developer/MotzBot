const log = require("./../../core/logger/logger");
const { botLabel } = require("./../../core/utils");

module.exports = async function chatAllUsersFromGrup(context) {
	const { sock, sender, msg, text, isGroup } = context;
	const messageToSend = text.match(/•(.*?)•/);
	const matchGroupLink = text.match(/chat\.whatsapp\.com\/([A-Za-z0-9]+)/);
	if (
		!messageToSend ||
		messageToSend < 1 ||
		!matchGroupLink ||
		matchGroupLink < 1
	) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					`Untuk mengirim pesan gunakan format •• dan tambahkan juga link grup nya. Contoh\n*kirim pesan •isi pesan• ke semua orang dari grup chat.whatsapp.net/xxx*`
				)
			},
			{ quoted: msg }
		);
		return;
	}
	try {
		if (isGroup) {
			if (matchGroupLink) {
				await sock.sendMessage(
					sender,
					{
						text: botLabel(
							`Sudah di grup tidak perlu memasukan link lagi`
						)
					},
					{ quoted: msg }
				);
			}
			const groupId = msg.key.remoteJid;
			const groupData = await sock.groupMetadata(groupId);
			const botNumber = sock.user.id.split(":")[0] + "@s.whatsapp.net";
			const usersNum = groupData.participants
				.map(({ id }) => id)
				.filter((id) => id !== botNumber);
			for (const numId of usersNum) {
				await sock.sendMessage(numId, {
					text: botLabel(messageToSend[1])
				});
			}
			await sock.sendMessage(
				sender,
				{
					text: botLabel(
						`Berhasil ngirim pesan ke ${usersNum.length} nomor`
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
					log.error(error);
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
			const groupData = await sock.groupMetadata(targetGroupId);
			const botNumber = sock.user.id.split(":")[0] + "@s.whatsapp.net";
			const usersNum = groupData.participants
				.map(({ id }) => id)
				.filter((id) => id !== botNumber);
			for (const numId of usersNum) {
				await sock.sendMessage(numId, {
					text: botLabel(messageToSend[1])
				});
			}
			const groupInviteLink = `https://chat.whatsapp.com/${groupInviteId}`;
			await sock.sendMessage(
				sender,
				{
					text: botLabel(
						`Berhasil ngirim pesan ke ${usersNum.length} nomor\n*Link grup: ${groupInviteLink}*`
					)
				},
				{ quoted: msg }
			);
		}
	} catch (error) {
	  await sock.sendMessage(
			sender,
			{
				text: botLabel(`Tidak bisa mengirim pesan ke grup. Pastikan tidak ada yang salah atau coba cek console error`)
			},
			{ quoted: msg }
		);
		log.error(error);
	}
};
