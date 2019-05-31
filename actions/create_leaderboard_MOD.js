module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "Create Leaderboard",

	//---------------------------------------------------------------------
	// Action Section
	//
	// This is the section the action will fall into.
	//---------------------------------------------------------------------

	section: "Lists and Loops",

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
	short_description: "This mod will sort members by their data",

	//---------------------------------------------------------------------
	
	//---------------------------------------------------------------------
	// Action Subtitle
	//
	// This function generates the subtitle displayed next to the name.
	//---------------------------------------------------------------------

	subtitle: function (data) {
		const list = ['Current Server', 'Temp Variable', 'Server Variable', 'Global Variable', 'All Bot Servers'];
		return `${list[parseInt(data.server)]}: Create User Leaderboard by "${data.data1}" & "${data.data2}"`;
	},

	//---------------------------------------------------------------------
	// Action Storage Function
	//
	// Stores the relevant variable info for the editor.
	//---------------------------------------------------------------------

	variableStorage: function (data, varType) {
		const type = parseInt(data.storage);
		const storagetype = parseInt(data.storagetype);
		let dataTypes = ['List', 'Text'];
		return ([data.varName2, dataTypes[storagetype]]);
	},

	//---------------------------------------------------------------------
	// Action Fields
	//
	// These are the fields for the action. These fields are customized
	// by creating elements with corresponding IDs in the HTML. These
	// are also the names of the fields stored in the action's JSON data.
	//---------------------------------------------------------------------

	fields: ["server", "varName", "data1", "data2", "reverse", "limit", "skipdata", "storagetype", "content", "storage", "varName2"],

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
	<div style="width: 550px; height: 350px; overflow-y: scroll; overflow-x: hidden;">
		<div>
			<p>
			Made by ${this.author}.
			</p>
		</div><br>
		<div style="float: left; width: 35%;">
			Source Server:<br>
			<select id="server" class="round" onchange="glob.onChange(this, 'varNameContainer')">
				${data.servers[isEvent ? 1 : 0]}
				<option value="4">All Bot Servers</option>
			</select>
		</div>
		<div id="varNameContainer" style="display: none; float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text" list="variableList">
		</div><br><br><br>
		<div style="padding-top: 8px; display: table;">
			<div style="display: table-cell;">
				Data Name:<br>
				<input id="data1" class="round" type="text">
			</div>
			<div style="display: table-cell;">
				Alternative Data Name:<br>
				<input id="data2" class="round" type="text">
			</div>
			<div style="display: table-cell;">
				Reverse:<br>
				<select id="reverse" class="round" style="width: 280%;">
					<option value="0" selected>No</option>
					<option value="1">Yes</option>
				</select>
			</div>
		</div><br>
		<div style="padding-top: 8px; display: table;">
			<div style="display: table-cell;">
				Result Limit:<br>
				<input id="limit" class="round" type="text" value="10" placeholder="Optional">
			</div>
			<div style="display: table-cell;">
				Skip Undefined Data:<br>
				<select id="skipdata" class="round">
					<option value="0" selected>Check No Value</option>
					<option value="1">Check Data1's Value</option>
					<option value="2">Check Data2's Value</option>
					<option value="3">Check Both Values</option>
				</select>
			</div>
			<div style="display: table-cell; padding-left: 18px;">
				Store As:<br>
				<select id="storagetype" class="round" style="width: 260%;">
					<option value="0" selected>List</option>
					<option value="1">Text</option>
				</select>
			</div>
		</div><br>
		<div style="float: left; width: 104%; padding-top: 8px;">
			Leaderboard Content:<br>
			<input id="content" class="round" type="text" value="\${position}. \${user} - Level: \${data1} XP: \${data2}"><br>
		</div>
		<div style="float: left; width: 35%;  padding-top: 8px;">
			Store In:<br>
			<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer2')">
				${data.variables[1]}
			</select>
		</div>
		<div id="varNameContainer2" style="float: right; width: 60%; padding-top: 8px;">
			Variable Name:<br>
			<input id="varName2" class="round" type="text"><br>
		</div><br><br><br>
		<div style="float: left; width: 100%; padding-top: 8px;">
			<h3>
				Variables for the Leaderboard Content:
			</h3>
			<p>
				Leaderboard Position: \${position}<br>
				Current User: \${user}<br>
				Data Value: \${data1}<br>
				Alternative Data Value: \${data2}<br>
			</p>
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

		glob.onChange = function() {
			var varNameContainer = document.getElementById('varNameContainer');
			switch(parseInt(document.getElementById('server').value)) {
				case 0:
				case 4:
					varNameContainer.style.display = 'none';
					break;
				case 1:
				case 2:
				case 3:
					varNameContainer.style.display = null;
					break;
			}
		}
		glob.variableChange(document.getElementById('storage'), 'varNameContainer2');
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
		const AddOns = this.getAddOns();
		const arraySort = AddOns.require('array-sort');
		const server = parseInt(data.server);
		const varName = this.evalMessage(data.varName, cache);
		const data1 = this.evalMessage(data.data1, cache);
		const data2 = this.evalMessage(data.data2, cache);
		const reverse = parseInt(data.reverse) == 1 ? false : true;
		const limit = !parseInt(this.evalMessage(data.limit, cache)) ? Number.MAX_VALUE : parseInt(data.limit);
		const skipdata = parseInt(data.skipdata);
		const content = data.content;
		var users;
		var list = [];
		var results = [];
		var result = [];

		if(server == 4) {
			users = this.getDBM().Bot.bot.users.array();
		} else {
			var targetServer = this.getServer(server, varName, cache);
			if(!targetServer) {
				return this.callNextAction(cache);
			} else {
				users = targetServer.members.array();
			}
		}

		for(var loop = 0; loop < users.length; loop++) {
			var check;
			switch(skipdata) {
				case 1:
					check = (users[loop].data(data1, 'nodata1existing') === 'nodata1existing' ? false : true);
					break;
				case 2:
					check = (users[loop].data(data2, 'nodata2existing') === 'nodata2existing' ? false : true);
					break;
				case 3:
					check = (users[loop].data(data1, 'nodata1existing') === 'nodata1existing' || users[loop].data(data2, 'nodata2existing') === 'nodata2existing' ? false : true);
					break;
				default:
					check = true;
			}
			if(check) {
				list.push({'user': (users[loop].user ? users[loop].user : users[loop]), 'data1': users[loop].data(data1, 0), 'data2': users[loop].data(data2, 0)});
			}
		}

		if(data2 !== undefined && data2 !== "") {
			if(reverse) {
				results = arraySort(list, ['data1', 'data2'], {'reverse': true});
			} else {
				results = arraySort(list, ['data1', 'data2']);
			}
		} else {
			if(reverse) {
				results = arraySort(list, 'data1', {'reverse': true});
			} else {
				results = arraySort(list, 'data1');
			}
		}

		for(var loop = 0; loop < results.length; loop++) {
			async function insertData(data, res, text, pos) {
				const position = pos+1;
				const user = data[loop].user;
				const data1 = data[loop].data1;
				const data2 = data[loop].data2;
				var content;
				
				if(text.match(/\$\{.*\}/im)) {
					try {
						content = eval('`' + text.replace(/`/g,'\\`').replace(/\${text}/g, '').replace(/\${pos}/g, '').replace(/\${data}/g, '').replace(/\${res}/g, '') + '`');
					} catch(e) {
						content = user;
					}
					res.push(content);
				} else {
					res.push(user);
				}
			}
			if(loop < limit) {
				insertData(results, result, content, loop);
			} else {
				break;
			}
		}

		if (result !== undefined) {
			const storage = parseInt(data.storage);
			const varName2 = this.evalMessage(data.varName2, cache);
			const storagetype = parseInt(data.storagetype);
			if(storagetype == 1) {
				this.storeValue(result.join('\n'), storage, varName2, cache);
			} else {
				this.storeValue(result, storage, varName2, cache);
			}
		};
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