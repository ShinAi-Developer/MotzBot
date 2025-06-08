const log = require("./../../core/logger/logger");
const { botLabel, normalizeNumber, delay } = require("./../../core/utils");

async function blockNumber(context) {
	const { sock, sender, msg, text } = context;
	const rawNumbers = text.match(/(?:\+?\d{9,15})/g) || [];
	if (!rawNumbers || rawNumbers.length < 1) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					`Untuk memblokir nomor gunakan awalan '+'. Contoh\n*blokir nomor +628xxx*\nBisa untuk banyak nomor`
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
				text: botLabel(`Hanya bisa memblokir 1 nomor`)
			},
			{ quoted: msg }
		);
		return;
	}
	try {
		if (rawNumbers[0].startsWith("+")) {
			const replaceNums =
				rawNumbers[0].replace("+", "") + "@s.whatsapp.net";
			await sock.updateBlockStatus(replaceNums, "block");
			await sock.sendMessage(
				sender,
				{
					text: botLabel(
						`Berhasil memblokir ${normalizeNumber(replaceNums)}`
					)
				},
				{ quoted: msg }
			);
		} else if (
			rawNumbers[0].startsWith("08") ||
			rawNumbers[0].startsWith("628")
		) {
			await sock.sendMessage(
				sender,
				{
					text: botLabel(
						`tidak bisa memblokir nomor karena tidak memakai awalan '+'`
					)
				},
				{ quoted: msg }
			);
			return;
		}
	} catch (error) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					`Tidak bisa memblokir nomor. Pastikan tidak ada yang salah atau coba cek console error`
				)
			},
			{ quoted: msg }
		);
		log.error(error);
	}
}

async function unBlockNumber(context) {
	const { sock, sender, msg, text } = context;
	const rawNumbers = text.match(/(?:\+?\d{9,15})/g) || [];
	if (!rawNumbers || rawNumbers.length < 1) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					`Untuk membuka blokir nomor gunakan awalan '+'. Contoh\n*buka blokir +628xxx*\nBisa untuk banyak nomor`
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
				text: botLabel(`Hanya bisa membuka blokir 1 nomor`)
			},
			{ quoted: msg }
		);
		return;
	}
	try {
		if (rawNumbers[0].startsWith("+")) {
			const replaceNums =
				rawNumbers[0].replace("+", "") + "@s.whatsapp.net";
			await sock.updateBlockStatus(replaceNums, "unblock");
			await sock.sendMessage(
				sender,
				{
					text: botLabel(
						`Berhasil membuka blokir ${normalizeNumber(
							replaceNums
						)}`
					)
				},
				{ quoted: msg }
			);
		} else if (
			rawNumbers[0].startsWith("08") ||
			rawNumbers[0].startsWith("628")
		) {
			await sock.sendMessage(
				sender,
				{
					text: botLabel(
						`tidak bisa membuka blokir nomor karena tidak memakai awalan '+'`
					)
				},
				{ quoted: msg }
			);
			return;
		}
	} catch (error) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					`Tidak bisa membuka blokir nomor. Pastikan tidak ada yang salah atau coba cek console error`
				)
			},
			{ quoted: msg }
		);
		log.error(error);
	}
}

module.exports = { blockNumber, unBlockNumber };
