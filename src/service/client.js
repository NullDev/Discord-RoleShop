import { Client, Collection } from "discord.js";

class DiscordClient extends Client {
    constructor(options){
        super(options);
        this.commands = new Collection();
    }
}

export default DiscordClient;
