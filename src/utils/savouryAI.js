import { pipeline, env } from '@xenova/transformers';
import { getAikontext } from './savouryKnowledge';

// Optimize for browser environment
env.allowLocalModels = false;
env.useBrowserCache = true;

class SavouryAIService {
  constructor() {
    this.instance = null;
    this.context = getAikontext();
  }

  async getInstance() {
    if (!this.instance) {
      console.log("Loading Savoury AI model...");
      this.instance = await pipeline('question-answering', 'Xenova/distilbert-base-uncased-distilled-squad');
      console.log("Savoury AI model loaded successfully.");
    }
    return this.instance;
  }

  async ask(question) {
    try {
      const qa = await this.getInstance();
      
      // Simple intent check to ensure it only talks about the restaurant
      const siteKeywords = ['savoury', 'menu', 'food', 'order', 'reservation', 'hours', 'time', 'location', 'address', 'phone', 'price', 'eat', 'drink', 'serve', 'owner', 'santhosh'];
      const isAboutSite = siteKeywords.some(kw => 
        question.toLowerCase().includes(kw) || 
        this.context.toLowerCase().includes(question.toLowerCase().split(' ').pop())
      );

      if (!isAboutSite) {
        return "I'm the Savoury Concierge, and I'm specialized in helping with our menu and services. Could you please ask something about our restaurant?";
      }

      const result = await qa(question, this.context);
      
      if (result.score < 0.01) {
        return "I'm not quite sure about that. Our menu features a variety of gourmet dishes like Wagyu Steaks and Truffle Pizzas. You can also ask about our opening hours or location!";
      }

      return result.answer;
    } catch (error) {
      console.error("AI Error:", error);
      return "I'm having a bit of trouble thinking right now. Please try again or contact us directly at hello@savoury.com!";
    }
  }
}

export const savouryAI = new SavouryAIService();
