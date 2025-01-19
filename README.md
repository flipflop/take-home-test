# take-home-test
Take Home Test

##Grammatical Parse (for requirements)

- You have an appliance that uses energy, and you want to calculate how much energy it uses over a period of time
- input to your calculations
- a series of events that contain a timestamp and the new state (on or off)
- timestamps range from 0 (beginning of the day) to 1439 (last minute of the day)
- You are also given the initial state of the appliance
- calculate the energy use of the appliance i.e. the amount of time it is switched on
- The amount of energy it uses is measured in 1-minute intervals over the period of a day
- spurious state change events (duplicates at different time periods)

##Notes and Questions

- Ensure profile is sorted by timestamp
- Compare previousState and currentState for transition states, useful to identify duplicate events
- Timestamp range is from 0 to 1439 (1440 minutes in a 24hr day)
- Timestamp not running every 1 minute
- Duplicate event entries
- Duplicate event states (same as previous but with a different timestamp, i.e. not a state change)
- Incorrect data structure
- Incomplete or missing data
- Incorrect timestamp range over 1 day 1440 minutes
- Implement a State Machine with
    - initialState
    - Events (switch)
    - Actions (onEnter and OnExit)
        - Handle Side effects / Example Middleware?
    - Transitions (including target for transition)

##Validation

- Detect repeat of binary states (issue a warning)
- Validate schema for Profile object

##Assumptions

- Timestamp resets each day from 0 to 1440
- Event notification is based on change of event and not frequency i.e. when the event is on the new event must be off in order to qualify for a change in state
- Whenever an/off event calculate timestamp for energy
- New event timestamp needs to offset initial state timestamp of appliance
- Not calculating for leap years (Max Days 31)
- On / Off are binary states
