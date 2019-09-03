import * as plugins from './smartdaemon.plugins';
import { SmartDaemonTemplateManager } from './smartdaemon.classes.templatemanager';
import { SmartDaemonService, SmartDaemonServiceConstructorOptions } from './smartdaemon.classes.service';
import { SmartDaemonSystemdManager } from './smartdaemon.classes.systemdmanager';



export class SmartDaemon {
  
  public serviceMap: plugins.lik.Objectmap<SmartDaemonService>;
  public templateManager: SmartDaemonTemplateManager;
  public systemdManager: SmartDaemonSystemdManager;

  constructor() {
    this.serviceMap = new plugins.lik.Objectmap<SmartDaemonService>();
    this.templateManager = new SmartDaemonTemplateManager(this);
    this.systemdManager = new SmartDaemonSystemdManager(this);
  }

  /**
   * adds a service
   * @param nameArg
   * @param commandArg 
   * @param workingDirectoryArg 
   */
  public async addService(optionsArg: SmartDaemonServiceConstructorOptions): Promise<SmartDaemonService> {
    let serviceToAdd: SmartDaemonService;
    const existingService = this.serviceMap.find(serviceArg => {
      return serviceArg.name === optionsArg.name;
    });
    if (!existingService) {
      serviceToAdd = await SmartDaemonService.createFromOptions(this, optionsArg);
    } else {
      serviceToAdd = existingService;
      Object.assign(serviceToAdd, optionsArg);
      await serviceToAdd.save();
    }
    return serviceToAdd;
  };

  public async init() {
    await this.systemdManager.init();
  }
}
