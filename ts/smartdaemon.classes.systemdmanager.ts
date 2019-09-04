import * as plugins from './smartdaemon.plugins';
import * as paths from './smartdaemon.paths';
import { SmartDaemon } from './smartdaemon.classes.smartdaemon';

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

  public async getServices() {
    if (await this.checkElegibility()) {
      const availableServices = plugins.smartfile.fs.listAllItems(
        paths.systemdDir,
        new RegExp(`${SmartDaemonSystemdManager.smartDaemonNamespace}`)
      );
    }
  }

  public async startService(serviceNameArg: string) {
    if (await this.checkElegibility()) {
      await this.execute(`systemctl start ${SmartDaemonSystemdManager.createFilePathFromServiceName(serviceNameArg)}`);
    }
  };
  public async stopService(serviceNameArg: string) {
    if (await this.checkElegibility()) {
      await this.execute(`systemctl stop ${SmartDaemonSystemdManager.createFilePathFromServiceName(serviceNameArg)}`);
    }
  }

  public async saveService(serviceNameArg: string, serviceFileString: string) {
    if (await this.checkElegibility()) {
      await plugins.smartfile.memory.toFs(
        serviceFileString,
        SmartDaemonSystemdManager.createFilePathFromServiceName(serviceNameArg)
      );
    }
  }

  public async deleteService(serviceName: string) {
    if (await this.checkElegibility()) {
      await plugins.smartfile.fs.remove(SmartDaemonSystemdManager.createFilePathFromServiceName(serviceName));
    }
  }

  public async enableService(serviceName: string) {
    if (await this.checkElegibility()) {
      await this.execute(`systemctl enable ${SmartDaemonSystemdManager.createFileNameFromServiceName(serviceName)}`);
    }
  }
  public async disableService(serviceName: string) {
    if (await this.checkElegibility()) {
      await this.execute(`systemctl disable ${SmartDaemonSystemdManager.createFileNameFromServiceName(serviceName)}`);
    }
  }

  public async init() {}
}
