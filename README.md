# WordWise - English Learning App

Interactive English article reader with vocabulary management to help you learn English more effectively.

## Features

- Read English articles with interactive vocabulary support
- Click on words to see translations and save them to your vocabulary list
- Track your vocabulary progress
- Responsive design that works on desktop and mobile
- AI-powered translations with context explanations using Ollama

## Tech Stack

- Next.js 13
- React
- TypeScript
- Tailwind CSS
- Radix UI components
- Ollama for AI translations

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Setting up Ollama

This application uses Ollama for AI-powered word translations. To enable this feature:

1. Install Ollama from [https://ollama.ai/](https://ollama.ai/)
2. Run Ollama on your local machine
3. Pull a language model (по умолчанию используется gemma3:12b):
   ```bash
   ollama pull gemma3:12b
   ```
4. Ensure Ollama is running while using the application

If Ollama is not available, the application will fall back to using a predefined dictionary of translations.

You can also configure Ollama settings in `lib/config.ts`:
- Change the model name
- Enable/disable Ollama integration
- Configure the endpoint URL

## Screenshots

(Screenshots will be added soon)

## License

MIT 