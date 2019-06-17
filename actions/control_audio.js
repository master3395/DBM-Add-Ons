module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Control Audio",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Audio Control",

//---------------------------------------------------------------------
// DBM Add-Ons Infos (Optional)
//
// These are the informations about this mod.
//---------------------------------------------------------------------

// Who made the mod (Default: "DBM Add-Ons Mod Developer")
author: "ZockerNico",

// The version of the mod (Default: 1.0.0)
version: "1.0.0",

// A short description for this mod
short_description: "Control the bot's audio.",

//---------------------------------------------------------------------

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	const actions = ["Stop Audio", "Pause Audio", "Resume Audio", "Enable Loop Item", "Disable Loop Item", "Enable Loop Queue", "Disable Loop Queue", "Enable Shuffle Queue", "Disable Shuffle Queue", "Enable AutoPlay", "Disable AutoPlay"];
	return `${actions[parseInt(data.action)]}`;
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["action"],

//---------------------------------------------------------------------
// Command HTML
//
// This function returns a string containing the HTML used for
// editting actions. 
//
// The "isEvent" parameter will be true if this action is being used
// for an event. Due to their nature, events lack certain information, 
// so edit the HTML to reflect this.
//
// The "data" parameter stores constants for select elements to use. 
// Each is an array: index 0 for commands, index 1 for events.
// The names are: sendTargets, members, roles, channels, 
//                messages, servers, variables
//---------------------------------------------------------------------

html: function(isEvent, data) {
	return `
<div style="float: left; width: 80%;">
	Audio Action:<br>
	<select id="action" class="round">
		<option value="0" selected>Stop Audio</option>
		<option value="1">Pause Audio</option>
		<option value="2">Resume Audio</option>
		<option value="3">Enable Loop Item</option>
		<option value="4">Disable Loop Item</option>
		<option value="5">Enable Loop Queue</option>
		<option value="6">Disable Loop Queue</option>
		<option value="7">Enable Shuffle Queue</option>
		<option value="8">Disable Shuffle Queue</option>
		<option value="9">Enable AutoPlay</option>
		<option value="10">Disable AutoPlay</option>
	</select>
</div>`
},

//---------------------------------------------------------------------
// Action Editor Init Code
//
// When the HTML is first applied to the action editor, this code
// is also run. This helps add modifications or setup reactionary
// functions for the DOM elements.
//---------------------------------------------------------------------

init: function() {
},

//---------------------------------------------------------------------
// Action Bot Function
//
// This is the function for the action within the Bot's Action class.
// Keep in mind event calls won't have access to the "msg" parameter, 
// so be sure to provide checks for variable existance.
//---------------------------------------------------------------------

action: function(cache) {
	const data = cache.actions[cache.index];
	const Audio = this.getDBM().Audio;
	const server = cache.server;
	let dispatcher;
	if(server) {
		dispatcher = Audio.dispatchers[server.id];
	} 
	if(dispatcher) {
		const action = parseInt(data.action);
		switch(action) {
			case 0:
				dispatcher._forceEnd = true;
				dispatcher.end();
				break;
			case 1:
				dispatcher.pause();
				break;
			case 2:
				dispatcher.resume();
				break;
			case 3:
				Audio.loopItem[server.id] = true;
				break;
			case 4:
				Audio.loopItem[server.id] = false;
				break;
			case 5:
				Audio.loopQueue[server.id] = true;
				break;
			case 6:
				Audio.loopQueue[server.id] = false;
				break;
			case 7:
				Audio.shuffleQueue[server.id] = true;
				break;
			case 8:
				Audio.shuffleQueue[server.id] = false;
				break;
			case 9:
				Audio.autoplay[server.id] = true;
				break;
			case 10:
				Audio.autoplay[server.id] = false;
				break;
		}
	}
	this.callNextAction(cache);
},

//---------------------------------------------------------------------
// Action Bot Mod
//
// Upon initialization of the bot, this code is run. Using the bot's
// DBM namespace, one can add/modify existing functions if necessary.
// In order to reduce conflictions between mods, be sure to alias
// functions you wish to overwrite.
//---------------------------------------------------------------------

mod: function(DBM) {
}

}; // End of module