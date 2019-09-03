import * as plugins from './smartdaemon.plugins';
import * as paths from './smartdaemon.paths';
import { SmartDaemon } from './smartdaemon.classes.smartdaemon';

export interface SmartDaemonServiceConstructorOptions {
  name: string;
  description: string;
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
    return service;
  }

  public options: SmartDaemonServiceConstructorOptions;

  public name: string;
  public description: string;
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
    await this.save();
    await this.smartdaemonRef.systemdManager.enableService(this.name);
  }

  /**
   * disables the service
   */
  public async disable() {
    await this.smartdaemonRef.systemdManager.disableService(this.name);
  }

  /**
   * starts a service
   */
  public async start() {
    await this.smartdaemonRef.systemdManager.startService(this.name);
  }

  /**
   * stops a service
   */
  public async stop() {
    await this.smartdaemonRef.systemdManager.stopService(this.name);
  }


  // Save and Delete
  public async save() {
    await this.smartdaemonRef.systemdManager.saveService(this.name, this.smartdaemonRef.templateManager.generateServiceTemplate({
      command: this.command,
      description: this.description,
      pathWorkkingDir: this.workingDir,
      serviceName: this.name,
      serviceVersion: 'x.x.x'
    }));
  }

  /** */
  public async delete() {
    await this.smartdaemonRef.systemdManager.deleteService(this.name);
  }
}
