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

  public async addService(serviceNameArg: string, commandArg: string, workingDirectory?: string): Promise<SmartDaemonService> {
    let serviceToAdd: SmartDaemonService;
    const existingService = this.serviceMap.find(serviceArg => {
      return serviceArg.name === serviceNameArg;
    });
    if (!existingService) {

    } else {

    }
    return serviceToAdd;
  };

  public async init() {
    await this.systemdManager.init();
  }
}
