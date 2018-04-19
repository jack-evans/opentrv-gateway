
/**
 * logFunctionEntry
 *
 * @param {Object} logger - the bunyan logger
 * @param {String} functionName - name of the function
 * @param {Boolean} isInternalFunction - is it an internal function
 * @param {Object} options - properties to be logged
 */
const logFunctionEntry = (logger, functionName, isInternalFunction, options) => {
  let logMessage = 'Entered into the ' + functionName
  if (isInternalFunction) {
    logMessage += ' internal'
  }
  logMessage += ' function'
  logger.info(logMessage, options || '')
}

/**
 * logErrorCase
 *
 * @param {Object} logger - the bunyan logger
 * @param {String} functionName - name of the function
 * @param {Object} errorObject - error object to be logged
 */
const logErrorCase = (logger, functionName, errorObject) => {
  let logMessage = 'Encountered '
  switch (errorObject.statusCode) {
    case 400: {
      logMessage += 'bad request '
      break
    }

    case 404: {
      logMessage += 'not found '
      break
    }

    case 409: {
      logMessage += 'conflict '
      break
    }

    case 500: {
      logMessage += 'internal server error '
      break
    }

    default: {
      logMessage += 'unexpected error (' + errorObject.statusCode + ') '
      break
    }
  }
  logMessage = logMessage + 'in the ' + functionName
  logger.error(logMessage, errorObject)
}

module.exports = {
  logFunctionEntry: logFunctionEntry,
  logErrorCase: logErrorCase
}
