
const spawn = require('react-dev-utils/crossSpawn');
const paths = require('../config/paths');

const command = 'electron';
let args = [paths.appClientJs,'--debug','&']

const proc = spawn.sync(command, args, { stdio: 'inherit' });
if (proc.status !== 0) {
    console.error(`\`${command} ${args.join(' ')}\` failed`);
    return;
}