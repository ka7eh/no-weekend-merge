import * as core from '@actions/core'
import {isInDowntime} from './check'

const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

const run = async (): Promise<void> => {
  const currentDate = new Date()
  try {
    const tz = parseFloat(core.getInput('tz'))
    const downtimes = core.getInput(days[currentDate.getUTCDate()]) || ''

    for (const downtime of downtimes.split(',')) {
      if (isInDowntime(currentDate, tz, downtime)) {
        core.setFailed(
          `The PR cannot be merged at this time (${currentDate}) with the current settings (${downtime}).`
        )
      }
    }
  } catch (error) {
    core.setFailed(`Error: ${error}. Run date: ${currentDate}.`)
  }
}

run()
