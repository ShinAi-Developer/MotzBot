const { normalizeNumber } = require("./../../core/utils");

module.exports = async function tagAllNumbers() {
	const groupId = msg.key.remoteJid;
	try {
		if (isGroup) {
			const groupData = await sock.groupMetadata(groupId);
			const mentionNum = msg.key.participant;
			const mentionedNum = [];
			const filtered = groupData.participants
				.map(({ id }) => id)
				.filter((id) => id !== process.env.BOT_NUMBER && id !== senderJid);
			mentionedNum.push(...filtered);
			if (mentionedNum.length < 1) {
				await sock.sendMessage(
					groupId,
					{
						text: botLabel(`Tidak ada nomor di grup untuk di tag`)
					},
					{ quoted: msg }
				);
				return;
			}
			await sock.sendMessage(
				groupId,
				{
					text: botLabel(
						`Di tag oleh @${normalizeNumber(mentionNum)
							.replace("+", "")
							.trim()}\nBerhasil ngetag ${
							mentionedNum.length
						} nomor`
					),
					mentions: mentionedNum
				},
				{ quoted: msg }
			);
		} else {
			await sock.sendMessage(
				sender,
				{
					text: botLabel(`Harus berada di grup untuk ngetag nomor`)
				},
				{ quoted: msg }
			);
			return;
		}
	} catch (e) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel("Tidak bisa di tag. Coba lapor ke admin bot")
			},
			{ quoted: msg }
		);
		log.error(e);
	}
};
