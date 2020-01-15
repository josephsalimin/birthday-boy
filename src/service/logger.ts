import debug from 'debug';

const _logger = {};
const logTypes: string[] = [
  "info",
  "error"
];

const initiate = (namespace: string): void => {
  if (Object.keys(_logger).length > 0) {
    return;
  }

  logTypes.forEach(logType => {
    const logger = debug(namespace);
    logger.log = console[logType].bind(console);
    _logger[logType] = logger.extend(logType); 
  });
};

const log = (logType: string, message: any, ...params): void => {
  _logger[logType](message, ...params);
};

const info = (message: any, ...params): void => {
  log("info", message, ...params);
};

const error = (message: any, ...params): void => {
  log("error", message, ...params);
};

export {
  initiate,
  info,
  error
};
