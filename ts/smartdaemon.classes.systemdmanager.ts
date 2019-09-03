import * as plugins from './smartdaemon.plugins';
import * as paths from './smartdaemon.paths';
import { SmartDaemon } from './smartdaemon.classes.smartdaemon';

export class SmartDaemonSystemdManager {
  private smartDaemonNamespace = 'smartdaemon_';
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
      console.log('Smartdaemon can only be used on Linuc systems! Refusing to set up a service.');
      this.shouldExecute = false;
    }
    return this.shouldExecute;
  }

  public async execute(commandArg: string) {
    (await this.checkElegibility()) ? await this.smartshellInstance.exec(commandArg) : null;
  }

  public async getServices () {
    const availableServices = plugins.smartfile.fs.listAllItems(paths.systemdDir, new RegExp(`${this.smartDaemonNamespace}`));
  }

  public async init() {

  };

}