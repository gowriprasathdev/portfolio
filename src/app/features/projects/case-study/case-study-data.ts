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
  layer: 'Ingress & Decoupling' | 'Processing & Orchestration' | 'Cognitive & AI Tier' | 'Data & Persistence' | 'Outbound & Client Egress';
  category: 'Edge' | 'Ingress' | 'Queue' | 'Core AI' | 'Storage' | 'Egress';
  tech: string;
  sla: string;
  protocol: string;
  description: string;
  responsibilities: string[];
  flows: string[];
  upstream: string[];
  downstream: string[];
}

export interface ArchitectureFlow {
  id: string;
  name: string;
  badge: string;
  description: string;
  activeNodeIds: string[];
}

export interface PipelineSnippet {
  title: string;
  language: string;
  code: string;
  caption?: string;
  badge?: string;
}

export interface PipelineTraceStage {
  id: string;
  title: string;
  category: string;
  badge: string;
  summary: string;
  description: string;
  highlights: string[];
  inputSnippet: PipelineSnippet;
  outputSnippet: PipelineSnippet;
  backendTrace: {
    component: string;
    action: string;
    latency: string;
    details: string;
  };
}

export interface CaseStudyData {
  id: string;
  type?: 'conversational' | 'pipeline';
  title: string;
  subtitle: string;
  badge: string;
  techPills?: string[];
  overview: string;
  gallery: ProductionScreenshot[];
  pipelineTraces?: PipelineTraceStage[];
  tracesLabel?: string;
  challenges: EngineeringChallenge[];
  nodes: ArchitectureNode[];
  flows: ArchitectureFlow[];
  mermaidCode: string;
  connectorLabels?: {
    tier1To2?: string;
    tier2To3?: string;
    tier3To45?: string;
    tier45To6?: string;
  };
  metrics: {
    stat: string;
    label: string;
    subtext: string;
  }[];
}

