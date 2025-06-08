const {
	extractText,
	extractContextInfo,
	extractQuotedMessage,
	notAllowedMessage,
	formatTime,
	botBehavior: botSettings
} = require("./../utils");
const log = require("./../../core/logger/logger");
const handlerMessageResponse = require("./handlerMessageResponse");
const {
	botBehavior: settings,
	botResponsePatterns
} = require("./../../settings/botConfig");

module.exports = async function handlerMessage(sock, msg) {
	const sender = msg.key.remoteJid;
	const text = extractText(msg);
	const ctxInfo = extractContextInfo(msg);
	const isGroup = sender.endsWith("@g.us");
	const isStatus = sender.includes("status@broadcast");
	const isSticker = msg.message.stickerMessage;
	const senderJid = isGroup ? msg.key.participant : sender;
	const botJid = process.env.BOT_NUMBER || sock.user.id;
	const isFromBot = msg.key.fromMe || senderJid === botJid;
	const replyMyMessage = settings.replyMyMessage;
	let quotedMessage = "";
	const normalizeBotNumber = process.env.BOT_NUMBER.replace(
		"@s.whatsapp.net",
		""
	);
	if (ctxInfo?.quotedMessage && ctxInfo?.participant === process.env.botJid) {
		quotedMessage = extractQuotedMessage(msg);
	}
	const isMentioned = ctxInfo?.mentionedJid?.includes(botJid);
	const replyBotMsg = ctxInfo?.participant === botJid;
	const botLabel = text?.includes(settings.botLabel);
	if (!replyMyMessage && isFromBot) return;
	if (botLabel || isSticker || isStatus) return;
	const isAllowedToProcess =
		!isGroup || (isGroup && (replyBotMsg || isMentioned));
	if (!isAllowedToProcess || !text) return;
	const isFromAdmin = senderJid === process.env.OWNER_NUMBER;
	const normalizeText = text.replace(`@${normalizeBotNumber}`, []).trim();
	log.message(
		isGroup ? "group" : "pribadi",
		isFromAdmin ? "admin" : `user ${senderJid}`,
		normalizeText
	);
	const context = {
		sock,
		sender,
		msg,
		text,
		quotedMessage,
		isFromAdmin,
		isGroup,
		settings,
		botResponsePatterns
	};
	await botSettings(context, settings);
	await handlerMessageResponse(context);
};
