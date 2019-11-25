# ykushjs
Node.js module for [Yepkit Ykush USB switch](https://www.yepkit.com/products/ykush).
Based on [ykushcmd](https://github.com/Yepkit/ykush).

## Supported modules

* [ykush](https://www.yepkit.com/products/ykush)
* [ykushxs](https://www.yepkit.com/product/300115/YKUSHXS)
* [ykush3](https://www.yepkit.com/product/300110/YKUSH3)


## Requirements
* linux, win64 or macos
* node 10 or 12

**linux**
* libusb: `sudo apt install -y libusb-1.0-0`
* udev rules to be able to use ykush without root access

    [Here](bin/linux/install_udev.sh) is simple udev rule installation script. To install it just run:
    ```
    curl -sL https://github.com/OpenTMI/ykushjs/raw/master/bin/linux/install_udev.sh | sudo bash -
    ```


## API

```js
(() => async function() {
    const {Ykush, Ykushxs} = require('Ykush');
    
    // ykush
    let listOfSerialNumbers = await Ykush.list();
    const ykush = new Ykush(listOfSerialNumbers[0]);
    await ykush.powerOn({channel: 1});
    await ykush.powerOff({channel: 1});
    await ykush.powerAllOn();
    await ykush.powerAllOff();
    console.log(ykush.serialNumber);
    
    // ykushxs
    listOfSerialNumbers = await Ykushxs.list();
    const ykushxs = new Ykushxs(listOfSerialNumbers[0]);
    await ykushxs.powerOn();
    await ykushxs.powerOff();
    
    // ykush3
    listOfSerialNumbers = await Ykush3.list();
    const ykush3 = new Ykushxs(listOfSerialNumbers[0]);
    await ykush3.powerOn({channel: 1});
    await ykush3.powerOff({channel: 1});
    await ykush3.reset();
    await ykush3.switchOn5V()
    await ykush3.switchOff5V()
    await ykush3.writeGPIO({gpio: 1, state: 0})
    await ykush3.writeGPIO({gpio: 1, state: 1})

})();
```
