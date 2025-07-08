const { loadCommands } = require("./../core/utils");

const botBehavior = {
	botName: "Motz",
	botLabel: "*[MTZ]*",
	botMenu: "menu list",
	replyMyMessage: true,
	readMessage: true,
	isTyping: true,
	typingDelay: 1500
};

const returnCommand = loadCommands();
const botResponsePatterns = [
	{
		command: "buat qr code",
		handler: returnCommand["qrCode_create"]
	},
	{
		command: "baca qr code",
		handler: returnCommand["qrCode_read"]
	},
	{
		command: "ubah jadi stiker",
		handler: returnCommand["sticker_fromImage"]
	},
	{
		command: "buat teks jadi stiker",
		handler: returnCommand["sticker_fromText"]
	},
	{
		command: "download video tiktok",
		handler: returnCommand["downloaders_tiktok"].handleVideoTiktokDownload
	},
	{
		command: "download foto tiktok",
		handler: returnCommand["downloaders_tiktok"].handleImageTiktokDownload
	},
	{
		command: "download musik tiktok",
		handler: returnCommand["downloaders_tiktok"].handleMusicTiktokDownload
	},
	{
		command: "ekstrak gambar ke teks",
		handler: returnCommand["image_toText"]
	},
	{
		command: "cek nomor",
		handler: returnCommand["numbers_check"]
	},
	{
		command: "ambil poto profile",
		handler: returnCommand["numbers_getProfile"]
	},
	{
		command: "blokir nomor",
		handler: returnCommand["numbers_block"].blockNumber,
		isAdmin: true
	},
	{
		command: "buka blokir",
		handler: returnCommand["numbers_block"].unBlockNumber,
		isAdmin: true
	},
	{
		command: "buat grup",
		handler: returnCommand["group_create"],
		isAdmin: true
	},
	{
		command: "tambahkan nomor ke grup",
		handler: returnCommand["group_addNumbers"],
		isAdmin: true
	},
	{
		command: "keluarkan nomor",
		handler: returnCommand["group_kickNumbers"],
		isAdmin: true
	},
	{
		command: "tag semua",
		handler: returnCommand["group_tagAllNumbers"]
	},
	{
		command: "kirim pesan ke semua nomor di grup",
		handler: returnCommand["group_chatAllNumbers"],
		isAdmin: true
	}
];

module.exports = { botBehavior, botResponsePatterns };
