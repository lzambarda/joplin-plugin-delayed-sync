# Joplin Delayed Sync

This simple plugin introduces the ability to synchronize after a note has been modified, with a delay. It is intended for people who quickly jot something down on Joplin and then go about their day forgetting to synchronize! :P

## Options

The plugin only has two options:

 - **Sync Delay**: how many milliseconds to wait after a note has been edited, before triggering a synchronization. Defaults to `5000` milliseconds. I would not make this too small as it also behaves as a debouncer, clearing the timer with each note edit.
 - **Queue Syncs**: whether to queue another sync if a synchronization is already happening after **Sync Delay** seconds have passed. This is to make sure that all note changes are saved "in time". Defaults to `true`.

## Notes

I have noticed a slight delay between executing the synchronization command and the Sync button actually showing some activity. Not sure why, but in case that's too long, you can decrease the delay.
