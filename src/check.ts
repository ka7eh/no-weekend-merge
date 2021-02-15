interface UTCAdjustments {
  hours: number
  minutes: number
}

interface DowntimePattern {
  [k: string]: string
  fromHour: string
  fromMinute: string
  toHour: string
  toMinute: string
}

export const getUTCAdjustments = (tz: number): UTCAdjustments => {
  const hours = parseInt(tz.toString(), 10)
  const minutes = (tz % hours) * 60
  return {
    hours,
    minutes
  }
}

export const isInDowntime = (
  date: Date,
  utcAdjustments: UTCAdjustments,
  downtime?: string
): boolean => {
  if (!downtime) {
    return false
  }

  const result = /(?<fromHour>\d{2}):(?<fromMinute>\d{2})-(?<toHour>\d{2}):(?<toMinute>\d{2})/.exec(
    downtime
  )

  if (!result) {
    throw new Error('Invalid downtime')
  }

  const groups = result.groups as DowntimePattern

  const fromHour = parseInt(groups.fromHour, 10)
  const fromMinute = parseInt(groups.fromMinute, 10)
  const toHour = parseInt(groups.toHour, 10)
  const toMinute = parseInt(groups.toMinute, 10)

  for (const num of [fromHour, fromMinute, toHour, toMinute]) {
    if (Number.isNaN(num)) {
      throw new Error('Invalid downtime')
    }
  }

  for (const hour of [fromHour, toHour]) {
    if (hour < 0 || hour > 23) {
      throw new Error('Invalid downtime')
    }
  }

  for (const minute of [fromMinute, toMinute]) {
    if (minute < 0 || minute > 59) {
      throw new Error('Invalid downtime')
    }
  }

  if (fromHour > toHour || (fromHour === toHour && fromMinute > toMinute)) {
    throw new Error('Invalid downtime')
  }

  const start = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    fromHour - utcAdjustments.hours,
    fromMinute - utcAdjustments.minutes
  )

  const end = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    toHour - utcAdjustments.hours,
    toMinute - utcAdjustments.minutes
  )

  return date.getTime() >= start && date.getTime() <= end
}
