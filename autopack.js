/// api_version=2
// var Item = Java.type('net.minecraft.item.Item');
var GuiChest = Java.type('net.minecraft.client.gui.inventory.GuiChest');
var Item = Java.type('net.minecraft.item.Item');

var script = registerScript({
	name: "AutoPack",
	version: "1.0.0",
	authors: ["Foresteam"]
});

var neededN = 9;
var neededId = 79; // ice

function GetItemStacks(inv, allowPart) {
	var totalBlocks = 0;
	var ifound = [];
	for (var i = 0; i <= 36; i++) {
		var stack = inv.getStackInSlot(i);
		if (!stack)
			continue;
		var item = stack.getItem()
		var id = Item.getIdFromItem(item);
		if (id == neededId && stack.stackSize == item.getItemStackLimit()) {
			ifound.push(i);
			totalBlocks += stack.stackSize;
		}
	}
	if ((allowPart || neededN * 64 <= totalBlocks) && ifound.length > 0) {
		ifound.splice(9, ifound.length - 9);
		return ifound;
	}
	return null;
}

var isPacking = false;
var stacksPut = 0;
var cooldown = 0;

function Main(module) {
	module.on("enable", function () {
		
	});
	module.on('update', function () {
		var inv = mc.thePlayer.inventory
		var slots = GetItemStacks(inv, isPacking);
		var screen = mc.currentScreen;
		if (!(screen instanceof GuiChest)) {
			if (!isPacking && slots) {
				cooldown = Date.now() + Math.random() * 200 + 400;
				mc.thePlayer.sendChatMessage('/craft');
				return;
			}
			isPacking = false;
			cooldown = 0;
			stacksPut = 0;
			return;
		}
		if (!isPacking && !slots)
			return;
		// Chat.print(mc.currentScreen.inventoryRows);
		if (!isPacking && slots)
			isPacking = true;

		if (Date.now() < cooldown)
			return;
		cooldown = Date.now() + Math.random() * 200 + 400;

		var slot = screen.inventorySlots.getSlot(23);
		var stack = slot.getStack();

		if (stacksPut < neededN) {
			var slot = screen.inventorySlots.getSlotFromInventory(inv, slots[0]);
			screen.handleMouseClick(slot, slot.slotNumber, 0, 1);
			stacksPut++;
		}
		else if (stack) {
			screen.handleMouseClick(slot, slot.slotNumber, 0, 1);
			isPacking = false;
			stacksPut = 0;
			mc.thePlayer.closeScreen();
		}
	});
	var didLastThrow = Date.now();
}

script.registerModule({
	name: "AutoPack",
	category: "Misc", 
	description: "Packs ice (and mb smth else)"
}, Main);