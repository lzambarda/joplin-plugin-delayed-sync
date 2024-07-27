import joplin from 'api';
import { SettingItemType } from 'api/types';

joplin.plugins.register({
	onStart: async function() {
		await joplin.settings.registerSection('delayedSyncSettings', {
			label: 'Delayed Sync',
			iconName: 'fas fa-clock',
		});

		await joplin.settings.registerSettings({
			'delayedSyncSettings.delay': {
				value: 5000,
				type: SettingItemType.Int,
				minimum: 1000,
				section: 'delayedSyncSettings',
				public: true,
				label: 'Sync Delay',
				description: 'How many milliseconds to wait after a note is changed before triggering a sync.'
			},
			'delayedSyncSettings.queue': {
				value: true,
				type: SettingItemType.Bool,
				section: 'delayedSyncSettings',
				public: true,
				label: 'Queue Syncs',
				description: 'Whether to queue a sync if a sync is already in progress and a note is edited. Queue will trigger after Sync Delay.'
			},
		});

		let syncTimeout: NodeJS.Timeout;
		let isSyncing: boolean;
		let isSyncQueued: boolean;

		await joplin.workspace.onSyncStart(() => {
			isSyncing = true;
			console.log('[DelayedSync] isSyncing = true')
		});

		await joplin.workspace.onSyncComplete(async () => {
			isSyncing = false;
			console.log('[DelayedSync] isSyncing = false')

			if (isSyncQueued) {
				isSyncQueued = false;
				console.log('[DelayedSync] setting new delay from queue');
				await setDelayedSync();
			}
		});

		const setDelayedSync = async () => {
			const delay: number = await joplin.settings.value('delayedSyncSettings.delay');
			const queue: boolean = await joplin.settings.value('delayedSyncSettings.queue');

			console.log(`[DelayedSync] setting delayed sync with delay ${delay}, queue ${queue}`);

			if (isSyncing) {
				if (queue) {
					isSyncQueued = true;
					console.log('[DelayedSync] queueing another sync after this one');
				}
				return
			}

			clearTimeout(syncTimeout);
			syncTimeout = setTimeout(async () => {
				console.log('[DelayedSync] running synchronize');
				await joplin.commands.execute('synchronize',true);
			}, delay);
		}

		// This event will be triggered when the user selects a different note
		await joplin.workspace.onNoteChange(setDelayedSync);
	},
});
