interface DowntimePattern {
  [k: string]: string
  fromHour: string
  fromMinute: string
  toHour: string
  toMinute: string
}

export const isInDowntime = (
  date: Date,
  tz: number,
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

  const hourAdjustment = parseInt(tz.toString(), 10)
  const minuteAdjustment = (tz % hourAdjustment) * 60

  const start = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    fromHour - hourAdjustment,
    fromMinute - minuteAdjustment
  )

  const end = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    toHour - hourAdjustment,
    toMinute - minuteAdjustment
  )

  return date.getTime() >= start && date.getTime() <= end
}
