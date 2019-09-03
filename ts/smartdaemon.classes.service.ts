import * as plugins from './smartdaemon.plugins';
import * as paths from './smartdaemon.paths';
import { SmartDaemon } from './smartdaemon.classes.smartdaemon';

export interface SmartDaemonServiceConstructorOptions {
  name: string;
  command: string;
  workingDir: string;
}

/**
 * represents a service that is being spawned by SmartDaemon
 */
export class SmartDaemonService implements SmartDaemonServiceConstructorOptions {
  public static async createFromOptions(smartdaemonRef: SmartDaemon, optionsArg: SmartDaemonServiceConstructorOptions) {
    const service = new SmartDaemonService(smartdaemonRef);
    for (const key of Object.keys(optionsArg)) {
      service[key] = optionsArg[key];
    }

  }

  public options: SmartDaemonServiceConstructorOptions;

  public name: string;
  public command: string;
  public workingDir: string;

  public smartdaemonRef: SmartDaemon;

  constructor(smartdaemonRegfArg: SmartDaemon) {
    this.smartdaemonRef = smartdaemonRegfArg;
  }

  /**
   * enables the service
   */
  public async enable() {
    this.smartdaemonRef
  }

  /**
   * disables the service
   */
  public async disable() {

  }

  /**
   * pauses the service
   */
  public pause() {};
}
