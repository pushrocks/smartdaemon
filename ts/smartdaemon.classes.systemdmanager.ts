import * as plugins from './smartdaemon.plugins';
import * as paths from './smartdaemon.paths';
import { SmartDaemon } from './smartdaemon.classes.smartdaemon';
import { ISmartDaemonServiceConstructorOptions, SmartDaemonService } from './smartdaemon.classes.service';

export class SmartDaemonSystemdManager {
  // STATIC
  private static smartDaemonNamespace = 'smartdaemon';
  public static createFileNameFromServiceName = (serviceNameArg: string) => {
    return `${SmartDaemonSystemdManager.smartDaemonNamespace}_${serviceNameArg}.service`;
  };

  public static createFilePathFromServiceName = (serviceNameArg: string) => {
    return plugins.path.join(
      paths.systemdDir,
      SmartDaemonSystemdManager.createFileNameFromServiceName(serviceNameArg)
    );
  };

  // INSTANCE
  public smartdaemonRef: SmartDaemon;
  public smartshellInstance: plugins.smartshell.Smartshell;
  public smartsystem: plugins.smartsystem.Smartsystem;

  public shouldExecute: boolean = false;

  constructor(smartdaemonRefArg: SmartDaemon) {
    this.smartdaemonRef = smartdaemonRefArg;
    this.smartshellInstance = new plugins.smartshell.Smartshell({
      executor: 'bash'
    });
    this.smartsystem = new plugins.smartsystem.Smartsystem();
  }

  public async checkElegibility() {
    if (await this.smartsystem.env.isLinuxAsync()) {
      this.shouldExecute = true;
    } else {
      console.log('Smartdaemon can only be used on Linux systems! Refusing to set up a service.');
      this.shouldExecute = false;
    }
    return this.shouldExecute;
  }

  public async execute(commandArg: string) {
    if (await this.checkElegibility()) {
      await this.smartshellInstance.exec(commandArg);
    }
  }

  /**
   * gets all services that are already present
   */
  public async getServices() {
    const existingServices: SmartDaemonService[] = [];
    if (await this.checkElegibility()) {
      const smartfmInstance = new plugins.smartfm.Smartfm({
        fmType: 'yaml'
      });
      const availableServices = await plugins.smartfile.fs.fileTreeToObject(
        paths.systemdDir,
        'smartdaemon_*.service'
      );
      for (const serviceFile of availableServices) {
        const data = smartfmInstance.parseFromComments('# ', serviceFile.contentBuffer.toString())
          .data as ISmartDaemonServiceConstructorOptions;
        const service = await SmartDaemonService.createFromOptions(this.smartdaemonRef, data);
        service.alreadyExists = true;
        existingServices.push(service);
      }
    }
    return existingServices;
  }

  public async startService(serviceArg: SmartDaemonService) {
    if (await this.checkElegibility()) {
      await this.execute(
        `systemctl start ${SmartDaemonSystemdManager.createFilePathFromServiceName(serviceArg.name)}`
      );
    }
  }
  public async stopService(serviceArg: SmartDaemonService) {
    if (await this.checkElegibility()) {
      await this.execute(
        `systemctl stop ${SmartDaemonSystemdManager.createFilePathFromServiceName(serviceArg.name)}`
      );
    }
  }

  public async saveService(serviceArg: SmartDaemonService) {
    if (await this.checkElegibility()) {
      if (serviceArg.alreadyExists) {
        this.stopService(serviceArg);
      }
      await plugins.smartfile.memory.toFs(
        this.smartdaemonRef.templateManager.generateUnitFileForService(serviceArg),
        SmartDaemonSystemdManager.createFilePathFromServiceName(serviceArg.name)
      );
    }
  }

  public async deleteService(serviceArg: SmartDaemonService) {
    if (await this.checkElegibility()) {
      await plugins.smartfile.fs.remove(
        SmartDaemonSystemdManager.createFilePathFromServiceName(serviceArg.name)
      );
    }
  }

  public async enableService(serviceArg: SmartDaemonService) {
    if (await this.checkElegibility()) {
      await this.saveService(serviceArg);
      await this.execute(
        `systemctl enable ${SmartDaemonSystemdManager.createFileNameFromServiceName(serviceArg.name)}`
      );
    }
  }
  public async disableService(serviceArg: SmartDaemonService) {
    if (await this.checkElegibility()) {
      await this.execute(
        `systemctl disable ${SmartDaemonSystemdManager.createFileNameFromServiceName(serviceArg.name)}`
      );
    }
  }

  public async init() {}
}
