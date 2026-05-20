import winston from "winston";

const customFormat = winston.format.printf((info) => {
  const statusPart = info.statusCode ? ` [HTTP ${info.statusCode}]` : "";
  return `${info.timestamp} [${info.level}]${statusPart}: ${info.message}`;
});

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    customFormat,
  ),
  transports: [new winston.transports.Console()],
});

function getLevelFromStatusCode(statusCode: number): string {
  if (statusCode >= 500) {
    return "error";
  }
  if (statusCode >= 400) {
    return "warn";
  }
  return "info";
}

export const logHttpTransaction = (
  statusCode: number,
  message: string,
): void => {
  const level = getLevelFromStatusCode(statusCode);
  logger.log({
    level,
    message,
    statusCode,
  });
};

export default logger;
