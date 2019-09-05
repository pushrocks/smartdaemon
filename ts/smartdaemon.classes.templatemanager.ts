import * as plugins from './smartdaemon.plugins';
import { SmartDaemon } from './smartdaemon.classes.smartdaemon';

export class SmartDaemonTemplateManager {
  public smartdaemonRef: SmartDaemon;

  constructor(smartdaemonRefArg: SmartDaemon) {
    this.smartdaemonRef = smartdaemonRefArg;
  }

  public generateServiceTemplate = (optionsArg: {
    name: string;
    description: string;
    version: string;
    command: string;
    workkingDir;
  }) => {
    return `# ---
# name: ${optionsArg.name}
# version: ${optionsArg.version}
# description: ${optionsArg.description}
# command: ${optionsArg.command}
# workingDir: ${optionsArg.workkingDir}
# ---
[Unit]
Description=${optionsArg.description}
Requires=network.target
After=network.target

[Service]
Type=simple
ExecStart=/bin/bash -c "cd ${optionsArg.workkingDir} && ${optionsArg.command}"
WorkingDirectory=${optionsArg.workkingDir}
Restart=on-failure
LimitNOFILE=infinity
LimitCORE=infinity
StandardInput=null
StandardOutput=syslog
StandardError=syslog
Restart=always
[Install]
WantedBy=multi-user.target
`;
  }
}
