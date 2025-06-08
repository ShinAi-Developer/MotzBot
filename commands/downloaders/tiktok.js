const { ttdl } = require("ruhend-scraper");
const log = require("./../../core/logger/logger");
const { botLabel } = require("./../../core/utils");

async function tiktokData(url) {
	const data = await ttdl(url);
	return data;
}

module.exports = async function handleTiktokDownload(context) {
	const { sock, sender, msg, text } = context;
	const matchTiktokLink = text.match(
		/vt\.tiktok\.com\/([A-Za-z0-9]+)/
	);
	if (!matchTiktokLink || !matchTiktokLink[1]) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					`Untuk mendownload video tiktok pastikan linknya sudah di ketikan. Contoh\ndownload video tiktok https://vt.tiktok.com/xxx`
				)
			},
			{ quoted: msg }
		);
		return;
	}
	try {
		await sock.sendMessage(
			sender,
			{
				text: botLabel("Video sedang didownload")
			},
			{ quoted: msg }
		);
		const data = await tiktokData(text);
		await sock.sendMessage(
			sender,
			{
				video: { url: data.video_hd || data.video },
				caption: botLabel(`Video berhasil didownload \n*${data.title}*`)
			},
			{ quoted: msg }
		);
	} catch (err) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					`Gagal download video tiktok. Coba periksa kembali url nya atau coba lapor ke admin bot`
				)
			},
			{ quoted: msg }
		);
		log.error(err);
	}
};
