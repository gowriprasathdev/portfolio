export interface ProductionScreenshot {
  id: string;
  title: string;
  category: string;
  badge: string;
  imageSrc: string;
  description: string;
  highlights: string[];
  backendTrace: {
    component: string;
    action: string;
    latency: string;
    details: string;
  };
}

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
  gallery: ProductionScreenshot[];
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
  subtitle: 'Event-Driven Microservices Architecture — Conversational Commerce & Lead Intelligence',
  badge: 'Distributed Architecture',
  overview:
    'An enterprise automotive sales platform engineered in Go (Gin, GORM, Asynq, Redis, PostgreSQL). Decouples aggressive 5-second Meta Cloud API timeouts into sub-50ms queue ingresses, drives multi-turn agentic tool calling with multilingual and vernacular dialect adaptation, manages interactive test-drive appointment bookings/reschedules via WhatsApp Flows v3 with distributed mutex locking, and runs asynchronous debounced lead scoring and forensic payment receipt verification.',
  metrics: [
    {
      stat: '< 45ms',
      label: 'Webhook Ingress SLA',
      subtext: 'Instant 200 OK ACK via Redis Asynq to prevent Meta timeout drops'
    },
    {
      stat: '100%',
      label: 'Context Continuity',
      subtext: 'Hierarchical memory (10-message sliding window + rolling summary)'
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
  gallery: [
    {
      id: 'appointment-booking',
      title: 'WhatsApp Flows Test-Drive Booking',
      category: 'Showroom Appointments',
      badge: 'WhatsApp Flows v3',
      imageSrc: '/images/whatsapp_sales/01-appointment-booking-flow.png',
      description:
        'Customer initiates a test-drive inquiry. The system renders a native WhatsApp Flows interactive date & time selector directly inside WhatsApp (Thu, May 07, 5:00 PM - 7:00 PM). The backend acquires a distributed Redis Redlock mutex to reserve the slot, commits the appointment in PostgreSQL, and generates an official confirmed booking card.',
      highlights: [
        'Native WhatsApp UI component rendering (no external webview redirects)',
        'Zero-contention slot reservation using Redis Redlock distributed mutex',
        'Automatic salesperson lead assignment with WhatsApp notification alert',
        'Generates clickable Google Calendar / iCal confirmation payload'
      ],
      backendTrace: {
        component: 'messaging-ingress-service ➔ pkg/flows/crypto.go',
        action: 'FlowsDataExchange -> schedule_appointment_slot',
        latency: '165ms round-trip',
        details: 'Decrypted AES-GCM flow token, queried PostgreSQL slot pool, acquired Redis Redlock mutex, and returned dynamic Screen JSON in 165ms.'
      }
    },
    {
      id: 'reschedule-cancellation-voice',
      title: 'Rescheduling, Cancellation & Voice Processing',
      category: 'Voice & State Machine',
      badge: 'State Machine + ASR',
      imageSrc: '/images/whatsapp_sales/02-reschedule-cancellation-voice.png',
      description:
        'End-to-end appointment lifecycle management: interactive reschedule proposal cards, instant slot cancellation with slot release back to the inventory pool, and customer voice note ingestion (.ogg -> ffmpeg in-memory PCM -> Whisper STT) to query Jimny inventory.',
      highlights: [
        'WhatsApp audio notes (.ogg Opus) downloaded and converted to 16kHz WAV in-memory',
        'Whisper STT transcription with automotive domain vocabulary boosting',
        'Dynamic state machine transitions: BOOKED -> RESCHEDULE_OFFERED -> CANCELLED',
        'Automatic slot recycling in PostgreSQL ensuring zero ghost bookings'
      ],
      backendTrace: {
        component: 'messaging-ingress-service ➔ conversation_service.go',
        action: 'cancel_appointment + audio_transcribe_intent',
        latency: '340ms (voice pipeline)',
        details: 'Audio stream piped in-memory through ffmpeg into Whisper STT. State machine cleanly transitioned appointment to CANCELLED and recycled slot.'
      }
    },
    {
      id: 'deposit-verification',
      title: 'Deposit Slip Forensic OCR Verification',
      category: 'Financial Verification',
      badge: 'Vision OCR & Anti-Fraud',
      imageSrc: '/images/whatsapp_sales/03-deposit-receipt-verification.png',
      description:
        'Customer requests vehicle booking details -> bot outputs official corporate banking details -> customer uploads mobile banking transfer receipt (SGD 5,000) -> Vision LLM extracts transaction reference, bank name, amount, and verifies matching dealership account.',
      highlights: [
        'Extracts bank name, transaction timestamp, reference number, and account last-4',
        'Validates amount matches or exceeds vehicle deposit threshold (SGD 5,000)',
        'Prevents double-spend fraud by hashing receipt image perceptual hash into Postgres',
        'Auto-tags vehicle status to RESERVED in vehicle-inventory-service'
      ],
      backendTrace: {
        component: 'messaging-ingress-service ➔ payment_verification_service.go',
        action: 'verify_deposit_receipt(image_url, expected_amount)',
        latency: '3.1s end-to-end',
        details: 'Receipt image streamed to BytePlus Torch Object Storage (TOS). Multi-modal vision extracted metadata with 98% confidence score.'
      }
    },
    {
      id: 'vehicle-photo-dispatch',
      title: 'Real-Time Vehicle Gallery & Specs Dispatch',
      category: 'Inventory Media',
      badge: 'BytePlus TOS + CDN',
      imageSrc: '/images/whatsapp_sales/04-vehicle-photo-dispatch.png',
      description:
        'Customer asks for details on a 2024 Toyota Harrier 2.0 Z Luxury -> AI streams complete specifications (mileage, grade, color, features) and dispatches high-resolution exterior and interior photos directly into WhatsApp chat.',
      highlights: [
        'Direct streaming from BytePlus Torch Object Storage (TOS) via signed CDN links',
        'Rich media template cards rendered natively in WhatsApp chat',
        'Dynamic pricing calculation factoring road tax, COE, and down payment scenarios',
        'Automatic tracking of customer vehicle affinity profile in PostgreSQL'
      ],
      backendTrace: {
        component: 'messaging-ingress-service ➔ Meta Graph API / TOS',
        action: 'get_vehicle_details + send_vehicle_media',
        latency: '210ms',
        details: 'Fetched vehicle specifications and signed TOS media links, dispatching high-resolution photo template to customer WhatsApp chat.'
      }
    },
    {
      id: 'tamil-test-drive-booking',
      title: 'Tamil & Tanglish Localized Sales Flow',
      category: 'Vernacular AI',
      badge: 'Tanglish / Tamil AI',
      imageSrc: '/images/whatsapp_sales/05-tamil-test-drive-booking.png',
      description:
        'Customer sends Tamil-English code-mixed queries ("Enna varusam model?"). AI responds in clear Tamil with 2025 specs, guides the customer step-by-step through test-drive scheduling in Tamil, and outputs a localized Tamil confirmation slip.',
      highlights: [
        'Robust comprehension of romanized vernacular ("Tanglish") and formal script',
        'Automotive terminology adaptation (e.g., மைலேஜ், டெஸ்ட் டிரைவ், முன்பதிவு)',
        'Full localized booking workflow with Tamil date/time confirmation card',
        'Maintains context continuity even if the user switches languages mid-conversation'
      ],
      backendTrace: {
        component: 'agentic-ai-engine ➔ chat.Client (Gemini 2.5 Flash)',
        action: 'polyglot_nlp_router(lang="ta")',
        latency: '240ms',
        details: 'Identified Tamil intent from romanized input, preserved booking parameters, and rendered localized Tamil confirmation slip.'
      }
    },
    {
      id: 'multilingual-polyglot-chat',
      title: 'Zero-Latency Polyglot Language Switching',
      category: 'Polyglot Routing',
      badge: 'EN / MS / ZH / TA',
      imageSrc: '/images/whatsapp_sales/06-multilingual-polyglot-chat.png',
      description:
        'Customer switches languages in four consecutive turns: English ("Can I check stock for Honda Vezel?") -> Bahasa Melayu ("Boleh saya tahu ada warna apa?") -> Mandarin ("请问这辆车可以做多少百分比的贷款？") -> Tamil ("நேரில் வந்து பார்க்க எப்போது வரலாம்?"). The AI responds in kind each turn without latency degradation.',
      highlights: [
        'Turn-by-turn language detection with confidence threshold gating',
        'Domain-specific vocabulary in Malay (pinjaman, warna), Mandarin (首付, 贷款), and Tamil (நேரில் வருகை)',
        'Unified conversational context retained in Redis across all language shifts',
        'Strict guardrails preventing hallucinated pricing or terms across all dialects'
      ],
      backendTrace: {
        component: 'messaging-ingress-service ➔ conversation_service.go',
        action: 'dynamic_language_switch_hook',
        latency: '190ms - 250ms per turn',
        details: 'Dynamic language detection heuristic triggered. Prompt templates and terminology catalogs adapted on the fly while retaining memory slots.'
      }
    }
  ],
  nodes: [
    {
      id: 'meta-cloud-api',
      title: 'Meta Cloud API (WhatsApp Webhooks)',
      category: 'External',
      description: 'Webhook sender delivering inbound user messages, media payloads, button clicks, and Flows cryptographic tokens. Requires HTTP 200 within 5,000ms SLA.',
      tech: 'WhatsApp Business Platform v25.0',
      sla: 'Must receive 200 OK in < 5,000ms'
    },
    {
      id: 'messaging-ingress-service',
      title: 'messaging-ingress-service (HTTP Ingress)',
      category: 'Ingress',
      description: 'High-throughput Go (Gin) service that validates Meta HMAC-SHA256 signatures, deserializes payloads, and enqueues jobs into Redis Asynq in < 45ms.',
      tech: 'Go, Gin Web Framework',
      sla: '< 45ms response latency'
    },
    {
      id: 'redis-asynq-queue',
      title: 'Redis Task Queue (Asynq)',
      category: 'Queue',
      description: 'Provides durable FIFO message scheduling, rate limiting, and exponential-backoff retries. Decouples HTTP ingress from asynchronous LLM tool execution.',
      tech: 'Redis 7, hibiken/asynq',
      sla: 'Zero message drop guarantee'
    },
    {
      id: 'asynq-worker',
      title: 'Asynq Message Processor Worker',
      category: 'Queue',
      description: 'Go worker pool consuming queued conversation tasks, maintaining Redis conversation context windows, and dispatching agentic tool calling pipelines.',
      tech: 'Go goroutine worker pool',
      sla: 'Automatic exponential backoff'
    },
    {
      id: 'agentic-ai-engine',
      title: 'agentic-ai-engine (Core AI Engine)',
      category: 'Core AI',
      description: 'Universal Go agentic library managing schema translation, system prompts, guardrails, and autonomous tool calling for automotive catalog search.',
      tech: 'Go, Google GenAI SDK, BytePlus ARK',
      sla: 'Dynamic schema translation'
    },
    {
      id: 'gemini-flash',
      title: 'Google Gemini 2.5 Flash',
      category: 'Core AI',
      description: 'Primary conversational LLM handling natural language understanding, polyglot translation, tool selection, and vehicle sales dialogue generation.',
      tech: 'Gemini 2.5 Flash / Doubao Lite',
      sla: 'Sub-second text generation'
    },
    {
      id: 'byteplus-asr',
      title: 'BytePlus Seed Speech ASR 2.0',
      category: 'Core AI',
      description: 'High-accuracy automatic speech recognition engine transcribing customer WhatsApp audio voice notes (.ogg Opus) into structured text.',
      tech: 'Doubao ASR BigModel API',
      sla: '2s polling loop with timeout context'
    },
    {
      id: 'postgres-db',
      title: 'PostgreSQL Relational Store',
      category: 'Storage',
      description: 'Primary transactional database storing vehicle inventory specifications, confirmed test-drive appointments, CRM leads, and payment receipt logs.',
      tech: 'PostgreSQL 16, GORM ORM',
      sla: 'ACID transaction guarantees'
    },
    {
      id: 'byteplus-tos',
      title: 'BytePlus TOS / AWS S3',
      category: 'Storage',
      description: 'Cloud object storage holding high-resolution vehicle photo galleries, customer audio notes, and uploaded payment transfer slips.',
      tech: 'Torch Object Storage (S3-compatible)',
      sla: '99.9999% durability'
    }
  ],
  scenarios: [
    {
      id: 'appointment-flow',
      label: 'WhatsApp Flows Test-Drive Booking',
      icon: '📅',
      description: 'Customer books showroom appointment via native Flows date/time picker, Redis Redlock locks slot, and calendar slip is issued.',
      userPrompt: 'Can I book a test drive for the 2024 Toyota Harrier this Thursday afternoon?',
      messages: [
        {
          id: 'm1',
          sender: 'user',
          time: '10:14 AM',
          text: 'Can I book a test drive for the 2024 Toyota Harrier this Thursday afternoon?'
        },
        {
          id: 'm2',
          sender: 'agent',
          time: '10:14 AM',
          text: 'Here are the available showroom slots for the Toyota Harrier 2.0 Z Luxury. Please tap below to pick your preferred date and time slot:',
          interactiveList: {
            header: 'Select Test Drive Slot',
            buttonText: 'Book Test Drive',
            rows: [
              { id: 'r1', title: '📅 Pick a Date', desc: 'Thu, May 07, 2026' },
              { id: 'r2', title: '⏰ Available Time', desc: '5:00 PM - 7:00 PM', badge: 'Available' },
              { id: 'r3', title: '📍 Showroom Location', desc: 'Central Flagship Showroom' }
            ]
          },
          backendTrace: {
            component: 'messaging-ingress-service ➔ pkg/flows',
            action: 'send_whatsapp_flow("test_drive_booking_v3")',
            latency: '165ms',
            details: 'Dispatched native WhatsApp Flows screen payload via Meta Graph API.'
          }
        },
        {
          id: 'm3',
          sender: 'system',
          time: '10:15 AM',
          text: 'Redis lock acquired: slot_lock:harrier:2026-05-07_1700 -> Slot reserved -> Appointment #APT-8821 created in PostgreSQL.'
        },
        {
          id: 'm4',
          sender: 'agent',
          time: '10:15 AM',
          text: '✅ Test Drive Confirmed!\n\nVehicle: 2024 Toyota Harrier 2.0 Z Luxury\nDate: Thursday, May 07, 2026\nTime: 5:00 PM - 7:00 PM\nShowroom: Central Flagship Showroom\nAdvisor: Marcus Tan (+65 9123 4567)\n\nWe look forward to seeing you!',
          backendTrace: {
            component: 'messaging-ingress-service ➔ appointment_service.go',
            action: 'commit_appointment_booking',
            latency: '88ms',
            details: 'ACID transaction committed in PostgreSQL. Lead notification alerted sales advisor dashboard.'
          }
        }
      ]
    },
    {
      id: 'voice-note',
      label: 'Audio Note Transcription & Stock Search',
      icon: '🎙️',
      description: 'Customer sends 3-second WhatsApp voice note. Engine transcodes in-memory via ffmpeg and transcribes via Whisper STT.',
      userPrompt: '[3-second voice note] "Hi, do you have any Suzuki Jimny in stock right now?"',
      messages: [
        {
          id: 'v1',
          sender: 'user',
          time: '04:10 PM',
          audioDuration: '0:03'
        },
        {
          id: 'v2',
          sender: 'system',
          time: '04:10 PM',
          text: 'Audio received: 32kbps Opus -> Transcoded in-memory to 16kHz WAV mono -> Sent to ASR pipeline.'
        },
        {
          id: 'v3',
          sender: 'system',
          time: '04:10 PM',
          text: 'Transcribed text: "Hi, do you have any Suzuki Jimny in stock right now?" (Confidence: 99.4%)'
        },
        {
          id: 'v4',
          sender: 'agent',
          time: '04:10 PM',
          text: 'Yes! We have 2 units of Suzuki Jimny 1.5 Sierra available:\n\n1. 2024 Suzuki Jimny Sierra JC (Jungle Green) - SGD 142,888\n2. 2023 Suzuki Jimny Sierra JL (Chiffon Ivory) - SGD 135,888\n\nWould you like to see exterior/interior photos or book a test drive slot?',
          backendTrace: {
            component: 'agentic-ai-engine ➔ search_inventory',
            action: 'search_catalog(make="Suzuki", model="Jimny")',
            latency: '240ms',
            details: 'Extracted vehicle parameters from transcribed audio and queried live inventory catalog.'
          }
        }
      ]
    },
    {
      id: 'deposit-receipt',
      label: 'Deposit Slip Forensic OCR Verification',
      icon: '🧾',
      description: 'Customer uploads advance bank transfer slip image. Vision AI validates amount, beneficiary, and locks vehicle.',
      userPrompt: '[Image Upload: Mobile Banking Fast Transfer Receipt for SGD 5,000]',
      messages: [
        {
          id: 'd1',
          sender: 'user',
          time: '02:30 PM',
          text: 'Please send your bank details for the SGD 5,000 deposit to hold this car.'
        },
        {
          id: 'd2',
          sender: 'agent',
          time: '02:30 PM',
          text: 'Here are the official dealership payment details:\n\nBank: Maybank Singapore\nAccount Name: Apex Motor Group Pte Ltd\nAccount No: 140-9988-1111\nDeposit Amount: SGD 5,000\nReference: DEPOSIT-2024-HARRIER\n\nPlease upload your bank transfer slip image here once completed.'
        },
        {
          id: 'd3',
          sender: 'user',
          time: '02:34 PM',
          receipt: {
            bank: 'Maybank Singapore',
            amount: 'SGD 5,000.00',
            accountLast4: '1111',
            reference: 'MB-20260507-99120',
            verified: true,
            confidence: 0.98
          }
        },
        {
          id: 'd4',
          sender: 'agent',
          time: '02:34 PM',
          text: '🎉 Payment Verified!\n\nReceipt Ref: MB-20260507-99120\nAmount: SGD 5,000.00 (Confirmed)\nBeneficiary: Apex Motor Group Pte Ltd\nVehicle Status: Marked as RESERVED 🔒\n\nYour deposit has been credited to vehicle inventory file #VEH-9012. Our sales manager will contact you with the sales agreement.',
          backendTrace: {
            component: 'messaging-ingress-service ➔ payment_service.go',
            action: 'verify_deposit_slip + reserve_vehicle',
            latency: '3.1s',
            details: 'Vision AI OCR extracted transaction details with 98% confidence. Vehicle status transitioned to RESERVED.'
          }
        }
      ]
    }
  ],
  challenges: [
    {
      title: 'WhatsApp Flows State Machine & Concurrent Slot Contention',
      tag: 'Redis Redlock / Concurrency',
      problem:
        'When multiple customers concurrently request popular test-drive slots on weekends, naive database writes risk double-booking the same vehicle and salesperson.',
      tradeOff:
        'Optimistic database locking risks high retry aborts; pessimistic table locks degrade throughput across other dealership operations.',
      solution:
        'Implemented distributed mutex locking via Redis Redlock with unique composite keys (vehicle_id:slot_timestamp) and a 120-second lease time. If a customer is in the middle of a WhatsApp Flows screen, the slot is provisionally locked. Once confirmed, a PostgreSQL ACID transaction commits the booking and notifies the team.'
    },
    {
      title: 'In-Memory Voice Audio Transcoding & Async Transcription',
      tag: 'Go io.Pipe / FFmpeg Streaming',
      problem:
        'WhatsApp delivers voice notes encoded in .ogg Opus format at variable sample rates. Writing files to local disk for external ffmpeg CLI caused high disk I/O latency and container ephemeral storage leaks.',
      tradeOff:
        'Third-party cloud audio transcoding APIs add 800ms+ round-trip latency and ongoing per-minute billing fees.',
      solution:
        'Engineered an in-memory streaming pipe in Go using io.Pipe and exec.Command("ffmpeg", "-i", "pipe:0", "-ar", "16000", "-f", "wav", "pipe:1"). The converted PCM stream is piped directly into the Whisper STT multipart HTTP request buffer without a single byte written to disk.'
    },
    {
      title: 'Meta 15-Second Webhook Timeout vs Multi-Turn LLM Inference',
      tag: 'Asynq / Worker Pattern',
      problem:
        'Meta WhatsApp Cloud API automatically cancels webhooks and retries if an endpoint does not return HTTP 200 within 15 seconds. High-load LLM reasoning or multi-pass vision OCR can take 3 to 4 seconds, causing duplicate delivery cascades.',
      tradeOff:
        'Synchronous request processing simplifies error handling but risks Meta dropping the webhook and flooding the server with automated retries.',
      solution:
        'Architected an asynchronous worker pattern. The Gin HTTP handler verifies HMAC-SHA256 signature, enqueues the event payload into a buffered Go channel, stores the message ID in Redis as an idempotency key, and returns HTTP 200 in under 35ms. Dedicated worker goroutines consume the channel and dispatch LLM replies via the outbound Meta Graph API.'
    },
    {
      title: 'Bank Deposit Slip OCR Tampering & Anti-Fraud Heuristics',
      tag: 'Computer Vision / Anti-Fraud',
      problem:
        'Risk of malicious actors reusing genuine past payment slips, altering reference numbers with image editing apps, or depositing smaller amounts than the required vehicle holding deposit.',
      tradeOff:
        'Manual human verification of every deposit slip introduces friction and delays car reservation by hours; naive regex OCR fails on diverse banking app layouts.',
      solution:
        'Built a 3-layer verification pipeline: (1) Compute image perceptual hash (pHash) and verify uniqueness against historical receipt index to block re-uploads; (2) Multi-modal Vision model extracts transaction timestamp (must be within last 48 hours), bank account number, and amount; (3) Cross-checks amount >= vehicle minimum deposit and flags any discrepancies for manual review.'
    }
  ]
};
