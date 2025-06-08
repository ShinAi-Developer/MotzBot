const { ytmp4, ytmp3 } = require("ruhend-scraper");
const log = require("./../../core/logger/logger");
const { botLabel } = require("./../../core/utils");

function normalizeYoutubeUrl(url) {
	if (!url.includes("youtu")) return;
	if (url.includes("youtu.be")) {
		const videoId = url.split("youtu.be/")[1].split("?")[0];
		return `https://youtube.com/watch?v=${videoId}`;
	} else if (url.includes("youtube.com")) {
		return url;
	}
}

async function youtubeData(url, type) {
	const dataMP4 = await ytmp4(url);
	const dataMP3 = await ytmp3(url);
	return type === "mp4" ? dataMP4 : dataMP3;
}

async function handleYoutubeMP4Download(context) {
	const { sock, sender, msg, text } = context;
	const normalizedUrl = normalizeYoutubeUrl(text);
	if (text.toLowerCase().includes("video") && !normalizedUrl) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					`Untuk mendownload video youtube pastikan linknya sudah di ketikan. Contoh\n*download video tiktok https://youtube.com/watch?v=xxx atau https://youtu.be/watch?v=xxx*`
				)
			},
			{ quoted: msg }
		);
		return;
	}
	try {
		const data = await youtubeData(normalizedUrl, "mp4");
		await sock.sendMessage(
			sender,
			{
				text: botLabel(`Video sedang didownload`)
			},
			{ quoted: msg }
		);
		await sock.sendMessage(
			sender,
			{
				video: { url: data.video },
				caption: botLabel(`Video berhasil didownload \nJudul video: *${data.title}*`)
			},
			{ quoted: msg }
		);
	} catch (err) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					`Gagal download video youtube. Coba periksa kembali url nya atau coba lapor ke admin bot`
				)
			},
			{ quoted: msg }
		);
		log.error(err);
	}
}

async function handleYoutubeMP3Download(context) {
	const { sock, sender, msg, text } = context;
	const normalizedUrl = normalizeYoutubeUrl(text);
	if (text.toLowerCase().includes("musik") && !normalizedUrl) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					`Untuk mendownload musik youtube pastikan linknya sudah di ketikan. Contoh\n*download video tiktok https://youtube.com/watch?v=xxx atau https://youtu.be/watch?v=xxx*\nIni juga bisa membuat video di youtube menjadi musik / mp3`
				)
			},
			{ quoted: msg }
		);
		return;
	}
	try {
		const data = await youtubeData(normalizedUrl, "mp3");
		await sock.sendMessage(
			sender,
			{
				text: botLabel(`Musik sedang didownload`)
			},
			{ quoted: msg }
		);
		const sanitize = (stz) => stz.replace(/[<>:"/\\|?*]/g, "");
		const fileName = `${sanitize(data.title)} - Motz.mp3`;
		await sock.sendMessage(
			sender,
			{
				audio: { url: data.audio },
				mimetype: "audio/mpeg",
				ptt: false,
				fileName
			},
			{ quoted: msg }
		);
	} catch (err) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					`Gagal download musik dari youtube. Coba periksa kembali url nya atau coba lapor ke admin bot`
				)
			},
			{ quoted: msg }
		);
		log.error(err);
	}
}

module.exports = { handleYoutubeMP4Download, handleYoutubeMP3Download };
