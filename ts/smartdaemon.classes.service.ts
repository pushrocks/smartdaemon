import * as plugins from './smartdaemon.plugins';
import * as paths from './smartdaemon.paths';
import { SmartDaemon } from './smartdaemon.classes.smartdaemon';

export interface ISmartDaemonServiceConstructorOptions {
  name: string;
  description: string;
  command: string;
  workingDir: string;
  version: string;
}

/**
 * represents a service that is being spawned by SmartDaemon
 */
export class SmartDaemonService implements ISmartDaemonServiceConstructorOptions {
  public static async createFromOptions(smartdaemonRef: SmartDaemon, optionsArg: ISmartDaemonServiceConstructorOptions) {
    const service = new SmartDaemonService(smartdaemonRef);
    for (const key of Object.keys(optionsArg)) {
      service[key] = optionsArg[key];
    }
    return service;
  }

  public options: ISmartDaemonServiceConstructorOptions;
  public alreadyExists = false;

  public name: string;
  public version: string;
  public command: string;
  public workingDir: string;
  public description: string;

  public smartdaemonRef: SmartDaemon;

  constructor(smartdaemonRegfArg: SmartDaemon) {
    this.smartdaemonRef = smartdaemonRegfArg;
  }

  /**
   * enables the service
   */
  public async enable() {
    await this.smartdaemonRef.systemdManager.enableService(this);
  }

  /**
   * disables the service
   */
  public async disable() {
    await this.smartdaemonRef.systemdManager.disableService(this);
  }

  /**
   * starts a service
   */
  public async start() {
    await this.smartdaemonRef.systemdManager.startService(this);
  }

  /**
   * stops a service
   */
  public async stop() {
    await this.smartdaemonRef.systemdManager.stopService(this);
  }


  // Save and Delete
  public async save() {
    await this.smartdaemonRef.systemdManager.saveService(this);
  }

  /**
   * deletes the service
   */
  public async delete() {
    await this.smartdaemonRef.systemdManager.deleteService(this);
  }
}
