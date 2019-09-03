import * as plugins from './smartdaemon.plugins';

export class SmartDaemonTemplateManager {
  public generateServiceTemplate = (optionsArg: {
    serviceName: string;
    description: string;
    serviceVersion: string;
    pathNodeJs: string;
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
ExecStart=${optionsArg.pathNodeJs} ${optionsArg.pathJsFileToRun}
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
  };
}
