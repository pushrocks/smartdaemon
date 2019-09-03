import { expect, tap } from '@pushrocks/tapbundle';
import * as smartdaemon from '../ts/index';

let testSmartdaemon: smartdaemon.SmartDaemon;

tap.test('should create an instance of smartdaemon', async () => {
  testSmartdaemon = new smartdaemon.SmartDaemon();
  expect(testSmartdaemon).to.be.instanceOf(smartdaemon.SmartDaemon);
});

tap.start();
