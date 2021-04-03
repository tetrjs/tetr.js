<p align="center">
  <img width="80%" src="https://raw.githubusercontent.com/Proximitynow19/TETR.JS/master/images/large_shadow.png">
</p>

<p align="center">
  API Wrapper For <a href="https://tetr.io/">TETR.IO</a>
</p>

<p align="center">
  <!-- Flat style -->
  <a href="https://www.npmjs.com/package/tetr.js" rel="NPM Size"><img src="https://img.shields.io/badge/TypeScript-v4.2.3-blue"></a>
  <a href="https://www.npmjs.com/package/tetr.js" rel="NPM Size"><img src="https://img.shields.io/bundlephobia/min/tetr.js"></a>
  <a href="https://www.npmjs.com/package/tetr.js" rel="NPM Version"><img src=" https://img.shields.io/npm/v/tetr.js"></a>
</p>

- [Install](#install)
- [Example](#example)
- [Technologies](#technologies)
- [Contributing](#contributing)
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

client.on("authorize", () => {
  console.log("Bot online");
});

client.login("YOUR TOKEN HERE");
```

## Technologies

- [TypeScript](https://www.typescriptlang.org/)
- [TypeDoc](https://typedoc.org//)

## Contributing

Feedback and PRs are welcome!

## License

This project is licensed under the MIT License. See [LICENSE](https://github.com/Proximitynow19/TETR.JS/blob/master/LICENSE) for details.

## Disclaimer

TETR.JS is not associated with TETR.IO or osk. The token provided must match an account that has been approved as a bot account. Contact osk on Discord to receive such bot accounts. Code is written using [VSCode's LiveShare plugin](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare-pack), so it seems "BumpyBill" has written little amounts of code.

## Credits

Special thanks to [Poyo-SSB](https://github.com/Poyo-SSB) for documenting how the [TETR.IO Ribbon system](https://github.com/Poyo-SSB/tetrio-bot-docs) operates.
