const { loadCommands } = require("./../core/utils");

const botBehavior = {
	botName: "Motz",
	botLabel: "[MTZ]",
	botMenu: "menu list",
	replyMyMessage: true,
	readMessage: true,
	isTyping: true,
	typeDelay: 1500
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
		handler: returnCommand["downloaders_tiktok"]
	},
	{
		command: "download video youtube",
		handler: returnCommand["downloaders_youtube"].handleYoutubeMP4Download
	},
	{
		command: "download musik youtube",
		handler: returnCommand["downloaders_youtube"].handleYoutubeMP3Download
	},
	{
		command: "ekstrak gambar ke teks",
		handler: returnCommand["image_toText"]
	},
	{
	  command: "cek nomor",
	  handler: returnCommand["numbers_check"],
	},
	{
	  command: "ambil poto profil",
	  handler: returnCommand["numbers_getProfile"]
	},
	{
		command: "blokir nomor",
		handler: returnCommand["numbers_block"].blockNumber,
		isAdmin:true
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
		handler: returnCommand["group_addUsers"],
		isAdmin: true
	},
	{
		command: "kirim pesan ke semua nomor di grup",
		handler: returnCommand["group_chatAllUsersFromGroup"],
		isAdmin: true
	}
];

module.exports = { botBehavior, botResponsePatterns };
