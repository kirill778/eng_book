# WordWise - Advanced English Learning Application

WordWise is an interactive application designed to enhance English language acquisition through contextual learning. It combines article reading with instant word translation and vocabulary management, creating an immersive and efficient learning environment.

## Purpose and Benefits

WordWise addresses several key challenges in language learning:

- **Contextual Learning**: Instead of learning words in isolation, users encounter vocabulary in meaningful contexts, which significantly improves retention and proper usage.
  
- **Reduced Friction**: Traditional methods require constant switching between reading and dictionary lookup, disrupting the learning flow. WordWise integrates these activities seamlessly.
  
- **Comprehensive Word Information**: Beyond simple translations, the app provides contextual meanings, linguistic explanations, English synonyms, and example usage.
  
- **Systematic Vocabulary Building**: The application allows users to save words to a personal vocabulary list, helping track progress and facilitating spaced repetition learning.

## Key Features

- **Interactive Article Reader**: Read English articles with the ability to select any word or phrase for instant translation
  
- **Intelligent Translation**: 
  - Russian translations of words and phrases
  - English synonyms for vocabulary expansion
  - Contextual meaning explanations in Russian
  - Detailed linguistic information in English (etymology, usage, nuances)
  - Example sentences from literature, speeches, or other sources
  
- **Vocabulary Management**:
  - Save words to your personal vocabulary list
  - Review saved words with their complete context and explanations
  - Track learning progress
  
- **Smart UI Features**:
  - Previously learned words are automatically highlighted in articles
  - Responsive design that works on both desktop and mobile devices
  - Dark/light theme support
  
- **AI-Powered Translations**: Uses Ollama to provide high-quality, context-aware translations and explanations

## Technical Implementation

### Tech Stack

- **Frontend**: Next.js 13, React, TypeScript, Tailwind CSS
- **UI Components**: Shadcn/UI (built on Radix UI)
- **AI Integration**: Ollama API for intelligent translations
- **State Management**: React Context API
- **Storage**: Local storage for vocabulary persistence

### Architecture

The application follows a component-based architecture with:
- Article reader component for displaying content
- Word selection handling and context extraction
- Translation popup with comprehensive word information
- Vocabulary management system

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start using WordWise.

## Setting up Ollama for AI Translations

This application leverages Ollama to provide AI-powered word translations and explanations:

1. Install Ollama from [https://ollama.ai/](https://ollama.ai/)
2. Run Ollama on your local machine
3. Pull a language model (the default is gemma3:12b):
   ```bash
   ollama pull gemma3:12b
   ```
4. Ensure Ollama is running while using the application

If Ollama is not available, the application will fall back to using a predefined dictionary of common translations.

You can configure Ollama settings in `lib/config.ts`:
- Change the model name
- Enable/disable Ollama integration
- Configure the endpoint URL

## Future Development

- Synchronization across devices
- Enhanced pronunciation features
- Expanded article library
- Custom article import
- Progress analytics and learning recommendations

## License

MIT 