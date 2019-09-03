import * as plugins from './smartdaemon.plugins';
import { SmartDaemonTemplateManager } from './smartdaemon.classes.templatemanager';
import { SmartDaemonService } from './smartdaemon.classes.service';
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

  public async addService(nameArg: string, commandArg: string, workingDirectoryArg?: string): Promise<SmartDaemonService> {
    let serviceToAdd: SmartDaemonService;
    const existingService = this.serviceMap.find(serviceArg => {
      return serviceArg.name === nameArg;
    });
    if (!existingService) {
      serviceToAdd = await SmartDaemonService.createFromOptions(this, {
        command: commandArg,
        name: nameArg,
        workingDir: workingDirectoryArg
      })
    } else {

    }
    return serviceToAdd;
  };

  public async init() {
    await this.systemdManager.init();
  }
}
