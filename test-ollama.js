// Тестовый скрипт для проверки соединения с Ollama
async function testOllama() {
  try {
    console.log('Тестирование соединения с Ollama...');
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gemma3:12b',
        prompt: 'Hello, are you working?',
        stream: false,
      }),
    });

    if (!response.ok) {
      console.error(`Ошибка соединения: ${response.status} ${response.statusText}`);
      return;
    }

    const data = await response.json();
    console.log('Ответ получен!');
    console.log(data);
  } catch (error) {
    console.error('Ошибка при подключении к Ollama:', error);
  }
}

testOllama(); 