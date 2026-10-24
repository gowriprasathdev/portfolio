export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  time: string;
  text?: string;
  audioDuration?: string;
  receipt?: {
    bank: string;
    amount: string;
    accountLast4: string;
    reference: string;
    verified: boolean;
    confidence: number;
  };
  interactiveList?: {
    header: string;
    buttonText: string;
    rows: {
      id: string;
      title: string;
      desc: string;
      badge?: string;
    }[];
  };
  backendTrace?: {
    component: string;
    action: string;
    latency: string;
    details: string;
    badgeColor?: 'accent' | 'blue' | 'purple' | 'amber';
  };
}

export interface SimulationScenario {
  id: string;
  label: string;
  icon: string;
  description: string;
  userPrompt: string;
  messages: ChatMessage[];
}

export interface EngineeringChallenge {
  title: string;
  tag: string;
  problem: string;
  tradeOff: string;
  solution: string;
}

export interface ArchitectureNode {
  id: string;
  title: string;
  category: 'Ingress' | 'Queue' | 'Core AI' | 'Storage' | 'External';
  description: string;
  tech: string;
  sla: string;
}

export interface CaseStudyData {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  overview: string;
  scenarios: SimulationScenario[];
  challenges: EngineeringChallenge[];
  nodes: ArchitectureNode[];
  metrics: {
    stat: string;
    label: string;
    subtext: string;
  }[];
}

