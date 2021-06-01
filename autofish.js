/// api_version=2
var Item = Java.type('net.minecraft.item.Item');
var Block = Java.type('net.minecraft.block.Block');
var BlockPos = Java.type('net.minecraft.util.BlockPos');

var script = registerScript({
	name: "BetterFish",
	version: "1.0.0",
	authors: ["Foresteam"]
});

function Main(module) {
	module.on("enable", function() {
		// Chat.print("Module enabled");
		// var ply = mc.thePlayer;
		// var inv = ply.inventory;
		// var itemStack = inv.getCurrentItem();
		// var item = itemStack.getItem();
		// // fishind rod is 346
		// var id = Item.getIdFromItem(item);
		// Chat.print('ok');
	});
	var didLastThrow = Date.now();
	module.on('update', function() {
		var ply = mc.thePlayer;
		var inv = ply.inventory;
		var itemStack = inv.getCurrentItem();
		if (!itemStack)
			return;
		var item = itemStack.getItem();
		var id = Item.getIdFromItem(item);
		if (id != 346) // fishing rod is 346
			return;
		var fishEntity = ply.fishEntity;
		var timeHasCome = Date.now() - didLastThrow > 800;
		if (fishEntity) {
			var float = fishEntity.posY - parseInt(fishEntity.posY);
			// Chat.print(float);
			if (fishEntity.motionX == 0 && fishEntity.motionZ == 0 && fishEntity.motionY < 0 && float < 0.83 && timeHasCome) {
				didLastThrow = Date.now();
				mc.rightClickMouse();
			}
		}
		else
			if (timeHasCome) {
				mc.rightClickMouse();
				didLastThrow = Date.now();
			}
	});
}

script.registerModule({
	name: "BetterFish",
	category: "Player", 
	description: "An AutoFish of a normal human"
}, Main);