export function getMermaidArchitectureCode(theme: 'light' | 'dark' = 'dark'): string {
  const isLight = theme === 'light';
  const edgeClass = isLight
    ? 'fill:#ffffff,stroke:#0d9488,stroke-width:1.5px,color:#0f172a'
    : 'fill:#0d1522,stroke:#41d1c2,stroke-width:1.5px,color:#f1f5f9';
  const ingressClass = isLight
    ? 'fill:#f0fdfa,stroke:#0284c7,stroke-width:1.5px,color:#0f172a'
    : 'fill:#121e33,stroke:#38bdf8,stroke-width:1.5px,color:#f1f5f9';
  const queueClass = isLight
    ? 'fill:#faf5ff,stroke:#7e22ce,stroke-width:1.5px,color:#0f172a'
    : 'fill:#181829,stroke:#a855f7,stroke-width:1.5px,color:#f1f5f9';
  const coreClass = isLight
    ? 'fill:#f0fdf4,stroke:#0d9488,stroke-width:2px,color:#0f172a'
    : 'fill:#0d2328,stroke:#41d1c2,stroke-width:2px,color:#f1f5f9';
  const aiClass = isLight
    ? 'fill:#fdf2f8,stroke:#be185d,stroke-width:1.5px,color:#0f172a'
    : 'fill:#1f132b,stroke:#ec4899,stroke-width:1.5px,color:#f1f5f9';
  const storageClass = isLight
    ? 'fill:#f0fdf4,stroke:#059669,stroke-width:1.5px,color:#0f172a'
    : 'fill:#1b2318,stroke:#10b981,stroke-width:1.5px,color:#f1f5f9';
  const egressClass = isLight
    ? 'fill:#fffbeb,stroke:#d97706,stroke-width:1.5px,color:#0f172a'
    : 'fill:#261e12,stroke:#f59e0b,stroke-width:1.5px,color:#f1f5f9';

  return `flowchart TD
  %% Theme Styles (${isLight ? 'Light Theme' : 'Dark Theme'})
  classDef edgeClass ${edgeClass}
  classDef ingressClass ${ingressClass}
  classDef queueClass ${queueClass}
  classDef coreClass ${coreClass}
  classDef aiClass ${aiClass}
  classDef storageClass ${storageClass}
  classDef egressClass ${egressClass}

  subgraph Clients ["Clients & External Edge"]
    Customer["📱 Customer WhatsApp Client"]:::edgeClass
    CRMAdmin["💻 Dealership CRM Admin"]:::edgeClass
    MetaCloud["☁️ Meta WhatsApp Cloud Platform"]:::edgeClass
  end

  subgraph IngressTier ["Ingress & Decoupling Layer (Sub-45ms SLA)"]
    IngressGW["⚡ API Ingress Gateway<br/>Go 1.22 + Gin · HMAC-SHA256"]:::ingressClass
    RedisQueue[("📬 Redis Asynq FIFO Queue<br/>Buffer & Rate-Limiting")]:::queueClass
  end

  subgraph OrchestrationCore ["Asynchronous Processing Core"]
    WorkerPool["⚙️ Asynq Consumer Pool<br/>Goroutine Worker Pool"]:::queueClass
    BroadcastPool["📢 Outbound HSM Worker<br/>Meta Tier Rate Limiter"]:::queueClass
    AIOrchestrator["🧠 Agentic AI Orchestrator<br/>Tools & Guardrails Core"]:::coreClass
  end

  subgraph SpecializedAI ["Cognitive & Multimodal AI Engines"]
    LLMEngine["💬 Conversational LLM<br/>Gemini 2.5 Flash"]:::aiClass
    ASREngine["🎙️ Audio Transcoder<br/>io.Pipe + Doubao ASR"]:::aiClass
    VisionOCR["🧾 Forensic Vision OCR<br/>Deposit Slip & pHash"]:::aiClass
  end

  subgraph DataPersistence ["State & Persistence Tier"]
    PostgreSQL[("🗄️ PostgreSQL 16 Store<br/>Inventory & ACID State")]:::storageClass
    RedisState[("⚡ Redis Session & Mutex<br/>Context & Redlock")]:::storageClass
    ObjectStore[("📦 Cloud Object Storage<br/>TOS / S3 Media Bucket")]:::storageClass
  end

  subgraph OutboundTier ["Outbound Dispatch & Egress"]
    OutboundDispatcher["🚀 Outbound Dispatcher<br/>Flows v3 & HSM Templates"]:::egressClass
    CRMPush["🔔 Realtime CRM Push<br/>WebSocket Gateway"]:::egressClass
  end

  %% Flow Connections
  Customer -->|Inbound Message / Audio / Slip| MetaCloud
  MetaCloud -->|HTTP POST Webhook| IngressGW
  CRMAdmin -->|Trigger Broadcast / CRM Action| IngressGW
  IngressGW -->|Instant 200 OK ACK under 45ms| MetaCloud
  IngressGW -->|Enqueue Conversation Job| RedisQueue
  IngressGW -->|Enqueue HSM Fan-Out| BroadcastPool

  RedisQueue -->|Consume FIFO Task| WorkerPool
  WorkerPool -->|Restore Context Window| RedisState
  WorkerPool -->|Dispatch Conversation Turn| AIOrchestrator

  AIOrchestrator <-->|Reasoning & Tool Schema| LLMEngine
  AIOrchestrator <-->|Transcode OGG & Transcribe| ASREngine
  AIOrchestrator <-->|Forensic Slip Validation| VisionOCR

  AIOrchestrator -->|Acquire Booking Lock| RedisState
  AIOrchestrator -->|Query / Reserve Inventory| PostgreSQL
  AIOrchestrator -->|Stream Photo Gallery / Media| ObjectStore
  VisionOCR -->|Deduplicate pHash & Record Payment| PostgreSQL

  BroadcastPool -->|Verify Active Inventory| PostgreSQL
  BroadcastPool -->|Outbound HSM Enqueue| OutboundDispatcher
  WorkerPool -->|Enqueue Outbound Response| OutboundDispatcher
  AIOrchestrator -->|Push Lead / Booking Alert| CRMPush
  CRMPush -->|Realtime Alert| CRMAdmin

  OutboundDispatcher -->|Meta Graph API HTTPS| MetaCloud
  MetaCloud -->|Deliver to WhatsApp| Customer`;
}

