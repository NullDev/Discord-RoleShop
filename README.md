# Discord-RoleShop

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
- [x] Optional multiplier for server boosters
    - Can be set on every Discord server individually
- [x] Slash commands
- [x] Multi-language support (currently English and German)
    - Can be set on every Discord server individually
- [x] Easy to setup
    - No external database needed
    - Easy configuration system
    - Install instructions provided [below](#wrench-setup)
- [x] Admin commands
- [x] _Smart Spam Filtering™_ via Exponential Smoothing
    - $S_t = \alpha x_t + (1 - \alpha) S_{t-1}$
    - Where:
        - $S_t$ is the smoothed value at time $t$,
        - $x_t$ is the observed value at time $t$,
        - $S_{t-1}$ is the smoothed value at time $t-1$, and
        - $\alpha$ is the smoothing factor (value between 0 and 1).

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
| bot_settings: <br> `slash_command_prefix` | Prefix for all slash commands. e.g. `/rs-foo`, `/rs-bar` | String | "rs" |
| bot_settings: <br> `booster_multiplier` | Points-Mulitplier for Server boosters (nitro). Set to `1` to disable. | Integer | 2 | 

<hr>
