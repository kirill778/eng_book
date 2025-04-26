import { Article, VocabularyWord } from "./types";
import { generateId } from "./utils";

export const sampleArticle: Article = {
  id: generateId(),
  title: "The Future of Artificial Intelligence",
  content: `Artificial Intelligence (AI) has become one of the most remarkable technological advancements of our era. From virtual assistants like Siri and Alexa to self-driving cars and sophisticated data analysis tools, AI is transforming how we live and work.

The fundamental concept behind AI is creating machines that can perform tasks that typically require human intelligence. These include problem-solving, recognizing speech, visual perception, decision-making, and language translation. The field of AI research was founded on the assumption that intelligence can be so precisely described that a machine can be made to simulate it.

Machine learning, a subset of AI, has been particularly influential in recent years. It involves training algorithms on large datasets so they can learn patterns and make predictions or decisions without being explicitly programmed for specific tasks. Deep learning, a more specialized form of machine learning using neural networks with many layers, has enabled significant breakthroughs in areas like image and speech recognition.

The ubiquitous presence of AI in our daily lives raises important ethical questions. As systems become more autonomous, who is responsible when an AI makes a mistake? How do we ensure algorithms don't perpetuate or amplify existing biases? The answers to these questions will shape the regulatory frameworks governing AI development and deployment.

Looking ahead, experts predict that AI will continue to evolve in several key directions. First, we can expect more sophisticated natural language processing, enabling more seamless human-computer interaction. Second, AI systems will become more transparent and explainable, addressing current concerns about their "black box" nature. Third, AI will increasingly collaborate with humans rather than simply replacing them, augmenting our capabilities in fields ranging from healthcare to creative arts.

The economic implications of AI are equally profound. While automation may displace certain jobs, it will also create new ones that we can't yet imagine. The key challenge for society will be ensuring that the benefits of AI are broadly shared and that workers have opportunities to develop the skills needed in an AI-driven economy.

Despite these challenges, the potential of AI to address humanity's most pressing problems is enormous. From accelerating scientific discovery to optimizing resource allocation in a changing climate, AI offers powerful new tools for human progress. The future of AI is not just about technology—it's about how we choose to harness this remarkable innovation for the common good.`,
  dateAdded: new Date(Date.now() - 3600000).toISOString()
};

export const additionalArticles: Article[] = [
  {
    id: generateId(),
    title: "The Art of Mindful Living",
    content: `In our fast-paced modern world, the ancient practice of mindfulness has emerged as a vital tool for maintaining mental well-being and emotional equilibrium. Mindfulness, the art of being present and fully engaged with whatever we're doing at the moment, has garnered significant attention from both scientific researchers and mental health professionals.

The essence of mindfulness lies in its simplicity: paying attention to the present moment without judgment. This seemingly straightforward practice can have profound effects on our mental and physical health. Research has shown that regular mindfulness practice can reduce stress, anxiety, and depression while improving focus, emotional regulation, and overall life satisfaction.

One of the most compelling aspects of mindfulness is its accessibility. Unlike many wellness practices that require special equipment or settings, mindfulness can be practiced anywhere, at any time. Whether you're walking to work, eating lunch, or even washing dishes, these mundane activities can become opportunities for mindful awareness.

The cognitive benefits of mindfulness are particularly noteworthy. Studies have demonstrated that consistent mindfulness practice can enhance attention span, improve memory, and boost creative thinking. In the workplace, these benefits translate to increased productivity, better decision-making, and more effective communication with colleagues.

Perhaps most significantly, mindfulness helps us develop resilience in the face of life's inevitable challenges. By teaching us to observe our thoughts and emotions without becoming overwhelmed by them, mindfulness provides a powerful framework for managing stress and adapting to change.`,
    dateAdded: new Date(Date.now() - 7200000).toISOString(),
    source: "Wellness Journal"
  },
  {
    id: generateId(),
    title: "Ocean Exploration: The Final Frontier",
    content: `Despite centuries of maritime exploration, the ocean remains one of Earth's most enigmatic frontiers. Scientists estimate that more than 80% of our ocean is unmapped, unobserved, and unexplored. This vast aquatic wilderness harbors countless mysteries and untold discoveries waiting to be unveiled.

Recent technological advances have revolutionized our ability to explore the ocean depths. Autonomous underwater vehicles (AUVs), equipped with sophisticated sensors and imaging systems, can now venture into previously inaccessible regions. These intrepid robots are mapping underwater mountains, discovering new species, and even locating historic shipwrecks.

The deep ocean, particularly the hadal zone found in ocean trenches, represents one of the most extreme environments on Earth. These pitch-black waters, under immense pressure, host bizarre and resilient life forms that have evolved unique adaptations to survive. Bioluminescent creatures illuminate the darkness, while extremophiles thrive in conditions that would be lethal to most organisms.

Marine biologists continue to discover new species at an astonishing rate. Each expedition to unexplored regions reveals organisms that challenge our understanding of life's diversity and adaptability. From transparent ctenophores to giant squid, these discoveries highlight how much remains to be learned about ocean life.

The importance of ocean exploration extends beyond scientific curiosity. Understanding marine ecosystems is crucial for conservation efforts and sustainable resource management. Climate change, ocean acidification, and plastic pollution pose significant threats to marine biodiversity. Only through comprehensive exploration and research can we develop effective strategies to protect these vital ecosystems.`,
    dateAdded: new Date(Date.now() - 10800000).toISOString(),
    source: "Marine Science Weekly"
  }
];

export const sampleVocabularyWords: VocabularyWord[] = [
  {
    id: generateId(),
    word: "remarkable",
    translation: "замечательный",
    contextMeaning: "Worthy of attention because unusual or exceptional.",
    dateAdded: new Date().toISOString(),
    exampleSentence: "AI has become one of the most remarkable technological advancements of our era."
  },
  {
    id: generateId(),
    word: "fundamental",
    translation: "фундаментальный",
    contextMeaning: "Forming a necessary base or core; of central importance.",
    dateAdded: new Date().toISOString(),
    exampleSentence: "The fundamental concept behind AI is creating machines that can perform tasks that typically require human intelligence."
  },
  {
    id: generateId(),
    word: "ubiquitous",
    translation: "вездесущий",
    contextMeaning: "Present, appearing, or found everywhere.",
    dateAdded: new Date().toISOString(),
    exampleSentence: "The ubiquitous presence of AI in our daily lives raises important ethical questions."
  }
];