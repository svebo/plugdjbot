const PlugAPI = require('plugapi');

const bot = new PlugAPI({
	email: process.env.EMAIL,
	password: process.env.PASSWORD
});

let autoskip = false;

bot.connect('quintor');
bot.sendChat(`Quintor Bot activated`);

bot.on(PlugAPI.events.ROOM_JOIN, (room) => {
	console.log(`Joined ${room}`);
});

bot.on('command:autoskip', (data) => {
	if (data.havePermission(PlugAPI.ROOM_ROLE.RESIDENTDJ)) {
		autoskip = true;
		data.respond(`Set autoskip to ${autoskip}`);
	}
});

bot.on(PlugAPI.events.ADVANCE, () => onNewMedia());
bot.on(PlugAPI.events.MOD_SKIP, () => onNewMedia());
bot.on(PlugAPI.events.USER_SKIP, () => onNewMedia());
	
function onNewMedia(){
	let media = bot.getMedia();
	
	console.log(`${media.author} - ${media.title}`);
	console.log(`Autoskip: ${autoskip}`);

	bot.sendChat(`Currently playing: ${media.author} - ${media.title}`);
	bot.woot();

	setTimeout(() => {
		setTimeout(() => skipCheck(), media.duration * 1000);
	}, 1000);
};

function skipCheck(){
	const rem = bot.getTimeRemaining();
	if(rem <= 0 && autoskip){
		bot.moderateForceSkip();
	}
}
