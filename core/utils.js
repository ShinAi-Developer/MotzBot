const fs = require("fs");
const path = require("path");

function extractText(msg) {
	return (
		msg.message.extendedTextMessage?.text ||
		msg.message.imageMessage?.caption ||
		msg.message.videoMessage?.caption ||
		msg.message.conversation
	);
}

function extractContextInfo(msg) {
	return (
		msg.message.extendedTextMessage?.contextInfo ||
		msg.message.imageMessage?.contextInfo ||
		msg.message.videoMessage?.contextInfo ||
		msg.message.conversation?.contextInfo
	);
}

function extractQuotedMessage(msg) {
	const quotedMsg = extractContextInfo(msg).quotedMessage;
	return (
		quotedMsg?.conversation ||
		quotedMsg?.extendedTextMessage?.text ||
		quotedMsg?.imageMessage?.caption ||
		quotedMsg?.videoMessage?.caption
	);
}

function extractImageMessage(msg, sender) {
	const ctxInfo = msg.message?.extendedTextMessage?.contextInfo;
	const quotedImage = ctxInfo?.quotedMessage?.imageMessage;
	const directImage = msg.message?.imageMessage;
	let imageMsg = null;
	let msgKey = null;
	if (quotedImage) {
		imageMsg = quotedImage;
		msgKey = {
			remoteJid: sender,
			fromMe: false,
			id: ctxInfo.stanzaId,
			participant: ctxInfo.participant || sender
		};
	} else if (directImage) {
		imageMsg = directImage;
		msgKey = msg.key;
	}
	return { imageMsg, msgKey };
}

function formatTime() {
	return new Date().toLocaleTimeString("id-ID", {
		hour12: false,
		hour: "2-digit",
		minute: "2-digit"
	});
}

async function botBehavior(context, settings) {
	const { sock, sender, msg, text } = context;
	const { readMessage, isTyping, typeDelay } = settings;
	if (readMessage) await sock.readMessages([msg.key]);
	if (isTyping) {
		await sock.sendPresenceUpdate("composing", sender);
		await new Promise((resolve) => setTimeout(resolve, 2000));
		await sock.sendPresenceUpdate("paused", sender);
	}
}

function loadCommands(baseDir = path.join(__dirname, "./../commands")) {
	const returnCommand = {};

	function walk(currentPath) {
		const files = fs.readdirSync(currentPath);

		for (const file of files) {
			const fullPath = path.join(currentPath, file);
			const stat = fs.statSync(fullPath);

			if (stat.isDirectory()) {
				walk(fullPath);
			} else if (file.endsWith(".js")) {
				const relativePath = path.relative(baseDir, fullPath);
				const key = relativePath
					.replace(/\\/g, "/")
					.replace(/\.js$/, "")
					.replace(/\//g, "_");

				returnCommand[key] = require(fullPath);
			}
		}
	}

	walk(baseDir);
	return returnCommand;
}

function botLabel(text) {
	const { botBehavior: settings } = require("./../settings/botConfig");
	const label = settings.botLabel;
	return `${label} ${text}`;
}

function normalizeNumber(num) {
	if (Array.isArray(num)) {
		return num.map(normalizeNumber);
	}
	const str = String(num).trim();
	const clearedNum = str.replace("@s.whatsapp.net", "");
	return `+${clearedNum}`;
}

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

module.exports = {
	extractText,
	extractContextInfo,
	extractQuotedMessage,
	extractImageMessage,
	formatTime,
	botBehavior,
	loadCommands,
	botLabel,
	normalizeNumber,
	delay
};
