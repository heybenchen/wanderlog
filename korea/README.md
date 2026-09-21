# Korea trip

Files for the Seoul, Busan and Jeju trip. The itinerary itself lives in Wanderlog; this folder holds the source data and one early build script.

- `pins.json`: South Korea pins taken from a shared Google Maps list (the 500 most recently modified entries, newest first). Each pin has `name`, `note`, `lat`, `lng`, `added` and `modified`. It contains someone else's saved places and notes, so think before publishing this repo.
- `rebuild.mjs`: an early, one-off script that built the first version of the daily plan from `pins.json`. It is out of date and would overwrite the current trip, so keep it for reference only. Run from the repo root if you ever need it: `node --env-file=.env korea/rebuild.mjs <tripKey>`.

The trip key is not stored here; pass it as an argument.
