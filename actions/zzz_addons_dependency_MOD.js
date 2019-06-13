//Create Dependency
//---------------------------------------------------------------
const AddOns = {}

AddOns.author = 'ZockerNico';
AddOns.version = '2.0.0';
AddOns.description = 'This is the main mod (dependency) which is needed for many other mods to work. It overwrites many parts of your bot.js to give you access to better functions.';
AddOns.nodeModules = new Map();
AddOns.settings = {};

//Load Dependency Settings
//---------------------------------------------------------------
try {
    AddOns.settings = JSON.parse(require('fs').readFileSync('./data/addons_settings.json'));
    if(AddOns.settings.loadAddOns != 'true' && AddOns.settings.loadAddOns != 'false') {
        AddOns.settings.loadAddOns = 'true';
    }
    if(AddOns.settings.fixYouTubeLivestreams != 'true' && AddOns.fixYouTubeLivestreams[key] != 'false') {
        AddOns.settings.fixYouTubeLivestreams = 'true';
    }
    if(AddOns.settings.logYouTubeLivestreams != 'true' && AddOns.settings.logYouTubeLivestreams != 'false') {
        AddOns.settings.logYouTubeLivestreams = 'true';
    }
    if(AddOns.settings.highlightInfos != 'true' && AddOns.settings.highlightInfos != 'false') {
        AddOns.settings.highlightInfos = 'true';
    }
    if(AddOns.settings.secureLoad != 'true' && AddOns.settings.secureLoad != 'false') {
        AddOns.settings.secureLoad = 'false';
    }
} catch(e) {
    AddOns.settings = {
        'loadAddOns': 'true',
        'fixYouTubeLivestreams': 'true',
        'logYouTubeLivestreams': 'false',
        'highlightInfos': 'false',
        'secureLoad': 'false'
    }
}
require('fs').writeFileSync('./data/addons_settings.json', JSON.stringify(AddOns.settings));

//NodeModule Installer
//---------------------------------------------------------------
AddOns.install = function(nodeModule, forceInstallation) {
    return new Promise((resolve, reject) => {
        if(!nodeModule) {
            reject(nodeModule);
        }
        function checkModule() {
            var result;
            try {
                require.resolve(nodeModule);
                result = true;
            } catch(e) {
                result = false;
            }
            return result;
        }
        var forceInstallationCheck = checkModule();
        if(forceInstallation == true && forceInstallationCheck == true) {
            //Force installation / update
            for(var timeout = 0; timeout < 3; timeout++) {
                const child_process = require('child_process');
                var command = 'npm install ' + nodeModule + ' --save';
                this.settings.highlightInfos == 'true' ? console.log(`\x1b[1m\x1b[4m\x1b[32mDBM Add-Ons\x1b[0m: Update${timeout > 0 ? ` (Attempt: ${timeout+1})` : ``} of "\x1b[1m${nodeModule}\x1b[0m" is starting, please wait...`) : console.log(`DBM Add-Ons: Update${timeout > 0 ? ` (Attempt: ${timeout+1})` : ``} of "${nodeModule}" is starting, please wait...`);
                try {
                    child_process.execSync(command, {cwd: process.cwd(), stdio:[0,1,2]});
                } catch(e) {}
                var check = checkModule();
                if(check === true) {
                    break;
                }
            }
            var result = checkModule();
            if(result == true) {
                this.nodeModules.set(`${nodeModule}`, require(nodeModule));
                this.settings.highlightInfos == 'true' ? console.log(`\x1b[1m\x1b[4m\x1b[32mDBM Add-Ons\x1b[0m: Update of "\x1b[1m${nodeModule}\x1b[0m" is finished!`) : console.log(`DBM Add-Ons: Update of "${nodeModule}" is finished!`);
                resolve(nodeModule);
            } else {
                this.settings.highlightInfos == 'true' ? console.log(`\x1b[1m\x1b[4m\x1b[32mDBM Add-Ons\x1b[0m: Update of "\x1b[1m${nodeModule}\x1b[0m" failed! Please run "\x1b[1mnpm install ${nodeModule} --save\x1b[0m" manually.`) : console.log(`DBM Add-Ons: Update of "${nodeModule}" failed! Please run "npm install ${nodeModule} --save" manually.`);
                reject(nodeModule);
            }

        } else {
            //Start installation only if needed
            for(var timeout = 0; timeout < 3; timeout++) {
                var check = checkModule();
                if(check === true) {
                    break;
                }
                const child_process = require('child_process');
                var command = 'npm install ' + nodeModule + " --save";
                this.settings.highlightInfos == 'true' ? console.log(`\x1b[1m\x1b[4m\x1b[32mDBM Add-Ons\x1b[0m: Installation${timeout > 0 ? ` (Attempt: ${timeout+1})` : ``} of "\x1b[1m${nodeModule}\x1b[0m" is starting, please wait...`) : console.log(`DBM Add-Ons: Installation${timeout > 0 ? ` (Attempt: ${timeout+1})` : ``} of "${nodeModule}" is starting, please wait...`);
                try {
                    child_process.execSync(command, {cwd: process.cwd(), stdio:[0,1,2]});
                } catch(e) {}
            }
            var result = checkModule();
            if(result == true) {
                this.nodeModules.set(`${nodeModule}`, require(nodeModule));
                if(timeout !== 0) {
                    this.settings.highlightInfos == 'true' ? console.log(`\x1b[1m\x1b[4m\x1b[32mDBM Add-Ons\x1b[0m: Installation of "\x1b[1m${nodeModule}\x1b[0m" is finished!`) : console.log(`DBM Add-Ons: Installation of "${nodeModule}" is finished!`);
                }
                resolve(nodeModule);
            } else {
                this.settings.highlightInfos == 'true' ? console.log(`\x1b[1m\x1b[4m\x1b[32mDBM Add-Ons\x1b[0m: Installation of "\x1b[1m${nodeModule}\x1b[0m" failed! Please run "\x1b[1mnpm install ${nodeModule} --save\x1b[0m" manually.`) : console.log(`DBM Add-Ons: Installation of "${nodeModule}" failed! Please run "npm install ${nodeModule} --save" manually.`);
                reject(nodeModule);
            }
        }
    });
}
//---------------------------------------------------------------

