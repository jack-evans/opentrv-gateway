const bunyan = require('bunyan')
const moment = require('moment')
const rp = require('request-promise')

const logger = bunyan.createLogger({name: 'activity-checker', serializers: bunyan.stdSerializers})

/**
 * Method:
 *
 * 1. get all schedules
 * 	- if no schedules return
 * 2. for each schedule compare time to current time
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
	const numOfSchedules = schedules.length
	let activeSchedules = []
	let indexOfActiveSchedule = []

	let time = new Date()
	let hours = time.getHours()
	let minutes = time.getMinutes()


	for (let i = 0; i < numOfSchedules; i++) {
		let schedule = schedules[i]

		for (let j = 0; j < schedule.startTime; j++) {
			let startTimeHours = schedule.startTime[j].split(':')[0]
			let startTimeMinutes = schedule.startTime[j].split(':')[1]

			let endTimeHours = schedule.endTime[j].split(':')[0]
			let endTimeMinutes = schedule.endTime[j].split(':')[1]

			if (hours >= startTimeHours && minutes >= startTimeMinutes) {
				activeSchedules.push()
			}
		}
	}

	return Promise.resolve(activeSchedules)
}

module.exports = {
	startActivityChecker: startActivityChecker,
	internal: {
		_getAllSchedules: _getAllSchedules,
		_identifyAndReturnActiveSchedules: _identifyAndReturnActiveSchedules
	}
}
