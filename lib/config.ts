interface OllamaConfig {
  endpoint: string;
  model: string;
  enabled: boolean;
}

export const ollamaConfig: OllamaConfig = {
  endpoint: 'http://localhost:11434/api/generate',
  model: 'gemma3:12b', // Модель, которая уже установлена на ПК
  enabled: true // Можно переключить на false, чтобы всегда использовать моковые данные
}; 