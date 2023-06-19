export default {
    discord: {
        bot_token: "",
        bot_status: "Usage: /rs-help",
    },
    bot_settings: {
        slash_command_prefix: "rs",
        spam_filter: {
            alpha: 0.4,
            window: 5,
        },
        emote_server_id: "",
        bot_owner_ids: [""],
    },
    default_values: {
        random_gift: {
            cooldown: 4,
            chance: 5,
            min_points: 10,
            max_points: 70,
        },
        points: {
            multiplier: 1,
            boost_multiplier: 1.5,
        },
        role_icon_type: "x",
        default_member_permissions: "8",
        shop: {
            owned: "✅",
            not_owned: "❌",
        },
        icons: {
            bot: "https://cdn.discordapp.com/avatars/1102551839674740737/89848012463df027b4db688e05b89a44.png",
            no_pb: "https://cdn.discordapp.com/embed/avatars/0.png",
            gift: "https://cdn.discordapp.com/attachments/1113567657921355866/1113569384787611668/gift_1.gif",
        },
    },
};
