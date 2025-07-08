module.exports = async function chatAllUsersFromGrup() {
	const messageToSend = text.match(/•(.*?)•/);
	try {
		if (!messageToSend || messageToSend[1].length < 1) {
			await sock.sendMessage(
				sender,
				{
					text: botLabel(
						`Untuk mengirim pesan gunakan format •isi pesan•. Contoh\n*kirim pesan •isi pesan• ke semua nomor dari grup*`
					)
				},
				{ quoted: msg }
			);
			return;
		}
		if (isGroup) {
			const groupId = msg.key.remoteJid;
			const groupData = await sock.groupMetadata(groupId);
			const usersNum = groupData.participants
				.map(({ id }) => id)
				.filter(
					(id) => id !== process.env.BOT_NUMBER && id !== senderJid
				);
			if (usersNum.length < 1) {
				await sock.sendMessage(
					sender,
					{
						text: botLabel(`Tidak ada nomor untuk di kirimi pesan`)
					},
					{ quoted: msg }
				);
				return;
			}
			await Promise.all(
				usersNum.map((numId) =>
					sock.sendMessage(numId, {
						text: botLabel(messageToSend[1])
					})
				)
			);
			await sock.sendMessage(
				sender,
				{
					text: botLabel(
						`Berhasil ngirim pesan ke *${usersNum.length}* nomor`
					)
				},
				{ quoted: msg }
			);
		} else {
			await sock.sendMessage(
				sender,
				{
					text: botLabel(
						`Tidak berada di grup. Tidak bisa mengirim pesan ke semua nomor di grup`
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
					`Tidak bisa mengirim pesan ke grup. Pastikan tidak ada yang salah atau coba cek console error`
				)
			},
			{ quoted: msg }
		);
		log.error(error);
	}
};
