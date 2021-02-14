import * as core from '@actions/core'
import {isInDowntime} from './check'

const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

async function run(): Promise<void> {
  const currentDate = new Date()
  const tz = parseFloat(core.getInput('tz'))
  core.debug(`TZ: ${tz} - Day: ${currentDate.getUTCDay()}`)

  const downtimes = core.getInput(days[currentDate.getUTCDay()]) || ''
  core.debug(`Downtimes: ${downtimes}`)
  // try {
  for (const downtime of downtimes.split(',')) {
    if (isInDowntime(currentDate, tz, downtime)) {
      core.setFailed(
        `The PR cannot be merged at this time (${currentDate}) with the current settings (${downtime}).`
      )
    }
  }
  // } catch (error) {
  //   core.setFailed(`Error: ${error.message}. Run date: ${currentDate}.`)
  // }
}

run()
