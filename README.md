<p align="center">
  <img width="80%" src="https://raw.githubusercontent.com/Proximitynow19/TETR.JS/master/images/large_shadow.png">
</p>

<p align="center">
 An API Wrapper For <a href="https://tetr.io/">TETR.IO</a>
</p>

<p align="center">
  <!-- Flat style -->
  <a href="https://www.typescriptlang.org/" rel="TypeScript"><img src="https://img.shields.io/badge/TypeScript-v4.2.3-blue"></a>
  <a href="https://www.npmjs.com/package/tetr.js" rel="NPM Size"><img src="https://img.shields.io/bundlephobia/min/tetr.js"></a>
  <a href="https://www.npmjs.com/package/tetr.js" rel="NPM Version"><img src=" https://img.shields.io/npm/v/tetr.js"></a>
</p>

- [Install](#install)
- [Example](#example)
- [Gameplay](#gameplay)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [Discord](#discord)
- [License](#license)
- [Disclaimer](#disclaimer)
- [Credits](#credits)

## Install

```sh
$ npm i tetr.js --save
```

## Example

```js
const { Client } = require("tetr.js");

const client = new Client();

client.on("ready", () => {
  console.log("Bot online");
});

client.login("YOUR-TOKEN-HERE");
```

Find more examples [here](https://github.com/Proximitynow19/TETR.JS/tree/master/examples)

## Gameplay

_**Gameplay is currently NOT built-in to this package**_. However, we do have a currently WIP addon to this package to enable gameplay. If you want access to it, or you just want to know the specifics of how it works, you can join [our discord](https://discord.gg/e3vFHq9WZz) and ask there.

## Technologies

- [TypeScript](https://www.typescriptlang.org/)
- [TypeDoc](https://typedoc.org//)

## Contributing

Feedback and PRs are welcome!

## Discord

<p align="center">
  <a href="https://discord.gg/e3vFHq9WZz">
    <img src="https://discordapp.com/api/guilds/827703471822078002/widget.png?style=banner3"/>
  </a>
</p>

## License

This project is licensed under the MIT License. See [LICENSE](https://github.com/Proximitynow19/TETR.JS/blob/master/LICENSE) for details.

## Disclaimer

TETR.JS is not associated with TETR.IO or osk. The token provided must match an account that has been approved as a bot account. Contact osk on Discord to receive such bot accounts.

## Credits

Special thanks to [Poyo-SSB](https://github.com/Poyo-SSB) for documenting how the [TETR.IO Ribbon system](https://github.com/Poyo-SSB/tetrio-bot-docs) operates.
