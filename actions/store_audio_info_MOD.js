module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Store Audio Info",

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
short_description: "Store Informations about the current audio status of the bot.",

//---------------------------------------------------------------------

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	const actions = ['Is Audio stopped?', 'Is Audio paused?', 'Is Audio playing?', 'Is Loop Item enabled?', 'Is Loop Queue enabled?', 'Is Loop Queue disabled?', 'Is Shuffle Queue disabled?', 'Is AutoPlay enabled?', 'Is AutoPlay disabled?', 'Queue Url List', 'Queue Data List', 'Queue List Length', 'AutoPlay URL List', 'AutoPlay Amount List', 'AutoPlay Data List', 'AutoPlay List Length'];
	return `${actions[parseInt(data.action)]}`;
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["action", "storage", "varName"],

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
		<option value="0" selected>Is Audio stopped?</option>
		<option value="1">Is Audio paused?</option>
		<option value="2">Is Audio playing?</option>
		<option value="3">Is Loop Item enabled?</option>
		<option value="4">Is Loop Item disabled?</option>
		<option value="5">Is Loop Queue enabled?</option>
		<option value="6">Is Loop Queue disabled?</option>
		<option value="7">Is Shuffle Queue enabled?</option>
		<option value="8">Is Shuffle Queue disabled?</option>
		<option value="9">Is AutoPlay enabled?</option>
		<option value="10">Is AutoPlay disabled?</option>
		<option value="11">Queue Url List</option>
		<option value="12">Queue Data List</option>
		<option value="13">Queue List Length</option>
		<option value="14">AutoPlay URL List</option>
		<option value="15">AutoPlay Amount List</option>
		<option value="16">AutoPlay Data List</option>
		<option value="17">AutoPlay List Length</option>
	</select>
	<div>
		<div style="float: left; width: 35%;  padding-top: 8px;">
			Store In:<br>
			<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
				${data.variables[1]}
			</select>
		</div>
		<div id="varNameContainer" style="float: right; width: 60%; padding-top: 8px;">
			Variable Name:<br>
			<input id="varName" class="round" type="text"><br>
		</div>
	</div>
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
	const action = parseInt(data.action);
	var result;
	switch(action) {
		case 0:
			result = Audio.status('stopped', cache);
			break;
		case 1:
			result = Audio.status('paused', cache);
			break;
		case 2:
			result = Audio.status('playing', cache);
			break;
		case 3:
			result = String(Audio.loopItem[server.id] == true ? true : false);
			break;
		case 4:
			result = String(Audio.loopItem[server.id] == true ? true : false);
			break;
		case 5:
			result = String(Audio.loopQueue[server.id] == true ? true : false);
			break;
		case 6:
			result = String(Audio.loopQueue[server.id] == true ? true : false);
			break;
		case 7:
			result = String(Audio.shuffleQueue[server.id] == true ? true : false);
			break;
		case 8:
			result = String(Audio.shuffleQueue[server.id] == true ? true : false);
			break;
		case 9:
			result = String(Audio.autoplay[server.id] == true ? true : false);
			break;
		case 10:
			result = String(Audio.autoplay[server.id] == true ? true : false);
			break;
		case 11:
			result = Audio.queue[server.id].map(i => i = i[2]);
			break;
		case 12:
			result = Audio.queue[server.id].map(i => i = i);
			break;
		case 13:
			result = Audio.queue[server.id].length;
			break;
		case 14:
			result = Audio.autoplaydata.map(i => i = i.url);
			break;
		case 15:
			result = Audio.autoplaydata.map(i => i = i.amount);
			break;
		case 16:
			result = Audio.autoplaydata.map(i => i = i);
			break;
		case 17:
			result = Audio.autoplaydata.length;
			break;
	}
	this.storeValue(result, storage, varName, cache);
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