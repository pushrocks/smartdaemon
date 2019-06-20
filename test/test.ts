import { expect, tap } from '@pushrocks/tapbundle';
import * as smartdaemon from '../ts/index';

tap.test('first test', async () => {
  console.log(smartdaemon.standardExport);
});

tap.start();
