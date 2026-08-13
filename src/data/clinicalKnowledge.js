/**
 * Vetted Clinical Knowledge Base for Retrieval-Augmented Generation (RAG)
 * and CBT/DBT Interactive Workbooks.
 */

export const CLINICAL_KNOWLEDGE_BASE = [
  {
    id: "cbt-01",
    category: "CBT Reframing",
    title: "Identifying and Challenging Cognitive Distortions",
    content: `Cognitive Behavioral Therapy (CBT) focuses on recognizing automatic negative thoughts (ANTs) and cognitive distortions. Common distortions include:
- All-or-Nothing Thinking: Viewing situations in black-or-white categories.
- Catastrophizing: Expecting the worst possible outcome without objective evidence.
- Mind Reading: Assuming you know what others think without confirmation.
- Emotional Reasoning: Believing that because you feel something, it must be true.
To reframe a thought: 1) Identify the evidence for and against it. 2) Ask 'What would I tell a close friend in this situation?' 3) Draft a balanced, realistic alternative thought.`,
    tags: ["cbt", "reframing", "thoughts", "anxiety", "distortions"]
  },
  {
    id: "dbt-01",
    category: "DBT Distress Tolerance",
    title: "The TIPP Skill for Acute Distress & Overwhelm",
    content: `Dialectical Behavior Therapy (DBT) TIPP skills rapidly reduce extreme physiological arousal and intense emotional spikes:
- T (Temperature): Change facial temperature with cold water or a wet cloth for 30 seconds to trigger the mammalian dive reflex and slow heart rate.
- I (Intense Exercise): Engage in 5-10 minutes of fast movement (jumping jacks, brisk walk) to expend surplus adrenaline.
- P (Paced Breathing): Inhale deeply into the abdomen for 4 seconds, exhale slowly for 7-8 seconds.
- P (Paired Muscle Relaxation): Tense muscle groups for 5 seconds on inhale, release completely on exhale while saying 'Relax'.`,
    tags: ["dbt", "tipp", "distress", "panic", "overwhelm", "somatic"]
  },
  {
    id: "mind-01",
    category: "Mindfulness & Somatic",
    title: "4-7-8 Parasympathetic Breathing Protocol",
    content: `The 4-7-8 breathing technique acts as a natural tranquilizer for the nervous system by activating the parasympathetic response:
1. Exhale completely through your mouth with a soft whoosh sound.
2. Inhale quietly through your nose for a count of 4.
3. Hold your breath for a count of 7.
4. Exhale completely through your mouth for a count of 8.
Repeat for 4 full cycles to slow heart rate, reduce cortisol, and relieve panic.`,
    tags: ["breathing", "4-7-8", "mindfulness", "sleep", "calm"]
  },
  {
    id: "mind-02",
    category: "Grounding",
    title: "5-4-3-2-1 Sensory Grounding Technique",
    content: `Grounding brings your awareness back to the present moment during sensory overload or dissociation:
- 5 things you can SEE around you (e.g., desk, lamp, pattern on wall).
- 4 things you can TOUCH/FEEL (e.g., chair beneath you, soft fabric, cool air).
- 3 things you can HEAR (e.g., distant clock, traffic, hum of fan).
- 2 things you can SMELL (e.g., coffee, essential oil, fresh air).
- 1 thing you can TASTE or a positive affirmation (e.g., sip of water, 'I am safe in this moment').`,
    tags: ["grounding", "54321", "sensory", "panic", "anxiety"]
  },
  {
    id: "cbt-02",
    category: "CBT Behavioral Activation",
    title: "Behavioral Activation for Low Energy & Depression",
    content: `Behavioral Activation counters depressive isolation by breaking tasks into tiny micro-steps (5-minute rule). Action often precedes motivation, not the other way around. 
Identify one small, manageable activity (e.g., drinking a glass of water, opening a window, making the bed) and rate your mood before and after.`,
    tags: ["cbt", "behavioral-activation", "depression", "motivation", "energy"]
  }
];

export const COGNITIVE_DISTORTIONS = [
  {
    id: "all-or-nothing",
    name: "All-or-Nothing Thinking",
    definition: "Seeing things in black-and-white terms with no middle ground.",
    example: "If I don't get an A on this project, I am a complete failure.",
    reframingQuestion: "Is there a gray area between perfection and failure?"
  },
  {
    id: "catastrophizing",
    name: "Catastrophizing",
    definition: "Blowing a negative event out of proportion and expecting the worst outcome.",
    example: "I haven't heard back from my manager, so I'm definitely getting fired today.",
    reframingQuestion: "What is the most likely, realistic outcome based on facts?"
  },
  {
    id: "mind-reading",
    name: "Mind Reading",
    definition: "Assuming you know what someone else is thinking without evidence.",
    example: "They didn't smile at me in the hallway, so they must hate me.",
    reframingQuestion: "What alternative reasons might explain their behavior?"
  },
  {
    id: "emotional-reasoning",
    name: "Emotional Reasoning",
    definition: "Believing that your negative feelings reflect objective reality.",
    example: "I feel completely overwhelmed, so this problem must be impossible to solve.",
    reframingQuestion: "Are my feelings facts, or are they temporary emotional states?"
  },
  {
    id: "should-statements",
    name: "'Should' / 'Must' Statements",
    definition: "Rigid demands on yourself or others that create unnecessary guilt and frustration.",
    example: "I should never feel anxious during presentations.",
    reframingQuestion: "Can I replace 'should' with 'I would prefer' or 'It is okay if'?"
  },
  {
    id: "personalization",
    name: "Personalization",
    definition: "Blaming yourself for events outside of your direct control.",
    example: "My team's meeting went poorly, so it's entirely my fault.",
    reframingQuestion: "What external factors contributed to this event?"
  }
];

export const CRISIS_RESOURCES = {
  national: [
    {
      name: "988 Suicide & Crisis Lifeline",
      contact: "988",
      details: "Available 24/7 in US & Canada. Call or Text 988. Free and confidential.",
      type: "phone_text"
    },
    {
      name: "Crisis Text Line",
      contact: "Text HOME to 741741",
      details: "24/7 crisis support via SMS in US, UK, and Canada.",
      type: "text"
    },
    {
      name: "Veterans Crisis Line",
      contact: "988 (Press 1) or Text 838255",
      details: "Dedicated support for veterans and service members.",
      type: "phone_text"
    },
    {
      name: "The Trevor Project (LGBTQ Youth)",
      contact: "1-866-488-7386 or Text START to 678-678",
      details: "24/7 crisis intervention for LGBTQ young people.",
      type: "phone_text"
    },
    {
      name: "International Emergency Hotline Directory",
      contact: "https://findahelpline.com",
      details: "Global crisis numbers across 130+ countries.",
      type: "link"
    }
  ]
};
