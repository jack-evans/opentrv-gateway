const bunyan = require('bunyan')
const rp = require('request-promise')

const logger = bunyan.createLogger({name: 'activity-checker', serializers: bunyan.stdSerializers})

/**
 * Method:
 *
 * 1. get all schedules
 * 	- if no schedules return
 * 2. for each schedule compare time
 */

const startActivityChecker = () => {
	logger.info('Starting activity checker')
	return module.exports.internal._getAllSchedules()
		.then(schedules => {
			logger.info('Retrieved the following schedules: ', schedules)
			if (schedules.length < 1) {
				return Promise.resolve()
			} else {
				return module.exports.internal._identifyAndReturnActiveSchedules(schedules)
			}
		})
		.catch(error => {

		})
}

const _getAllSchedules = () => {
	logger.info('Entered into the _getAllSchedules function')
	let options = {
		url: 'http://localhost:3002/api/v1/schedule',
		method: 'GET',
		json: true
	}

	logger.info('Making a ' + options.method + ' request to ' + options.url)
	return rp(options)
}

const _identifyAndReturnActiveSchedules = (schedules) => {

}

module.exports = {
	startActivityChecker: startActivityChecker,
	internal: {
		_getAllSchedules: _getAllSchedules,
		_identifyAndReturnActiveSchedules: _identifyAndReturnActiveSchedules
	}
}
