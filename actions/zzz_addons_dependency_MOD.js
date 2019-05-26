const AddOns = {}

AddOns.author = 'ZockerNico';
AddOns.version = 'beta';
AddOns.description = 'This is the main addon which is needed for many other addons to work. It also overwrites many parts of your bot.js to give you access to better functions.';
AddOns.nodeModules = new Map();
AddOns.settings = {};

//NodeModule Installer
AddOns.install = function(nodeModule) {
    return new Promise((resolve, reject) => {
        if(!nodeModule) {
            reject();
        }
        function checkModule() {
            var error;
            try {
                require.resolve(nodeModule);
                error = true;
            } catch(e) {
                error = false;
            }
            return error;
        }
        for(var timeout = 0; timeout < 4; timeout++) {
            var check = checkModule();
            if(check === true) {
                break;
            }
            const child_process = require('child_process');
            var command = 'npm install ' + nodeModule + " --save";
            console.log(`\x1b[1m\x1b[4m\x1b[32mDBM Add-Ons${timeout > 0 ? `(Attempt: ${timeout++})` : ``}\x1b[0m: Installation of "\x1b[1m${nodeModule}\x1b[0m" is starting, please wait...`);
            child_process.execSync(command,{cwd: process.cwd(),stdio:[0,1,2]});
            timeout++;
        }
        var result = checkModule();
        if(result == true) {
            this.nodeModules.set(`${nodeModule}`, require(nodeModule));
            if(timeout !== 0) {
                console.log(`\x1b[1m\x1b[4m\x1b[32mDBM Add-Ons\x1b[0m: Installation of "\x1b[1m${nodeModule}\x1b[0m" is finished!`);
            }
            resolve(nodeModule);
        } else {
            console.log(`\x1b[1m\x1b[4m\x1b[32mDBM Add-Ons\x1b[0m: Installation of "\x1b[1m${nodeModule}\x1b[0m" failed! Please run "\x1b[1mnpm install ${nodeModule} --save\x1b[0m" manually.`);
            reject();
        }
	});
}

//NodeModule Updater
AddOns.update = function(nodeModule) {
    return new Promise((resolve, reject) => {
        if(!nodeModule) {
            reject();
        }
        function checkModule() {
            var error;
            try {
                require.resolve(nodeModule);
                error = undefined
            } catch(e) {
                error = e;
                error = true;
            }
            if(error !== undefined) {
                return false;
            } else {
                return true;
            }
        }
        var result = checkModule();
        if(result == true) {
            return this.install(nodeModule);
        } else {
            this.install(nodeModule);
            for(var timeout = 0; timeout < 4; timeout++) {
                var check = checkModule();
                if(check === true) {
                    break;
                }
                const child_process = require('child_process');
                var command = 'npm install ' + nodeModule + " --save";
                console.log(`\x1b[1m\x1b[4m\x1b[32mDBM Add-Ons${timeout > 0 ? `(Attempt: ${timeout++})` : ``}\x1b[0m: Update of "\x1b[1m${nodeModule}\x1b[0m" is starting, please wait...`);
                child_process.execSync(command,{cwd: process.cwd(),stdio:[0,1,2]});
                timeout++;
            }
            return this.install(nodeModule);
        }
    });
}

//Custom Require Function
AddOns.require = function(nodeModule) {
    this.install(nodeModule);
    return this.nodeModules.get(nodeModule);
}

