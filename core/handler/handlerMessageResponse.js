const {
	botBehavior,
	botResponsePatterns
} = require("./../../settings/botConfig");
const { botFirstResponse, botMenu, notAdmin } = require("./../../commands/botResponse");

module.exports = async function handlerMessageResponse(context) {
	const { text, quotedMessage, isFromAdmin } = context;
	const botSettings = { botBehavior, botResponsePatterns };
	const normalizedText = text.trim().toLowerCase();
	const cleanedText = normalizedText.replace(/^([^\w\s]+)/, "");
	const match = botResponsePatterns.find((e) => {
		if (!e.command) return false;
		const keywords = e.command.toLowerCase().split(" ");
		return keywords.every((kw) => normalizedText.includes(kw));
	});
	if (normalizedText === botBehavior.botMenu)
		return await botMenu(context, botSettings);
	if (!match) return await botFirstResponse(context, botSettings);
	if (match?.isAdmin === true && !isFromAdmin) return notAdmin(context);
	return match.handler(context);
};
