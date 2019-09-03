import * as plugins from './smartdaemon.plugins';
import { SmartDaemonTemplateManager } from './smartdaemon.classes.templatemanager';

const smartDaemonNamespace = 'smartdaemon_';

interface SmartDaemonConstructorOptions {
  name: string;
  scriptPath: string;
  workingDir: string;
}

export class SmartDaemon {
  private templateManager: SmartDaemonTemplateManager;
  private smartshellInstance: plugins.smartshell.Smartshell;
  private smartsystem: plugins.smartsystem.Smartsystem;
  private shouldExecute: boolean = false;

  constructor() {
    this.templateManager = new SmartDaemonTemplateManager;
    this.smartshellInstance = new plugins.smartshell.Smartshell({
      executor: 'bash'
    });
    this.smartsystem = new plugins.smartsystem.Smartsystem();
  }

  public async checkElegibility () {
    if (await this.smartsystem.env.isLinuxAsync()) {
      this.shouldExecute = true;
    } else {
      console.log('Smartdaemon can only be used on Linuc systems! Refusing to set up a service.');
      this.shouldExecute = false;
    }
    return this.shouldExecute;
  }

  /**
   * enables the service
   */
  public async enable() {

  };

  /**
   * disables the service
   */
  public async disable() {
    
  };

  /**
   * pauses the service
   */
  public pause() {};

  
  private async execute(commandArg: string) {
    
    this.smartshellInstance.exec(commandArg);
  }
}