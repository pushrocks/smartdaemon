import * as plugins from './smartdaemon.plugins';

export const logger = new plugins.smartlog.Smartlog({
  logContext: {
    company: 'Some Company',
    companyunit: 'Some CompanyUnit',
    containerName: 'Some Containername',
    environment: 'local',
    runtime: 'node',
    zone: 'gitzone'
  },
  minimumLogLevel: 'silly'
});

logger.addLogDestination(new plugins.smartlogDestinationLocal.DestinationLocal());
