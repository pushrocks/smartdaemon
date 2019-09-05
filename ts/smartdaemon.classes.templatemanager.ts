import * as plugins from './smartdaemon.plugins';
import { SmartDaemon } from './smartdaemon.classes.smartdaemon';
import { SmartDaemonService } from './smartdaemon.classes.service';

export class SmartDaemonTemplateManager {
  public smartdaemonRef: SmartDaemon;

  constructor(smartdaemonRefArg: SmartDaemon) {
    this.smartdaemonRef = smartdaemonRefArg;
  }

  public generateUnitFileForService = (serviceArg: SmartDaemonService) => {
    return `# ---
# name: ${serviceArg.name}
# version: ${serviceArg.version}
# description: ${serviceArg.description}
# command: ${serviceArg.command}
# workingDir: ${serviceArg.workingDir}
# ---
[Unit]
Description=${serviceArg.description}
Requires=network.target
After=network.target

[Service]
Type=simple
ExecStart=/bin/bash -c "cd ${serviceArg.workingDir} && ${serviceArg.command}"
WorkingDirectory=${serviceArg.workingDir}
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
