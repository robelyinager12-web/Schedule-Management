# Engineer Ry

A personal productivity dashboard for software engineers — daily schedule,
task manager, weekly planner, habit tracker, KPIs, and monthly review,
all in one local-first tool.

## What this is

A single-page app, no backend, no account. Your data lives in your
browser's localStorage. Built around a specific time-management
framework: protected deep work blocks, a 5-category task system,
and burnout-prevention habit tracking.

## What this is not

- Not multi-device. Data does not sync between browsers or devices.
- Not a team tool. Single user only.
- Not connected to any real calendar (Google Calendar, etc).

## Running it

Some browsers block `fetch()` on file:// paths, which this app needs
to load schedule-config.json. Run a local server instead of double-
clicking index.html:

## Backing up your data

Click Export in the header to download a JSON backup of everything.
Click Import to restore from a backup file. Do this before clearing
browser data or switching machines — localStorage does not sync or
survive a cache clear.

## Customizing your schedule

Edit data/schedule-config.json directly. Each block needs a start
time, end time, label, and category (deep-work, coding, learning,
meeting, or personal).