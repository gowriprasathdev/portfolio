import {
  ArchitectureNode,
  ArchitectureFlow,
  EngineeringChallenge,
  CaseStudyData,
  PipelineTraceStage
} from './case-study-data';

export function getInventoryEtlMermaidCode(theme: 'light' | 'dark' = 'dark'): string {
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

  subgraph ExternalSources ["External Data Sources & Triggers"]
    CronTimer["⏰ Cloud FaaS Cron Timer<br/>5-Minute Periodic Auto-Sync"]:::edgeClass
    APIGateway["⚡ Cloud API Gateway Trigger<br/>POST /api/v1/inventory/sync"]:::edgeClass
    GoogleSheets["📊 Master Google Sheets<br/>Tabular Grid & cell.Note"]:::edgeClass
    DriveStorage["📁 Google Drive Folders<br/>Inspection Photos & Docs"]:::edgeClass
  end

  subgraph IngressTier ["Ingress & Ingestion Decoupling Layer (Sub-40ms SLA)"]
    FaaSDaemon["⚡ Serverless Ingress Daemon<br/>Go 1.21 · Instant 202 Accepted"]:::ingressClass
    SheetsProvider["📑 Google Sheets Ingestor<br/>Single-Pass Row & Note Reader"]:::ingressClass
    TOSStreamer["📦 Cloud Storage Streamer<br/>Zero-Disk Ingestion Engine"]:::ingressClass
  end

  subgraph OrchestrationCore ["Delta Detection & Concurrency Core"]
    SplitCacheEngine[("⚡ Redis Split-Cache Engine<br/>vehicleHash & commentsHash")]:::queueClass
    ConcurrencyGovernor["🚦 Nested Concurrency Governor<br/>Sheet & Chunk Semaphores"]:::coreClass
    MediaSyncWorker["📸 Parallel Media Sync Engine<br/>8-Car Pool & MD5 Cache"]:::queueClass
  end

  subgraph CognitiveAI ["Cognitive LLM Extraction Tier"]
    VehicleExtractor["🚗 Vehicle Grid LLM Extractor<br/>Gemini 2.5 Negative Constraints"]:::aiClass
    CommentExtractor["💬 Comment NLP Lifecycle Parser<br/>LOU Loan & Milestone Events"]:::aiClass
  end

  subgraph PersistenceTier ["Persistence & Cloud Storage Tier"]
    PostgresStore[("🗄️ PostgreSQL Relational Store<br/>ACID COALESCE Atomic Upsert")]:::storageClass
    CloudObjectStore[("📦 Cloud Object Storage<br/>TOS / S3 Vehicle Photos Bucket")]:::storageClass
    RedisCacheStore[("⚡ Redis Hash & State Store<br/>Delta Signatures & Vehicle Cache")]:::storageClass
  end

  subgraph EgressTier ["Event Egress & Consumer Notification"]
    PubSubEgress["🚀 Redis Pub/Sub Dispatcher<br/>inventory:updated Channel"]:::egressClass
    WhatsAppConsumer["📱 WhatsApp Conversational AI<br/>Immediate Cache Invalidation"]:::egressClass
    EmailAlert["📧 SMTP Alerting Service<br/>Sync Failure Breakdowns"]:::egressClass
  end

  %% Flow Connections
  CronTimer -->|Trigger Auto-Sync| SheetsProvider
  APIGateway -->|Upload Webhook| FaaSDaemon
  FaaSDaemon -->|Immediate 202 ACK under 40ms| APIGateway
  FaaSDaemon -->|Async Background Process| TOSStreamer

  GoogleSheets -->|Read Rows & Notes| SheetsProvider
  SheetsProvider -->|Raw Grid & Notes| SplitCacheEngine
  TOSStreamer -->|Parsed Worksheets| SplitCacheEngine

  SplitCacheEngine -->|Cache Hit - Skip AI| RedisCacheStore
  SplitCacheEngine -->|Grid Mismatch| ConcurrencyGovernor
  SplitCacheEngine -->|Comments Mismatch| ConcurrencyGovernor

  ConcurrencyGovernor -->|Chunk Batches - TPM Throttled| VehicleExtractor
  ConcurrencyGovernor -->|Comment Batches| CommentExtractor

  VehicleExtractor -->|Typed Vehicle DTOs & Drive URLs| PostgresStore
  CommentExtractor -->|Merged Sales Lifecycle JSONB| PostgresStore

  PostgresStore -->|Fetch Unsold Drive Folder URLs| MediaSyncWorker
  MediaSyncWorker <-->|Check MD5 & Rename State| RedisCacheStore
  MediaSyncWorker -->|Stream Binary Downloads| DriveStorage
  DriveStorage -->|Direct Stream - Zero Disk| CloudObjectStore
  MediaSyncWorker -->|Soft-Delete Removed Files| PostgresStore

  PostgresStore -->|Commit Success Event| PubSubEgress
  PubSubEgress -->|Broadcast Invalidation| WhatsAppConsumer
  ConcurrencyGovernor -.->|On Critical Error| EmailAlert`;
}

export const INVENTORY_ETL_NODES: ArchitectureNode[] = [
  // Tier 1: Clients & External Edge
  {
    id: 'cron-timer-trigger',
    title: 'Cloud Function Cron Timer',
    layer: 'Ingress & Decoupling',
    category: 'Edge',
    tech: 'BytePlus FaaS Cron Trigger',
    sla: 'Every 5 Minutes',
    protocol: 'Internal Timer Event',
    description: 'Serverless cron timer that triggers one-shot automated synchronization of master vehicle inventories from Google Sheets.',
    responsibilities: [
      'Executes periodic sync loop every 5 minutes',
      'Invokes compiled binary in serverless one-shot mode',
      'Passes execution context and runs to completion before clean exit'
    ],
    flows: ['all', 'auto-sync'],
    upstream: [],
    downstream: ['sheets-ingestor']
  },
  {
    id: 'api-gateway-trigger',
    title: 'Cloud API Gateway Trigger',
    layer: 'Ingress & Decoupling',
    category: 'Edge',
    tech: 'BytePlus API Gateway',
    sla: '< 40ms ACK',
    protocol: 'HTTPS POST /sync',
    description: 'Edge API Gateway receiving asynchronous manual inventory upload notifications from admin services.',
    responsibilities: [
      'Terminates TLS and enforces request rate limits',
      'Routes POST /api/v1/inventory/sync payload to the persistent FaaS daemon',
      'Returns immediate HTTP 202 Accepted to prevent upstream client timeouts'
    ],
    flows: ['all', 'manual-upload'],
    upstream: [],
    downstream: ['faas-ingress-daemon']
  },
  {
    id: 'google-sheets-source',
    title: 'Google Sheets Master Catalog',
    layer: 'Ingress & Decoupling',
    category: 'Edge',
    tech: 'Google Sheets API v4',
    sla: 'Read-Only Source',
    protocol: 'REST / TLS 1.3',
    description: 'Live collaborative dealership inventory spreadsheet containing multi-sheet stock categories and cell sticky notes.',
    responsibilities: [
      'Serves raw tabular rows across multiple stock category sheets',
      'Provides cell.Note metadata for deposit and salesperson commentary',
      'Acts as master source of truth for automated scheduled synchronization'
    ],
    flows: ['all', 'auto-sync'],
    upstream: ['cron-timer-trigger'],
    downstream: ['sheets-ingestor']
  },
  {
    id: 'google-drive-source',
    title: 'Google Drive Image Repositories',
    layer: 'Ingress & Decoupling',
    category: 'Edge',
    tech: 'Google Drive API v3',
    sla: '10 QPS Quota',
    protocol: 'REST / Media Download',
    description: 'External cloud folders referenced via cell URLs storing high-resolution vehicle inspection photos and paperwork.',
    responsibilities: [
      'Stores 10-30 high-resolution inspection photos per vehicle',
      'Exposes folder structures via cell hyperlinks embedded in inventory sheets',
      'Streams binary media via HTTP download for object storage ingestion'
    ],
    flows: ['all', 'drive-media'],
    upstream: ['media-sync-worker'],
    downstream: ['cloud-object-store']
  },

  // Tier 2: Ingress & Queue Decoupling
  {
    id: 'faas-ingress-daemon',
    title: 'Serverless Ingress Daemon',
    layer: 'Ingress & Decoupling',
    category: 'Ingress',
    tech: 'Go 1.21 · net/http · FaaS Native',
    sla: '< 40ms Response',
    protocol: 'HTTP/1.1 REST',
    description: 'Long-lived Go server deployed on BytePlus FaaS behind the API Gateway to decouple uploads from long-running ETL jobs.',
    responsibilities: [
      'Implements "Two Functions, One Binary" pattern controlled via SERVER_MODE',
      'Validates incoming sync requests and enforces single-flight busy mutex locks',
      'Dispatches background ETL jobs while immediately returning HTTP 202'
    ],
    flows: ['all', 'manual-upload'],
    upstream: ['api-gateway-trigger'],
    downstream: ['tos-excel-streamer']
  },
  {
    id: 'sheets-ingestor',
    title: 'Google Sheets Ingestor',
    layer: 'Ingress & Decoupling',
    category: 'Ingress',
    tech: 'Google Sheets Client SDK',
    sla: 'Single-Pass Fetch',
    protocol: 'Spreadsheets.Get GridData',
    description: 'High-performance ingestion module reading tabular cells and cell note annotations in a single API pass to prevent double-fetch costs.',
    responsibilities: [
      'Retrieves both row grid data and cell.Note comments in one round-trip',
      'Normalizes messy whitespace, merged cells, and empty row buffers',
      'Forwards structured sheet matrices to the split-cache delta engine'
    ],
    flows: ['all', 'auto-sync'],
    upstream: ['google-sheets-source'],
    downstream: ['split-cache-engine']
  },
  {
    id: 'tos-excel-streamer',
    title: 'Cloud Storage Excel Streamer',
    layer: 'Ingress & Decoupling',
    category: 'Ingress',
    tech: 'excelize/v2 · BytePlus TOS (S3)',
    sla: 'Zero-Disk Streaming',
    protocol: 'S3 API / OSS Stream',
    description: 'Streams uploaded Excel (.xlsx) files from Cloud Object Storage directly into memory without ephemeral disk persistence.',
    responsibilities: [
      'Downloads multi-megabyte .xlsx streams via BytePlus TOS S3 interface',
      'Parses worksheets and threaded comments using excelize.GetComments()',
      'Strips Microsoft Excel boilerplate headers and normalizes text encoding'
    ],
    flows: ['all', 'manual-upload'],
    upstream: ['faas-ingress-daemon'],
    downstream: ['split-cache-engine']
  },

  // Tier 3: Processing & Orchestration Core
  {
    id: 'split-cache-engine',
    title: 'Redis Split-Cache Hash Engine',
    layer: 'Processing & Orchestration',
    category: 'Queue',
    tech: 'Redis 7 · SHA-256 Hashes',
    sla: '< 3ms Hash Lookup',
    protocol: 'Redis TCP / In-Memory',
    description: 'Dual-pass change detection state machine evaluating vehicleHash (CSV) and commentsHash (comments) independently.',
    responsibilities: [
      'Eliminates silent drops: detects comment-only changes without cell grid updates',
      'Saves 70%+ in LLM token costs by reusing cached vehicle JSON on note updates',
      'Short-circuits completely unchanged sheets with zero downstream LLM calls'
    ],
    flows: ['all', 'auto-sync', 'cognitive-nlp'],
    upstream: ['sheets-ingestor', 'tos-excel-streamer'],
    downstream: ['concurrency-governor', 'redis-state-store']
  },
  {
    id: 'concurrency-governor',
    title: 'Nested Concurrency Governor',
    layer: 'Processing & Orchestration',
    category: 'Queue',
    tech: 'Go Counting Semaphores · sync.WaitGroup',
    sla: 'RPM/TPM Quota Guard',
    protocol: 'In-Memory Channels',
    description: 'Two-tier concurrency governor controlling concurrent sheet processing and row-chunk LLM fan-outs to avoid model rate-limits.',
    responsibilities: [
      'Enforces sheet-level concurrency limit (2-4 sheets in parallel)',
      'Governs row-chunk LLM calls via buffered channel semaphore (limit 4)',
      'Chunks large inventories into 50-row batches with dedicated 3-minute timeouts'
    ],
    flows: ['all', 'cognitive-nlp'],
    upstream: ['split-cache-engine'],
    downstream: ['vehicle-grid-extractor', 'comment-lifecycle-parser']
  },
  {
    id: 'media-sync-worker',
    title: 'Parallel Media Sync Engine',
    layer: 'Processing & Orchestration',
    category: 'Queue',
    tech: 'Go errgroup · Google Drive API',
    sla: '8-Car Semaphore',
    protocol: 'Zero-Disk io.Pipe Stream',
    description: 'Asynchronous worker pool downloading car inspection photo folders from Google Drive and streaming them to Cloud Object Storage.',
    responsibilities: [
      'Limits folder concurrency to 8 cars to prevent Google Drive API 429 throttling',
      'Compares MD5 checksums and timestamps against Redis to skip unchanged files',
      'Executes zero-disk binary streaming from Drive HTTP download directly to Object Storage',
      'Detects removed Drive files and flags soft-deletion in PostgreSQL'
    ],
    flows: ['all', 'drive-media'],
    upstream: ['postgres-db'],
    downstream: ['cloud-object-store', 'redis-state-store']
  },

  // Tier 4: Cognitive & Multimodal AI Tier
  {
    id: 'vehicle-grid-extractor',
    title: 'Vehicle Grid LLM Extractor',
    layer: 'Cognitive & AI Tier',
    category: 'Core AI',
    tech: 'Google Gemini 2.5 Flash / Doubao',
    sla: '~1.4s / 50-Row Chunk',
    protocol: 'HTTPS / JSON Schema',
    description: 'Cognitive LLM extraction pass deconstructing noisy auction strings, sticky date context headers, and drive folder hyperlinks.',
    responsibilities: [
      'Extracts make, multi-word model, grade, and spec codes from model strings',
      'Strictly separates drive types (4WD/AWD) from auction grades (5A/4.5B)',
      'Cascades sticky date context rows (ETD/ETA) down multi-row batches',
      'Enforces negative constraints preventing nett/promo prices from polluting base prices'
    ],
    flows: ['all', 'cognitive-nlp'],
    upstream: ['concurrency-governor'],
    downstream: ['postgres-db']
  },
  {
    id: 'comment-lifecycle-parser',
    title: 'Comment NLP Lifecycle Parser',
    layer: 'Cognitive & AI Tier',
    category: 'Core AI',
    tech: 'LLM Structured Extraction · Few-Shot Prompting',
    sla: '~620ms / Sheet',
    protocol: 'HTTPS / JSON Array',
    description: 'Domain-specific NLP engine extracting commercial booking deposits, salesperson attribution, bank loan statuses, and milestone timelines.',
    responsibilities: [
      'Disambiguates dealer slang: "LOU" identified as Letter of Undertaking (loan), never customer',
      'Normalizes Malaysian Ringgit financial shorthand: RM143k+21k into base price and import duty',
      'Generates chronological sales_events JSONB timeline (viewing, deposit, loan, full payment)',
      'Strictly avoids hallucinations with deterministic fallbacks to null'
    ],
    flows: ['all', 'cognitive-nlp'],
    upstream: ['concurrency-governor'],
    downstream: ['postgres-db']
  },

  // Tier 5: State & Persistence Tier
  {
    id: 'postgres-db',
    title: 'PostgreSQL Relational Store',
    layer: 'Data & Persistence',
    category: 'Storage',
    tech: 'PostgreSQL 16 · GORM · pgx/v5',
    sla: '< 45ms Commit',
    protocol: 'SQL / ACID Transactions',
    description: 'Relational database housing normalized vehicles, car media metadata, status change histories, and audit change logs.',
    responsibilities: [
      'Executes atomic batch upserts using COALESCE semantics to prevent metadata loss',
      'Maintains write-once lock on historical reserved_at booking timestamps',
      'Automatically transitions unsold vehicles to archived/sold status when missing',
      'Stores media metadata and soft-deletion flags in car_files table'
    ],
    flows: ['all', 'atomic-persistence', 'drive-media'],
    upstream: ['vehicle-grid-extractor', 'comment-lifecycle-parser'],
    downstream: ['media-sync-worker', 'pubsub-egress']
  },
  {
    id: 'cloud-object-store',
    title: 'Cloud Object Storage (TOS / S3)',
    layer: 'Data & Persistence',
    category: 'Storage',
    tech: 'BytePlus TOS · S3 Compatible',
    sla: '99.99% Availability',
    protocol: 'HTTPS S3 REST',
    description: 'High-durability cloud object storage holding master inventory spreadsheets and vehicle inspection photo galleries.',
    responsibilities: [
      'Stores raw Excel uploads under inventory/<timestamp>_<name>.xlsx',
      'Hosts permanent inspection image assets under {carID}/{fileID}.{ext}',
      'Serves media assets with pre-signed URLs for downstream consumers'
    ],
    flows: ['all', 'drive-media', 'manual-upload'],
    upstream: ['media-sync-worker', 'faas-ingress-daemon'],
    downstream: []
  },
  {
    id: 'redis-state-store',
    title: 'Redis State & Hash Cache',
    layer: 'Data & Persistence',
    category: 'Storage',
    tech: 'Redis 7 · go-redis/v9',
    sla: '< 2ms Latency',
    protocol: 'Redis In-Memory Key-Value',
    description: 'In-memory data store maintaining distributed execution locks, worksheet state hashes, and image MD5 cache signatures.',
    responsibilities: [
      'Maintains inventory:sync:lock distributed mutex with TTL ceiling',
      'Caches sheet JSON vehicle payloads to avoid redundant LLM invocations',
      'Tracks Google Drive file MD5 checksums and shadow timestamp keys'
    ],
    flows: ['all', 'auto-sync', 'drive-media'],
    upstream: ['split-cache-engine', 'media-sync-worker'],
    downstream: []
  },

  // Tier 6: Outbound Dispatch & Client Egress
  {
    id: 'pubsub-egress',
    title: 'Redis Pub/Sub Event Dispatcher',
    layer: 'Outbound & Client Egress',
    category: 'Egress',
    tech: 'Redis Pub/Sub Channel',
    sla: '< 5ms Fan-Out',
    protocol: 'TCP Event Broadcast',
    description: 'Event-driven broadcast dispatcher publishing inventory change events to notify consumer services immediately post-commit.',
    responsibilities: [
      'Publishes inventory:updated event containing sync run IDs and change counters',
      'Triggers immediate cache eviction in the WhatsApp Conversational AI sales engine',
      'Notifies API gateways to refresh public search and filter catalogs'
    ],
    flows: ['all', 'atomic-persistence'],
    upstream: ['postgres-db'],
    downstream: ['whatsapp-consumer']
  },
  {
    id: 'whatsapp-consumer',
    title: 'WhatsApp Conversational AI Engine',
    layer: 'Outbound & Client Egress',
    category: 'Egress',
    tech: 'Go Microservice · WhatsApp Cloud API',
    sla: 'Downstream Consumer',
    protocol: 'Internal Event & Query',
    description: 'Autonomous AI sales platform querying the latest normalized inventory and inspection photo URLs to assist car buyers.',
    responsibilities: [
      'Subscribes to inventory:updated channel to instantly bust stale vehicle caches',
      'Queries active ready_stock inventory with accurate pricing, grade, and features',
      'Dispatches high-res vehicle inspection galleries directly inside WhatsApp customer chats'
    ],
    flows: ['all', 'atomic-persistence'],
    upstream: ['pubsub-egress'],
    downstream: []
  },
  {
    id: 'smtp-alert-gateway',
    title: 'SMTP Error Alerting Gateway',
    layer: 'Outbound & Client Egress',
    category: 'Egress',
    tech: 'Go SMTP · Zap Logger',
    sla: 'Instant Notification',
    protocol: 'SMTP / TLS Email',
    description: 'Administrative notification service delivering structured diagnostic alerts upon partial or complete sync failures.',
    responsibilities: [
      'Compiles structured error diagnostics across LLM, DB, and Drive pipelines',
      'Dispatches incident summaries to system administrators with run IDs and timestamps',
      'Guarantees zero silent failures during automated serverless execution'
    ],
    flows: ['all', 'auto-sync'],
    upstream: ['concurrency-governor'],
    downstream: []
  }
];

export const INVENTORY_ETL_FLOWS: ArchitectureFlow[] = [
  {
    id: 'all',
    name: 'Complete ETL & Media System',
    badge: '15 Services',
    description: 'End-to-end view of cloud function triggers, Google Drive media synchronization, split-cache delta detection, LLM cognitive parsing, and PostgreSQL persistence.',
    activeNodeIds: [
      'cron-timer-trigger',
      'api-gateway-trigger',
      'google-sheets-source',
      'google-drive-source',
      'faas-ingress-daemon',
      'sheets-ingestor',
      'tos-excel-streamer',
      'split-cache-engine',
      'concurrency-governor',
      'media-sync-worker',
      'vehicle-grid-extractor',
      'comment-lifecycle-parser',
      'postgres-db',
      'cloud-object-store',
      'redis-state-store',
      'pubsub-egress',
      'whatsapp-consumer'
    ]
  },
  {
    id: 'auto-sync',
    name: '5-Minute Scheduled Auto-Sync & Split Cache',
    badge: 'Cron Triggered',
    description: 'Automated 5-minute synchronization from Google Sheets reading tabular rows and cell notes, evaluated against Redis split-cache hashes.',
    activeNodeIds: [
      'cron-timer-trigger',
      'google-sheets-source',
      'sheets-ingestor',
      'split-cache-engine',
      'redis-state-store',
      'concurrency-governor'
    ]
  },
  {
    id: 'manual-upload',
    name: 'Asynchronous API Gateway Ingress & Streaming',
    badge: '< 40ms Gateway ACK',
    description: 'Decoupled manual upload flow: API Gateway accepts spreadsheet uploads, acknowledges immediately with HTTP 202 Accepted, and streams into memory.',
    activeNodeIds: [
      'api-gateway-trigger',
      'faas-ingress-daemon',
      'cloud-object-store',
      'tos-excel-streamer',
      'split-cache-engine'
    ]
  },
  {
    id: 'cognitive-nlp',
    name: 'Dual-Pass Cognitive LLM Extraction & Deal Lifecycle',
    badge: 'Gemini 2.5 Flash',
    description: 'Dual-pass AI extraction parsing noisy vehicle specs with negative constraints, and converting unstructured sticky comments into typed sales lifecycles.',
    activeNodeIds: [
      'split-cache-engine',
      'concurrency-governor',
      'vehicle-grid-extractor',
      'comment-lifecycle-parser',
      'postgres-db'
    ]
  },
  {
    id: 'drive-media',
    name: 'Google Drive Media Sync & Zero-Disk Cloud Streaming',
    badge: 'Rate-Governed Pipe',
    description: 'Concurrent worker pool processing Google Drive inspection photo folders, checking Redis MD5 hashes, streaming to Cloud Storage, and tracking deletions.',
    activeNodeIds: [
      'google-drive-source',
      'postgres-db',
      'media-sync-worker',
      'redis-state-store',
      'cloud-object-store'
    ]
  },
  {
    id: 'atomic-persistence',
    name: 'Non-Destructive PostgreSQL COALESCE Upsert & Egress',
    badge: 'ACID Commit',
    description: 'Atomic batch upserts preserving historical booking data, reconciling unsold stock, and broadcasting invalidation events to downstream WhatsApp AI agents.',
    activeNodeIds: [
      'postgres-db',
      'pubsub-egress',
      'whatsapp-consumer'
    ]
  }
];

export const INVENTORY_ETL_CHALLENGES: EngineeringChallenge[] = [
  {
    title: 'Dual-Pass Split Caching vs. Silent Annotation Mutation',
    tag: 'Redis Hash / Incremental ETL',
    problem:
      'Dealership sales teams frequently add or modify commercial booking notes (e.g., adding "Booking RM1k + LOU by Coco") directly as cell comments without modifying any cell values. Standard CSV content hashing marked the sheet as unmodified, causing critical booking deposits, loan statuses, and salesperson attributions to be dropped silently.',
    tradeOff:
      'Re-running full LLM extraction across all rows on every 5-minute sync guarantees freshness but explodes LLM token bills and exhausts rate limits (TPM/RPM); skipping unchanged sheets drops revenue-critical booking data.',
    solution:
      'Engineered a Dual-Pass Split-Cache State Engine in Go. It computes two independent SHA-256 hashes: vehicleHash (tabular CSV grid) and commentsHash (lexicographically sorted cell comments). If only comments change, the service reuses cached vehicle JSON from Redis and executes only the comment AI pass. This eliminated silent metadata drops while reducing token consumption and processing duration by over 70%.'
  },
  {
    title: 'High-Volume LLM Token Exhaustion & Rate-Limit Throttling',
    tag: 'Goroutine Semaphore / Token Bucket',
    problem:
      'Dealership inventories span multiple sheets with thousands of vehicles. Firing unconstrained concurrent LLM requests to Google Gemini or Doubao immediately triggered HTTP 429: Resource Exhausted errors (Tokens-Per-Minute / Requests-Per-Minute quotas) and caused dropped rows during batch ingestion.',
    tradeOff:
      'Sequential execution avoids rate limits but causes sync operations to take 15+ minutes, exceeding serverless timeout limits; unbounded goroutine fan-out overwhelms API quotas.',
    solution:
      'Implemented a two-tier nested concurrency governor using buffered Go channels as counting semaphores: (1) Sheet-level semaphore (sheetConcurrencyLimit = 2-4) controlling simultaneous sheet analysis; (2) Chunk-level semaphore (chunkConcurrencyLimit = 4) with fixed batching (chunkSize = 50 rows). Each batch executes under a dedicated context timeout (aiTimeout = 3m) with automatic retry handling, achieving peak ingestion throughput strictly within provider quotas.'
  },
  {
    title: 'Sticky Context Header Propagation & Negative Constraint Guardrails',
    tag: 'Prompt Engineering / Deterministic Schema',
    problem:
      'Dealership spreadsheets use visual "sticky header" rows (e.g., "ETD 19/01/2026 - ETA 06/02/2026") that apply to all subsequent car rows until a new date appears. Furthermore, LLMs frequently hallucinated pricing by improperly pulling values from adjacent columns ("Nett Price" or "SDMX Price" into "Selling Price"), and conflated drive types (4WD) with auction grades (5A).',
    tradeOff:
      'Hand-written regex parsers break whenever operators adjust column orders; unconstrained LLM parsing introduces hallucinated prices and corrupted variant specifications.',
    solution:
      'Engineered a hybrid two-tier extraction pipeline: (1) An in-memory pre-processor preserves and propagates sticky date contexts across row chunks; (2) Designed structured prompts with strict Negative Constraint Rules and strict JSON Schema enforcement. The prompt explicitly prohibits populating base prices from promotional columns and isolates drive types from auction scores prior to generating strongly-typed DTOs.'
  },
  {
    title: 'Concurrent Google Drive Media Sync & Zero-Disk Cloud Streaming',
    tag: 'Google Drive API / Cloud Storage / Redis Delta',
    problem:
      'Each vehicle record references a Google Drive folder containing 10 to 30 high-resolution inspection photos. Naively downloading files to container disk exhausted ephemeral storage on serverless function runners and triggered aggressive Google Drive API rate limits (10 requests/sec limit per user). In addition, detecting renamed or deleted photos in Drive was difficult without full rescans.',
    tradeOff:
      'Serial downloading creates massive bottlenecks (10+ minutes); writing files to local disk leads to ephemeral container out-of-disk crashes; third-party transfer services incur high costs and external dependencies.',
    solution:
      'Engineered a two-tier concurrent media synchronization engine in Go: (1) Capped folder concurrency to 8 cars and file workers to 5 using errgroup.WithContext and counting semaphores; (2) Computed Redis MD5 checksum hashes (with shadow timestamp fallback) to bypass unchanged images with zero network transfer; (3) Piped binary streams directly from Google Drive HTTP response body (io.ReadCloser) into Cloud Object Storage (UploadStream) without writing a single byte to disk; (4) Tracked file deletions in Drive by comparing active file IDs against the Redis snapshot, marking removed files for soft deletion in PostgreSQL and evicting Redis cache keys.'
  },
  {
    title: 'Non-Destructive COALESCE Upsert Semantics & Write-Once Historical Audit',
    tag: 'PostgreSQL ACID / Delta Reconciliation',
    problem:
      'Once a vehicle is booked, its comment stores deposit and loan metadata. If a subsequent sync processes an updated sheet where the comment is cleared, or if a sync runs in an environment without comments, naive database upserts overwrite existing metadata with NULL, destroying historical booking, deposit, and salesperson tracking.',
    tradeOff:
      'Append-only tables make real-time inventory queries complex and slow; naive ON CONFLICT DO UPDATE statements overwrite historical data.',
    solution:
      'Crafted atomic PostgreSQL upsert queries using COALESCE across 16 sales metadata fields: COALESCE(EXCLUDED.col, cars.col) ensures EXCLUDED values apply only when new non-null data is extracted, preserving historical records. In addition, reserved_at historical booking timestamps are write-once locked (COALESCE(cars.reserved_at, EXCLUDED.reserved_at)), and vehicle status changes to Sold trigger automatic timestamp stamping via SQL CASE expressions.'
  }
];

export const INVENTORY_ETL_PIPELINE_TRACES: PipelineTraceStage[] = [
  {
    id: 'model-parsing',
    title: 'Vehicle Spec Deconstruction & Drive URL Ingestion',
    category: 'Cognitive LLM Extraction',
    badge: 'Prompt Negative Constraints',
    summary: 'Deconstructs messy auction strings into typed attributes and extracts Drive photo hyperlinks.',
    description:
      'Auction and inventory spreadsheets combine brand, multi-word model, auction score, drive configuration, and spec codes into a single cell (e.g. "T Vellfire Z Premier 4WD 6A *K1"), accompanied by Google Drive inspection photo hyperlinks. The LLM extraction pass isolates each attribute into a strongly typed schema while propagating sticky ETD/ETA context dates.',
    highlights: [
      'Separates auction grade ("6A") from drive configuration ("4WD") without regex brittleness',
      'Propagates sticky temporal context rows ("ETD 19/01/2026 - ETA 06/02/2026") across row chunks',
      'Extracts Google Drive photo folder URLs (chassis_folder_url) directly from cell hyperlinks',
      'Enforces negative constraints prohibiting nett/promo prices from polluting base selling prices'
    ],
    inputSnippet: {
      title: 'Raw Excel Cell & Hyperlink Input',
      language: 'csv',
      badge: 'Dirty Spreadsheet Row',
      code: `no,year,status,ap,model,colour,chassis_no,mileage,price,nett_price
12,2023,Available,AV*,T Vellfire Z Premier 4WD 6A *K1,Black,TAHA40-0021948,14000 km,RM 388k,RM 370k
Context Header: "ETD 19/01/2026 - ETA 06/02/2026"
Chassis Hyperlink: "https://drive.google.com/drive/folders/1aB2c3D4e5F6g7H8i9J0kLmNoP"`
    },
    outputSnippet: {
      title: 'Cognitive LLM Extraction Output',
      language: 'json',
      badge: 'Normalized Domain DTO',
      code: `{
  "brand": "Toyota",
  "model_name": "Vellfire",
  "grade": "Z Premier",
  "drive_type": "4WD",
  "engine_variant": "6A",
  "spec_code": "*K1",
  "colour": "Black",
  "chassis_no": "TAHA40-0021948",
  "mileage": 14000,
  "mileage_unit": "km",
  "price": 388000,
  "currency": "MYR",
  "etd": "2026-01-19T00:00:00Z",
  "eta": "2026-02-06T00:00:00Z",
  "chassis_folder_url": "https://drive.google.com/drive/folders/1aB2c3D4e5F6g7H8i9J0kLmNoP"
}`
    },
    backendTrace: {
      component: 'Ingestion Worker ➔ Cognitive AI Extractor (Gemini 2.5 / Doubao)',
      action: 'aiClient.Extractor.Parse(vehiclePrompt, vehicleJSONSchema)',
      latency: '1.4s / 50-row batch',
      details: 'Extracted 50 vehicle rows; parsed model strings, auction grades, and linked Drive inspection URLs into typed CarDTOs.'
    }
  },
  {
    id: 'split-cache',
    title: 'Redis Split-Cache Hash Engine & Selective Execution',
    category: 'Incremental State & Caching',
    badge: '70% Token Savings',
    summary: 'Eliminates silent drops and cuts token costs by independently hashing CSV rows and comments.',
    description:
      'Solves the silent update problem where commercial notes change without altering spreadsheet grid values. Separates vehicleHash (CSV text) from commentsHash (sorted notes). When only comments mutate, the expensive vehicle extraction pass is skipped and hydrated from Redis JSON cache in under 2ms.',
    highlights: [
      'Dual SHA-256 state hashing independently tracks grid tabular CSV and cell annotations',
      'When only comments mutate, vehicle extraction is completely bypassed',
      'Previous vehicle JSON is reloaded from Redis cache in < 2ms to hydrate downstream models',
      'Saves over 70% in LLM API token billing and cuts end-to-end sync duration in half'
    ],
    inputSnippet: {
      title: 'Worksheet State Evaluation',
      language: 'go',
      badge: 'Split Hashing Logic',
      code: `vehicleHash  := utils.HashCSV(csv)
commentsHash := utils.HashCommentsOnly(sheetComments)

cachedVHash, _ := cache.GetSheetHash(ctx, sheetName)
cachedCHash, _ := cache.GetSheetCommentsHash(ctx, sheetName)

vehiclesChanged := (cachedVHash != vehicleHash)
commentsChanged := (cachedCHash != commentsHash)`
    },
    outputSnippet: {
      title: 'Selective Orchestration Execution',
      language: 'bash',
      badge: 'Execution Log Trace',
      code: `[INFO] change detection complete total_sheets=14 changed=1
[INFO] sheet "Ready Stock AV" evaluation:
  ├─ vehicleHash:  "e3b0c44298fc1c149..." (MATCH - SKIPPED)
  └─ commentsHash: "7d1a58b2e88a4120f..." (MISMATCH - RE-PARSE)
[INFO] vehicles unchanged — loaded 82 cached vehicle rows from Redis [1.8ms]
[INFO] dispatched AI extraction for 12 changed cell comments only
[METRIC] LLM Token Savings: 74.2% · Execution Time: 820ms (vs 4.2s)`
    },
    backendTrace: {
      component: 'Sync Orchestrator ➔ Redis Split-Cache Engine',
      action: 'HashCSV(csv) vs HashCommentsOnly(comments)',
      latency: '3ms (Cache Evaluation)',
      details: 'vehicleHash [MATCH - SKIPPED], commentsHash [MISMATCH - RUN]. Reused cached JSON for 82 vehicles, queued 12 comments for LLM.'
    }
  },
  {
    id: 'comment-lifecycle',
    title: 'Unstructured Comment Parsing & Deal Timeline Engine',
    category: 'Domain NLP & Lifecycle',
    badge: '16+ Commercial Attributes',
    summary: 'Extracts booking deposits, salesperson attribution, and milestone timelines from sticky notes.',
    description:
      'Parses messy, freeform dealer shorthand and reply chains (e.g. "Booking RM1k + LOU by Coco", "SP RM143k+21k", "LOU Loan RM133k from PBB") into structured financial fields, salesperson attribution, and a chronological sales_events JSONB lifecycle.',
    highlights: [
      'Disambiguates dealer slang: "LOU" (Letter of Undertaking) is strictly identified as bank loan, never customer',
      'Financial shorthand normalization: "k" suffix converted (143k ➔ 143,000); duty addition (+21k) vs rebate deduction (-10k)',
      'Generates structured sales_events array tracking viewing, agreements, down payment, loan approval, and full payment',
      'Enforces zero-hallucination rules with deterministic fallback to null'
    ],
    inputSnippet: {
      title: 'Raw Excel Cell Comment Thread',
      language: 'markdown',
      badge: 'Dealer Annotation Thread',
      code: `2025 Pre Order NO333
Booking RM1k + LOU by Coco / Carlyn
Toyota Harrier Z 2022
MXUA80-0071718
Pre Order
SP RM143k+21k
22/1/2026
---REPLY---
LOU Loan RM133k FROM PBB
---REPLY---
Customer come on 26/02 for confirmation
Agreement sign 26/02 & Settle down Payment
---REPLY---
Full Payment done RM27193.64 & 9k CDM @27/02
FIL EIN, FP37193. PAY DUTY`
    },
    outputSnippet: {
      title: 'Structured Sales Metadata & Event Timeline',
      language: 'json',
      badge: 'Normalized Sales Record',
      code: `{
  "chassis_no": "MXUA80-0071718",
  "booking_reference": "2025 Pre Order No 333",
  "reservation_amount": 1000.00,
  "reservation_currency": "MYR",
  "reserved_at": "2026-01-22T00:00:00Z",
  "salesperson_names": "Coco, Carlyn",
  "sale_price_base": 143000.00,
  "sale_price_extra": 21000.00,
  "loan_status": "lou_approved",
  "loan_amount": 133000.00,
  "loan_bank": "PBB",
  "final_payment_amount": 37193.00,
  "final_payment_at": "2026-02-27T00:00:00Z",
  "sales_events": [
    {"at": "2026-02-26", "kind": "viewing", "raw": "Customer come on 26/02 for confirmation"},
    {"at": "2026-02-26", "kind": "agreement", "raw": "Agreement sign 26/02"},
    {"at": "2026-02-27", "kind": "full_payment", "amount": 27193.64, "raw": "Full Payment done RM27193.64"}
  ]
}`
    },
    backendTrace: {
      component: 'Comment Extractor ➔ Structured LLM Parser',
      action: 'extractCommentsWithAI(sheetName, commentsMap)',
      latency: '620ms (Prompt Inference)',
      details: 'Parsed 14 comments; extracted booking deposits, salesperson attribution, loan approval status, and structured event timelines.'
    }
  },
  {
    id: 'drive-media-sync',
    title: 'Google Drive to Cloud Object Storage Streamer',
    category: 'Media Ingestion & Cloud Storage',
    badge: 'Zero-Disk Binary Pipe',
    summary: 'Streams inspection photos from Drive to Object Storage with Redis MD5 delta deduplication.',
    description:
      'Reads Google Drive folder URLs extracted from vehicle records, queries Google Drive API, checks Redis MD5/timestamp hashes, and streams image binaries directly to Cloud Object Storage (TOS / S3) with automatic in-place rename and soft-deletion tracking.',
    highlights: [
      'Worker pool governed by 8-car semaphore and 5-worker goroutines to prevent Drive API 429 throttling',
      'Compares MD5 checksums (with timestamp shadow keys fallback) against Redis to skip unchanged images with 0-byte transfer',
      'Detects in-place renames in Drive and updates DB record immediately without re-downloading bytes',
      'Zero-disk streaming via io.ReadCloser directly from Google Drive HTTP download to Cloud Object Storage upload',
      'Automated soft-deletion (deleted_at = NOW()) in PostgreSQL for files removed from Drive, instantly evicting Redis cache'
    ],
    inputSnippet: {
      title: 'Drive Folder Sync & Delta Logic',
      language: 'go',
      badge: 'Zero-Disk Stream & Deduplication',
      code: `// Check Redis MD5 checksum before download
cachedHash, _ := cache.GetFileHash(ctx, carID, fileID)
if file.Md5Checksum != "" && cachedHash == file.Md5Checksum {
    if existing.OriginalFilename != file.Name {
        carFileRepo.UpdateFilename(fileID, file.Name) // Fast rename, 0 byte transfer
    }
    return nil // Skipped!
}

// Direct stream: Google Drive -> Cloud Object Storage
body, _ := driveProvider.DownloadFile(fileID)
defer body.Close()
ossURL, _ := ossClient.UploadStream(ctx, bucket, objectKey, body)`
    },
    outputSnippet: {
      title: 'Media Sync Run Statistics',
      language: 'bash',
      badge: 'Cloud Sync Console Trace',
      code: `🚗 STARTING MEDIA SYNC FOR CAR: 4b9e28f1-8f43-4b67... (Chassis: MXUA80-0071718)
├─ Drive Folder: "1aB2c3D4e5F6g7H8i9J0kLmNoP" (Found 18 files)
├─ Redis Hash Evaluation:
│   ├─ 14 files MATCH MD5 checksum ➔ SKIPPED (0 bytes downloaded)
│   ├─ 1 file RENAMED in Drive ➔ Updated DB record [2ms]
│   └─ 3 files NEW / MODIFIED ➔ Streamed to Object Storage [540ms]
├─ Deletion Loop:
│   └─ File "0B8x9Y...ts" no longer in Drive ➔ Soft-deleted & Redis evicted
✅ SYNC COMPLETE: 14 skipped, 3 uploaded, 1 renamed, 1 soft-deleted`
    },
    backendTrace: {
      component: 'Media Sync Service ➔ Google Drive API + Cloud Object Storage (TOS / S3)',
      action: 'SyncMultipleCarsMedia() ➔ DriveProvider.DownloadFile() ➔ OSSClient.UploadStream()',
      latency: '180ms/image (Zero-Disk Stream) · 0ms (Cache Hit)',
      details: 'Processed 38 car folders; skipped 214 unchanged images via Redis hash, uploaded 18 new inspection photos, soft-deleted 2 removed files.'
    }
  },
  {
    id: 'coalesce-upsert',
    title: 'Atomic PostgreSQL COALESCE Upsert & Downstream Egress',
    category: 'Database Persistence & Egress',
    badge: 'ACID Transactional Safety',
    summary: 'Applies atomic database updates with COALESCE to protect booking data and notifies downstream AI.',
    description:
      'Applies all changes in a single PostgreSQL transaction with COALESCE semantics to prevent comment-free syncs from blanking historical booking records, updates unsold car status, and broadcasts invalidation events to Redis Pub/Sub.',
    highlights: [
      'ON CONFLICT (chassis_no) DO UPDATE with COALESCE(EXCLUDED.col, cars.col) prevents accidental erasure of previous deposits',
      'reserved_at write-once protection: historical booking date is permanently locked once stamped',
      'Automatic status transition: CASE WHEN EXCLUDED.status = "Sold" AND cars.sold_at IS NULL THEN NOW() ELSE cars.sold_at END',
      'Status reconciliation: automatically archives units no longer present in inventory sheets',
      'Emits inventory:updated payload via Redis Pub/Sub to instantly purge stale caches across WhatsApp AI Sales agents'
    ],
    inputSnippet: {
      title: 'Atomic Upsert Query with COALESCE',
      language: 'sql',
      badge: 'PostgreSQL Upsert Clause',
      code: `INSERT INTO cars (chassis_no, model, price, booking_reference, reservation_amount, reserved_at, status)
VALUES ($1, $2, $3, $4, $5, $6, $7)
ON CONFLICT (chassis_no) DO UPDATE SET
  model                = EXCLUDED.model,
  price                = EXCLUDED.price,
  status               = EXCLUDED.status,
  booking_reference    = COALESCE(EXCLUDED.booking_reference, cars.booking_reference),
  reservation_amount   = COALESCE(EXCLUDED.reservation_amount, cars.reservation_amount),
  reserved_at          = COALESCE(cars.reserved_at, EXCLUDED.reserved_at), -- Write-once lock
  sold_at              = CASE WHEN EXCLUDED.status = 'Sold' AND cars.sold_at IS NULL THEN NOW() ELSE cars.sold_at END,
  updated_at           = CURRENT_TIMESTAMP;`
    },
    outputSnippet: {
      title: 'Event Egress & Cache Invalidation',
      language: 'json',
      badge: 'Redis Pub/Sub Payload',
      code: `{
  "event": "inventory:updated",
  "sync_run_id": "7f3b8901-d824-42f8-9a67-18349fa81bc2",
  "timestamp": "2026-10-26T11:05:42Z",
  "inserted": 4,
  "updated": 19,
  "archived": 2,
  "media_synced": 38,
  "affected_stock_types": ["ready_stock", "pre_arrival"],
  "downstream_targets": ["whatsapp-ai-sales", "core-api-service"]
}`
    },
    backendTrace: {
      component: 'Car Repository ➔ PostgreSQL 16 + Redis Pub/Sub',
      action: 'carService.WithTx().InsertCars() + redis.Publish("inventory:updated")',
      latency: '42ms (Atomic Commit) / 4ms (Pub/Sub Broadcast)',
      details: 'Committed 82 vehicle upserts inside a single ACID transaction; preserved 14 historical bookings; broadcasted cache invalidation event.'
    }
  }
];

export const INVENTORY_ETL_CASE_STUDY: CaseStudyData = {
  id: 'inventory-etl-pipeline',
  type: 'pipeline',
  title: 'LLM-Powered Inventory ETL Pipeline',
  subtitle: 'Cloud-Native Automotive Inventory Sync, Cognitive Extraction & Concurrent Media Pipeline',
  badge: 'Cloud Native Go FaaS · Serverless Architecture',
  techPills: [
    'Go 1.21+ & BytePlus Cloud Functions',
    'Google Gemini 2.5 Flash / Doubao',
    'Redis 7 Split-Cache Engine',
    'PostgreSQL 16 ACID Upsert',
    'Google Drive API & Cloud Object Storage'
  ],
  overview:
    'A high-throughput, cloud-native Go microservice running serverless on BytePlus Cloud Functions. Architected to ingest messy automotive auction spreadsheets (Google Sheets & Object Storage), execute dual-pass LLM cognitive normalization (extracting multi-word vehicle variants, sticky context rows, and 16+ commercial booking attributes from cell sticky notes), stream Google Drive inspection photos directly to Cloud Object Storage with Redis MD5 delta deduplication, and commit non-destructive ACID updates to PostgreSQL via COALESCE semantics with downstream Redis Pub/Sub event broadcasting.',
  metrics: [
    {
      stat: '5-Min',
      label: 'Sync Frequency',
      subtext: 'Automated cron trigger & async event trigger'
    },
    {
      stat: '70%+',
      label: 'Token Cost Reduction',
      subtext: 'Dual-pass Redis split-cache & incremental delta engine'
    },
    {
      stat: '< 40ms',
      label: 'FaaS Ingress ACK',
      subtext: 'Asynchronous HTTP gateway decoupling (202 Accepted)'
    },
    {
      stat: '16+',
      label: 'Sales Metadata Fields',
      subtext: 'Extracted from unstructured sticky comments & reply chains'
    },
    {
      stat: '8x Concurrency',
      label: 'Google Drive Streaming',
      subtext: 'Rate-governed binary pipe to Cloud Object Storage'
    }
  ],
  gallery: [],
  pipelineTraces: INVENTORY_ETL_PIPELINE_TRACES,
  nodes: INVENTORY_ETL_NODES,
  flows: INVENTORY_ETL_FLOWS,
  challenges: INVENTORY_ETL_CHALLENGES,
  mermaidCode: getInventoryEtlMermaidCode('dark'),
  connectorLabels: {
    tier1To2: 'Zero-Disk Streams · Cloud Function Triggers · < 40ms Response',
    tier2To3: 'Sheet Matrix Ingestion · Redis Split-Cache Delta Evaluation',
    tier3To45: 'Nested Semaphore Throttling ⇄ Cognitive LLM Normalization',
    tier45To6: 'Atomic ACID Commit ➔ Redis Pub/Sub Downstream Invalidation'
  }
};
