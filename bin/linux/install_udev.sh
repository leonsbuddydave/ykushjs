#!/bin/bash
# Simple installation script for ykush udev rules

# exit immediately if fail
set -e


if [ "$(expr substr $(uname -s) 1 5)" != "Linux" ]; then
    echo "This script is only for linux"
    exit 1
fi

if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root"
   exit 1
fi

wget https://raw.githubusercontent.com/OpenTMI/ykushjs/master/bin/linux/99-ykush.rules -O /etc/udev/rules.d/99-ykush.rules
chmod 644 /etc/udev/rules.d/99-ykush.rules
usermod -a -G dialout $USER
udevadm control --reload-rules && udevadm trigger
echo "Ready"
