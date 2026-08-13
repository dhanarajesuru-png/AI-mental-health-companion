/**
 * Conversational AI Companion Engine with RAG Context & Safety Constraints
 * Integrates Google Gemini API with strict dual-layer safety pre-guardrails
 * and offline TF-IDF RAG fallback.
 */

import { SafetyPipeline } from './safetyPipeline.js';
import { RAGEngine } from './ragEngine.js';

export class AICompanionService {
  /**
   * Helper to call Google Gemini API REST endpoint
   */
  static async callGeminiAPI(userMessage, history = [], retrievedDocs = [], memoryContext = [], apiKey = "") {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

      const systemPrompt = `You are AuraMind, an empathetic, supportive, evidence-based AI Mental Health Companion.
Your core goal is to provide warm, non-judgmental active listening rooted in Cognitive Behavioral Therapy (CBT), Dialectical Behavior Therapy (DBT), and Mindfulness protocols.

STRICT BOUNDARIES:
- NEVER provide psychiatric diagnoses, medical advice, or medication prescriptions.
- NEVER encourage self-harm or risky behaviors.
- Maintain a comforting, realistic, non-clinical supportive tone.
- Keep responses concise (2-3 paragraphs max) and offer structured coping suggestions.

CLINICAL CONTEXT (RAG):
${retrievedDocs.map(d => `- ${d.citation}: ${d.content}`).join('\n')}

USER MEMORY CONTEXT:
${memoryContext.length ? memoryContext.join('; ') : 'None'}`;

      const contents = [
        ...history.slice(-6).map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        })),
        {
          role: 'user',
          parts: [{ text: userMessage }]
        }
      ];

      const body = {
        contents,
        systemInstruction: {
          parts: [{ text: systemPrompt }]
        },
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 600
        }
      };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        throw new Error(`Gemini API Error: ${res.statusText}`);
      }

      const data = await res.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (generatedText) {
        return generatedText;
      }
      return null;
    } catch (err) {
      console.warn("⚠️ Gemini API Call Failed, falling back to local RAG engine:", err.message);
      return null;
    }
  }

  /**
   * Process user input and generate a clinically-grounded response
   * @param {string} userMessage 
   * @param {Array} history 
   * @param {Object} memoryContext - Lightweight user memory summaries
   * @returns {Promise<Object>} Response payload including message, citations, safety audit, interactive tools
   */
  static async generateResponse(userMessage, history = [], memoryContext = []) {
    // Step 1: Run Mandatory Dual-Layer Safety Pipeline (Pre-Guardrail)
    const safetyAudit = SafetyPipeline.evaluateInput(userMessage, history);

    // Step 2: Handle Safety Overrides
    if (safetyAudit.action === "CRISIS_OVERRIDE") {
      return {
        message: "I hear how much pain and distress you are experiencing right now. Because your safety is the absolute top priority, I am connecting you directly with crisis support resources. Please reach out to these trained compassionate professionals immediately.",
        citations: [],
        safetyAudit,
        isCrisis: true,
        recommendedTool: "CRISIS_MODAL"
      };
    }

    if (safetyAudit.action === "REFUSE_DIAGNOSIS") {
      return {
        message: "As an AI wellness companion, I cannot provide medical diagnoses or psychiatric evaluations. Mental health conditions require evaluation by a licensed healthcare professional or psychiatrist. I can, however, help you explore grounding techniques, track your feelings, or prepare questions for your doctor.",
        citations: [],
        safetyAudit,
        isCrisis: false,
        recommendedTool: null
      };
    }

    if (safetyAudit.action === "REFUSE_PRESCRIPTION") {
      return {
        message: "I cannot provide medical advice, prescription guidelines, or dosage recommendations. Medication adjustments must strictly be discussed with your prescribing physician or pharmacist. Please reach out to your doctor or pharmacist directly before making any changes.",
        citations: [],
        safetyAudit,
        isCrisis: false,
        recommendedTool: null
      };
    }

    // Step 3: TF-IDF RAG Retrieval over Vetted Clinical Knowledge Base
    const retrievedDocs = RAGEngine.search(userMessage);
    const citations = retrievedDocs.map(doc => doc.citation);

    // Determine recommended tool based on keywords
    let recommendedTool = null;
    const lower = userMessage.toLowerCase();
    if (lower.includes("reframe") || lower.includes("thought") || lower.includes("negative") || lower.includes("worst")) {
      recommendedTool = "CBT_REFRAMER";
    } else if (lower.includes("tipp") || lower.includes("cold water") || lower.includes("dive reflex") || lower.includes("panic attack")) {
      recommendedTool = "DBT_TIPP";
    } else if (lower.includes("breath") || lower.includes("panic") || lower.includes("anxious") || lower.includes("heart rate")) {
      recommendedTool = "BREATHING_TIMER";
    } else if (lower.includes("ground") || lower.includes("overwhelmed") || lower.includes("dissociat") || lower.includes("dizzy")) {
      recommendedTool = "GROUNDING_54321";
    }

    // Check for API Key (Env variable or user-configured key in PrivacySettings)
    const apiKey = import.meta.env?.VITE_GEMINI_API_KEY || localStorage.getItem('auramind_gemini_api_key');

    let responseText = null;

    if (apiKey) {
      responseText = await this.callGeminiAPI(userMessage, history, retrievedDocs, memoryContext, apiKey);
    }

    // Fallback: Offline RAG Synthesis Engine if no API key or API call failed
    if (!responseText) {
      if (recommendedTool === "CBT_REFRAMER") {
        responseText = `It sounds like you're dealing with an automatic negative thought. In Cognitive Behavioral Therapy (CBT), we look at how our thoughts influence our emotions. ${citations.length ? citations[0] : ''}\n\nWould you like to try our interactive **CBT Thought Reframer** tool together right now to examine the evidence and reframe this thought?`;
      } else if (recommendedTool === "DBT_TIPP") {
        responseText = `During intense physical arousal or panic spikes, Dialectical Behavior Therapy (DBT) recommends the TIPP skill (Temperature, Intense exercise, Paced breathing, Paired muscle relaxation). ${citations.length ? citations[0] : ''}\n\nLet's switch over to the interactive **DBT TIPP Emergency Protocol** tool to lower your heart rate right now.`;
      } else if (recommendedTool === "BREATHING_TIMER") {
        responseText = `When anxiety or physical tension builds up, slowing down your breathing helps signal safety to your nervous system. ${citations.length ? citations[0] : ''}\n\nLet's take a pause. I've prepared a **4-7-8 Parasympathetic Breathing Cycle** for us. Shall we start a 2-minute session?`;
      } else if (recommendedTool === "GROUNDING_54321") {
        responseText = `When everything feels overwhelming or scattered, sensory grounding helps anchor you in the present moment. ${citations.length ? citations[0] : ''}\n\nWe can run through the **5-4-3-2-1 Sensory Grounding Exercise** together step-by-step.`;
      } else {
        const memorySnippet = memoryContext.length ? ` (Keeping in mind your previous note about: ${memoryContext[0]})` : "";
        const ragSnippet = retrievedDocs.length 
          ? `\n\n${retrievedDocs[0].citation}: ${retrievedDocs[0].content.slice(0, 180)}...`
          : "";

        responseText = `Thank you for sharing how you feel.${memorySnippet} Taking time to acknowledge your emotion is an important step. I'm here to listen and support you without judgment.${ragSnippet}\n\nHow is your energy level right now, and would you like to explore a quick mindfulness exercise or log your mood check-in?`;
        recommendedTool = recommendedTool || "MOOD_LOGGER";
      }
    }

    return {
      message: responseText,
      citations,
      retrievedDocs,
      safetyAudit,
      isCrisis: false,
      recommendedTool
    };
  }
}

