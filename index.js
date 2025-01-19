/* The maximum number of minutes in a period (a day) */

const MAX_IN_PERIOD = 1440; // The total minutes in a day

/**
 * PART 1
 *
 * You have an appliance that uses energy, and you want to calculate how
 * much energy it uses over a period of time.
 *
 * As an input to your calculations, you have a series of events that contain
 * a timestamp and the new state (on or off). You are also given the initial
 * state of the appliance. From this information, you will need to calculate
 * the energy use of the appliance i.e. the amount of time it is switched on.
 *
 * The amount of energy it uses is measured in 1-minute intervals over the
 * period of a day. Given there is 1440 minutes in a day (24 * 60), if the
 * appliance was switched on the entire time, its energy usage would be 1440.
 * To simplify calculations, timestamps range from 0 (beginning of the day)
 * to 1439 (last minute of the day).
 *
 * HINT: there is an additional complication with the last two tests that
 * introduce spurious state change events (duplicates at different time periods).
 * Focus on getting these tests working after satisfying the first tests.
 *
 * The structure for `profile` looks like this (as an example):
 * ```
 * {
 *    initial: 'on',
 *    events: [
 *      { state: 'off', timestamp: 50 },
 *      { state: 'on', timestamp: 304 },
 *      { state: 'off', timestamp: 600 },
 *    ]
 * }
 * ```
 */

const validateProfile = (profile) => {
  let isValidProfile = false;

  let initialState = ('initial' in profile) ? profile.initial : 'off';

  return isValidProfile;
}

// Helper function to check if a value is an integer
const isInteger = (number) => Number.isInteger(number);

// Part 1: calculateEnergyUsageSimple
const calculateEnergyUsageSimple = (profile) => {
  let totalUsage = 0;
  let currentState;
  let lastTimestamp = 0;

  if (profile || profile.initial || profile.events) {
    let currentState = profile.initial === 'on' ? 'on' : 'off';

    const sortedByAscendingTimestamp = [...profile.events].sort(
	    (a, b) => a.timestamp - b.timestamp
    );
    // Iterate through events and calculate usage
    sortedByAscendingTimestamp.map((event) => {
      if (currentState === 'on') {
        totalUsage += event.timestamp - lastTimestamp;
      }

      currentState = event.state;
      lastTimestamp = event.timestamp;
    });

    // Add the usage after the last event until the end of the day
    if (currentState === 'on') {
      totalUsage += MAX_IN_PERIOD - lastTimestamp;
    } 

    if (typeof profile == 'object' && Array.isArray(profile.events)) {
      if (profile.events.length === 0 && profile.initial === 'auto-off') {
          totalUsage = MAX_IN_PERIOD;
      }
    }


  } else {
    totalUsage = MAX_IN_PERIOD;
  } // end if (profile || profile.lenth === 0)

  return totalUsage;
};

/**
 * PART 2
 *
 * You purchase an energy-saving device for your appliance in order
 * to cut back on its energy usage. The device is smart enough to shut
 * off the appliance after it detects some period of disuse, but you
 * can still switch on or off the appliance as needed.
 *
 * You are keen to find out if your shiny new device was a worthwhile
 * purchase. Its success is measured by calculating the amount of
 * energy *saved* by device.
 *
 * To assist you, you now have a new event type that indicates
 * when the appliance was switched off by the device (as opposed to switched
 * off manually). Your new states are:
 * * 'on'
 * * 'off' (manual switch off)
 * * 'auto-off' (device automatic switch off)
 *
 * (The `profile` structure is the same, except for the new possible
 * value for `initial` and `state`.)
 *
 * Write a function that calculates the *energy savings* due to the
 * periods of time when the device switched off your appliance. You
 * should not include energy saved due to manual switch offs.
 *
 * You will need to account for redundant/non-sensical events e.g.
 * an off event after an auto-off event, which should still count as
 * an energy savings because the original trigger was the device
 * and not manual intervention.
 */

// // Part 2: calculateEnergySavings
// const calculateEnergySavings = (profile) => {
//   let energySavings = 0;
//   let currentState = profile.initial === 'on' ? 'on' : 'off';
//   let lastTimestamp = 0;



