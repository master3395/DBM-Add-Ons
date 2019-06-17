module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "Add URL to AutoPlay",

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
	short_description: "This action will add an url to the autoplay database.",

	//---------------------------------------------------------------------
	
	//---------------------------------------------------------------------
	// Action Subtitle
	//
	// This function generates the subtitle displayed next to the name.
	//---------------------------------------------------------------------

	subtitle: function (data) {
		return `Add "${data.url}" to AutoPlay`;
	},

	//---------------------------------------------------------------------
	// Action Storage Function
	//
	// Stores the relevant variable info for the editor.
	//---------------------------------------------------------------------

	variableStorage: function (data, varType) {
		const type = parseInt(data.storage);
		if (type !== varType) return;
		let dataType = 'Unknown Type';
		return ([data.varName, dataType]);
	},

	//---------------------------------------------------------------------
	// Action Fields
	//
	// These are the fields for the action. These fields are customized
	// by creating elements with corresponding IDs in the HTML. These
	// are also the names of the fields stored in the action's JSON data.
	//---------------------------------------------------------------------

	fields: ["url"],

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

	html: function (isEvent, data) {
		return `
	<div>
		<div>
			<p>
			Made by ${this.author}.
			</p>
		</div>
		<div style="float: left; width: 100%; padding-top: 8px;">
			<br>URL (Needs to be YouTube):<br>
			<input id="url" class="round" type="text">
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

	init: function () {
		const { glob, document } = this;

	},

	//---------------------------------------------------------------------
	// Action Bot Function
	//
	// This is the function for the action within the Bot's Action class.
	// Keep in mind event calls won't have access to the "msg" parameter,
	// so be sure to provide checks for variable existance.
	//---------------------------------------------------------------------

	action: function (cache) {
		const data = cache.actions[cache.index];
		const Audio = this.getDBM().Audio;
		const url = this.evalMessage(data.url, cache);
		
		if(url.startsWith('https://www.youtube.com/watch?v=')) {
			Audio.addAutoPlay(url.slice(0, 43));
		} else if(url.startsWith('https://youtu.be/')) {
			Audio.addAutoPlay(`https://www.youtube.com/watch?v=${url.slice(17, 28)}`);
		} else {
			console.log(`WARNING: "${url}" isn't a valid YouTube video url!\nUnable to add this url to the AutoPlay database.`);
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

	mod: function (DBM) {

	}

}; // End of module