const axios = require("axios");

async function downloadTiktok(url) {
	try {
		const { data } = await axios.get(
			`https://tikwm.com/api?url=${encodeURIComponent(url)}`
		);
		return data;
	} catch (err) {
		log.error("❌ Error:", err.message);
	}
}

async function handleVideoTiktokDownload() {
	const match = text.match(/(https?:\/\/(?:vt|www)?\.tiktok\.com\/[^\s]+)/);
	if (!match || !match[1]) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					"Untuk mendownload video tiktok, pastikan link nya sudah di dapatkan.\nContoh:\n*download video tiktok https://vt.tiktok.com/xxx*"
				)
			},
			{ quoted: msg }
		);
		return;
	}
	try {
		await sock.sendMessage(
			sender,
			{ text: botLabel("Video sedang di proses") },
			{ quoted: msg }
		);
		const data = await downloadTiktok(match[1]);
		await sock.sendMessage(
			sender,
			{
				video: { url: data.data.play },
				caption: botLabel(
					`Video berhasil di download!\n*${data.data?.title}*`
				)
			},
			{ quoted: msg }
		);
	} catch (error) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					"Tidak bisa mendownload video tiktok. Coba lapor admin bot"
				)
			},
			{ quoted: msg }
		);
		log.error(error);
	}
}

async function handleImageTiktokDownload() {
	const match = text.match(/(https?:\/\/(?:vt|www)?\.tiktok\.com\/[^\s]+)/);
	if (!match || !match[1]) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					"Untuk mendownload foto tiktok, pastikan link nya sudah di dapatkan. Contoh\n*download foto tiktok https://vt.tiktok.com/xxx*"
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
				text: botLabel("Foto sedang di proses")
			},
			{ quoted: msg }
		);
		const data = await downloadTiktok(match[1]);
		for (const image of data.data.images) {
			await sock.sendMessage(sender, {
				image: { url: image }
			});
		}
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					`*${data.data.images.length}* foto berhasil di download!`
				)
			},
			{ quoted: msg }
		);
	} catch (error) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					"Tidak bisa mendownload video tiktok. Coba lapor admin bot"
				)
			},
			{ quoted: msg }
		);
		log.error(error);
	}
}

async function handleMusicTiktokDownload() {
	const match = text.match(/(https?:\/\/(?:vt|www)?\.tiktok\.com\/[^\s]+)/);
	if (!match || !match[1]) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					"Untuk mendownload musik tiktok, pastikan link nya sudah di dapatkan. Contoh\n*download musik tiktok https://vt.tiktok.com/xxx*"
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
				text: botLabel("Musik sedang di proses")
			},
			{ quoted: msg }
		);
		const data = await downloadTiktok(match[1]);
		await sock.sendMessage(
			sender,
			{
				audio: { url: data.data.music_info.play },
				mimetype: "audio/mpeg"
			},
			{ quoted: msg }
		);
		await sock.sendMessage(sender, {
			text: botLabel(
				`Musik berhasil di download!\n*${data.data.music_info.title}*`
			)
		});
	} catch (error) {
		await sock.sendMessage(
			sender,
			{
				text: botLabel(
					"Tidak bisa mendownload video tiktok. Coba lapor admin bot"
				)
			},
			{ quoted: msg }
		);
		log.error(error);
	}
}

module.exports = {
	handleVideoTiktokDownload,
	handleImageTiktokDownload,
	handleMusicTiktokDownload
};
