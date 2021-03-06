﻿var exec = require('../lib/exec').default.exec;

export default function BuildDistributable(componentname, componententry, distpath) {
    return exec(`node ./node_modules/webpack/bin/webpack --config webpack-base.config.js --env.componententry="${componententry}" --env.componentname=${componentname} --env.distpath="${distpath}" --bail`);
}