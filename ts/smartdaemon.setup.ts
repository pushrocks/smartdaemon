import * as plugins from './smartdaemon.plugins';

import { logger } from './smartdamon.logging';
import { settingsReference } from './smartdaemon.settings';
import { templateReference } from './smartdaemon.templates';

const smartshellInstance = new plugins.smartshell.Smartshell({
  executor: 'bash'
});

/**
 * print success message
 * @method setup.success
 * @param {string} message
 */
export const setupSuccess = (message: string) => {
  logger.log('success', `service-systemd: ${message}`);
};

/**
 * print error message
 * @method setup.fail
 * @param {string} message
 */
export const setupFail = (message) => {
  logger.log('error', `service-systemd ${message}`);
};

/**
 * install the service
 * can also be used to update the service
 * @method setup.add
 * @param {object} settings
 * @return {string}
 */
export const setupAdd = async (settings) => {
  setupCheckSettings(settings);
  const contents = setupParse(settings);
  await setupCheckPaths(settings);
  await setupAddLog(settings);
  await setupAddScripts(settings, contents);
  await setupAddLogrotate(settings, contents);
  return `service ${settings.name} installed`;
};

/**
 * remove the service
 * @method setup.remove
 * @param {string} service service name
 * @return {string}
 */
export const setupRemove = async (service) => {
  if (!service) {
    throw new Error('Missing argument: service name');
  }

  const cmd = `systemctl disable ${service}.service`;
  logger.log('info', `service-systemd > ${cmd}`);
  await smartshellInstance.exec(cmd);

  let file = plugins.path.join('/etc/systemd/system', `${service}.service`);
  logger.log('info', `service-systemd remove ${file}`);
  await plugins.fs.unlink(file);

  file = plugins.path.join('/usr/local/bin', `systemd-${service}-start`);
  logger.log('info', `service-systemd remove ${file}`);
  await plugins.fs.unlink(file);

  file = plugins.path.join('/etc/logrotate.d', service);
  logger.log('info', `service-systemd remove ${file}`);
  await plugins.fs.unlink(file);
  return `service ${service} uninstalled`;
};

/**
 * check mandatories params and paths
 * @method setup.checkSettings
 * @param {object} settings
 */
export const setupCheckSettings = (settings) => {
  if (!settings.name) {
    settings.name = settings.service;
  }

  delete settings.service;

  const paths = [];
  for (const optionArg of Object.keys(settingsReference)) {
    const option = settingsReference[optionArg];
    if (option.mandatory && !settings[optionArg]) {
      throw new Error(`Missing ${optionArg} in settings file or arguments`);
    }
    if (option.fs) {
      settings[optionArg] = plugins.path.resolve(settings[optionArg]);
    }
  }
};

/**
 * check mandatories params and paths
 * @method setup.checkPaths
 * @param {object} settings
 */
export const setupCheckPaths = async (settings) => {
  const exists = [];
  for (const optionArg of Object.keys(settingsReference)) {
    const option = settingsReference[optionArg];
    if (option.fs) {
      exists.push((async () => {
        const exists2 = await plugins.fs.pathExists(settings[optionArg]);
        if (!exists2) {
          throw Error(`path ${settings[optionArg]} (${optionArg}) does not exists`);
        }
      })());
    }
  }

  await Promise.all(exists);
};

/**
 * merge settings with templates
 * create scripts contents
 * @method setup.parse
 * @param {object} settings
 */
export const setupParse = (settings) => {

  if (settings.env) {
    settings.envs = '';
    for (const key of Object.keys(settings.env)) {
      settings.envs += 'Environment=' + key + '=' + settings.env[key] + '\n';
    }
  }
  settings.user = settings.user
    ? `User=${settings.user}`
    : '';
  settings.group = settings.group
    ? `Group=${settings.group}`
    : '';

  settings.date = (new Date()).toString();

  for (const key in settings) {
    if (typeof settings[key] === 'string') {
      settings[key] = plugins.string.template(settings[key], settings, true);
    }
  }

  const _service = plugins.string.template(templateReference.engines[settings.engine].service, settings, true);
  const _start = plugins.string.template(templateReference.engines[settings.engine].start, settings, true);
  const _stop = plugins.string.template(templateReference.engines[settings.engine].stop, settings, true);
  const _logrotate = settings.logrotate ? plugins.string.template(templateReference.logrotate, settings, true) : '';

  return {
    service: _service,
    start: _start,
    stop: _stop,
    logrotate: _logrotate
  };
};

/**
 * write scripts and run commands to install the service
 * @method setup.addScripts
 * @param {object} settings
 * @param {object} contents scripts contents
 * @param {string} contents.start
 * @param {string} contents.stop
 * @param {string} contents.service
 */
export const setupAddScripts = async (settings, contents) => {
  const service = plugins.path.join('/etc/systemd/system', `${settings.name}.service`);
  const tasks = [];

  if (contents.start) {
    tasks.push(() => {
      const start = plugins.path.join('/usr/local/bin', `systemd-${settings.name}-start`);
      logger.log('info', `service-systemd: write file ${start}`);
      return plugins.fs.writeFile(start, contents.start, 'utf8');
    });
  }

  if (contents.stop) {
    tasks.push(() => {
      const stop = plugins.path.join('/usr/local/bin', `systemd-${settings.name}-stop`);
      logger.log('info', `service-systemd: write file ${stop}`);
      return plugins.fs.writeFile(stop, contents.stop, {
        encoding: 'utf8'
      });
    });
  }

  if (contents.start || contents.stop) {
    tasks.push(() => {
      const cmd = `chmod a+x /usr/local/bin/systemd-${settings.name}*`;
      logger.log('info', `service-systemd > ${cmd}`);
      return smartshellInstance.exec(cmd);
    });
  }

  tasks.push(() => {
    logger.log('info', `service-systemd write file ${service}`);
    return plugins.fs.writeFile(service, contents.service, 'utf8');
  });

  tasks.push(() => {
    const cmd = `systemctl enable ${service};systemctl daemon-reload`;
    logger.log('info', `service-systemd > ${cmd}`);
    return smartshellInstance.exec(cmd);
  });

  for (const task of tasks) {
    await task();
  }
};

/**
 * ensure dirs for log files
 * @method setup.addLog
 * @param {object} settings
 */
export const setupAddLog = async (settings) => {
  const tasks = [];
  let dirLog;
  let dirError;

  if (settings.log) {
    dirLog = plugins.path.dirname(settings.log);
    logger.log('info', `service-systemd: ensure dir ${dirLog}`);
    tasks.push(plugins.fs.ensureDir(dirLog));
  }
  if (settings.error) {
    dirError = plugins.path.dirname(settings.error);
    if (dirError !== dirLog) {
      logger.log('info', `service-systemd ensure dir ${dirError}`);
      tasks.push(plugins.fs.ensureDir(dirError));
    }
  }
  await Promise.all(tasks);
};

/**
 * write logrotate conf script
 * @method setup.addLogrotate
 * @param {object} settings
 * @param {object} contents scripts contents
 * @param {string} contents.start
 * @param {string} contents.stop
 * @param {string} contents.service
 */
export const setupAddLogrotate = async (settings, contents) => {
  if (!settings.logrotate) {
    return;
  }
  const file = plugins.path.join('/etc/logrotate.d/', settings.name);
  logger.log('info', `service-systemd: write logrotate file ${file}`);
  await plugins.fs.writeFile(file, contents.logrotate, 'utf8');
};
