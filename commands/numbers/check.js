const { botLabel, normalizeNumber } = require("./../../core/utils");

module.exports = async function checkNumber(context) {
	const { sock, sender, msg, text } = context;
	const rawNumbers = text.match(/(?:\+?\d{9,15})/g) || [];
	if (!rawNumbers || rawNumbers.length < 1) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					"Nomor tidak ada. Jalankan\n*cek nomor +628xxx*\nUntuk melihat apakah nomor terdaftar di whatsapp atau tidak"
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
				text: botLabel("Maksimal nomor yang bisa dicek 1")
			},
			{ quoted: msg }
		);
		return;
	}
	if (!rawNumbers[0].includes("+")) {
	  await sock.sendMessage(
			sender,
			{
				text: botLabel("Format nomor salah. Pastikan awalannya menggunakan '+'")
			},
			{ quoted: msg }
		);
		return;
	}
	const raw = rawNumbers[0];
	const jid = raw.replace("+", "") + "@s.whatsapp.net";
	const checkedNum = await sock.onWhatsApp(jid);
	await sock.sendMessage(
		sender,
		{
			text: botLabel(
				`Nomor ${normalizeNumber(jid)} ${
					checkedNum?.[0]?.exists
						? "terdaftar di whatsapp"
						: "tidak terdaftar di whatsapp"
				}`
			)
		},
		{ quoted: msg }
	);
};
