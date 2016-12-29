#!/bin/bash
set -e

dir_name=self_install_${RANDOM}_${RANDOM}_${RANDOM}
mkdir $dir_name
cd $dir_name
echo '{}' > package.json
npm install --save egxo
node -e 'require("egxo")'
cd ..
rm -rf $dir_name
