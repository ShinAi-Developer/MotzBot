async function botFirstResponse(botSettings) {
	const { botBehavior, botResponsePatterns } = botSettings;
	return await sock.sendMessage(
		sender,
		{
			text: botLabel(
				`Selamat datang di *${botBehavior.botName}*. Jalankan \`${botBehavior.botMenu}\` untuk melihat menu bot`
			)
		},
		{ quoted: msg }
	);
}

async function botMenu(botSettings) {
	const { botBehavior, botResponsePatterns } = botSettings;

	let regularCommands = [];
	let adminCommands = [];

	botResponsePatterns.forEach(({ command, isAdmin }) => {
		if (isAdmin) {
			adminCommands.push(`*╰⪼* ${command}`);
		} else {
			regularCommands.push(`*╰⪼* ${command}`);
		}
	});

	const borTop = "╔════ ≪ •❈• ≫ ";
	const borBot = "╚════ ≪ •❈• ≫ ";
	let menuText = [
		"",
		borTop,
		`║ Welcome to *${botBehavior.botName}*`,
		borBot,
		"",
		"*➣ Fitur Bot*",
		...regularCommands,
		adminCommands.length > 0 ? "\n*➣ Fitur Admin 🜲* " : "",
		...adminCommands
	].join("\n");
	return await sock.sendMessage(
		sender,
		{
			text: botLabel(menuText)
		},
		{ quoted: msg }
	);
}

async function notAdmin(context) {
	const { sock, sender, msg, text } = context;
	await sock.sendMessage(
		sender,
		{
			text: botLabel(
				"Kamu bukan admin. Tidak bisa menjalankan perintah. Coba jalankan perintah lain yang bukan fitur admin"
			)
		},
		{ quoted: msg }
	);
	return;
}

module.exports = { botFirstResponse, botMenu, notAdmin };
