const {
	extractText,
	extractContextInfo,
	extractQuotedMessage,
	notAllowedMessage,
	formatTime,
	botEffects,
	normalizeNumber
} = require("./../utils");
const {
	botMenu,
	botFirstResponse,
	notAdmin
} = require("./../botResponseUtils");
const {
	botBehavior,
	botResponsePatterns
} = require("./../../settings/botConfig");

module.exports = async function handlerMessage(sock, msg) {
	globalThis.sock = sock;
	globalThis.msg = msg;
	globalThis.sender = msg.key.remoteJid;
	const rawText = extractText(msg);
	const normalizeBotNumber = process.env.BOT_NUMBER.replace(
		"@s.whatsapp.net",
		""
	);
	globalThis.text = rawText?.replace(`@${normalizeBotNumber}`, []).trim();
	globalThis.ctxInfo = extractContextInfo(msg);
	globalThis.isGroup = sender.endsWith("@g.us");
	const isStatus = sender.includes("status@broadcast");
	const isSticker = msg.message.stickerMessage;
	globalThis.senderJid = isGroup ? msg.key.participant : sender;
	const adminJid = process.env.ADMIN_NUMBER;
	const botJid = process.env.BOT_NUMBER;
	const isFromBot = senderJid === botJid;
	const quotedMessage = extractQuotedMessage(msg);
	const isMentioned = ctxInfo?.mentionedJid?.includes(botJid);
	const replyBotMsg = ctxInfo?.participant === botJid;
	const botLabel = text?.includes(botBehavior.botLabel);
	const replyMyMessage = botBehavior.replyMyMessage;
	if (!replyMyMessage && isFromBot) return;
	if (botLabel || isSticker || isStatus) return;
	const isAllowedToProcess =
		!isGroup || (isGroup && (replyBotMsg || isMentioned));
	if (!isAllowedToProcess || !text) return;
	const isFromAdmin = senderJid === (adminJid || botJid);
	log.message(
		isGroup ? "group" : "pribadi",
		isFromAdmin ? "admin" : `user ${normalizeNumber(senderJid)}`,
		text
	);
	await botEffects(botBehavior);
	const botSettings = { botBehavior, botResponsePatterns };
	const match = botResponsePatterns.find((e) => {
		if (!e.command) return false;
		const keywords = e.command.toLowerCase().split(" ");
		return keywords.every((kw) => {
			const pattern = new RegExp(`\\b${kw}\\b`, "i");
			return pattern.test(text.toLowerCase());
		});
	});

	if (text.toLowerCase() === botBehavior.botMenu.toLowerCase())
		return await botMenu(botSettings);
	if (!match) return await botFirstResponse(botSettings);
	if (match?.isAdmin === true && !isFromAdmin) return notAdmin();
	return match.handler();
};
