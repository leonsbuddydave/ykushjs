# ykushjs
Node.js module for [Yepkit Ykush USB switch](https://www.yepkit.com/products/ykush).
Based on [ykushcmd](https://github.com/Yepkit/ykush).

## Supported modules

* [ykush](https://www.yepkit.com/products/ykush)
* [ykushxs](https://www.yepkit.com/product/300115/YKUSHXS)
* [ykush3](https://www.yepkit.com/product/300110/YKUSH3)


## Requirements
* linux, win64 or macos
* node 8, 10 or 12


## API

```js
(() => async function() {
    const Ykush = require('Ykush');
    const listOfSerialNumbers = await Ykush.detect();
    const ykush = new Ykush(listOfSerialNumbers[0]);
    await ykush.powerOn({channel: 1});
    await ykush.powerOff({channel: 1});
    await ykush.powerAllOn();
    await ykush.powerAllOff();
    console.log(ykush.serialNumber);
}())();
```
