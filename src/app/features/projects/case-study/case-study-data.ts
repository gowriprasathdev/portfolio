export interface GallerySubImage {
  src: string;
  caption: string;
  stepTitle?: string;
}

export interface ProductionScreenshot {
  id: string;
  title: string;
  category: string;
  badge: string;
  imageSrc: string;
  galleryImages?: GallerySubImage[];
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
    'An enterprise automotive sales platform engineered in Go (Gin, GORM, Asynq, Redis, PostgreSQL). Decouples aggressive 5-second Meta Cloud API timeouts into sub-50ms queue ingresses, drives multi-turn agentic tool calling with multilingual and vernacular dialect adaptation, manages interactive test-drive appointment bookings/reschedules via WhatsApp Flows v3 with distributed mutex locking, and runs asynchronous debounced lead scoring, forensic payment receipt verification, and pre-approved HSM broadcast fan-outs.',
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
      id: 'general-inquiry',
      title: 'General Vehicle Inquiry & Inventory Media Dispatch',
      category: 'General Vehicle Inquiry',
      badge: 'Catalog NLU & Media Ingestion',
      imageSrc: 'images/whatsapp_sales/01-general-inquiry-chat.png',
      galleryImages: [
        {
          src: 'images/whatsapp_sales/01-general-inquiry-chat.png',
          stepTitle: 'Step 1: Budget & Model Inquiry',
          caption: 'Customer queries Suzuki Swift within MYR 110k budget; AI formats interactive specs card and checks live inventory.'
        },
        {
          src: 'images/whatsapp_sales/04-vehicle-photo-dispatch.png',
          stepTitle: 'Step 2: Vehicle Gallery Stream',
          caption: 'Customer asks for photos; AI invokes send_vehicle_image tool and streams high-resolution photo gallery from BytePlus TOS.'
        }
      ],
      description:
        'End-to-end vehicle discovery: customer inquires about models and budget thresholds (e.g., Suzuki Swift under MYR 110k) -> NLU engine parses constraints, queries PostgreSQL inventory, and returns rich interactive specs. On customer request, agent invokes native tool send_vehicle_image to stream high-resolution exterior and interior photos directly from BytePlus Torch Object Storage (TOS).',
      highlights: [
        'Multi-turn parameter extraction (make, model, year, mileage, auction grade, budget caps)',
        'Anti-affirmation guardrails: never promises vehicle availability before DB confirmation',
        'Direct pre-signed CDN media streaming from BytePlus TOS S3-compatible storage',
        'WhatsApp interactive list limits enforced (<=24 char titles, <=72 char descriptions)'
      ],
      backendTrace: {
        component: 'recon-social-service ➔ recon-ai-lib ➔ inventory_service.go',
        action: 'search_vehicles(budget=110000, make="Suzuki") + send_vehicle_image',
        latency: '310ms',
        details: 'Parsed natural language budget query into SQL GORM filter; generated compliant WhatsApp interactive card and dispatched primary hero image from BytePlus TOS.'
      }
    },
    {
      id: 'appointment-management',
      title: 'Showroom Visit Booking, Rescheduling & Slot Lifecycle',
      category: 'Appointment Booking',
      badge: 'WhatsApp Flows v3 & Distributed Mutex',
      imageSrc: 'images/whatsapp_sales/01-appointment-booking-flow.png',
      galleryImages: [
        {
          src: 'images/whatsapp_sales/01-appointment-booking-flow.png',
          stepTitle: 'Step 1: WhatsApp Flows Picker',
          caption: 'Native WhatsApp Flows v3 date & time slot selection menu directly inside WhatsApp client.'
        },
        {
          src: 'images/whatsapp_sales/02-appointment-reschedule-picker.png',
          stepTitle: 'Step 2: Reschedule & Rebook',
          caption: 'Interactive reschedule proposal card; customer declines old slot, selects new date/time, and receives confirmed booking.'
        },
        {
          src: 'images/whatsapp_sales/02-reschedule-cancellation-voice.png',
          stepTitle: 'Step 3: Instant Cancellation',
          caption: 'Customer cancels appointment; backend frees reserved time slot and recycles availability back into PostgreSQL pool.'
        }
      ],
      description:
        'Unified appointment lifecycle management: (1) WhatsApp Flows v3 native interactive calendar & slot selector. (2) Interactive reschedule proposal handling with customer decline/rebook options. (3) Instant appointment cancellation releasing reserved time slots back to PostgreSQL slot pool. Uses Redis Redlock distributed mutex to prevent double-booking collisions across sales advisors.',
      highlights: [
        'Native WhatsApp Flows v3 with RSA + AES-GCM payload encryption',
        'Interactive reschedule state machine: proposal card ➔ decline ➔ pick new slot ➔ confirmed',
        'Redis Redlock distributed mutex prevents concurrent double-booking of same vehicle/slot',
        'Instant slot recycling in PostgreSQL on cancellation ensures zero ghost reservations'
      ],
      backendTrace: {
        component: 'recon-social-service ➔ pkg/flows/crypto.go + conversation_service.go',
        action: 'action_requests.Create(type="MEETING_REQUEST") + Redlock Mutex',
        latency: '165ms (Flows) / 88ms (Commit)',
        details: 'Decrypted AES-GCM flow token, acquired Redis Redlock mutex, committed appointment row in PostgreSQL, and triggered CRM sales advisor push notification.'
      }
    },
    {
      id: 'voice-multilingual',
      title: 'Voice Note Ingestion, Tanglish Vernacular & Polyglot Routing',
      category: 'Voice & Multilingual',
      badge: 'Doubao ASR & Polyglot NLU',
      imageSrc: 'images/whatsapp_sales/05-tamil-test-drive-booking.png',
      galleryImages: [
        {
          src: 'images/whatsapp_sales/05-tamil-test-drive-booking.png',
          stepTitle: 'Step 1: Tanglish & Tamil',
          caption: 'Romanized Tanglish query ("Enna varusam model?") auto-detected and replied with native Tamil confirmation slip.'
        },
        {
          src: 'images/whatsapp_sales/06-multilingual-polyglot-chat.png',
          stepTitle: 'Step 2: Polyglot Switching',
          caption: 'Consecutive code-switching across English, Bahasa Melayu, Mandarin, and Tamil in a single conversation thread.'
        },
        {
          src: 'images/whatsapp_sales/02-reschedule-cancellation-voice.png',
          stepTitle: 'Step 3: Voice Note Ingestion',
          caption: 'Inbound customer voice note (.ogg Opus) transcoded in-memory via ffmpeg into Whisper STT to query Jimny stock.'
        }
      ],
      description:
        'Unified multimodal and polyglot conversational intelligence: (1) Audio voice memo ingestion (.ogg Opus piped through in-memory ffmpeg to 16kHz WAV without disk I/O -> Whisper/Doubao ASR). (2) Vernacular Romanized dialect adaptation ("Tanglish", Manglish, Bahasa Melayu) seamlessly translated and answered in native script. (3) Zero-latency code-switching across English, Malay, Mandarin, and Tamil in consecutive turns without conversational context decay.',
      highlights: [
        'Zero-disk in-memory audio transcoding via io.Pipe + ffmpeg to Whisper STT',
        'Automatic romanized dialect detection: Latin Tanglish ➔ Native Tamil script response',
        'Zero context degradation during rapid multi-turn 4-language code switching',
        'Cultural nuance and local idiom preservation while enforcing strict pricing guardrails'
      ],
      backendTrace: {
        component: 'recon-ai-lib ➔ BytePlus Seed Speech ASR + Gemini 2.5 Flash',
        action: 'ASR.TranscribeAudio(raw_ogg) + dynamicPrompt.InjectLanguageContext',
        latency: '1.2s (voice pipeline) / 240ms (polyglot turn)',
        details: 'Downloaded audio before Meta 5-min link expiration, streamed PCM in-memory, identified user language intent, and injected localized vocabulary catalog.'
      }
    },
    {
      id: 'deposit-verification',
      title: 'Deposit Slip Forensic Vision OCR & Anti-Fraud Verification',
      category: 'Payment Receipt OCR',
      badge: 'Vision OCR & Anti-Fraud',
      imageSrc: 'images/whatsapp_sales/03-deposit-receipt-verification.png',
      galleryImages: [
        {
          src: 'images/whatsapp_sales/03-deposit-receipt-verification.png',
          stepTitle: 'Forensic OCR Verification',
          caption: 'Vision AI extracts transaction amount, reference, beneficiary bank, and last-4 digits; locks car to RESERVED.'
        }
      ],
      description:
        'Forensic advance payment verification: customer requests vehicle reservation -> AI generates official dealership banking details (beneficiary, account last-4, booking ref) -> customer uploads mobile banking transfer receipt (SGD 5,000) -> Vision LLM extracts timestamp, amount, bank name, and account last-4 -> automated validation with 1% allowable tolerance -> auto-locks vehicle to RESERVED in vehicle-inventory-service.',
      highlights: [
        'Forensic criteria: is_payment_receipt == true (confidence score >= 0.70 threshold)',
        'Numerical amount validation with 1% allowable fee tolerance',
        'Perceptual hash (pHash) deduplication against historical index prevents duplicate slip reuse',
        'Auto-transitions vehicle inventory status to RESERVED and alerts CRM sales manager'
      ],
      backendTrace: {
        component: 'recon-social-service ➔ payment_verification_service.go',
        action: 'validateReceipt(extracted, booking, branchBank)',
        latency: '740ms (Vision OCR)',
        details: 'Extracted Amount: SGD 5,000; Bank: Maybank; Last4: 1111. Created ADVANCE_PAYMENT_VERIFICATION action request with WebSocket alert to CRM sales manager.'
      }
    },
    {
      id: 'broadcast-messaging',
      title: 'Broadcast Messaging & Meta 24-Hour Re-Engagement Architecture',
      category: 'Broadcast Messaging',
      badge: 'Meta HSM Templates & Fan-Out',
      imageSrc: 'images/whatsapp_sales/05-broadcast-marketing-lexus.png',
      galleryImages: [
        {
          src: 'images/whatsapp_sales/05-broadcast-marketing-lexus.png',
          stepTitle: 'Meta Pre-Approved HSM Card',
          caption: 'New arrival broadcast message (Lexus RX350) sent outside 24h window with interactive CTA and opt-out support.'
        }
      ],
      description:
        'Compliant outbound re-engagement bypassing Meta\'s 24-hour customer care window: under Meta Cloud API policies, once 24 hours have elapsed without a customer message, standard session messages are blocked. To re-engage dormant leads or broadcast new inventory, marketing teams initiate broadcast campaigns using pre-approved Meta HSM (Highly Structured Message) templates.',
      highlights: [
        'Meta 24-Hour Policy Compliance: Bypasses 24h session block using pre-approved Meta HSM templates',
        'End-to-End Orchestration: UI CRM Trigger ➔ recon-api-service ➔ recon-social-service ➔ Redis Asynq',
        'Inventory Guardrail: Automatically verifies vehicle status before broadcast (aborts if Reserved/Sold)',
        'Asynchronous Fan-Out: Redis Asynq workers handle rate limiting, delivery receipts, and STOP opt-outs'
      ],
      backendTrace: {
        component: 'recon-api-service ➔ recon-social-service ➔ pkg/workers/broadcast_processor.go',
        action: 'TriggerBroadcast(templateID, groupID, vehicleID) ➔ QueueOutgoing',
        latency: '45ms enqueue / 100 msg/sec fan-out',
        details: 'Validated Meta template approval status, verified vehicle availability in inventory service, created BroadcastRun in PostgreSQL, and enqueued BroadcastMasterPayload to Asynq.'
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
      title: 'Meta 24-Hour Messaging Window & High-Throughput HSM Broadcast Fan-Out',
      tag: 'Meta Policy & Distributed Fan-Out',
      problem:
        'Meta Cloud API strictly terminates free-form conversation sessions 24 hours after the last customer message. Outbound session messages fail with error 131047. Dealership marketing teams needed to announce new car arrivals and promotions without getting banned or dropping messages.',
      tradeOff:
        'Standard session messages are free; Meta charges per delivered marketing template conversation. Broadcasts require pre-approval and rigid schema parameters.',
      solution:
        'Built a dual-path messaging router: (1) Inside 24h window: dynamic conversational LLM responses. (2) Outside 24h window: UI triggers broadcast campaigns via recon-api-service to recon-social-service. Verifies template approval and vehicle stock availability, creates a PostgreSQL BroadcastRun, and enqueues a BroadcastMasterPayload into Redis Asynq (QueueOutgoing). Dedicated goroutine workers fan out personalized template messages with rate-limiting compliant with Meta Cloud API tier quotas (1,000 to 10,000/day).'
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