export const MERMAID_ARCHITECTURE_CODE = getMermaidArchitectureCode('dark');

export const ARCHITECTURE_FLOWS: ArchitectureFlow[] = [
  {
    id: 'all',
    name: 'Complete System Architecture',
    badge: '14 Services',
    description: 'Full end-to-end view of all microservices, queues, AI engines, persistence stores, and egress gateways.',
    activeNodeIds: [
      'meta-cloud-api',
      'ingress-gateway',
      'redis-asynq-queue',
      'asynq-worker-pool',
      'agentic-ai-orchestrator',
      'gemini-llm',
      'audio-asr-transcoder',
      'vision-ocr-engine',
      'postgres-db',
      'redis-state-store',
      'object-storage',
      'outbound-dispatcher',
      'broadcast-worker-pool',
      'crm-push-gateway'
    ]
  },
  {
    id: 'ingress',
    name: 'Webhook Ingress & Buffer (<45ms SLA)',
    badge: '< 45ms ACK',
    description: 'High-throughput ingress validating HMAC-SHA256 signatures and buffering to Redis Asynq to prevent Meta 5s timeout drops.',
    activeNodeIds: [
      'meta-cloud-api',
      'ingress-gateway',
      'redis-asynq-queue',
      'asynq-worker-pool'
    ]
  },
  {
    id: 'booking',
    name: 'WhatsApp Flows v3 & Distributed Redlock',
    badge: 'Zero Double-Booking',
    description: 'Native slot picker with RSA + AES-GCM payload encryption, Redis Redlock distributed mutex locking, and ACID booking commit in PostgreSQL.',
    activeNodeIds: [
      'meta-cloud-api',
      'ingress-gateway',
      'asynq-worker-pool',
      'agentic-ai-orchestrator',
      'redis-state-store',
      'postgres-db',
      'outbound-dispatcher',
      'crm-push-gateway'
    ]
  },
  {
    id: 'voice',
    name: 'In-Memory Voice Note Transcoder & ASR',
    badge: 'Zero-Disk I/O',
    description: 'WhatsApp .ogg Opus audio memo streamed through in-memory io.Pipe + ffmpeg into 16kHz WAV and transcribed via Seed Speech ASR.',
    activeNodeIds: [
      'meta-cloud-api',
      'ingress-gateway',
      'asynq-worker-pool',
      'agentic-ai-orchestrator',
      'audio-asr-transcoder',
      'gemini-llm',
      'object-storage',
      'outbound-dispatcher'
    ]
  },
  {
    id: 'ocr',
    name: 'Deposit Slip Forensic Vision OCR',
    badge: '98% Confidence',
    description: 'Customer mobile banking receipt evaluated by Multimodal Vision AI with perceptual hash deduplication, auto-locking vehicle to RESERVED.',
    activeNodeIds: [
      'meta-cloud-api',
      'ingress-gateway',
      'asynq-worker-pool',
      'agentic-ai-orchestrator',
      'vision-ocr-engine',
      'postgres-db',
      'crm-push-gateway',
      'outbound-dispatcher'
    ]
  },
  {
    id: 'broadcast',
    name: 'Outbound HSM Broadcast Fan-Out',
    badge: 'Meta 24h Policy',
    description: 'CRM campaign trigger verifying stock availability, creating PostgreSQL runs, and fanning out pre-approved Meta HSM marketing templates.',
    activeNodeIds: [
      'ingress-gateway',
      'broadcast-worker-pool',
      'postgres-db',
      'outbound-dispatcher',
      'meta-cloud-api'
    ]
  }
];