//   // Iterate through events and calculate savings
//   profile.events.forEach((event) => {
//     if (event.state === 'auto-off' && currentState === 'on') {
//       energySavings += event.timestamp - lastTimestamp;
//     }

//     currentState = event.state;
//     lastTimestamp = event.timestamp;
//   });

//   // If the appliance is on until the end of the day, account for energy savings
//   if (currentState === 'on' && lastTimestamp > 0) {
//     energySavings += MAX_IN_PERIOD - lastTimestamp;
//   }

//   return energySavings;
// };

// Part 2: calculateEnergySavings
const calculateEnergySavings = (profile) => {

  let energySavings = 0;
  let initEvent = { state: profile.initial, timestamp: 0 } // initial event state
  let autoOffEvent = null;

  // track auto off events
  if (initEvent.state === 'auto-off') {
    autoOffEvent = initEvent;
  }

  if (profile.events && profile.events.length == 0) { // no event changes
    if (autoOffEvent) {
      energySavings = MAX_IN_PERIOD;
    }
  } else {
    // Iterate through events and calculate savings
    profile.events.map((currentEvent, index, events) => {
      if (autoOffEvent && currentEvent.state === 'on') {
        energySavings += currentEvent.timestamp - autoOffEvent.timestamp;
        autoOffEvent = null; // reset autoOffEvent after saving as added
      }

      // if there is no auto off event, assign the current auto off event
      // checking auto off event for null prevents duplicates
      if (autoOffEvent == null && currentEvent.state === 'auto-off') {
        autoOffEvent = currentEvent 
      }

    });

    // final event of the day, which end of the day - last event
    // end of day is MAX_IN_PERIOD (1440)
    if (autoOffEvent) {
      energySavings += MAX_IN_PERIOD - autoOffEvent.timestamp;
    }
  }

  return energySavings;
};

/**
 * PART 3
 *
 * The process of producing metrics usually requires handling multiple days of data. The
 * examples so far have produced a calculation assuming the day starts at '0' for a single day.
 *
 * In this exercise, the timestamp field contains the number of minutes since a
 * arbitrary point in time (the "Epoch"). To simplify calculations, assume:
 *  - the Epoch starts at the beginning of the month (i.e. midnight on day 1 is timestamp 0)
 *  - our calendar simply has uniform length 'days' - the first day is '1' and the last day is '365'
 *  - the usage profile data will not extend more than one month
 *
 * Your function should calculate the energy usage over a particular day, given that
 * day's number. It will have access to the usage profile over the month.
 *
 * It should also throw an error if the day value is invalid i.e. if it is out of range
 * or not an integer. Specific error messages are expected - see the tests for details.
 *
 * (The `profile` structure is the same as part 1, but remember that timestamps now extend
 * over multiple days)
 *
 * HINT: You are encouraged to re-use `calculateEnergyUsageSimple` from PART 1 by
 * constructing a usage profile for that day by slicing up and rewriting up the usage profile you have
 * been given for the month.
 */

// Part 3: calculateEnergyUsageForDay
const calculateEnergyUsageForDay = (monthUsageProfile, day) => {
  // Validate the day input
  if (!isInteger(day) || day < 1 || day > 365) {
    throw new Error("day must be an integer between 1 and 365.");
  }

  // Filter events that occur on the specified day
  const dayStartTimestamp = (day - 1) * MAX_IN_PERIOD;
  const dayEndTimestamp = day * MAX_IN_PERIOD;

  // Slice out events that occur during this day
  const dayEvents = monthUsageProfile.events.filter(
    (event) => event.timestamp >= dayStartTimestamp && event.timestamp < dayEndTimestamp
  );

  // Step 3: Construct a usage profile for this day
  const dayProfile = {
    initial: dayEvents.length > 0 ? dayEvents[0].state : monthUsageProfile.initial,
    events: dayEvents,
  };

  // Step 4: Use the `calculateEnergyUsageSimple` function to calculate the energy usage for this day
  return calculateEnergyUsageSimple(dayProfile);
};

module.exports = {
  calculateEnergyUsageSimple,
  calculateEnergySavings,
  calculateEnergyUsageForDay,
  MAX_IN_PERIOD,
};

