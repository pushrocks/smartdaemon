import * as plugins from './smartdaemon.plugins';
import { SmartDaemonTemplateManager } from './smartdaemon.classes.templatemanager';
import {
  SmartDaemonService,
  ISmartDaemonServiceConstructorOptions,
} from './smartdaemon.classes.service';
import { SmartDaemonSystemdManager } from './smartdaemon.classes.systemdmanager';

export class SmartDaemon {
  public templateManager: SmartDaemonTemplateManager;
  public systemdManager: SmartDaemonSystemdManager;

  constructor() {
    this.templateManager = new SmartDaemonTemplateManager(this);
    this.systemdManager = new SmartDaemonSystemdManager(this);
  }

  /**
   * adds a service
   * @param nameArg
   * @param commandArg
   * @param workingDirectoryArg
   */
  public async addService(
    optionsArg: ISmartDaemonServiceConstructorOptions
  ): Promise<SmartDaemonService> {
    let serviceToAdd: SmartDaemonService;
    const existingServices = await this.systemdManager.getServices();
    const existingService = existingServices.find((serviceArg) => {
      return serviceArg.name === optionsArg.name;
    });
    if (!existingService) {
      serviceToAdd = await SmartDaemonService.createFromOptions(this, optionsArg);
    } else {
      serviceToAdd = existingService;
      Object.assign(serviceToAdd, optionsArg);
    }
    await serviceToAdd.save();
    return serviceToAdd;
  }
}
