import fs from "node:fs/promises";
import path from "node:path";
import { Collection, REST, Routes } from "discord.js";
import Log from "../util/log.js";

// ========================= //
// = Copyright (c) NullDev = //
// ========================= //

/**
 * Register all slash commands
 *
 * @param {import("discord.js").Client} client
 * @returns {Promise<Collection<string, import("discord.js").ApplicationCommand>>}
 */
const commandRegister = async function(client){
    client.commands = new Collection();
    const foldersPath = path.resolve("src", "commands");
    const commandFolders = await fs.readdir(foldersPath);

    for (const folder of commandFolders){
        const commandsPath = path.join(foldersPath, folder);
        const commandFiles = (await fs.readdir(commandsPath)).filter(file => file.endsWith(".js"));

        for (const file of commandFiles){
            const filePath = path.join(commandsPath, file);
            const command = (await import(filePath)).default;

            if ("data" in command && "execute" in command){
                client.commands.set(command.data.name, command);
            }
            else {
                Log.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
            }
        }

        Log.done(`Registered ${commandFiles.length} commands in ${folder}.`);
    }

    const rest = new REST().setToken(client.token);
    try {
        Log.info("Started refreshing application (/) commands.");
        const data = await rest.put(Routes.applicationCommands(client.user.id), {
            body: client.commands.map(command => command.data.toJSON()),
        });
        Log.done("Successfully reloaded " + data.length + " application (/) commands.");
    }
    catch (error){
        Log.error("Error during registering of application (/) commands: " + error);
    }

    return client.commands;
};

export default commandRegister;
