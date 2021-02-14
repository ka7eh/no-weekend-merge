# No Weekend Merge

Merging PRs that trigger some workflows on weekends or after work hours might break something without anyone being around to fix the issue.
You can prevent merges during these time using this action.

## Inputs

### Time zone (required):

Input name: **tz**

The time zone that the downtimes are specified in, e.g. -5 for Chicago and 3.5 for Tehran. The default value is 0.

### Days (optional):

There are seven inputs for the days of the week. Each day accepts a comma-separated list of downtime durations. Each downtime duration must match the following regex pattern: `/(?<fromHour>\d{2}):(?<fromMinute>\d{2})-(?<toHour>\d{2}):(?<toMinute>\d{2})/`

Input names: **mon**, **tue**, **wed**, **thu**, **fri**, **sat**, **sun**

For example, the following inputs prevent merges in the given time zone on all hours on weekends, and 00:00 to 07:00 and 16:30 to 23:59 on weekdays.

```
mon: '00:00-07:00,16:30-23:59'
tue: '00:00-07:00,16:30-23:59'
wed: '00:00-07:00,16:30-23:59'
thu: '00:00-07:00,16:30-23:59'
fri: '00:00-07:00,16:30-23:59'
sat: '00:00-23:59'
sun: '00:00-23:59'
```

## Usage

You can use this action by adding the following step to your workflow:

```
name: Check merge
on:
  push:
    branches:
      - main
jobs:
  no-weekend-merge:
    runs-on: ubuntu-latest
    steps:
    - name: Check for downtimes
      uses: ka7eh/no-weekend-merge@releases/v0.1
      with:
        tz: '-5'
        mon: '00:00-07:00,16:30-23:59'
        tue: '00:00-07:00,16:30-23:59'
        wed: '00:00-07:00,16:30-23:59'
        thu: '00:00-07:00,16:30-23:59'
        fri: '00:00-07:00,16:30-23:59'
        sat: '00:00-23:59'
        sun: '00:00-23:59'
```
