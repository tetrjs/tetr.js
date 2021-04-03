<p align="center">
  <img width="100%" src="images/large.png">
</p>

<p align="center">
API Wrapper For <a href="https://tetr.io/">TETR.IO</a>
</p>

<p align="center">
 <a href="https://www.typescriptlang.org/" rel="TypeScript"><img src="https://badges.frapsoft.com/typescript/version/typescript-v18.svg?v=101"></a>
 <a href="https://www.npmjs.com/package/tetr.js" rel="NPM Size"><img src="https://img.shields.io/bundlephobia/min/tetr.js"></a>
 <a href="https://www.npmjs.com/package/tetr.js" rel="NPM Version"><img src=" https://img.shields.io/npm/v/tetr.js"></a>

</p>

- [Install](#install)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)
- [Disclaimer](#disclaimer)

## Install

```sh
$ npm i tetr.js --save
```

## Documentation

### Client

- Client

  ```ts
  new Client();
  ```

  ##### Properties

  - token

  ```ts
  /**
   * @type {string}
   */
  ```

  - room.id

  ```ts
  /**
   * @type {string}
   */
  ```

  ##### Methods

  - login

  ```ts
  /**
   * @return {void}
   * @param {string} token - Client token.
   */
  ```

  - on

  ```ts
  /**
   * @return {void}
   * @param {Event} event - Event name.
   * @param {Function} func - Function to run when emitted.
   */
  ```

  - social.message

  ```ts
  /**
   * @return {void}
   * @param {string} recipient - The recipient's ID.
   * @param {string} msg - Content of the message.
   */
  ```

  - social.invite

  ```ts
  /**
   * @return {void}
   * @param {string} recipient - The recipient's ID.
   */
  ```

  - social.presence

  ```ts
  /**
   * @return {void}
   * @param {Presence} presence - Presence of the client.
   */
  ```

  - room.join

  ```ts
  /**
   * @return {void}
   * @param {string} r - Room ID.
   */
  ```

  - room.leave

  ```ts
  /**
   * @return {void}
   */
  ```

  - room.selfMode

  ```ts
  /**
   * @return {void}
   * @param {"player" | "spectator"} mode - Mode of the client.
   */
  ```

  - room.setMode

  ```ts
  /**
   * @return {void}
   * @param {string} user - User ID.
   * @param {"player" | "spectator"} mode - Mode of the user.
   */
  ```

  - room.updateSettings

  ```ts
  /**
   * @return {void}
   * @param {GameOptions} options - Options to change in the room.
   */
  ```

  - room.message

  ```ts
  /**
   * @return {void}
   * @param {string} message - Content of the message.
   */
  ```

### GameOptions

```ts
/**
 * @param {string} index - The property that is being altered.
 * @param {any} value - The value to be assigned.
 */
```

### Presence

```ts
/**
 * @param {"online" | "away" | "busy" | "offline"} status - Presence status.
 * @param {string} detail - Details of the presence.
 */
```

### Event

A good expelentation is in the unoffical documentation for TETR.IO. This can be found [here](https://github.com/Poyo-SSB/tetrio-bot-docs#pages)

## Technologies

- [TypeScript](https://www.typescriptlang.org/)

## Contributing

Feedback and PRs are welcome!

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Disclaimer

TETR.JS is not associated with TETR.IO or osk. Code is written using [VSCode's LiveShare plugin](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare-pack), so it seems "BumpyBill" has written little amounts of code.