export const WHATSAPP_SALES_CASE_STUDY: CaseStudyData = {
  id: 'whatsapp-sales',
  title: 'Conversational WhatsApp AI Sales Platform',
  subtitle: 'Event-Driven Microservices — Conversational Commerce & Lead Intelligence',
  badge: 'Production Distributed Architecture',
  overview:
    'An enterprise automotive sales agent engineered in Go (Gin, GORM, Asynq, Redis, PostgreSQL). Decouples aggressive 5-second Meta Cloud API timeouts into sub-50ms queue ingresses, drives multi-turn agentic tool calling with Manglish dialect adaptation, and runs asynchronous debounced lead scoring and forensic payment receipt verification.',
  metrics: [
    {
      stat: '< 45ms',
      label: 'Webhook Ingress SLA',
      subtext: 'Instant 200 OK ACK via Redis Asynq to prevent Meta timeout drops'
    },
    {
      stat: '100%',
      label: 'Context Continuity',
      subtext: 'Hierarchical memory (10-message sliding window + rolling summary injection)'
    },
    {
      stat: '60s',
      label: 'Analytics Debounce',
      subtext: 'Deduplicated lead scoring window avoids redundant LLM inferences'
    },
    {
      stat: '0%',
      label: 'Price Hallucination',
      subtext: 'Enforced anti-affirmation directives & strict DB tool query bindings'
    }
  ],
  scenarios: [
    {
      id: 'smart-search',
      label: 'Inventory Search & List',
      icon: '🔍',
      description: 'Customer inquires in casual Malaysian Manglish; agent queries inventory and formats a character-compliant WhatsApp interactive list.',
      userPrompt: 'Hi boss, got any Harrier or RX350 under 200k in stock?',
      messages: [
        {
          id: 'ss-1',
          sender: 'user',
          time: '10:14 AM',
          text: 'Hi boss, got any Harrier or RX350 under 200k in stock?'
        },
        {
          id: 'ss-2',
          sender: 'agent',
          time: '10:14 AM',
          text: 'Can check for you lah! We have 2 units matching your budget in our Glenmarie showroom right now leh:',
          interactiveList: {
            header: 'Available Premium SUVs',
            buttonText: 'View Vehicle Options',
            rows: [
              {
                id: '1',
                title: '2022 Harrier 2.0 Z',
                desc: 'Pearl White, 11,369 km, JBL Sound, MYR 170,000',
                badge: 'Grade 5A'
              },
              {
                id: '2',
                title: '2021 Lexus RX350 F-Sport',
                desc: 'Sonic Titanium, Sunroof, 360Cam, MYR 195,000',
                badge: 'Grade 4.5B'
              }
            ]
          },
          backendTrace: {
            component: 'recon-social-service ➔ Asynq Worker',
            action: 'search_vehicles(make=["Toyota", "Lexus"], max_price=200000)',
            latency: '340ms',
            details: 'Queried PostgreSQL cars table; truncated row titles to <=24 chars and descriptions to <=72 chars per WhatsApp interactive list rules.',
            badgeColor: 'accent'
          }
        },
        {
          id: 'ss-3',
          sender: 'user',
          time: '10:15 AM',
          text: 'Tell me more about the 2022 Harrier Z.'
        },
        {
          id: 'ss-4',
          sender: 'agent',
          time: '10:15 AM',
          text: 'Toyota Harrier 2.0 Z (2022)\nColour: Pearl White\nMileage: 11,369 km\nPrice: MYR 170,000\nBranch: Glenmarie\nAuction Grade: 5A (Pristine)\n\nEquipped with JBL Premium Audio, Panoramic 360 Camera, and Blind Spot Monitor. Would you like to schedule a showroom visit or test drive this weekend?',
          backendTrace: {
            component: 'recon-social-service ➔ conversation_service.go',
            action: 'get_vehicle_details(vehicle_id="uuid-harrier-z")',
            latency: '210ms',
            details: 'Fetched vehicle specs, sanitized UUID from user output, assembled showroom appointment invitation.',
            badgeColor: 'blue'
          }
        }
      ]
    },
    {
      id: 'voice-note',
      label: 'Voice Note & ASR',
      icon: '🎙️',
      description: 'Customer sends an audio voice note; BytePlus Seed Speech ASR 2.0 transcribes audio before conversational agent handles it.',
      userPrompt: 'Customer speaks audio: "Boss, is the 2023 Alphard SC still available?"',
      messages: [
        {
          id: 'vn-1',
          sender: 'user',
          time: '02:30 PM',
          audioDuration: '0:06',
          text: 'Voice note (0:06s)'
        },
        {
          id: 'vn-sys',
          sender: 'system',
          time: '02:30 PM',
          text: '🎙️ Transcribed via BytePlus Seed Speech ASR (Doubao 2.0): "Boss, is the 2023 Alphard SC package still available in Glenmarie?"'
        },
        {
          id: 'vn-2',
          sender: 'agent',
          time: '02:30 PM',
          text: 'Yes boss! The 2023 Toyota Alphard 2.5 SC is available in our Glenmarie showroom. Black exterior with Modelista bodykit, only 14,200 km, selling at MYR 298,000.\n\nWant me to send you the exterior and interior photo gallery?',
          backendTrace: {
            component: 'recon-ai-lib ➔ transcriber (BytePlus ASR)',
            action: 'SeedSpeech.SubmitAudio(raw_ogg) ➔ Poll Query',
            latency: '1.2s',
            details: 'Downloaded audio binary before Meta CDN 5-minute expiry, transcribed voice note to text, mapped to "user" message role.',
            badgeColor: 'purple'
          }
        }
      ]
    },
    {
      id: 'receipt-verification',
      label: 'Deposit Receipt OCR',
      icon: '🧾',
      description: 'Customer uploads bank transfer slip for car reservation; Vision AI forensically verifies amount and account details.',
      userPrompt: 'Customer sends transfer slip: "Here is the RM 5,000 deposit for the Harrier"',
      messages: [
        {
          id: 'rv-1',
          sender: 'user',
          time: '04:12 PM',
          text: 'I want to reserve the Harrier Z. Here is the bank transfer slip for RM 5,000 deposit.',
          receipt: {
            bank: 'Maybank Berhad',
            amount: 'MYR 5,000.00',
            accountLast4: '4821',
            reference: 'MBB20261024-883921',
            verified: true,
            confidence: 0.96
          }
        },
        {
          id: 'rv-2',
          sender: 'agent',
          time: '04:12 PM',
          text: 'Deposit received and verified! ✅\n\nYour RM 5,000 transfer to Maybank account ending in 4821 has been verified against Booking #BK-9024.\n\nOur Sales Manager has reserved the Harrier 2.0 Z under your name and is issuing the official receipt right now!',
          backendTrace: {
            component: 'recon-ai-lib ➔ receipt_extractor (Seed 2.0 Mini)',
            action: 'validateReceipt(extracted, booking, branchBank)',
            latency: '820ms',
            details: 'Confidence: 0.96 (>=0.70 threshold). Amount RM 5,000 matches expected deposit within 1% tolerance. Bank name fuzzy match OK. Account last-4 (4821) verified.',
            badgeColor: 'accent'
          }
        }
      ]
    },
    {
      id: 'human-handover',
      label: 'Frustration & Human Handover',
      icon: '🤝',
      description: 'Customer expresses frustration or asks for a real person; agent triggers human-in-the-loop escalation and locks bot.',
      userPrompt: 'I want to speak with a real person to negotiate trade-in price!',
      messages: [
        {
          id: 'hh-1',
          sender: 'user',
          time: '06:45 PM',
          text: 'I want to negotiate the trade-in value of my 2019 Honda Civic. Can I speak to a real salesperson please?'
        },
        {
          id: 'hh-2',
          sender: 'agent',
          time: '06:45 PM',
          text: 'Understood! I am connecting you directly with our Senior Sales Advisor at Glenmarie now. Mr. Tan is reviewing your vehicle details and will message you directly on this chat in a moment. Thank you for your patience!',
          backendTrace: {
            component: 'recon-social-service ➔ action_requests',
            action: 'request_human_handover(reason="Trade-in value negotiation for 2019 Civic")',
            latency: '140ms',
            details: 'Created action_request type="HUMAN_TAKEOVER" status="pending"; bot auto-replies locked to prevent interruption; CRM push notification sent to sales floor.',
            badgeColor: 'amber'
          }
        }
      ]
    }
  ],
  challenges: [
    {
      title: 'Meta 5-Second Timeout vs. AI Model Latency',
      tag: 'Decoupled Queue Ingress',
      problem:
        "Meta Cloud API strictly terminates webhook requests if the server takes longer than 5 seconds to reply with a 200 OK. Standard LLM tool-calling roundtrips take 1.5s–4s, while multimodal Vision OCR takes 3s–6s. Synchronous processing caused 504 timeouts, triggering Meta\'s aggressive retry storms.",
      tradeOff:
        'Immediate acknowledgment sacrifices synchronous error responses to Meta in exchange for 100% webhook ingestion reliability.',
      solution:
        'Decoupled HTTP ingress from inference using Redis via hibiken/asynq. Webhook endpoint validates signatures, checks Postgres idempotency locks (wa_message_id), enqueues the payload to Redis, and returns 200 OK in <45ms. Dedicated workers handle the heavy AI pipeline with automatic backoff retries.'
    },
    {
      title: 'Conversational Memory Decay Across Multi-Week Sales Cycles',
      tag: 'Hierarchical Memory Architecture',
      problem:
        'Automotive sales conversations span days or weeks. Storing 50+ messages in LLM context exceeds token budgets and introduces noise; keeping only the last 10 messages caused the AI to forget customer budget, trade-in interest, and previously shortlisted models.',
      tradeOff:
        'Rejected premature vector database infrastructure (pgvector / VikingDB) which added operational complexity for short 2–3 turn transactional sales queries.',
      solution:
        'Engineered a Hierarchical Rolling Memory: (1) Short-Term Memory: Sliding window of recent 10 messages. (2) Long-Term Memory: An asynchronous InsightsProcessor generates a concise rolling summary (ai_summary) and preference tags (ai_insights) stored on the customer record and injected into the dynamic system prompt.'
    },
    {
      title: 'Race Conditions & Duplicate LLM Inferences on Chatty Users',
      tag: 'Redis Asynq Debounce & Deduplication',
      problem:
        'Customers frequently send 4–6 rapid-fire messages within seconds. Running lead scoring and preference extraction on every message caused race conditions, overwrote concurrent customer state, and wasted expensive LLM tokens.',
      tradeOff:
        'Delayed lead scoring analytics by 60 seconds after the last message received.',
      solution:
        'Implemented EnqueueGenerateInsightsPayload with a 60-second delay and unique task deduplication: asynq.TaskID("insights:" + customerID). Any new message within the 60-second window silently drops duplicate tasks. The analyzer runs once after the customer pauses.'
    },
    {
      title: 'WhatsApp Interactive UI Character Limits (24/72 Rule)',
      tag: 'Prompt Engineering & Schema Truncation',
      problem:
        'WhatsApp interactive radio list messages silently fail to render if row titles exceed 24 characters or descriptions exceed 72 characters. Automotive titles (e.g., "2023 Toyota Harrier 2.0 Luxury Edition") routinely exceeded limits.',
      tradeOff:
        'Slight loss of verbose model names in the list view in exchange for guaranteed rendering on all WhatsApp mobile clients.',
      solution:
        'Built prompt guardrails enforcing strict character length caps inside the send_vehicle_list tool declaration. The model is instructed to intelligently prune titles (e.g., "2023 Harrier Luxury") and place supplementary specs into the 72-character description.'
    }
  ],
  nodes: [
    {
      id: 'meta-webhook',
      title: 'Meta Cloud API (WhatsApp Webhooks)',
      category: 'External',
      description: 'Dispatches inbound texts, voice notes, and images via HTTPS webhooks.',
      tech: 'WhatsApp Business Platform v25.0',
      sla: 'Must receive 200 OK in < 5,000ms'
    },
    {
      id: 'webhook-ingress',
      title: 'recon-social-service (HTTP Ingress)',
      category: 'Ingress',
      description: 'Validates HMAC signatures, checks message idempotency, and enqueues to Redis.',
      tech: 'Go, Gin Web Framework',
      sla: '< 45ms response latency'
    },
    {
      id: 'redis-asynq',
      title: 'Redis Task Queue (Asynq)',
      category: 'Queue',
      description: 'Drives decoupled background jobs, delayed debouncing, and task deduplication.',
      tech: 'Redis 7, hibiken/asynq',
      sla: 'Zero message drop guarantee'
    },
    {
      id: 'asynq-worker',
      title: 'Asynq Message Processor Worker',
      category: 'Queue',
      description: 'Executes media downloads, context assembly, and conversation agent loops.',
      tech: 'Go goroutine worker pool',
      sla: 'Automatic exponential backoff'
    },
    {
      id: 'recon-ai-lib',
      title: 'recon-ai-lib (Core AI Engine)',
      category: 'Core AI',
      description: 'Provider-agnostic interface handling chat, tool declarations, vision, and ASR.',
      tech: 'Go, Google GenAI SDK, BytePlus ARK',
      sla: 'Dynamic schema translation'
    },
    {
      id: 'gemini-llm',
      title: 'Google Gemini 2.5 Flash',
      category: 'Core AI',
      description: 'Primary conversational model with native function calling and persona guardrails.',
      tech: 'Gemini 2.5 Flash / Doubao Lite',
      sla: 'Sub-second text generation'
    },
    {
      id: 'byteplus-asr',
      title: 'BytePlus Seed Speech ASR 2.0',
      category: 'Core AI',
      description: 'Asynchronous speech-to-text pipeline transcribing WhatsApp audio voice notes.',
      tech: 'Doubao ASR BigModel API',
      sla: '2s polling loop with timeout context'
    },
    {
      id: 'postgres-db',
      title: 'PostgreSQL Relational Store',
      category: 'Storage',
      description: 'Stores customer profiles, message history, vehicle inventory, and action requests.',
      tech: 'PostgreSQL 16, GORM ORM',
      sla: 'ACID transaction guarantees'
    },
    {
      id: 'byteplus-tos',
      title: 'BytePlus TOS / AWS S3',
      category: 'Storage',
      description: 'Object storage for vehicle galleries, customer audio notes, and deposit receipts.',
      tech: 'Torch Object Storage (S3-compatible)',
      sla: '99.9999% durability'
    }
  ]
};