export const ARCHITECTURE_NODES: ArchitectureNode[] = [
  {
    id: 'meta-cloud-api',
    title: 'Meta WhatsApp Cloud API',
    layer: 'Ingress & Decoupling',
    category: 'Edge',
    tech: 'WhatsApp Business Platform v25.0',
    sla: '5,000ms Hard Timeout SLA',
    protocol: 'HTTPS / Webhook Event Emitter',
    description: 'Official WhatsApp gateway delivering inbound user messages, raw audio notes, interactive button selections, and encrypted Flows payloads.',
    responsibilities: [
      'Delivers incoming webhook events (messages, media, statuses) to server',
      'Enforces strict 5-second HTTP 200 acknowledgment window',
      'Executes TLS 1.3 handshake and generates payload HMAC-SHA256 signature headers'
    ],
    flows: ['all', 'ingress', 'booking', 'voice', 'ocr', 'broadcast'],
    upstream: ['Customer WhatsApp Client'],
    downstream: ['ingress-gateway']
  },
  {
    id: 'ingress-gateway',
    title: 'API Ingress Gateway',
    layer: 'Ingress & Decoupling',
    category: 'Ingress',
    tech: 'Go 1.22 · Gin Web Framework',
    sla: '< 45ms Response Latency',
    protocol: 'HTTPS REST / JSON / HMAC-SHA256',
    description: 'High-throughput edge receiver that validates Meta signature headers, handles deduplication checks, and offloads work to Redis queues in under 45ms.',
    responsibilities: [
      'Validates X-Hub-Signature-256 using SHA256 HMAC against app secret',
      'Issues instantaneous HTTP 200 OK ACK to eliminate Meta timeout retry storms',
      'Deserializes raw webhook envelopes and routes into Redis Asynq task queues'
    ],
    flows: ['all', 'ingress', 'booking', 'voice', 'ocr', 'broadcast'],
    upstream: ['meta-cloud-api', 'CRM Admin Dashboard'],
    downstream: ['redis-asynq-queue', 'broadcast-worker-pool']
  },
  {
    id: 'redis-asynq-queue',
    title: 'Redis Task Queue (Asynq)',
    layer: 'Ingress & Decoupling',
    category: 'Queue',
    tech: 'Redis 7 Cluster · hibiken/asynq',
    sla: 'Zero Message Drop Guarantee',
    protocol: 'Redis RESP3 Protocol',
    description: 'Durable FIFO message queue buffering conversation jobs, orchestrating task scheduling, exponential-backoff retries, and rate limiting.',
    responsibilities: [
      'Buffers inbound conversational events away from HTTP ingress',
      'Guarantees at-least-once message delivery with dead-letter queue (DLQ) support',
      'Provides per-phone-number concurrency debouncing and rate throttling'
    ],
    flows: ['all', 'ingress', 'booking', 'voice', 'ocr'],
    upstream: ['ingress-gateway'],
    downstream: ['asynq-worker-pool']
  },
  {
    id: 'asynq-worker-pool',
    title: 'Asynq Consumer Worker Pool',
    layer: 'Processing & Orchestration',
    category: 'Queue',
    tech: 'Go Goroutine Pool · Exponential Backoff',
    sla: 'Concurrent Non-Blocking Execution',
    protocol: 'In-Process Go Channel Dispatch',
    description: 'Scalable worker pool consuming queued conversation tasks, maintaining Redis conversation context windows, and dispatching agentic AI pipelines.',
    responsibilities: [
      'Dequeues conversation tasks and manages worker goroutine lifecycle',
      'Loads conversation history from Redis 10-message sliding window',
      'Dispatches agentic tool calling loop and handles error backoff retries'
    ],
    flows: ['all', 'ingress', 'booking', 'voice', 'ocr'],
    upstream: ['redis-asynq-queue'],
    downstream: ['agentic-ai-orchestrator', 'redis-state-store', 'outbound-dispatcher']
  },
  {
    id: 'agentic-ai-orchestrator',
    title: 'Agentic AI Orchestrator',
    layer: 'Processing & Orchestration',
    category: 'Core AI',
    tech: 'Go Engine · Dynamic Function Calling',
    sla: 'Sub-Second Agentic Turn',
    protocol: 'Provider-Agnostic LLM Client',
    description: 'Autonomous reasoning engine that executes multi-turn tool loops, dynamic schema translation, anti-affirmation guardrails, and catalog search.',
    responsibilities: [
      'Orchestrates autonomous tool-calling loops with strict schema validation',
      'Enforces anti-affirmation directives (never promises vehicle price without DB query)',
      'Manages multilingual & dialect context (Tanglish, Manglish, Bahasa Melayu, Tamil)'
    ],
    flows: ['all', 'booking', 'voice', 'ocr'],
    upstream: ['asynq-worker-pool'],
    downstream: ['gemini-llm', 'audio-asr-transcoder', 'vision-ocr-engine', 'postgres-db', 'redis-state-store', 'object-storage']
  },
  {
    id: 'gemini-llm',
    title: 'Conversational LLM (Gemini 2.5 Flash)',
    layer: 'Cognitive & AI Tier',
    category: 'Core AI',
    tech: 'Google GenAI SDK · Temperature 0.2',
    sla: 'Sub-Second Response Stream',
    protocol: 'HTTPS REST / JSON Streaming',
    description: 'Primary conversational model handling natural language understanding, polyglot vernacular translation, tool selection, and automotive dialogue.',
    responsibilities: [
      'Extracts vehicle criteria: make, model, year, mileage, and budget caps',
      'Translates romanized vernacular dialects and returns localized response copy',
      'Formats compliant WhatsApp interactive list cards (titles <= 24 chars)'
    ],
    flows: ['all', 'voice', 'booking', 'ocr'],
    upstream: ['agentic-ai-orchestrator'],
    downstream: ['agentic-ai-orchestrator']
  },
  {
    id: 'audio-asr-transcoder',
    title: 'In-Memory Audio Transcoder & ASR',
    layer: 'Cognitive & AI Tier',
    category: 'Core AI',
    tech: 'io.Pipe + ffmpeg · Doubao Seed Speech ASR',
    sla: '1.2s Voice Note Turnaround',
    protocol: 'In-Memory PCM Stream / HTTPS',
    description: 'Streams customer WhatsApp .ogg Opus voice notes through an in-memory ffmpeg pipe to 16kHz WAV without disk I/O, then transcribes via ASR.',
    responsibilities: [
      'Zero-disk in-memory audio transcoding via io.Pipe to prevent container disk exhaustion',
      'Transcribes customer audio voice notes into clean text with confidence scoring',
      'Handles background noise filtering and local vernacular accents'
    ],
    flows: ['all', 'voice'],
    upstream: ['agentic-ai-orchestrator'],
    downstream: ['agentic-ai-orchestrator']
  },
  {
    id: 'vision-ocr-engine',
    title: 'Forensic Vision OCR Engine',
    layer: 'Cognitive & AI Tier',
    category: 'Core AI',
    tech: 'Multimodal Vision AI · pHash Deduplication',
    sla: '740ms Forensic Extraction',
    protocol: 'Binary Stream / S3 Pre-signed URL',
    description: 'Forensic validation engine analyzing uploaded bank transfer slips, verifying transaction timestamp, amount, beneficiary, and preventing slip reuse.',
    responsibilities: [
      'Computes image perceptual hash (pHash) against historical index to block duplicate slips',
      'Extracts transaction timestamp, amount, bank reference, and last-4 account digits',
      'Enforces 1% allowable fee tolerance and triggers CRM salesperson notification'
    ],
    flows: ['all', 'ocr'],
    upstream: ['agentic-ai-orchestrator'],
    downstream: ['postgres-db', 'crm-push-gateway']
  },
  {
    id: 'redis-state-store',
    title: 'Redis Session & Mutex Store',
    layer: 'Data & Persistence',
    category: 'Storage',
    tech: 'Redis 7 Cluster · Redlock Mutex',
    sla: '< 2ms In-Memory Latency',
    protocol: 'Redis RESP3 Protocol',
    description: 'High-speed cache maintaining 10-turn sliding conversation windows, debounced lead scoring timers, and Redlock distributed mutex locks.',
    responsibilities: [
      'Maintains rolling 10-message sliding window plus hierarchical conversation summary',
      'Acquires Redis Redlock distributed mutex to prevent test-drive double-booking collisions',
      'Deduplicates incoming webhooks using Meta message_id idempotency keys'
    ],
    flows: ['all', 'ingress', 'booking', 'broadcast'],
    upstream: ['asynq-worker-pool', 'agentic-ai-orchestrator'],
    downstream: []
  },
  {
    id: 'postgres-db',
    title: 'PostgreSQL Relational Store',
    layer: 'Data & Persistence',
    category: 'Storage',
    tech: 'PostgreSQL 16 · GORM ORM',
    sla: 'ACID Transaction Guarantees',
    protocol: 'SQL (PostgreSQL Wire Protocol)',
    description: 'Primary transactional system of record holding vehicle inventory specifications, confirmed test-drive appointments, CRM leads, and payment records.',
    responsibilities: [
      'Stores verified automotive catalog: live pricing, mileage, auction grades, and status',
      'Executes ACID transactions for test-drive booking and cancellation slot recycling',
      'Persists lead scoring telemetry and verified payment deposit audit records'
    ],
    flows: ['all', 'booking', 'ocr', 'broadcast'],
    upstream: ['agentic-ai-orchestrator', 'vision-ocr-engine', 'broadcast-worker-pool'],
    downstream: []
  },
  {
    id: 'object-storage',
    title: 'Cloud Object Storage (TOS / S3)',
    layer: 'Data & Persistence',
    category: 'Storage',
    tech: 'S3-Compatible Torch Object Storage',
    sla: '99.999999% Durability',
    protocol: 'HTTPS / Pre-signed URLs',
    description: 'Cloud object store holding high-resolution vehicle photo galleries, customer audio notes, and forensic deposit slip images.',
    responsibilities: [
      'Stores exterior and interior multi-angle photo catalogs for live vehicle models',
      'Generates time-limited pre-signed CDN download URLs for WhatsApp media dispatch',
      'Archives customer voice notes and deposit verification images for compliance'
    ],
    flows: ['all', 'voice', 'ocr'],
    upstream: ['agentic-ai-orchestrator', 'audio-asr-transcoder'],
    downstream: ['Customer WhatsApp Client']
  },
  {
    id: 'outbound-dispatcher',
    title: 'Outbound Message Dispatcher',
    layer: 'Outbound & Client Egress',
    category: 'Egress',
    tech: 'Meta Graph API · Flows v3 Crypto Engine',
    sla: '100 msg/sec Rate-Limited Egress',
    protocol: 'HTTPS REST / AES-GCM Encryption',
    description: 'Outbound engine encrypting Flows v3 payloads (RSA + AES-GCM), managing outbound rate limits, and transmitting messages via Meta Graph API.',
    responsibilities: [
      'Encrypts and signs native WhatsApp Flows v3 date/time picker screen payloads',
      'Formats interactive lists, quick-reply buttons, and media attachment messages',
      'Enforces Meta Cloud API tier rate limits to prevent outbound delivery throttling'
    ],
    flows: ['all', 'ingress', 'booking', 'voice', 'ocr', 'broadcast'],
    upstream: ['asynq-worker-pool', 'broadcast-worker-pool'],
    downstream: ['meta-cloud-api']
  },
  {
    id: 'broadcast-worker-pool',
    title: 'Outbound HSM Broadcast Worker',
    layer: 'Processing & Orchestration',
    category: 'Queue',
    tech: 'Goroutine Fan-Out · Tier Quota Limiter',
    sla: '1,000–10,000 msgs/day Compliance',
    protocol: 'Redis Asynq Egress Queue',
    description: 'Dedicated campaign worker verifying vehicle stock availability, creating PostgreSQL runs, and fanning out pre-approved Meta HSM marketing templates.',
    responsibilities: [
      'Bypasses Meta 24-hour customer window block using pre-approved HSM templates',
      'Verifies vehicle stock status before dispatch to prevent marketing sold inventory',
      'Processes unsubscribe opt-out webhooks and records delivery analytics'
    ],
    flows: ['all', 'broadcast'],
    upstream: ['ingress-gateway'],
    downstream: ['postgres-db', 'outbound-dispatcher']
  },
  {
    id: 'crm-push-gateway',
    title: 'Realtime CRM WebSocket Gateway',
    layer: 'Outbound & Client Egress',
    category: 'Egress',
    tech: 'WebSockets · SSE Realtime Stream',
    sla: '< 100ms Notification Dispatch',
    protocol: 'WSS / REST Webhook',
    description: 'Pushes high-priority sales leads, test-drive booking slips, and verified deposit receipts directly into the dealership sales advisor dashboard.',
    responsibilities: [
      'Broadcasts instant lead alerts to sales advisors with full conversation context',
      'Pushes verified deposit receipts with vehicle reservation lock confirmation',
      'Synchronizes appointment slot cancellations back to showroom calendars'
    ],
    flows: ['all', 'booking', 'ocr'],
    upstream: ['agentic-ai-orchestrator', 'vision-ocr-engine'],
    downstream: ['Dealership CRM Admin']
  }
];

