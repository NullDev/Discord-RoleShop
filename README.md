# Discord-RoleShop
[![cd](https://github.com/NullDev/Discord-RoleShop/actions/workflows/cd.yml/badge.svg)](https://github.com/NullDev/Discord-RoleShop/actions/workflows/cd.yml) [![License](https://img.shields.io/github/license/NullDev/Discord-RoleShop?label=License&logo=Creative%20Commons)](https://github.com/NullDev/Discord-RoleShop/blob/master/LICENSE) [![GitHub closed issues](https://img.shields.io/github/issues-closed-raw/NullDev/Discord-RoleShop?logo=Cachet)](https://github.com/NullDev/Discord-RoleShop/issues?q=is%3Aissue+is%3Aclosed)

<p align="center"><img height="150" width="auto" src="https://cdn.discordapp.com/avatars/1102551839674740737/3354a0eebe93a021d96e53c271b0316e.webp?size=128" /></p>
<p align="center"><b>Discord Bot for a Roleshop with currency that can be earned by writing messages.</b></p>
<hr>

## :question: What does it do?

User earn points by writing messages. With those points, they can purchase special roles from a built-in shop.

<hr>

## :satellite: Invite the bot

[![Invite](https://img.shields.io/badge/Invite-37a779?style=for-the-badge)](https://discordapp.com/oauth2/authorize?client_id=1102551839674740737&scope=bot&permissions=1099780064256)

<sub>The link above will invite a bot hosted by me that uses the latest version of this repo. <br>
Alternatively you can host the bot yourself. Instructions [below ⏬](#wrench-setup) </sub>

<hr>

## :star: Features

- [x] Earn points by writing messages
- [x] Spend points in a built-in shop
- [x] Customizable shop
- [x] Random gifts
    - Can be disabled
    - Cooldown can be set
    - Chance can be set
- [x] Optional multiplier for server boosters [Default: 2x]
    - Can be set on every Discord server individually
- [x] Slash commands
- [x] Multi-language support (Can be set on every Discord server individually)
    - English (Peer reviewed ✅)
    - German (Peer reviewed ✅)
- [x] Easy to set up
    - Invite bot
    - Add roles to the shop (`/rs-add-role`)
    - Remove roles from the shop (`/rs-remove-role`)
    - [OPTIONAL] Set server language (`/rs-set-language`) [Default: English]
    - [OPTIONAL] Set or disable booster multiplier (`/rs-set-multiplier`) [Default: 2x]
    - [OPTIONAL] Toggle the spam filter (`/rs-spam-filter`) [Default: Enabled]
    - [OPTIONAL] Toggle and configure random gifts (`/rs-random-gift`) [Default: Enabled, Cooldown: 4hours, Chance: 5%]
- [x] Easy to self-host
    - No external database needed
    - Easy configuration system
    - Install instructions provided [below](#wrench-setup)
- [x] Admin commands
- [x] Fail-safes to prevent point loss on error
- [x] Automatic Syncing to keep up with DB and Discord states 
- [x] _Smart Spam Filtering™_ via Exponential Smoothing & Moving Average

<hr>

## :diamond_shape_with_a_dot_inside: Feature requests & Issues

Feature request or discovered a bug? Please [open an Issue](https://github.com/NullDev/Discord-RoleShop/issues/new/choose) here on GitHub.

<hr>

## :wrench: Setup

0. Open up your favourite terminal (and navigate somewhere you want to download the repository to). <br><br>
1. Make sure you have NodeJS installed (>= v20.0.0). Test by entering <br>
$ `node -v` <br>
If this returns a version number, NodeJS is installed. **If not**, get NodeJS <a href="https://nodejs.org/en/download/package-manager/">here</a>. <br><br>
2. Clone the repository and navigate to it. If you have Git installed, type <br>
$ `git clone https://github.com/NullDev/Discord-RoleShop.git && cd Discord-RoleShop` <br>
If not, download it <a href="https://github.com/NullDev/Discord-RoleShop/archive/master.zip">here</a> and extract the ZIP file.<br>
Then navigate to the folder.<br><br>
3. Install all dependencies by typing <br>
$ `npm install`<br><br>
4. Copy [config/config.template.js](https://github.com/NullDev/Discord-RoleShop/blob/master/config/config.template.js) and paste it as `config/config.custom.js` <br><br>
5. Configure it in your favourite editor by editing `config/config.custom.js`. OR use `npm run generate-config`<br><br>
6. Start it in development mode by running <br>
$ `npm start` <br>
or start in production mode <br>
$ `npm run start:prod` <br><br>

<hr>

## :nut_and_bolt: Configuration

Once the config has been copied like described in [Step 4](#wrench-setup), it can be changed to your needs:

| Config Key | Description | Data Type | Default value |
| ---------- | --------- | ------------------ | ------------ |
| discord: <br> `bot_token` | Auth Token of the Discord bot. Can be created [here](https://discordapp.com/developers/). | String | N/A |
| discord: <br> `bot_status` | Bot activity ala "Is playing...". | String | "Usage: /rs-help"
| bot_settings: <br> `slash_command_prefix` | Prefix for all slash commands. e.g. `/rs-foo`, `/rs-bar`. | String | "rs" |
| bot_settings.spam_filter: <br> `alpha` | The smoothing factor for the expavg spam filter. | Number | 0.4 |
| bot_settings.spam_filter: <br> `window` | The window for the moving average (last `n` messages) for calculation. | Number | 10 |

<hr>

## :octocat: Contributors

- [arellak](https://github.com/arellak)

<hr>
