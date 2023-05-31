export default {
    help: {
        desc: "Show an overview of commands.",
        translations: {
            de: "Zeig eine Übersicht aller Befehle.",
        },
    },
    info: {
        desc: "Show information about this bot.",
        translations: {
            de: "Zeig Informationen über diesen Bot.",
        },
    },
    "return": {
        desc: "Return a role that you bought from the shop.",
        translations: {
            de: "Gib eine Rolle zurück, die du im Shop gekauft hast.",
        },
    },
    shop: {
        desc: "Shop for new roles.",
        translations: {
            de: "Kaufe neue Rollen.",
        },
    },
    stats: {
        desc: "View your stats or the stats of another user.",
        translations: {
            de: "Zeige deine Statistiken oder die eines anderen Benutzers.",
        },
        options: {
            user: {
                desc: "The user to show stats for",
                translations: {
                    de: "Der Benutzer, dessen Statistiken angezeigt werden sollen",
                },
            },
        },
    },
    top: {
        desc: "Show the top 10 users with most points.",
        translations: {
            de: "Zeige die Top 10 Benutzer mit den meisten Punkten.",
        },
    },
    add_role: {
        desc: "Adds a new role to the shop (either an existing one on the server or creates a new one).",
        translations: {
            de: "Fügt dem Shop eine neue Rolle hinzu (entweder eine existierende oder erstellt eine neue).",
        },
        options: {
            name: {
                desc: "Name of the role",
                translations: {
                    de: "Name der Rolle",
                },
            },
            price: {
                desc: "Price of the role",
                translations: {
                    de: "Preis der Rolle",
                },
            },
        },
    },
    admin_help: {
        desc: "Show an overview of all admin commands.",
        translations: {
            de: "Zeig eine Übersicht aller Admin-Befehle.",
        },
    },
    list_roles: {
        desc: "List all registered roles from the shop.",
        translations: {
            de: "Liste alle registrierten Rollen aus dem Shop auf.",
        },
    },
    random_gift: {
        desc: "Enable, disable and configure random gifts.",
        translations: {
            de: "Aktiviere, deaktiviere und konfiguriere zufällige Geschenke.",
        },
        options: {
            enabled: {
                desc: "Enable or disable random gifts",
                translations: {
                    de: "Aktiviere oder deaktiviere zufällige Geschenke",
                },
            },
            cooldown: {
                desc: "Cooldown between gifts in hours (default: 4h)",
                translations: {
                    de: "Cooldown zwischen Geschenken in Stunden (Standard: 4h)",
                },
            },
            chance: {
                desc: "Chance of a gift being sent in percent (default: 5%)",
                translations: {
                    de: "Chance, dass ein Geschenk gesendet wird in Prozent (Standard: 5%)",
                },
            },
        },
    },
    remove_role: {
        desc: "Remove a role from the shop.",
        translations: {
            de: "Entferne eine Rolle aus dem Shop.",
        },
        options: {
            name: {
                desc: "Name of the role",
                translations: {
                    de: "Name der Rolle",
                },
            },
            "delete": {
                desc: "Delete the role from the Discord server",
                translations: {
                    de: "Lösche die Rolle vom Discord Server",
                },
            },
        },
    },
    reset_all: {
        desc: "Reset ALL stats for this server.",
        translations: {
            de: "Setze ALLE Statistiken für diesen Server zurück.",
        },
    },
    set_boost_multiplier: {
        desc: "Set multiplier for Server Boosters (1 to deactivate)",
        translations: {
            de: "Setze Multiplikator für Server Booster (1 zum Deaktivieren)",
        },
        options: {
            value: {
                desc: "Multiplier value (>=1; =1 to deactivate)",
                translations: {
                    de: "Multiplikatorwert (>=1; =1 zum Deaktivieren)",
                },
            },
        },
    },
    set_language: {
        desc: "Set the server language for the bot.",
        translations: {
            de: "Setze die Server-Sprache für den Bot.",
        },
        options: {
            language: {
                desc: "The language to set",
                translations: {
                    de: "Die zu setzende Sprache",
                },
            },
        },
    },
    set_points: {
        desc: "Set the points of a user.",
        translations: {
            de: "Setze die Punkte eines Benutzers.",
        },
        options: {
            user: {
                desc: "The user to set points for",
                translations: {
                    de: "Der Benutzer, dessen Punkte gesetzt werden sollen",
                },
            },
            points: {
                desc: "The points to set",
                translations: {
                    de: "Die zu setzenden Punkte",
                },
            },
        },
    },
    set_role_icon: {
        desc: "Set the icon of a role for the shop.",
        translations: {
            de: "Setze das Icon einer Rolle  für den Shop.",
        },
        options: {
            role: {
                desc: "The role to set the icon for",
                translations: {
                    de: "Die Rolle, für die das Icon gesetzt werden soll",
                },
            },
            icon: {
                desc: "The icon to set",
                translations: {
                    de: "Das zu setzende Icon",
                },
            },
        },
    },
    spam_filter: {
        desc: "Enable or disable the spam filter server wide.",
        translations: {
            de: "Aktiviere oder deaktiviere den Spam-Filter serverweit.",
        },
        options: {
            enabled: {
                desc: "Enable or disable the spam filter",
                translations: {
                    de: "Aktiviere oder deaktiviere den Spam-Filter",
                },
            },
        },
    },
    transaction_log: {
        desc: "Send the current transaction log for this guild.",
        translations: {
            de: "Sende das aktuelle Transaktionslog für diesen Server.",
        },
    },
};