export const WHATSAPP_SALES_CASE_STUDY: CaseStudyData = {
  id: 'whatsapp-sales',
  type: 'conversational',
  title: 'Conversational WhatsApp AI Sales Platform',
  subtitle: 'Event-Driven Microservices Architecture — Conversational Commerce & Lead Intelligence',
  badge: 'Distributed Architecture',
  techPills: [
    'Go 1.22 + Meta Cloud API',
    'WhatsApp Flows v3',
    'Redis Distributed Lock',
    'BytePlus TOS',
    'Gemini 2.5 Flash'
  ],
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
        component: 'messaging-ingress-gateway ➔ agentic-ai-engine ➔ inventory-service',
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
        component: 'messaging-ingress-gateway ➔ flows-crypto-module + appointment-service',
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
        component: 'agentic-ai-engine ➔ BytePlus Seed Speech ASR + Gemini 2.5 Flash',
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
        component: 'messaging-ingress-gateway ➔ payment-verification-engine',
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
        'End-to-End Orchestration: CRM Admin Trigger ➔ core-platform-api ➔ messaging-ingress-gateway ➔ Redis Asynq',
        'Inventory Guardrail: Automatically verifies vehicle status before broadcast (aborts if Reserved/Sold)',
        'Asynchronous Fan-Out: Redis Asynq workers handle rate limiting, delivery receipts, and STOP opt-outs'
      ],
      backendTrace: {
        component: 'core-platform-api ➔ messaging-ingress-gateway ➔ broadcast-worker-pool',
        action: 'TriggerBroadcast(templateID, groupID, vehicleID) ➔ QueueOutgoing',
        latency: '45ms enqueue / 100 msg/sec fan-out',
        details: 'Validated Meta template approval status, verified vehicle availability in inventory service, created BroadcastRun in PostgreSQL, and enqueued BroadcastMasterPayload to Asynq.'
      }
    }
  ],
  nodes: ARCHITECTURE_NODES,
  flows: ARCHITECTURE_FLOWS,
  mermaidCode: MERMAID_ARCHITECTURE_CODE,
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
        'Built a dual-path messaging router: (1) Inside 24h window: dynamic conversational LLM responses. (2) Outside 24h window: UI triggers broadcast campaigns via core-platform-api to messaging-ingress-gateway. Verifies template approval and vehicle stock availability, creates a PostgreSQL BroadcastRun, and enqueues a BroadcastMasterPayload into Redis Asynq (QueueOutgoing). Dedicated goroutine workers fan out personalized template messages with rate-limiting compliant with Meta Cloud API tier quotas (1,000 to 10,000/day).'
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
