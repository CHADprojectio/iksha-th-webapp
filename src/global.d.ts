// global.d.ts
interface TelegramWebApp {
	initData: string
	initDataUnsafe: any
	close(): void
	colorScheme: 'light' | 'dark'
	// Добавьте другие методы и свойства, если необходимо
}

interface Window {
	Telegram: {
		WebApp: TelegramWebApp
	}
}
