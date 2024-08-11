// global.d.ts
interface TelegramWebApp {
	initData: string
	initDataUnsafe: any
	close(): void
	// Добавьте другие методы и свойства, если необходимо
}

interface Window {
	Telegram: {
		WebApp: TelegramWebApp
	}
}