//NodeModule Updater
//---------------------------------------------------------------
AddOns.update = function(nodeModule) {
    this.install(nodeModule, true);
    return this.nodeModules.get(nodeModule);
}
//---------------------------------------------------------------

//NodeModule Require Function
//---------------------------------------------------------------
AddOns.require = function(nodeModule) {
    this.install(nodeModule);
    return this.nodeModules.get(nodeModule);
}
//---------------------------------------------------------------

//DBM Section
//---------------------------------------------------------------
module.exports = {
    name: "DBM Add-Ons Dependency",
    section: "API Interacting",

    author: AddOns.author,
    version: AddOns.version,
    short_description: AddOns.description,

    requiresAudioLibraries: true,

    subtitle: function(data) {
        return `DBM Add-Ons Dependency`;
    },
    
    variableStorage: function(data, varType) {
        /*const type = parseInt(data.storage);
        if (type !== varType) return;
        let dataType = 'Unknown Type';
        return ([data.varName, dataType]);*/
    },

    fields: ["module", "forceInstallation", "storage", "varName"],

    html: function(isEvent, data) {
        return `
        <style>
            .embed {
                background-color: #2f3136;
                color: #dcddde;
                margin: 4px;
                padding: 4px;
            }
        </style>
        <div style="width: 550px; height: 350px; overflow-y: scroll; overflow-x: hidden;">
            <div style="width: 100%;">
                <h1>Add-Ons Dependency</h1>
                What is this? Very simple!<br>
                This mod (dependency) allows every other DBM Add-Ons mod to install needed modules and gives you access to better bot functions.<br>
                You can access this mod via the Run Script action by using <span class="embed">this.getAddOns()</span> or via the action you're looking at.
            </div>
            <div style="width: 100%; padding-top: 32px;">
                <h2>NodeModules-Installer</h2>
            </div>
            <div style="float: left; padding-top: 8px; width: 60%;">
                NodeModule-Name:<br>
                <input id="module" class="round">
            </div>
            <div style="float: left; padding-top: 8px; padding-left: 16px; width: 30%;">
                Force Installation:<br>
                <select id="forceInstallation" class="round">
                    <option value="true">Yes</option>
                    <option value="false" selected>No</option>
                </select>
            </div>
            <div style="padding-top: 8px;">
                <div style="float: left; width: 35%;">
                    <br>Store In:<br>
                    <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
                        ${data.variables[0]}
                    </select>
                </div>
                <div id="varNameContainer" style="float: right; width: 60%;">
                    <br>Variable Name:<br>
                    <input id="varName" class="round" type="text">
                </div>
            </div>
        </div>`
    },

    init: function() {
        const {glob, document} = this;
        
        glob.variableChange(document.getElementById('storage'), 'varNameContainer');
    },

    action: function(cache) {
        const data = cache.actions[cache.index];

        if(data.module != "" && data.module != undefined) {
            var result = this.getAddOns().update(this.evalMessage(data.module, cache), (data.forceInstallation == "true" ? true : false));
        }
        this.storeValue((parseInt(result) === NaN ? 0 : parseInt(result)), data.storage, data.varName, cache);
        this.callNextAction(cache);
    },

    mod: function(DBM) {

        if(AddOns.settings.loadAddOns == 'true') {
            
            DBM.Actions.getAddOns = function() {
                return AddOns;
            }

            if(AddOns.settings.secureLoad !== 'true') {
                //Require Modules
                Object.util = null;
                var util = AddOns.require('util');
                if(util !== undefined && util !== null) {
                    Object.util = util;
                }
                String.validUrl = null;
                var validUrl = AddOns.require('valid-url');
                if(validUrl !== undefined && validUrl !== null) {
                    Object.validUrl = validUrl;
                }
                DBM.Audio.ytdl = null;
                var ytdl = AddOns.require('ytdl-core');
                if(ytdl !== undefined && ytdl !== null) {
                    DBM.Audio.ytdl = ytdl;
                }
                DBM.Audio.ytdl_discord = null;
                var ytdl_discord = AddOns.require('ytdl-core-discord');
                if(ytdl_discord !== undefined && ytdl_discord !== null) {
                    DBM.Audio.ytdl_discord = ytdl_discord;
                }
                DBM.Audio.ytinfo = null;
                var ytinfo = AddOns.require('youtube-info');
                if(ytinfo !== undefined && ytinfo !== null) {
                    DBM.Audio.ytinfo = ytinfo;
                }
            
                //Check for URL
                String.isUrl = function(suspect, type) {
                    //DOCUMENTATION: https://www.npmjs.com/package/valid-url
                    if(!url || !type || !String.validUrl) {
                        return false;
                    }
                    switch(type) {
                        default:
                        case 'Uri':
                            return String.validUrl.isUri(suspect);
                        case 'HttpUri':
                            return String.validUrl.isHttpUri(suspect);
                        case 'HttpsUri':
                            return String.validUrl.isHttpsUri(suspect);
                        case 'WebUri':
                            return String.validUrl.isWebUri(suspect);
                    }
                }
            
                //Inspect Object
                Object.inspect = function(object, depth) {
                    //DOCUMENTATION: https://www.npmjs.com/package/util
                    if(typeof(object) != 'object' || !Object.util) {
                        return false;
                    }
                    return Object.util.inspect(object, {depth: (parseInt(depth) >= 0 ? parseInt(depth) : 0)});
                }

                //BotReady
                DBM.Bot.onReady = function() {
                    if(process.send) process.send('BotReady');
                    console.log(`${this.bot.user.username} is ready!`);
                    this.restoreVariables();
                    this.preformInitialization();
                }
            }

            //Check for Command
            DBM.Bot.checkCommand = function(msg) {
                let command = DBM.Bot.checkTag(msg);
                if(command) {
                    if(!DBM.Bot._caseSensitive) {
                        command = command.toLowerCase();
                    }
                    const cmd = DBM.Bot.$cmds[command];
                    if(cmd) {
                        DBM.Actions.preformActions(msg, cmd);
                        return true;
                    }
                }
                return false;
            }

            //Create Prefix Data Object
            DBM.Bot.tags = {};

            //Load Prefixes
            DBM.Bot.loadTags = function() {
                try {
                    DBM.Bot.tags = JSON.parse(require('fs').readFileSync('./data/prefixes.json'));
                    AddOns.settings.highlightInfos == 'true' ? console.log('\x1b[1m\x1b[4m\x1b[32mDBM Add-Ons\x1b[0m: Prefixes loaded!') : console.log('DBM Add-Ons: Prefixes loaded!');
                } catch(e) {
                    DBM.Bot.tags = {};
                }
            }
            DBM.Bot.loadTags();
            
            //Check Prefix
            DBM.Bot.checkTag = function(msg) {
                var content = msg.content;
                const tag = DBM.Bot.tags[msg.guild.id] || DBM.Files.data.settings.tag;
                const separator = DBM.Files.data.settings.separator || '\\s+';
                content = content.split(new RegExp(separator))[0];
                if(content.startsWith(tag)) {
                    return content.substring(tag.length);
                }
                return null;
            }

            //Set Prefix
            DBM.Bot.setTag = function(prefix, id) {
                if(!prefix || !id) return false;
                DBM.Bot.tags[id] = prefix;
                require('fs').writeFile('./data/prefixes.json', `${JSON.stringify(DBM.Bot.tags)}`, function(error) {
                    if(error) {
                        return false;
                    } else {
                        return true;
                    }
                });
            }

            //Restart Bot
            DBM.Files.restartBot = function() {
                //! Not finished
                //TODO After the restart, the websocket shouldn't have the old bot still loaded
                return 'Not finished!';
                var username = DBM.Bot.bot.user.username;
                console.log(`Restarting ${username} in 5 seconds...`);
                DBM.Bot.bot.destroy();
                DBM = {};
                setTimeout(function() {
                    try {
                        eval(require('fs').readFileSync('./bot.js'));
                    } catch(error) {
                        if(error) console.error(error);
                    }
                    console.log(`Restarting ${username}!`);
                }, 5000);
            }

            //Reload Commands & Events
            DBM.Files.reloadBot = function(Bot) {
                //! Not finished
                //TODO After the execution, already running commands shouldn't be called twice
                return 'Not finished!';
                Bot.$cmds = {}; // Normal commands
                Bot.$icds = []; // Includes word commands
                Bot.$regx = []; // Regular Expression commands
                Bot.$anym = []; // Any message commands
                Bot.$evts = {}; // Events
                Bot.reformatData();
                Bot.initEvents();
                return true;
            }

            //Clear Member Data
            DBM.DiscordJS.GuildMember.prototype.clearData = function() {
                const id = DBM.DiscordJS.GuildMember.prototype.id;
                const data = DBM.Files.data.players;
                data[id] = {};
                DBM.DBM.Files.saveData('players');
            }
            DBM.DiscordJS.User.prototype.clearData = DBM.DiscordJS.GuildMember.prototype.clearData;

            //Clear Server Data
            DBM.DiscordJS.Guild.prototype.clearData = function() {
                const id = DBM.DiscordJS.Guild.prototype.id;
                const data = DBM.Files.data.servers;
                data[id] = {};
                DBM.Files.saveData('servers');
            }

            //Create Audio Data Objects
            DBM.Audio.queue = [];
            DBM.Audio.volumes = {};
            DBM.Audio.connections = [];
            DBM.Audio.dispatchers = [];
            DBM.Audio.playingnow = [];
            DBM.Audio.loopQueue = [];
            DBM.Audio.loopItem = [];
            DBM.Audio.shuffleQueue = [];
            DBM.Audio.autoplay = [];
            DBM.Audio.autoplaydata = [];

            //Load Volumes Data
            DBM.Audio.loadVolumes = function() {
                try {
                    var data = JSON.parse(require('fs').readFileSync('./data/volumes.json', 'utf8'));
                } catch(e) {
                    var data = {};
                }
                DBM.Audio.volumes = data;
                return true;
            };
            DBM.Audio.loadVolumes();

            //Save Volumes Data
            DBM.Audio.saveVolumes = function() {
                require('fs').writeFile('./data/volumes.json', `${JSON.stringify(DBM.Audio.volumes)}`, function(error) {
                    if(error) {
                        console.log(error);
                        return false;
                    };
                });
                return true;
            }

            //Set the Volume
            DBM.Audio.setVolume = function(volume, cache) {
                if(!cache.server || parseFloat(volume) === NaN || parseFloat(volume) === undefined) return false;
                const id = cache.server.id;
                DBM.Audio.saveVolumes();
                DBM.Audio.volumes[id] = volume;
                if(DBM.Audio.dispatchers[id]) {
                    DBM.Audio.dispatchers[id].setVolumeLogarithmic(volume);
                }
            };

            //Load AutoPlay Data
            DBM.Audio.loadAutoPlay = function() {
                try {
                    var data = JSON.parse(require('fs').readFileSync('./data/autoplay.json', 'utf8')).list;
                } catch(e) {
                    var data = [];
                }
                DBM.Audio.autoplaydata = data;
                return true;
            };
            DBM.Audio.loadAutoPlay();

            //Save AutoPlay Data
            DBM.Audio.saveAutoPlay = function() {
                var data = [];
                var error;
                DBM.Audio.autoplaydata.forEach(item => {
                    try {
                        var jsonData = JSON.stringify(item);
                    } catch(e) {
                        if(e) error = e;
                    };
                    if(error) {
                        data.push(item);
                        error = undefined;
                    } else {
                        data.push(jsonData);
                    };
                });
                setTimeout(function(){
                    var jsonFile = JSON.stringify({"list": data});
                    require('fs').writeFile('./data/autoplay.json', `${jsonFile.toString().replace(/\\"/g, '"').replace(/"{/g,'{').replace(/}"/g, '}')}`, function(error) {
                        if(error) {
                            console.log(error);
                            return false;
                        };
                    });
                }, 500)
                return true;
            };

            //Get AutoPlay Data
            DBM.Audio.getAutoPlay = function(type, data) {
                if(!type) {
                    return false;
                };
                switch(type) {
                    case 'position':
                        if(DBM.Audio.autoplaydata[data] !== undefined) {
                            return DBM.Audio.autoplaydata[data];
                        } else {
                            return false;
                        };
                    case 'amount':
                        for(loop = 0; loop < DBM.Audio.autoplaydata.length; loop++) {
                            if(DBM.Audio.autoplaydata[loop] !== undefined && DBM.Audio.autoplaydata[loop].amount == data) {
                                return data;
                            } else if(loop == DBM.Audio.autoplaydata.length-1) {
                                return false;
                            };
                        };
                        break;
                    case 'url':
                        for(loop = 0; loop < DBM.Audio.autoplaydata.length; loop++) {
                            if(DBM.Audio.autoplaydata[loop] !== undefined && DBM.Audio.autoplaydata[loop].url == data) {
                                return data;
                            } else if(loop == DBM.Audio.autoplaydata.length-1) {
                                return false;
                            };
                        };
                        break;
                    default:
                        return false;
                };
            };

            //Get Top AutoPlay Data
            DBM.Audio.topAutoPlay = function(min) {
                if(parseInt(min) === NaN) {
                    return false;
                }
                var list = [];
                for(loop = 0; loop < DBM.Audio.autoplaydata.length; loop++) {
                    if(DBM.Audio.autoplaydata[loop] !== undefined && DBM.Audio.autoplaydata[loop].amount >= parseInt(min)) {
                        list.push(DBM.Audio.autoplaydata[loop]);
                    };
                    if(loop == DBM.Audio.autoplaydata.length-1) {
                        return list;
                    };
                };
            };

            //Add AutoPlay Data
            DBM.Audio.addAutoPlay = function(url) {
                var item = DBM.Audio.getAutoPlay('url', url);
                setTimeout(function() {
                    if(item == undefined || item == false) {
                        DBM.Audio.autoplaydata.push({"url": url, "amount": 1});
                        DBM.Audio.saveAutoPlay();
                        return true;
                    } else {
                        for(loop = 0; loop < DBM.Audio.autoplaydata.length; loop++) {
                            if(DBM.Audio.autoplaydata[loop].url == url) {
                                var current = DBM.Audio.autoplaydata[loop].amount;
                                DBM.Audio.autoplaydata[loop] = {"url": url, "amount": current+1};
                                DBM.Audio.saveAutoPlay();
                                return true;
                            };
                            if(loop == DBM.Audio.autoplaydata.length-1) {
                                return false;
                            };
                        };
                    };
                }, 500);
            };

            //Connect to Voice
            DBM.Audio.connectToVoice = function(voiceChannel) {
                if(!voiceChannel) return false;
                const promise = voiceChannel.join()
                promise.then(function(connection) {
                    DBM.Audio.connections[voiceChannel.guild.id] = connection;
                    connection.on('disconnect', function() {
                        DBM.Audio.dispatchers[voiceChannel.guild.id] = null;
                        DBM.Audio.connections[voiceChannel.guild.id] = null;
                        DBM.Audio.playingnow[voiceChannel.guild.id] = null;
                        DBM.Audio.queue[voiceChannel.guild.id] = [];
                        DBM.Audio.loopQueue[voiceChannel.guild.id] = false;
                        DBM.Audio.loopItem[voiceChannel.guild.id] = false;
                        DBM.Audio.shuffleQueue[voiceChannel.guild.id] = false;
                        DBM.Audio.autoplay[voiceChannel.guild.id] = false;
                    });
                }).catch(console.error);
                return promise;
            };

            //Disconnect from Voice
            DBM.Audio.disconnectFromVoice = function(voiceChannel) {
                if(!voiceChannel) return false;
                voiceChannel.leave();
                return true;
            }

            //Add to Queue
            DBM.Audio.addToQueue = function(item, cache) {
                if(!cache.server) return false;
                const id = cache.server.id;
                if(!DBM.Audio.queue[id]) DBM.Audio.queue[id] = [];
                DBM.Audio.queue[id].push(item);
                DBM.Audio.playNext(id);
            };

            //Clear Queue
            DBM.Audio.clearQueue = function(cache) {
                if(!cache.server) return;
                const id = cache.server.id;
                DBM.Audio.queue[id] = [];
            };

            //Get the next Item
            DBM.Audio.playNext = function(id, forceSkip) {
                if(!DBM.Audio.connections[id]) return false;
                if(!DBM.Audio.dispatchers[id] || !!forceSkip) {
                    if(DBM.Audio.loopItem[id] === true) {
                        //Loop Item
                        if(!!DBM.Audio.playingnow[id]) {
                            DBM.Audio.playItem(DBM.Audio.playingnow[id], id);
                        } else if(DBM.Audio.queue[id].length > 0) {
                            //No PlayingNow Data existed (this should never be executed...)
                            DBM.Audio.playItem(DBM.Audio.queue[id].shift(), id);
                        } else {
                            //Queue is empty (this should never be executed...)
                            DBM.Audio.connections[id].disconnect();
                        }
                    } else if(DBM.Audio.shuffleQueue[id] === true && DBM.Audio.queue[id].length > 0) {
                        //Shuffle Queue
                        if(!!DBM.Audio.playingnow[id]) {
                            var amount = Math.round(Math.random(0)*DBM.Audio.queue[id].length);
                            while(amount > 0) {
                                DBM.Audio.queue[id].push(DBM.Audio.queue[id].shift());
                                amount = amount-1;
                            }
                            if(!!DBM.Audio.loopQueue[id]) {
                                // + Loop Queue
                                DBM.Audio.queue[id].push(DBM.Audio.playingnow[id]);
                            }
                            DBM.Audio.playItem(DBM.Audio.queue[id].shift(), id);
                        } else if(DBM.Audio.queue[id].length > 0) {
                            //No PlayingNow Data existed (this should never be executed...)
                            DBM.Audio.playItem(DBM.Audio.queue[id].shift(), id);
                        } else {
                            //Queue is empty (this should never be executed...)
                            DBM.Audio.connections[id].disconnect();
                        }
                    } else if(DBM.Audio.loopQueue[id] === true) {
                        //Loop Queue
                        if(!!DBM.Audio.playingnow[id]) {
                            DBM.Audio.queue[id].push(DBM.Audio.playingnow[id]);
                            DBM.Audio.playItem(DBM.Audio.queue[id].shift(), id);
                        } else if(DBM.Audio.queue[id].length > 0) {
                            //No PlayingNow Data existed (this should never be executed...)
                            DBM.Audio.playItem(DBM.Audio.queue[id].shift(), id);
                        } else {
                            //Queue is empty (this should never be executed...)
                            DBM.Audio.connections[id].disconnect();
                        }
                    } else if(DBM.Audio.autoplay[id] === true && DBM.Audio.queue[id].length === 0) {
                        //AutoPlay
                        var timeout = 0;
                        var itemList = [];
                        while(itemList.length == 0 && timeout < 10) {
                            //Get the most played AutoPlay Data
                            itemList = DBM.Audio.topAutoPlay(DBM.Audio.autoplaydata.length/10);
                            timeout++;
                        };
                        setTimeout(function() {
                            if(timeout >= 9) {
                                //Get any existing AutoPlay Data
                                itemList = DBM.Audio.topAutoPlay(0);
                            };
                            var error;
                            try {
                                //Use an random Item
                                var autoItem = itemList[Math.round(Math.random(0)*itemList.length)];
                                var item = ['yt', {seek: 0, bitrate: 'auto', passes: 1, volume: 0.5}, autoItem.url];
                            } catch(e) {error = e};
                            if(error) {
                                //Not AutoPlay Data existing
                                DBM.Audio.autoplay[id] = false;
                                DBM.Audio.playNext(id);
                            } else {
                                DBM.Audio.playItem(item, id);
                            };
                        }, 500);
                    } else if(DBM.Audio.queue[id].length > 0) {
                        //Call next Item (Without any mods)
                        DBM.Audio.playItem(DBM.Audio.queue[id].shift(), id);
                    } else {
                        //End of Queue
                        DBM.Audio.connections[id].disconnect();
                    }
                }
            };
            
            //Start an Item
            DBM.Audio.playItem = function(item, id) {
                if(!DBM.Audio.connections[id]) return false;
                if(!!DBM.Audio.dispatchers[id]) {
                    DBM.Audio.dispatchers[id]._forceEnd = true;
                    DBM.Audio.dispatchers[id].end();
                    DBM.Audio.dispatchers[id] = null;
                }
                const type = item[0];
                var volume = parseFloat(item[1].volume) || 0.5;
                if(volume === NaN || volume === 0.5 && DBM.Audio.volumes[id] !== 0.5 && DBM.Audio.volumes[id] !== undefined) {
                    volume = DBM.Audio.volumes[id];
                } else {
                    DBM.Audio.volumes[id] = volume || 0.5;
                }
                item[1].volume = 1;
                switch(type) {
                    case 'file':
                        DBM.Audio.playingnow[id] = item;
                        setupDispatcher = DBM.Audio.playFile(item[2], item[1], id);
                        return true;
                    case 'url':
                        setupDispatcher = DBM.Audio.playUrl(item[2], item[1], id);
                        DBM.Audio.playingnow[id] = item;
                        return true;
                    case 'yt':
                        setupDispatcher = DBM.Audio.playYt(item[2], item[1], id);
                        DBM.Audio.playingnow[id] = item;
                        return true;
                    default:
                        return false;
                }
            };

            //Setup a new Dispatcher
            DBM.Audio.setupDispatcher = function(id) {
                if(!DBM.Audio.dispatchers[id]._eventSetup) {
                    //start
                    DBM.Audio.dispatchers[id].on('start', function() {
                        if(parseFloat(DBM.Audio.volumes[id]) === NaN) {
                            var volume = 0.5;
                        } else {
                            var volume = parseFloat(DBM.Audio.volumes[id]);
                        }
                        DBM.Audio.dispatchers[id].setVolumeLogarithmic(volume);
                        DBM.Audio.saveVolumes();
                    });
                    //end
                    DBM.Audio.dispatchers[id].on('end', function() {
                        const isForced = DBM.Audio.dispatchers[id]._forceEnd;
                        DBM.Audio.dispatchers[id] = null;
                        if(!isForced) {
                            DBM.Audio.playNext(id);
                        }
                    });
                    //error
                    DBM.Audio.dispatchers[id].on('error', function() {
                        const isForced = DBM.Audio.dispatchers[id]._forceEnd;
                        DBM.Audio.dispatchers[id] = null;
                        if(!isForced) {
                            DBM.Audio.playNext(id);
                        }
                    });
                    DBM.Audio.dispatchers[id]._eventSetup = true;
                    return true;
                } else {
                    return false;
                }
            }

            //Play a File
            DBM.Audio.playFile = function(url, options, id) {
                DBM.Audio.dispatchers[id] = DBM.Audio.connections[id].playFile(Actions.getLocalFile(url), options);
                DBM.Audio.setupDispatcher(id);
                return true;
            }
            
            //Play a Webstream
            DBM.Audio.playUrl = function(url, options, id) {
                DBM.Audio.dispatchers[id] = DBM.Audio.connections[id].playArbitraryInput(url, options);
                DBM.Audio.setupDispatcher(id);
                return true;
            }
            
            //Play a YouTube video
            DBM.Audio.playYt = function(url, options, id) {
                if(!DBM.Audio.ytinfo) {
                    //YouTube Video (youtube-info is missing)
                    if(!DBM.Audio.ytdl) return false;
                    var stream = DBM.Audio.ytdl(url, {filter: 'audioonly'});
                    DBM.Audio.dispatchers[id] = DBM.Audio.connections[id].playStream(stream, options);
                    DBM.Audio.setupDispatcher(id);
                    return true;
                } else {
                    const ytinfo = DBM.Audio.ytinfo;
                    ytinfo(`${url.slice(32, 43)}`).then(video => {
                        if(video.duration === 0 && AddOns.settings.fixYouTubeLivestreams == 'true') {
                            //YouTube Livestream
                            if(!DBM.Audio.ytdl_discord) return false;
                            if(parseFloat(DBM.DiscordJS.version) < 11.4) {
                                console.log('WARNING: Discord.js is updating to 11.4.2!\nYou will need to run your project via command prompt after the installation is completed!');
                                AddOns.update('discord.js@11.4.2');
                            }
                            //Check Discord.js version
                            if(parseFloat(DBM.DiscordJS.version) >= 11.4) {
                                require('child_process').exec('npm -version', (error, stdout, stderr) => {
                                    if(error) {
                                        console.log('WARNING: Discord.js has been updated to 11.4.2! Please run your project via command prompt!');
                                        Audio.playNext(id);
                                    } else {
                                        async function play(Audio) {
                                            Audio.dispatchers[id] = Audio.connections[id].playOpusStream(await Audio.ytdl_discord(url));
                                            Audio.setupDispatcher(id);
                                        }
                                        play(DBM.Audio);
                                        AddOns.settings.logYouTubeLivestreams ? console.log('WARNING: YouTube Livestream detected!\nStarted playing in opusstream mode. You are now unable to control the volume!') : '';
                                        return true;
                                    }
                                });
                            }
                        } else {
                            //YouTube Video
                            if(!DBM.Audio.ytdl) return false;
                            var stream = DBM.Audio.ytdl(url, {filter: 'audioonly'});
                            DBM.Audio.dispatchers[id] = DBM.Audio.connections[id].playStream(stream, options);
                            DBM.Audio.setupDispatcher(id);
                            return true;
                        }
                    }).catch(error => {
                        if(error) console.error(error);
                    });
                }
            }

            if(AddOns.settings.fixYouTubeLivestreams == 'true') {
                AddOns.settings.highlightInfos == 'true' ? console.log('\x1b[1m\x1b[4m\x1b[32mDBM Add-Ons\x1b[0m: YouTube Livestream Debug loaded!') : console.log('DBM Add-Ons: YouTube Livestream Debug loaded!');
            }

            //Get Dispatcher or Connection Status
            DBM.Audio.status = function(type, cache) {
                if(!type || !cache || !cache.server) {
                    return false;
                }
                var id = cache.server.id;
                switch(type.toLowerCase()) {
                    case 'playing':
                        return DBM.Audio.dispatchers[id] ? (DBM.Audio.dispatchers[id].paused ? false : true) : false;
                    case 'paused':
                        return DBM.Audio.dispatchers[id] ? DBM.Audio.dispatchers[id].paused : false;
                    case 'stopped':
                        return DBM.Audio.dispatchers[id] ? false : true;
                    case 'connected':
                        return DBM.Audio.connections[id] ? true : false;
                    default:
                        return false;
                }
            }

            AddOns.settings.highlightInfos == 'true' ? console.log('\x1b[1m\x1b[4m\x1b[32mDBM Add-Ons\x1b[0m: Mods loaded!') : console.log('DBM Add-Ons: Mods loaded!');
        }
    }
}
//---------------------------------------------------------------