export default defineI18nConfig(() => ({
	legacy: false,

	strategy: 'no_prefix',
	locales: [
		{
			code: 'de',
			name: 'Deutsch'
		}, {
			code: 'en',
			name: 'English'
		}
	],
	defaultLocale: 'en',
	fallbackLocale: 'en',

	messages: {
		en: {
			appName: 'Zeity',
			common: {
				add: 'Add',
				cancel: 'Cancel',
				custom: 'Custom',
				delete: 'Delete',
				download: 'Download',
				edit: 'Edit',
				save: 'Save',
				start: 'Start',
				stop: 'Stop',
			},
			navigation: {
				timer: 'Timer',
				projects: 'Projects',
				reports: 'Reports',
				settings: 'Settings',
				login: 'Login',
				user: 'User',
				about: 'About',
				more: 'More',
			},
			times: {
				title: 'Times',
				form: {
					start: 'Start',
					end: 'End',
					project: 'Project',
					notes: 'Notes',
				},
				addNotes: 'Add notes',
				noProject: 'No project',
			},
			projects: {
				title: 'Projects',
				showClosed: 'closed projects',
				create: {
					title: 'Create Project',
				},
				edit: {
					title: 'Edit Project',
				},
				form: {
					name: 'Name',
					status: 'Status',
					notes: 'Notes',
				},
				status: {
					active: 'Active',
					closed: 'Closed',
				}
			},
			reports: {
				summary: 'Summary',
				report: 'Report',
			},
			settings: {
				title: 'Settings',
				general: 'General',
				language: 'Language',
				appearance: 'Appearance',
				theme: 'Theme',
				light: 'Light',
				dark: 'Dark',
				auto: 'Auto',
				color: 'Color',
				data: 'Data',
				import: 'Import',
				export: 'Export',
			},
			about: {
				title: 'Zeity',
				description: 'Zeity is a productivity app for getting things done.',
			},
		},
		de: {
			appName: 'Zeity',
			common: {
				add: 'Hinzufügen',
				cancel: 'Abbrechen',
				custom: 'Benutzerdefiniert',
				delete: 'Löschen',
				download: 'Herunterladen',
				edit: 'Bearbeiten',
				save: 'Speichern',
				start: 'Start',
				stop: 'Stop',
			},
			navigation: {
				timer: 'Timer',
				projects: 'Projekte',
				reports: 'Berichte',
				settings: 'Einstellungen',
				login: 'Anmelden',
				user: 'Benutzer',
				about: 'Über',
				more: 'Mehr',
			},
			times: {
				title: 'Zeiten',
				form: {
					start: 'Start',
					end: 'Ende',
					project: 'Projekt',
					notes: 'Notizen',
				},
				addNotes: 'Notizen hinzufügen',
				noProject: 'Kein Projekt',
			},
			projects: {
				title: 'Projekte',
				showClosed: 'Geschlossene Projekte',
				create: {
					title: 'Projekt erstellen',
				},
				edit: {
					title: 'Projekt bearbeiten',
				},
				form: {
					name: 'Name',
					status: 'Status',
					notes: 'Notizen',
				},
				status: {
					active: 'Aktiv',
					closed: 'Geschlossen',
				}
			},
			reports: {
				summary: 'Zusammenfassung',
				report: 'Bericht',
			},
			settings: {
				title: 'Einstellungen',
				general: 'Allgemein',
				language: 'Sprache',
				appearance: 'Erscheinungsbild',
				theme: 'Thema',
				light: 'Hell',
				dark: 'Dunkel',
				auto: 'Automatisch',
				color: 'Farbe',
				data: 'Daten',
				import: 'Importieren',
				export: 'Exportieren',
			},

			about: {
				title: 'Zeity',
				description: 'Zeity ist eine Produktivitäts-App zum Erledigen von Aufgaben.',
			},
		},
	},
}));
