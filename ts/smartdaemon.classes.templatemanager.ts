import * as plugins from './smartdaemon.plugins';
import { SmartDaemon } from './smartdaemon.classes.smartdaemon';

export class SmartDaemonTemplateManager {
  public smartdaemonRef: SmartDaemon;

  constructor(smartdaemonRefArg: SmartDaemon) {
    this.smartdaemonRef = smartdaemonRefArg;
  }

  public generateServiceTemplate = (optionsArg: {
    serviceName: string;
    description: string;
    serviceVersion: string;
    command: string;
    pathWorkkingDir;
    pathJsFileToRun;
  }) => {
    return `
# servicVersion: ${optionsArg.serviceVersion}
[Unit]
Description=${optionsArg.description}
Requires=network.target
After=network.target

[Service]
Type=simple
ExecStart=/bin/bash -c "cd ${optionsArg.pathWorkkingDir} && ${optionsArg.command}"
WorkingDirectory=${optionsArg.pathWorkkingDir}
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
