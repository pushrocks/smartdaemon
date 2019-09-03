// node native scope
import * as path from 'path';


export {
  path
};

// @pushrocks scope
import * as smartlog from '@pushrocks/smartlog';
import * as smartlogDestinationLocal from '@pushrocks/smartlog-destination-local';
import * as smartshell from '@pushrocks/smartshell';
import * as smartsystem from '@pushrocks/smartsystem';

export {
  smartlog,
  smartlogDestinationLocal,
  smartshell,
  smartsystem
};

// third party

import * as fs from 'fs-extra';

export {
  fs
};