//Add-Ons Loader
AddOns.loadAddOns = function(DBM) {
    //AUTHOR
    //This DBM AddOns bot.js mod is made by ZockerNico.
    //Do not give it out as your work or you get in trouble with me! xD

    //WARNING
    //Do not execute this function unless you know, what you're doing!
    //If your bot is already running, this may will reset it's current data.

    //INTRODUCTIONS
    //A DBM audio item needs to be build like this:
    //[type, options, url]
    //An AutoPlay item needs to be build like this:
    //{'url': url, 'amount': amount}

    if(!DBM) {
        return false;
    }

    //Require Modules
    Object.util = null;
    var util = this.require('util');
    if(util !== undefined && util !== null) {
        Object.util = util;
    }
    String.validUrl = null;
    var validUrl = this.require('valid-url');
    if(validUrl !== undefined && validUrl !== null) {
        Object.validUrl = validUrl;
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
        if(typeof(object) != 'object' || !Object.util) {
            return false;
        }
        return Object.util.inspect(object, {depth: (parseInt(depth) >= 0 ? parseInt(depth) : 0)});
    }

    //Check for Command
    DBM.Bot.checkCommand = function(msg) {
        let command = this.checkTag(msg);
        if(command) {
            if(!this._caseSensitive) {
                command = command.toLowerCase();
            }
            const cmd = this.$cmds[command];
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
        return 'Not finished!';
        var username = DBM.Bot.bot.user.username;
        console.log(`Restarting ${username} in 5 seconds...`);
        DBM.Bot.bot.destroy();
        setTimeout(function() {
            try {
                eval(require('fs').readFileSync('./bot.js'));
            } catch(error) {
                if(error) console.error(error);
            }
            console.log(`Restarting ${username}!`);
        }, 5000);
    }

    //Clear Member Data
    DBM.DiscordJS.GuildMember.prototype.clearData = function(name, value) {
        const id = this.id;
        const data = Files.data.players;
        data[id] = {};
        DBM.Files.saveData('players');
    };
    DBM.DiscordJS.User.prototype.clearData = DBM.DiscordJS.GuildMember.prototype.clearData;

    //Clear Server Data
    DBM.DiscordJS.Guild.prototype.clearData = function(name, value) {
        const id = this.id;
        const data = Files.data.servers;
        data[id] = {};
        data[id][name] = value;
        Files.saveData('servers');
    };

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

    //Require Modules
    DBM.Audio.ytdl = null;
    var ytdl = this.require('ytdl-core');
    if(ytdl !== undefined && ytdl !== null) {
        DBM.Audio.ytdl = ytdl;
    }
    DBM.Audio.ytdl_discord = null;
    var ytdl_discord = this.require('ytdl-core-discord');
    if(ytdl_discord !== undefined && ytdl_discord !== null) {
        DBM.Audio.ytdl_discord = ytdl_discord;
    }
    DBM.Audio.ytinfo = null;
    var ytinfo = this.require('youtube-info');
    if(ytinfo !== undefined && ytinfo !== null) {
        DBM.Audio.ytinfo = ytinfo;
    }

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
        if(!cache.server) return;
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

    //Get next Item
    DBM.Audio.playNext = function(id, forceSkip) {
        if(!DBM.Audio.connections[id]) return;
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
                    itemList = DBM.Audio.topAutoPlay(DBM.Audio.autoplaydata.length/10);
                    timeout++;
                };
                setTimeout(function() {
                    if(timeout >= 9) {
                        itemList = DBM.Audio.topAutoPlay(0);
                    };
                    var error;
                    try {
                        var autoItem = itemList[Math.round(Math.random(0)*itemList.length)];
                        var item = ['yt', {seek: 0, bitrate: 'auto', passes: 1, volume: 0.5}, autoItem.url];
                    } catch(e) {error = e};
                    if(error) {
                        DBM.Audio.connections[id].disconnect();
                        return false;
                    } else {
                        DBM.Audio.playItem(item, id);
                        return true;
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
        if(!DBM.Audio.connections[id]) return;
        if(DBM.Audio.dispatchers[id]) {
            DBM.Audio.dispatchers[id]._forceEnd = true;
            DBM.Audio.dispatchers[id].end();
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
                break;
            case 'url':
                setupDispatcher = DBM.Audio.playUrl(item[2], item[1], id);
                DBM.Audio.playingnow[id] = item;
                break;
            case 'yt':
                setupDispatcher = DBM.Audio.playYt(item[2], item[1], id);
                DBM.Audio.playingnow[id] = item;
                break;
        }
    };

    //Setup a new Dispatcher
    DBM.Audio.setupDispatcher = function(id) {
        if(!DBM.Audio.dispatchers[id]._eventSetup) {
            DBM.Audio.dispatchers[id].on('end', function() {
                const isForced = DBM.Audio.dispatchers[id]._forceEnd;
                DBM.Audio.dispatchers[id] = null;
                if(!isForced) {
                    DBM.Audio.playNext(id);
                }
            });
            DBM.Audio.dispatchers[id].on('start', function() {
                if(parseFloat(DBM.Audio.volumes[id]) === NaN) {
                    var volume = 0.5;
                } else {
                    var volume = parseFloat(DBM.Audio.volumes[id]);
                }
                DBM.Audio.dispatchers[id].setVolumeLogarithmic(volume);
                DBM.Audio.saveVolumes();
            });
            DBM.Audio.dispatchers[id].on('error', function() {
                DBM.Audio.dispatchers[id].end();
            })
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
    };
    
    //Play a Webstream
    DBM.Audio.playUrl = function(url, options, id) {
        DBM.Audio.dispatchers[id] = DBM.Audio.connections[id].playArbitraryInput(url, options);
        DBM.Audio.setupDispatcher(id);
        return true;
    };
    
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
                if(video.duration === 0 && this.settings.debugYouTubeLivestreams == 'true') {
                    //YouTube Livestream
                    if(!DBM.Audio.ytdl_discord) return false;
                    if(parseFloat(DBM.DiscordJS.version) >= 1.4) {} else {this.update('discord.js')};
                    async function play(Audio) {
                        Audio.dispatchers[id] = Audio.connections[id].playOpusStream(await Audio.ytdl_discord(url));
                        Audio.setupDispatcher(id);
                    }
                    play(DBM.Audio);
                    console.log('WARNING: YouTube Livestream detected!\nStarted playing in opusstream mode. You are now unable to control the volume!');
                    return true;
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
    };

    if(this.settings.debugYouTubeLivestreams == 'true') {
        console.log('\x1b[1m\x1b[4m\x1b[32mDBM Add-Ons\x1b[0m: YouTube Livestream Debug loaded!');
    }

    //Get Dispatcher or Connection Status
    DBM.Audio.status = function(type, id) {
        if(!type || !id || !DBM.Audio.connections[id] || !DBM.Audio.dispatchers[id]) {
            return false;
        };
        switch(type.toLowerCase()) {
            case 'playing':
                if(!DBM.Audio.dispatchers[id]) {
                    return false;
                } else if(DBM.Audio.dispatchers[id].paused === true) {
                    return false;
                } else {
                    return true;
                };
            case 'connected':
                return true;
            default:
                return false;
        };
    };

    console.log('\x1b[1m\x1b[4m\x1b[32mDBM Add-Ons\x1b[0m: Mods loaded!');
    return true;
}

AddOns.loadFixes = function(DBM) {
    //AUTHOR
    //This DBM AddOns bot.js fix is made by ZockerNico.
    //Do not give it out as your work or you get in trouble with me! xD

    //WARNING
    //Do not execute this function unless you know, what you're doing!
    //If your bot is already running, this may will reset it's current actions.
    
    if(!DBM) {
        return false;
    }

    //Store Command Params
    //Fixed: Multible Params
    DBM.Actions['Store Command Params'] = function(cache) {
        const data = cache.actions[cache.index];
        const msg = cache.msg;
        const infoType = parseInt(data.info);
        const index = parseInt(this.evalMessage(data.infoIndex, cache));
        const separator = this.getDBM().Files.data.settings.separator || '\\s+';
        let source;
        switch(infoType) {
            case 0:
                if(msg && msg.content) {
                    const params = msg.content.split(new RegExp(separator));
                    source = params[index] || '';
                }
                break;
            case 1:
                if(msg && msg.content) {
                    const params = msg.content.split(new RegExp(separator));
                    if(params.length >= index) {
                        source = params.slice(index).join(' ');
                    }
                }
                break;
            case 2:
                if(msg && msg.mentions && msg.mentions.members) {
                    const members = msg.mentions.members.array();
                    if(members[index - 1]) {
                        source = members[index - 1];
                    }
                }
                break;
            case 3:
                if(msg && msg.mentions && msg.mentions.roles) {
                    const roles = msg.mentions.roles.array();
                    if(roles[index - 1]) {
                        source = roles[index - 1];
                    }
                }
                break
            case 4:
                if(msg && msg.mentions && msg.mentions.channels) {
                    const channels = msg.mentions.channels.array();
                    if(channels[index - 1]) {
                        source = channels[index - 1];
                    }
                }
                break;
            default:
                break;
        }
        if(source) {
            const storage = parseInt(data.storage);
            const varName = this.evalMessage(data.varName, cache);
            this.storeValue(source, storage, varName, cache);
        }
        this.callNextAction(cache);
    }

    //Remove Item from List
    //Fixed: Variables in the Position field
    DBM.Actions['Remove Item from List'] = function(cache) {
        const data = cache.actions[cache.index];
        const storage = parseInt(data.storage);
        const varName = this.evalMessage(data.varName, cache);
        const list = this.getVariable(storage, varName, cache);
    
        const type = parseInt(data.removeType);
    
        let result = null;
        switch(type) {
            case 0:
                result = list.pop();
                break;
            case 1:
                result = list.shift();
                break;
            case 2:
                const position = parseInt(this.evalMessage(data.position, cache));
                if(position < 0) {
                    result = list.shift();
                } else if(position >= list.length) {
                    result = list.pop();
                } else {
                    result = list[position];
                    list.splice(position, 1);
                }
                break;
        }
    
        if(result) {
            const varName2 = this.evalMessage(data.varName2, cache);
            const storage2 = parseInt(data.storage2);
            this.storeValue(result, storage2, varName2, cache);
        }
    
        this.callNextAction(cache);
    }

    //Set Member Voice Channel
    //Fixed: Wrong variables
    DBM.Actions['Set Member Voice Channel'] = function(cache) {
        const data = cache.actions[cache.index];
        const storage = parseInt(data.member);
        const varName = this.evalMessage(data.varName, cache);
        const member = this.getMember(storage, varName, cache);
    
        const storage2 = parseInt(data.channel);
        const varName2 = this.evalMessage(data.varName2, cache);
        const channel = this.getVoiceChannel(storage2, varName2, cache);
    
        if(Array.isArray(member)) {
            this.callListFunc(member, 'setVoiceChannel', [channel]).then(function() {
                this.callNextAction(cache);
            }.bind(this));
        } else if(member && member.setVoiceChannel) {
            member.setVoiceChannel(channel).then(function() {
                this.callNextAction(cache);
            }.bind(this)).catch(this.displayError.bind(this, data, cache));
        } else {
            this.callNextAction(cache);
        }
    }

    //Find Channel
    //Fixed: Collection#find issue
    DBM.Actions['Find Channel'] = function(cache) {
        const server = cache.server;
        if(!server || !server.channels) {
            this.callNextAction(cache);
            return;
        }
        const data = cache.actions[cache.index];
        const info = parseInt(data.info);
        const find = this.evalMessage(data.find, cache);
        const channels = server.channels.filter(channel => channel.type == 'text' );
        let result;
        switch(info) {
            case 0:
                result = channels.find(channel => channel.id == find);
                break;
            case 1:
                result = channels.find(channel => channel.name == find);
                break;
            case 2:
                result = channels.find(channel => channel.topic == find);
                break;
            default:
                break;
        }
        if(result !== undefined) {
            const storage = parseInt(data.storage);
            const varName = this.evalMessage(data.varName, cache);
            this.storeValue(result, storage, varName, cache);
            this.callNextAction(cache);
        } else {
            this.callNextAction(cache);
        }
    }

    //Find Voice Channel
    //Fixed: Collection#find issue
    DBM.Actions['Find Voice Channel'] = function(cache) {
        const server = cache.server;
        if(!server || !server.channels) {
            this.callNextAction(cache);
            return;
        }
        const data = cache.actions[cache.index];
        const info = parseInt(data.info);
        const find = this.evalMessage(data.find, cache);
        const channels = server.channels.filter(channel => channel.type == 'voice');
        let result;
        switch(info) {
            case 0:
                result = channels.find(channel => channel.id == find);
                break;
            case 1:
                result = channels.find(channel => channel.name == find);
                break;
            case 2:
                result = channels.find(channel => channel.position == find);
                break;
            case 3:
                result = channels.find(channel => channel.userLimit == find);
                break;
            case 4:
                result = channels.find(channel => channel.bitrate == find);
                break;
            default:
                break;
        }
        if(result !== undefined) {
            const storage = parseInt(data.storage);
            const varName = this.evalMessage(data.varName, cache);
            this.storeValue(result, storage, varName, cache);
            this.callNextAction(cache);
        } else {
            this.callNextAction(cache);
        }
    }

    //Find Custom Emoji
    //Fixed: Collection#find issue
    DBM.Actions['Find Custom Emoji'] = function(cache) {
        const data = cache.actions[cache.index];
        const bot = this.getDBM().Bot.bot;
        const info = parseInt(data.info);
        const find = this.evalMessage(data.find, cache);
        let result;
        switch(info) {
            case 0:
                result = bot.emojis.find(emoji => emoji.id == find);
                break;
            case 1:
                result = bot.emojis.find(emoji => emoji.name == find);
                break;
            default:
                break;
        }
        if(result !== undefined) {
            const storage = parseInt(data.storage);
            const varName = this.evalMessage(data.varName, cache);
            this.storeValue(result, storage, varName, cache);
        }
        this.callNextAction(cache);
    }

    //Find Member
    //Fixed: Collection#find issue
    DBM.Actions['Find Member'] = function(cache) {
        const server = cache.server;
        if(!server || !server.members) {
            this.callNextAction(cache);
            return;
        }
        const data = cache.actions[cache.index];
        const info = parseInt(data.info);
        const find = this.evalMessage(data.find, cache);
        let result;
        switch(info) {
            case 0:
                result = server.members.find(member => member.id == find);
                break;
            case 1:
                result = server.members.find(member => (member.user ? member.user.username == find : member.username == find))
                break;
            case 2:
                result = server.members.find(member => member.displayName == find);
                break;
            case 3:
                result = server.members.find(member => member.displayColor == find);
                break;
            default:
                break;
        }
        if(result !== undefined) {
            const storage = parseInt(data.storage);
            const varName = this.evalMessage(data.varName, cache);
            this.storeValue(result, storage, varName, cache);
            this.callNextAction(cache);
        } else {
            this.callNextAction(cache);
        }
    }

    //Find Role
    //Fixed: Collection#find issue
    DBM.Actions['Find Role'] = function(cache) {
        const server = cache.server;
        if(!server || !server.roles) {
            this.callNextAction(cache);
            return;
        }
        const data = cache.actions[cache.index];
        const info = parseInt(data.info);
        const find = this.evalMessage(data.find, cache);
        let result;
        switch(info) {
            case 0:
                result = server.roles.find(role => role.id == find);
                break;
            case 1:
                result = server.roles.find(role => role.name == find);
                break;
            case 2:
                result = server.roles.find(role => role.color == find);
                break;
            default:
                break;
        }
        if(result !== undefined) {
            const storage = parseInt(data.storage);
            const varName = this.evalMessage(data.varName, cache);
            this.storeValue(result, storage, varName, cache);
        }
        this.callNextAction(cache);
    }

    //Find Server
    //Fixed: Collection#find issue
    DBM.Actions['Find Server'] = function(cache) {
        const bot = this.getDBM().Bot.bot;
        const servers = bot.guilds;
        const data = cache.actions[cache.index];
        const info = parseInt(data.info);
        const find = this.evalMessage(data.find, cache);
        let result;
        switch(info) {
            case 0:
                result = servers.find(server => server.id == find);
                break;
            case 1:
                result = servers.find(server => server.name == find);
                break;
            case 2:
                result = servers.find(server => server.nameAcronym == find);
                break;
            case 3:
                result = servers.find(server => server.memberCount == parseInt(find));
                break;
            case 4:
                result = servers.find(server => server.region == find);
                break;
            case 5:
                result = servers.find(server => server.ownerID == find);
                break;
            case 6:
                result = servers.find(server => server.verificationLevel == parseInt(find));
                break;
            case 7:
                result = servers.find(server => server.available == Boolean(find === 'true'));
                break;
            default:
                break;
        }
        if(result !== undefined) {
            const storage = parseInt(data.storage);
            const varName = this.evalMessage(data.varName, cache);
            this.storeValue(result, storage, varName, cache);
            this.callNextAction(cache);
        } else {
            this.callNextAction(cache);
        }
    }

    console.log('\x1b[1m\x1b[4m\x1b[32mDBM Add-Ons\x1b[0m: Fixes loaded!');
    return true;
}

//DBM Section
//---------------------------------------------------------------
module.exports = {
    name: "DBM Add-Ons Dependency",
    section: "DBM Add-Ons",

	subtitle: function (data) {
		//return `Action Subtitle`;
    },
    
	variableStorage: function (data, varType) {
		/*const type = parseInt(data.storage);
		if (type !== varType) return;
		let dataType = 'Unknown Type';
        return ([data.varName, dataType]);*/
	},

	fields: [],

	html: function (isEvent, data) {
		//return `<div></div>`
	},

	init: function () {
		//const { glob, document } = this;
	},

	action: function (cache) {
		//const data = cache.actions[cache.index];
		this.callNextAction(cache);
	},

	mod: function (DBM) {
        DBM.Actions.getAddOns = function() {
            return AddOns;
        }
        DBM.initAddOns = function() {
            var data;
            try {
                data = JSON.parse(require('fs').readFileSync('./data/addons_settings.json'));
            } catch(e) {
                data = {
                    "loadAddOns": "true",
                    "loadFixes": "true",
                    "debugYouTubeLivestreams": "true"
                };
                require('fs').writeFile('./data/addons_settings.json', `${JSON.stringify(data)}`, function(error) {
                    if(error) console.error(error);
                });
            }
            DBM.Actions.getAddOns().settings = data;
            if(data.loadAddOns == 'true') {
                DBM.Actions.getAddOns().loadAddOns(DBM);
            }
            if(data.loadFixes == 'true') {
                DBM.Actions.getAddOns().loadFixes(DBM);
            }
            return true;
        }
        DBM.Bot.onReady = function() {
            if(process.send) process.send('BotReady');
            console.log(`${this.bot.user.username} is ready!`);
            DBM.initAddOns();
            this.restoreVariables();
            this.preformInitialization();
        }
	}
};
//---------------------------------------------------------------