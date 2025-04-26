interface OllamaConfig {
  endpoint: string;
  model: string;
  enabled: boolean;
}

export const ollamaConfig: OllamaConfig = {
  endpoint: 'http://localhost:11434/api/generate',
  model: 'llama3', // Имя модели Ollama, которую вы используете
  enabled: true // Можно переключить на false, чтобы всегда использовать моковые данные
}; 