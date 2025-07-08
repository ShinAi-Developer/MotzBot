const { normalizeNumber } = require("./../../core/utils");

module.exports = async function kickNumbers() {
	try {
		if (isGroup) {
			const groupId = msg.key.remoteJid;
			const groupData = await sock.groupMetadata(groupId);
			const kickNums = [];
			if (ctxInfo.participant) {
				kickNums.push(ctxInfo.participant);
			}
			if (ctxInfo.mentionedJid) {
				if (Array.isArray(ctxInfo.mentionedJid)) {
					kickNums.push(...ctxInfo.mentionedJid);
				} else {
					kickNums.push(ctxInfo.mentionedJid);
				}
			}

			const filteredKickNums = kickNums.filter(
				(num) => num !== process.env.BOT_NUMBER
			);

			if (filteredKickNums.length === 0) {
				await sock.sendMessage(
					groupId,
					{
						text: botLabel(`Tidak ada nomor untuk dikeluarkan`)
					},
					{ quoted: msg }
				);
				return;
			}

			let isSuperadmin;
			const finalKickNums = [];

			for (const kn of filteredKickNums) {
				const participant = groupData.participants.find(
					({ id }) => id === kn
				);
				if (participant?.admin === "superadmin") {
					isSuperadmin = kn;
				} else {
					finalKickNums.push(kn);
				}
			}
			if (isSuperadmin) {
				await sock.sendMessage(
					groupId,
					{
						text: botLabel(
							`Tidak bisa mengeluarkan @${normalizeNumber(
								isSuperadmin
							)} karena pembuat grup`
						),
						mentions: [isSuperadmin]
					},
					{ quoted: msg }
				);
				if (finalKickNums.length > 0) return;
			}
			if (finalKickNums.length >= 1) {
				await sock.groupParticipantsUpdate(
					groupId,
					filteredKickNums,
					"remove"
				);
				await sock.sendMessage(
					groupId,
					{
						text: botLabel(
							`Berhasil mengeluarkan ${finalKickNums
								.map(
									(n) =>
										`@${normalizeNumber(n).replace(
											"+",
											""
										)}`
								)
								.join(", ")}`
						),
						mentions: [finalKickNums]
					},
					{ quoted: msg }
				);
			}
		} else {
			await sock.sendMessage(
				sender,
				{
					text: botLabel(
						`Harus berada di grup untuk mengeluarkan nomor`
					)
				},
				{ quoted: msg }
			);
			return;
		}
	} catch (e) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					"Nomor tidak bisa di Keluarkan. Coba cek console error"
				)
			},
			{ quoted: msg }
		);
		log.error(e);
	}
};
