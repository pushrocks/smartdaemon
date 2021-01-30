import { expect, tap } from '@pushrocks/tapbundle';
import * as smartdaemon from '../ts/index';

let testSmartdaemon: smartdaemon.SmartDaemon;

tap.test('should create an instance of smartdaemon', async () => {
  testSmartdaemon = new smartdaemon.SmartDaemon();
  expect(testSmartdaemon).to.be.instanceOf(smartdaemon.SmartDaemon);
});

tap.test('should create a service', async () => {
  testSmartdaemon.addService({
    name: 'npmversion',
    version: 'x.x.x',
    command: 'npm -v',
    description: 'displays the npm version',
    workingDir: __dirname,
  });
});

tap.start();
