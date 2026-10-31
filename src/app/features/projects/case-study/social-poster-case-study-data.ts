import {
  ArchitectureNode,
  ArchitectureFlow,
  EngineeringChallenge,
  CaseStudyData,
  PipelineTraceStage
} from './case-study-data';

export function getSocialPosterMermaidCode(theme: 'light' | 'dark' = 'dark'): string {
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

  subgraph ClientStudio ["Client Tier — Poster Studio & Campaign UI"]
    StudioUI["🎨 Poster Studio & Campaign UI<br/>Theme Presets & Photo Framing"]:::edgeClass
    PostComposer["✍️ Multi-Platform Post Composer<br/>Live Preview & Char Quota Counters"]:::edgeClass
    OAuthManager["🔑 Connected Accounts Manager<br/>PKCE Handshake & Primary Selector"]:::edgeClass
  end

  subgraph IngressGateway ["API Ingress & Security Orchestration Layer"]
    APIGateway["⚡ Go / Gin REST API Gateway<br/>JWT Auth, CORS & Rate Limits"]:::ingressClass
    OAuthController["🔐 OAuth 2.0 PKCE Controller<br/>State HMAC & AES-256 Token Store"]:::ingressClass
    PresignedCoordinator["📦 Direct OSS Stream Coordinator<br/>Presigned URL & Zero-Disk Pipe"]:::ingressClass
  end

  subgraph CreativeAIEngine ["Generative Creative & Multimodal AI Studio"]
    PosterComposer["🖼️ Vector Poster Composition Engine<br/>Hero Framing & 4-Point Macro Grid"]:::aiClass
    AICaptionEngine["🤖 Multimodal AI Caption Synthesizer<br/>Gemini 2.5 / Doubao Marketing Prompt"]:::aiClass
    PayloadNormalizer["🛡️ Cross-Platform Quota Normalizer<br/>Aspect Ratio & Media Count Guard"]:::coreClass
  end

  subgraph QueueTelemetry ["Distributed Execution & Live Telemetry Core"]
    AsynqDispatcher[("⚡ Redis Asynq Worker Pool<br/>FIFO Queues & Per-Platform Limiters")]:::queueClass
    StatusPoller["⏱️ Real-Time Status Telemetry<br/>5s Cadence Short Polling & URLs"]:::queueClass
  end

  subgraph PersistenceStore ["Persistence & Cloud Storage Infrastructure"]
    PostgresStore[("🗄️ PostgreSQL 16 Enterprise Store<br/>Encrypted Tokens, Posts & Job States")]:::storageClass
    CloudObjectStore[("☁️ Cloud Object Storage (TOS / S3)<br/>Presigned Renders & High-Res Photos")]:::storageClass
    RedisCacheStore[("⚡ Redis 7 State & Cache Store<br/>Session Nonces & Mutex Worker Locks")]:::storageClass
  end

  subgraph OutboundSocial ["Omni-Channel Social Media Gateways"]
    MetaGateway["📸 Meta Graph API Gateway<br/>Instagram Carousel & FB Pages API"]:::egressClass
    TwitterGateway["🐦 X / Twitter API v2 Gateway<br/>Chunked Media Upload & Tweet API"]:::egressClass
    LinkedInGateway["💼 LinkedIn UGC Gateway<br/>Asset Registration & Community REST"]:::egressClass
  end

  %% Flow Connections
  StudioUI -->|1. Generate Poster Request| APIGateway
  APIGateway -->|Layout Specs & Styling| PosterComposer
  PosterComposer -->|Generate Presigned URL| PresignedCoordinator
  PresignedCoordinator -->|Presigned S3/TOS Target| StudioUI
  StudioUI -->|2. Stream Render Direct Zero-Disk| CloudObjectStore

  PostComposer -->|3. Request AI Caption & Hashtags| APIGateway
  APIGateway -->|Vehicle Specs & Prompt| AICaptionEngine
  AICaptionEngine -->|Platform-Adapted Copy| PostComposer

  OAuthManager <-->|OAuth 2.0 PKCE Authorize| OAuthController
  OAuthController -->|AES-256 Encrypted Tokens| PostgresStore
  OAuthController <-->|HMAC Nonces & CSRF| RedisCacheStore

  PostComposer -->|4. Publish Payload| APIGateway
  APIGateway -->|Sanitize & Validate| PayloadNormalizer
  PayloadNormalizer -->|Split Multi-Job Tasks| AsynqDispatcher
  AsynqDispatcher -->|Atomic Job States| PostgresStore

  AsynqDispatcher -->|Worker Thread 1: Meta| MetaGateway
  AsynqDispatcher -->|Worker Thread 2: X| TwitterGateway
  AsynqDispatcher -->|Worker Thread 3: LinkedIn| LinkedInGateway

  MetaGateway -->|Pull Media Stream| CloudObjectStore
  TwitterGateway -->|Chunked Media Append| CloudObjectStore
  LinkedInGateway -->|UGC Binary Ingestion| CloudObjectStore

  MetaGateway -->|Return Live Post URL| StatusPoller
  TwitterGateway -->|Return Tweet Deep Link| StatusPoller
  LinkedInGateway -->|Return UGC Activity URL| StatusPoller

  StatusPoller -->|Write Success / Error| PostgresStore
  PostComposer <-->|5. Short Polling 5s Cadence| StatusPoller`;
}

export const SOCIAL_POSTER_NODES: ArchitectureNode[] = [
  // Tier 1: Client & External Edge
  {
    id: 'poster-studio-ui',
    title: 'Poster Studio & Campaign UI',
    layer: 'Ingress & Decoupling',
    category: 'Edge',
    tech: 'Web Management Console · Reactive State · REST Client',
    sla: '< 16ms Frame Render (60 FPS)',
    protocol: 'HTTPS / REST / Presigned S3',
    description:
      'Web-based marketing console featuring dynamic car photo selection, 5 curated branding themes (Dark Prestige, Clean Minimal, Bold Sport, Midnight Blue, Carbon Edition), real-time post previews, and direct object storage upload bypassing backend memory.',
    responsibilities: [
      'Interactive 5-point photo selection: 1 Cover Hero + 4-Point Macro Detail Grid (Interior, Cockpit, Wheels, Engine)',
      'Multi-platform post composition with live character countdowns (Twitter 280 vs Instagram 2,200 chars)',
      'Direct cloud storage upload using time-bounded presigned URLs bypassing backend memory',
      'Real-time publishing status polling with exponential backoff and dynamic deep-link generation'
    ],
    flows: ['flow-poster-creation', 'flow-caption-ai', 'flow-async-publish', 'flow-telemetry-polling'],
    upstream: [],
    downstream: ['api-ingress-gateway', 'cloud-object-store']
  },
  {
    id: 'api-ingress-gateway',
    title: 'Go / Gin REST Ingress Gateway',
    layer: 'Ingress & Decoupling',
    category: 'Ingress',
    tech: 'Go 1.22 · Gin Web Engine · Uber Zap · JWT Guard',
    sla: '< 30ms Ingress P99',
    protocol: 'RESTful JSON / HTTPS',
    description:
      'High-throughput microservice entry point managing API route registration, JWT session verification, CORS policy enforcement, rate limiting, and request decoupling.',
    responsibilities: [
      'Authenticates sales representatives via secure JWT cookies and RBAC permissions',
      'Validates multi-platform payload schemas before passing tasks to background workers',
      'Exposes presigned URL generation endpoints for direct zero-disk client storage uploads',
      'Emits structured request audit logs to Uber Zap for centralized operational tracing'
    ],
    flows: ['flow-poster-creation', 'flow-caption-ai', 'flow-async-publish'],
    upstream: ['poster-studio-ui'],
    downstream: ['generative-poster-engine', 'ai-caption-synthesizer', 'cross-platform-normalizer']
  },
  {
    id: 'oauth-pkce-controller',
    title: 'OAuth 2.0 PKCE Multi-Tenant Token Controller',
    layer: 'Ingress & Decoupling',
    category: 'Ingress',
    tech: 'OAuth 2.0 PKCE · SHA-256 · AES-256 GCM · HMAC',
    sla: '< 50ms State Validation',
    protocol: 'HTTPS OAuth Handshake / REST',
    description:
      'Centralized identity broker orchestrating multi-tenant authorization handshakes with Twitter/X, Meta (Facebook & Instagram), and LinkedIn with cryptographic CSRF nonces and silent token rotation.',
    responsibilities: [
      'Generates high-entropy PKCE code verifiers and SHA-256 challenge digests for Twitter API v2',
      'Validates callback state parameters using HMAC signatures to defeat replay and MITM attacks',
      'Encrypts access tokens at rest using AES-256 GCM before committing to PostgreSQL',
      'Executes silent background token refreshes 5 minutes prior to expiry without user disruption'
    ],
    flows: ['flow-oauth-lifecycle', 'flow-async-publish'],
    upstream: ['poster-studio-ui', 'api-ingress-gateway'],
    downstream: ['postgres-relational-store', 'redis-state-store']
  },

  // Tier 2: Processing & Creative AI Core
  {
    id: 'generative-poster-engine',
    title: 'Multimodal Vector Poster Composition Engine',
    layer: 'Processing & Orchestration',
    category: 'Core AI',
    tech: 'Go 1.22 · Graphics Engine · Dynamic Layout Geometry',
    sla: '< 850ms / Rendered Page',
    protocol: 'In-Memory Canvas Pipeline',
    description:
      'Automated automotive marketing graphic generator that compiles raw photography, vehicle catalog attributes, and visual branding themes into high-resolution multi-page promotional posters.',
    responsibilities: [
      'Synthesizes 2-page marketing layouts: Page 1 Cover Hero banner + Page 2 Technical Specification Matrix',
      'Applies curated color palettes: Dark Prestige (midnight gold), Bold Sport (vivid racing red), Carbon Edition (matte charcoal)',
      'Calculates dynamic geometric placement for 4-point macro inspection highlights without visual clipping',
      'Produces web-optimized vertical carousel banners (1080x1350) and landscape display assets'
    ],
    flows: ['flow-poster-creation'],
    upstream: ['api-ingress-gateway'],
    downstream: ['presigned-stream-coordinator', 'postgres-relational-store']
  },
  {
    id: 'presigned-stream-coordinator',
    title: 'Presigned Direct Cloud Storage Coordinator',
    layer: 'Processing & Orchestration',
    category: 'Ingress',
    tech: 'BytePlus TOS / AWS S3 SDK · HMAC-SHA256 Signer',
    sla: '< 25ms URL Generation',
    protocol: 'S3 Presigned REST API',
    description:
      'Zero-bandwidth storage coordinator generating time-bounded, cryptographically signed PUT URLs allowing the client UI to stream multi-megabyte image assets directly to Object Storage.',
    responsibilities: [
      'Issues 15-minute scoped presigned upload URLs with exact Content-Type and SHA-256 checksum constraints',
      'Eliminates backend memory saturation and socket exhaustion during concurrent poster generation',
      'Handles cross-origin isolation headers to ensure seamless client browser downloads without CORS errors'
    ],
    flows: ['flow-poster-creation'],
    upstream: ['generative-poster-engine'],
    downstream: ['cloud-object-store', 'poster-studio-ui']
  },
  {
    id: 'ai-caption-synthesizer',
    title: 'Cognitive AI Caption & Hashtag Synthesizer',
    layer: 'Processing & Orchestration',
    category: 'Core AI',
    tech: 'Google Gemini 2.5 Flash / Doubao LLM · Prompt Engineering',
    sla: '< 650ms LLM Inference',
    protocol: 'gRPC / HTTPS REST',
    description:
      'Multimodal contextual prompt engine that ingests structured vehicle specifications (make, model, year, transmission, price, fuel) and user marketing intent to synthesize persuasive social media copy.',
    responsibilities: [
      'Tailors caption voice and tone across commercial personas (Luxury Prestige, Promotional Urgency, Technical Showcase)',
      'Strictly enforces platform-specific character limits (280 chars for Twitter vs 2,200 chars for Instagram)',
      'Generates contextual, high-performing automotive hashtag clusters (#Supercars #ToyotaHarrier #DealershipPromo)',
      'Maintains zero hallucination guardrails preventing false price or mileage assertions'
    ],
    flows: ['flow-caption-ai'],
    upstream: ['api-ingress-gateway'],
    downstream: ['poster-studio-ui', 'postgres-relational-store']
  },
  {
    id: 'cross-platform-normalizer',
    title: 'Omni-Channel Media & Quota Enforcer',
    layer: 'Processing & Orchestration',
    category: 'Core AI',
    tech: 'Go Normalization Engine · Image Metadata Inspector',
    sla: '< 15ms Validation Time',
    protocol: 'Internal Go Routine',
    description:
      'Platform compatibility validator that intercepts unified publishing payloads and translates them into network-specific compliance structures before enqueuing execution jobs.',
    responsibilities: [
      'Enforces platform media bounds: Twitter max 4 images, Instagram max 10 carousel slides, LinkedIn UGC single/multi asset',
      'Verifies image aspect ratios (1:1 square, 4:5 vertical, 1.91:1 landscape) to prevent automated social API rejections',
      'Splits monolithic publishing requests into decoupled per-platform asynchronous worker tasks'
    ],
    flows: ['flow-async-publish'],
    upstream: ['api-ingress-gateway'],
    downstream: ['asynq-dispatch-core']
  },

  // Tier 3: Distributed Queue & Telemetry
  {
    id: 'asynq-dispatch-core',
    title: 'Redis Asynq Distributed Worker Dispatcher',
    layer: 'Processing & Orchestration',
    category: 'Queue',
    tech: 'Hibiken Asynq · Redis 7 · Concurrency Semaphore Pool',
    sla: 'Sub-millisecond Task Enqueue',
    protocol: 'Redis Protocol (RESP)',
    description:
      'Resilient background task orchestration engine executing parallel social publishing jobs with independent rate limiters, exponential retry backoff, and partial failure isolation.',
    responsibilities: [
      'Isolates platform execution: failure on Twitter API does not halt concurrent Meta or LinkedIn worker routines',
      'Enforces platform-specific throughput quotas: Meta 200 calls/hr, Twitter 50 tweets/15-min, LinkedIn 100/day',
      'Applies exponential backoff with jitter (5s, 30s, 2m, 10m) upon transient upstream network timeouts',
      'Maintains idempotent task execution IDs preventing duplicate posts on social feeds'
    ],
    flows: ['flow-async-publish'],
    upstream: ['cross-platform-normalizer'],
    downstream: ['meta-graph-publisher', 'x-twitter-publisher', 'linkedin-ugc-publisher', 'postgres-relational-store']
  },
  {
    id: 'job-status-poller',
    title: 'Real-Time Publishing Telemetry & Deep Link Engine',
    layer: 'Processing & Orchestration',
    category: 'Queue',
    tech: 'Go Microservice · PostgreSQL Indexed Lookups · Status Service',
    sla: '< 20ms Query Latency · 5s Polling Interval',
    protocol: 'RESTful Short Polling / HTTPS',
    description:
      'Live execution telemetry pipeline allowing client interfaces to observe per-platform progress and instantly obtain clickable deep links to published social media posts.',
    responsibilities: [
      'Queries composite indexed status tables: (user_id, status) with batch size limit 100 to prevent database locks',
      'Aggregates individual platform job states into unified status model (PENDING, PUBLISHING, PUBLISHED, FAILED)',
      'Resolves external platform post identifiers into canonical deep URLs (e.g., https://instagram.com/p/..., https://x.com/status/...)',
      'Signals completion to client UI to trigger auto-dismissal and success toast alerts'
    ],
    flows: ['flow-telemetry-polling'],
    upstream: ['meta-graph-publisher', 'x-twitter-publisher', 'linkedin-ugc-publisher'],
    downstream: ['postgres-relational-store', 'poster-studio-ui']
  },

  // Tier 4: Storage & Persistence
  {
    id: 'postgres-relational-store',
    title: 'PostgreSQL 16 Enterprise Relational Store',
    layer: 'Data & Persistence',
    category: 'Storage',
    tech: 'PostgreSQL 16 · GORM · AES-256 Encrypted Columns',
    sla: '< 10ms Transaction Commit',
    protocol: 'PostgreSQL Wire Protocol',
    description:
      'ACID relational datastore managing vehicle inventory specifications, generated poster metadata, encrypted OAuth credentials, and comprehensive social publishing audit logs.',
    responsibilities: [
      'Stores AES-256 encrypted access tokens and refresh tokens in user_social_tokens table',
      'Records parent posts and granular child job rows tracking individual platform outcomes and error traces',
      'Maintains vehicle brochure status with correlated subqueries enabling real-time UI inventory filtering',
      'Guarantees foreign key integrity and point-in-time recovery for marketing audit compliance'
    ],
    flows: ['flow-poster-creation', 'flow-oauth-lifecycle', 'flow-async-publish', 'flow-telemetry-polling'],
    upstream: ['oauth-pkce-controller', 'generative-poster-engine', 'asynq-dispatch-core', 'job-status-poller'],
    downstream: []
  },
  {
    id: 'cloud-object-store',
    title: 'Cloud Object Storage (BytePlus TOS / S3 Bucket)',
    layer: 'Data & Persistence',
    category: 'Storage',
    tech: 'BytePlus TOS / AWS S3 Compatible · Global CDN Cache',
    sla: '99.99% Availability · Sub-150ms Stream Delivery',
    protocol: 'HTTPS REST S3 API',
    description:
      'Highly scalable object storage hosting multi-resolution automotive photography, inspection albums, and high-fidelity vector brochure renders accessible via time-bounded presigned URLs.',
    responsibilities: [
      'Stores high-res generated promotional poster images with zero local disk overhead',
      'Serves public binary CDN streams for social media scraper bots (Meta Graph, Twitter, LinkedIn)',
      'Enforces bucket lifecycle policies for automatic archiving of temporary staging assets'
    ],
    flows: ['flow-poster-creation', 'flow-async-publish'],
    upstream: ['poster-studio-ui', 'presigned-stream-coordinator'],
    downstream: ['meta-graph-publisher', 'x-twitter-publisher', 'linkedin-ugc-publisher']
  },
  {
    id: 'redis-state-store',
    title: 'Redis 7 Distributed Mutex & State Cache',
    layer: 'Data & Persistence',
    category: 'Storage',
    tech: 'Redis 7 · In-Memory Key-Value · TTL Eviction',
    sla: '< 2ms Response Latency',
    protocol: 'RESP',
    description:
      'Sub-millisecond state cache managing temporary OAuth PKCE code verifiers, CSRF state tokens, distributed worker mutex locks, and platform rate limit counters.',
    responsibilities: [
      'Stores 10-minute expiring OAuth state HMAC signatures to prevent cross-site request forgery attacks',
      'Provides distributed Redlock mutex primitives preventing duplicate concurrent publishing dispatches',
      'Caches platform visibility toggles and active user preferences for rapid UI retrieval'
    ],
    flows: ['flow-oauth-lifecycle', 'flow-async-publish'],
    upstream: ['oauth-pkce-controller', 'asynq-dispatch-core'],
    downstream: []
  },

  // Tier 5: Outbound Social Media Gateways
  {
    id: 'meta-graph-publisher',
    title: 'Meta Graph API Gateway (Instagram & Facebook)',
    layer: 'Outbound & Client Egress',
    category: 'Egress',
    tech: 'Meta Graph API v19.0 · Content Publishing API · Pages Feed',
    sla: '< 8s Carousel Publish',
    protocol: 'HTTPS REST / OAuth Bearer',
    description:
      'Outbound integration handling Facebook Page feed publications and multi-step Instagram Carousel Container generation, status checking, and final release.',
    responsibilities: [
      'Orchestrates 2-phase Instagram Carousel: creates individual item containers, polls container status, creates carousel container, and triggers publishing release',
      'Publishes rich multi-photo photo albums and status updates to connected Facebook Business Pages',
      'Extracts official post permalinks (e.g. https://www.instagram.com/p/{shortcode}) for live client verification'
    ],
    flows: ['flow-async-publish', 'flow-telemetry-polling'],
    upstream: ['asynq-dispatch-core'],
    downstream: ['job-status-poller']
  },
  {
    id: 'x-twitter-publisher',
    title: 'Twitter / X API v2 Chunked Media & Tweet Gateway',
    layer: 'Outbound & Client Egress',
    category: 'Egress',
    tech: 'Twitter API v2 · OAuth 2.0 User Context · Chunked Media Upload',
    sla: '< 4s Tweet Dispatch',
    protocol: 'HTTPS REST / JSON',
    description:
      'Dedicated integration client managing 3-step chunked media uploads (INIT, APPEND, FINALIZE) and status dispatching adhering to strict 280-character and 4-image limits.',
    responsibilities: [
      'Executes chunked media uploads to upload.twitter.com with automated media category categorization',
      'Attaches up to 4 validated media IDs to the Tweet creation payload via POST /2/tweets',
      'Captures tweet ID and constructs canonical URL (https://x.com/{username}/status/{id})'
    ],
    flows: ['flow-async-publish', 'flow-telemetry-polling'],
    upstream: ['asynq-dispatch-core'],
    downstream: ['job-status-poller']
  },
  {
    id: 'linkedin-ugc-publisher',
    title: 'LinkedIn UGC & Community Management Gateway',
    layer: 'Outbound & Client Egress',
    category: 'Egress',
    tech: 'LinkedIn REST API · UGC Post API · Digital Asset Register',
    sla: '< 5s UGC Publish',
    protocol: 'HTTPS REST / OAuth 2.0 Bearer',
    description:
      'Enterprise business network integration managing digital media asset registration, binary upload streaming, and multi-image UGC post creation for corporate vehicle showcases.',
    responsibilities: [
      'Registers image assets via /v2/assets?action=registerUpload obtaining single-use upload URLs',
      'Streams high-res vehicle brochure binaries into LinkedIn media storage with byte-range headers',
      'Constructs ugcPosts with author organization URN and rich commentary styling'
    ],
    flows: ['flow-async-publish', 'flow-telemetry-polling'],
    upstream: ['asynq-dispatch-core'],
    downstream: ['job-status-poller']
  }
];

export const SOCIAL_POSTER_FLOWS: ArchitectureFlow[] = [
  {
    id: 'flow-poster-creation',
    name: 'End-to-End Poster Synthesis & Direct OSS Upload',
    badge: 'Zero-Disk Pipeline',
    description:
      'Salesperson picks a vehicle, selects 1 cover photo + 4 detail macro shots, selects an aesthetic theme (e.g. Dark Prestige), generates vector layouts, and streams renders directly to Object Storage via presigned URLs.',
    activeNodeIds: [
      'poster-studio-ui',
      'api-ingress-gateway',
      'generative-poster-engine',
      'presigned-stream-coordinator',
      'cloud-object-store',
      'postgres-relational-store'
    ]
  },
  {
    id: 'flow-caption-ai',
    name: 'Multimodal AI Caption & Hashtag Synthesis',
    badge: 'Cognitive LLM',
    description:
      'Sales representative inputs a brief marketing angle. The engine compiles vehicle specifications, invokes Gemini 2.5 / Doubao LLM, and formats platform-constrained copy with automated hashtag clusters.',
    activeNodeIds: [
      'poster-studio-ui',
      'api-ingress-gateway',
      'ai-caption-synthesizer',
      'postgres-relational-store'
    ]
  },
  {
    id: 'flow-oauth-lifecycle',
    name: 'Multi-Tenant OAuth 2.0 PKCE Connection & Silent Refresh',
    badge: 'Zero-Trust Security',
    description:
      'Sales reps connect social media accounts via secure OAuth 2.0 PKCE authorization flows. State HMACs prevent CSRF; credentials are stored with AES-256 GCM encryption and refreshed silently.',
    activeNodeIds: [
      'poster-studio-ui',
      'api-ingress-gateway',
      'oauth-pkce-controller',
      'redis-state-store',
      'postgres-relational-store'
    ]
  },
  {
    id: 'flow-async-publish',
    name: 'Asynchronous Multi-Platform Social Dispatch & Rate Limiting',
    badge: 'Redis Asynq Workers',
    description:
      'Unified post submission is validated against network quotas, decomposed into platform-specific tasks, and dispatched through Redis Asynq workers with isolated rate limiters.',
    activeNodeIds: [
      'poster-studio-ui',
      'api-ingress-gateway',
      'cross-platform-normalizer',
      'asynq-dispatch-core',
      'meta-graph-publisher',
      'x-twitter-publisher',
      'linkedin-ugc-publisher',
      'cloud-object-store',
      'postgres-relational-store'
    ]
  },
  {
    id: 'flow-telemetry-polling',
    name: 'Live Job Polling & Social Deep Link Resolution',
    badge: 'Real-Time Telemetry',
    description:
      'Client executes short polling at 5s intervals. Status engine tracks worker lifecycle and captures final post URLs, presenting verified direct links to live posts on Instagram, X, Facebook, and LinkedIn.',
    activeNodeIds: [
      'poster-studio-ui',
      'job-status-poller',
      'postgres-relational-store',
      'meta-graph-publisher',
      'x-twitter-publisher',
      'linkedin-ugc-publisher'
    ]
  }
];

export const SOCIAL_POSTER_PIPELINE_TRACES: PipelineTraceStage[] = [
  {
    id: 'asset-framing',
    title: 'Vehicle Ingestion & Dynamic Multi-Point Framing',
    category: 'Asset Ingestion & Geometry',
    badge: '5-Point Visual Selection',
    summary: 'Ingests raw dealership photography and applies 5-point dynamic framing rules.',
    description:
      'Translates unorganized photo libraries (18+ raw dealer inspection photos) into a curated 5-point automotive marketing schema: 1 dynamic Cover Hero photo for high-impact social cards + 4 macro detail highlights (interior cockpit, alloy wheels, center console, and engine bay) for the technical specification page.',
    highlights: [
      'Extracts vehicle specifications directly from relational inventory catalog (Year, Make, Model, Variant, Transmission, Price)',
      'Filters raw car file attachments by file_type === "IMAGE" and renders responsive preview cards for selection',
      'Enforces strict visual invariants: exactly 1 Cover image and 1-4 detail highlights before unlocking composition',
      'Zero local memory footprint: operates solely on presigned cloud storage image URLs'
    ],
    inputSnippet: {
      title: 'Vehicle Catalog Record & Attached File Pool',
      language: 'json',
      badge: 'Relational Vehicle Entity',
      code: `{
  "id": "c7a8e234-9012-4d8b-b152-6f29e18b4592",
  "chassisNo": "MXUA80-0071718",
  "make": "Toyota",
  "carModel": "Harrier",
  "variant": "2.0 Z Leather Package",
  "manufactureYear": "2022",
  "colour": "Precious Black Pearl",
  "price": 164000.00,
  "carFiles": [
    {"id": "file_01", "file_type": "IMAGE", "file_url": "https://cdn.platform.com/cars/c7a8.../front-three-quarter.webp"},
    {"id": "file_02", "file_type": "IMAGE", "file_url": "https://cdn.platform.com/cars/c7a8.../cockpit-steering.webp"},
    {"id": "file_03", "file_type": "IMAGE", "file_url": "https://cdn.platform.com/cars/c7a8.../alloy-wheel-19in.webp"},
    {"id": "file_04", "file_type": "IMAGE", "file_url": "https://cdn.platform.com/cars/c7a8.../rear-panoramic.webp"},
    {"id": "file_05", "file_type": "IMAGE", "file_url": "https://cdn.platform.com/cars/c7a8.../engine-bay.webp"}
  ]
}`
    },
    outputSnippet: {
      title: 'Curated 5-Point Composition Schema',
      language: 'json',
      badge: 'Curated Visual DTO',
      code: `{
  "car_id": "c7a8e234-9012-4d8b-b152-6f29e18b4592",
  "page1_image_ids": ["file_01"],
  "page2_image_ids": ["file_02", "file_03", "file_04", "file_05"],
  "selected_style": "dark_prestige",
  "geometry": {
    "page1_hero_aspect": "16:9_cover_crop",
    "page2_detail_grid": "2x2_macro_cluster",
    "overlay_contrast": "midnight_scrim_alpha_0.65"
  }
}`
    },
    backendTrace: {
      component: 'Poster Studio UI ➔ Ingress Gateway',
      action: 'CreateBrochure.buildImages() ➔ toggleDetail() ➔ selectStyle()',
      latency: '120ms (Interactive Selection)',
      details: 'Evaluated 18 inspection photos; confirmed 1 Cover Hero and 4 macro detail shots; assigned Dark Prestige theme palette.'
    }
  },
  {
    id: 'poster-synthesis',
    title: 'Multimodal Poster Composition & Direct OSS Streaming',
    category: 'Generative Studio & Cloud Storage',
    badge: 'Zero-Disk Binary Pipe',
    summary: 'Renders high-resolution vector posters and streams directly to Cloud Storage via presigned URLs.',
    description:
      'The Go backend compiles dynamic typographic vectors, color tokens, and vehicle specification tables onto raw photography. Renders are uploaded directly from the client to Cloud Object Storage (BytePlus TOS / S3) using presigned URLs with an interceptor-free bare HTTP client, completely bypassing backend memory overhead and CORS preflight blocks.',
    highlights: [
      '5 bespoke design themes: Dark Prestige (midnight gold), Clean White (editorial slate), Bold Sport (vivid red), Midnight Blue (deep navy), Carbon Edition (charcoal)',
      'Vector typography rendering with automatic font scaling to prevent chassis number or model name truncation',
      'Interceptor-free bare HTTP client: removes custom authorization headers that cause CORS preflight failures on S3/TOS buckets',
      'Presigned upload tokens cryptographically restricted to 15-minute expiration and exact SHA-256 hash digests'
    ],
    inputSnippet: {
      title: 'Brochure Generation Request Payload',
      language: 'json',
      badge: 'POST /car/brochure',
      code: `{
  "car_id": "c7a8e234-9012-4d8b-b152-6f29e18b4592",
  "page1_image_ids": ["file_01"],
  "page2_image_ids": ["file_02", "file_03", "file_04", "file_05"],
  "style": "dark_prestige"
}`
    },
    outputSnippet: {
      title: 'Presigned Cloud Object Storage Target & URLs',
      language: 'json',
      badge: 'Generated Poster Artifacts',
      code: `{
  "brochure_id": "brochure_91a0f8c2_2026",
  "style": "dark_prestige",
  "page1_url": "https://tos.cloud.service.com/brochures/91a0/page_1_cover.webp",
  "page2_url": "https://tos.cloud.service.com/brochures/91a0/page_2_specs.webp",
  "direct_upload_meta": {
    "signed_method": "PUT",
    "expires_seconds": 900,
    "bypass_cors_credentials": true
  }
}`
    },
    backendTrace: {
      component: 'Go Generative Engine ➔ Cloud Storage Coordinator',
      action: 'BrochureService.generateBrochure() ➔ OSSClient.UploadPresigned()',
      latency: '850ms / Page (Vector Rasterization & Stream)',
      details: 'Composed 2 high-res poster pages (1080x1350); applied midnight gradient scrim; streamed binary to Object Storage without disk I/O.'
    }
  },
  {
    id: 'ai-caption-synthesis',
    title: 'Cognitive Multimodal AI Caption & Hashtag Synthesis',
    category: 'Cognitive LLM & Prompt Engineering',
    badge: 'Platform Character Adaptation',
    summary: 'Synthesizes platform-constrained, high-converting social copy and hashtag clusters using Gemini 2.5.',
    description:
      'Ingests structured vehicle specifications and sales campaign instructions, invoking Google Gemini 2.5 Flash / Doubao LLM to author platform-adapted marketing copy. The prompt enforces strict character caps (280 chars for Twitter/X vs 2,200 chars for Instagram/Facebook) while dynamically generating targeted automotive hashtag clusters.',
    highlights: [
      'Extracts commercial vehicle attributes (Year, Make, Model, Variant, Transmission, Price, Fuel) into structured context',
      'Negative constraint mapping prevents LLM hallucination of unlisted features, inaccurate pricing, or fictitious warranties',
      'Adaptive length enforcer automatically truncates Twitter copy to sub-280 chars while expanding Instagram captions with descriptive bullets',
      'Contextual hashtag generator outputs high-velocity automotive tags: #ToyotaHarrier #SUVDeals #ReconCars'
    ],
    inputSnippet: {
      title: 'Prompt Context & Vehicle Input Payload',
      language: 'json',
      badge: 'POST /social/captions/suggest',
      code: `{
  "car_id": "c7a8e234-9012-4d8b-b152-6f29e18b4592",
  "platforms": ["instagram", "facebook", "x", "linkedin"],
  "user_comments": "Highlight pristine condition, full leather interior, and weekend special promotional discount."
}`
    },
    outputSnippet: {
      title: 'Synthesized Multi-Platform Marketing Copy',
      language: 'json',
      badge: 'LLM Synthesized Output',
      code: `{
  "caption": "🔥 Weekend Spotlight: 2022 Toyota Harrier 2.0 Z Leather Package\\n\\nTurn heads with pristine luxury. Finished in Precious Black Pearl with full premium leather upholstery, panoramic styling, and 19-inch alloys. Fully inspected, certified mileage, and available for immediate viewing.\\n\\n💰 Special Promo Price: RM 164,000\\n📍 Ready Stock — Schedule your private test drive today!",
  "hashtags": [
    "ToyotaHarrier",
    "LuxurySUV",
    "PreciousBlack",
    "HarrierZ",
    "CarDeals",
    "WeekendPromo"
  ]
}`
    },
    backendTrace: {
      component: 'AI Caption Synthesizer ➔ Google Gemini 2.5 / Doubao LLM',
      action: 'socialService.suggestCaption(payload) ➔ LLM.GenerateContent()',
      latency: '650ms (Cognitive Prompt Inference)',
      details: 'Extracted vehicle specs; adapted copy for Twitter (280 char limit) and Instagram (long-form bullets); generated 6 targeted hashtags.'
    }
  },
  {
    id: 'compliance-validation',
    title: 'Omni-Channel Quota & Media Compliance Validation',
    category: 'API Normalization & Security Preflight',
    badge: 'Preflight Quota Guard',
    summary: 'Normalizes media assets and validates OAuth 2.0 PKCE tokens across all target platforms.',
    description:
      'Performs deterministic preflight validation across the 4 social networks. Reconciles media count quotas (Twitter strictly max 4 images, Instagram max 10 carousel slides, Facebook photo albums, LinkedIn UGC), validates image aspect ratios (1:1, 4:5, 16:9), and verifies OAuth token freshness before background enqueuing.',
    highlights: [
      'Multi-platform quota enforcement: splits and filters image arrays according to destination constraints before dispatch',
      'Character length guardrail: dynamically validates platform character allowances in real time and flags oversized text prior to submission',
      'OAuth 2.0 token preflight: inspects token_expires_at; triggers silent refresh if token is within 5 minutes of expiration',
      'Composite issue aggregator: flags missing vehicles, empty captions, or disconnected account credentials in real time'
    ],
    inputSnippet: {
      title: 'Unified Social Publish Payload',
      language: 'json',
      badge: 'POST /social/publish',
      code: `{
  "platforms": ["instagram", "facebook", "x", "linkedin"],
  "description": "🔥 Weekend Spotlight: 2022 Toyota Harrier 2.0 Z... [Full text]",
  "hashtags": ["ToyotaHarrier", "LuxurySUV", "CarDeals"],
  "car_id": "c7a8e234-9012-4d8b-b152-6f29e18b4592",
  "brochure_id": "brochure_91a0f8c2_2026",
  "asset_ids": ["file_01", "file_02", "file_03", "file_04", "file_05"]
}`
    },
    outputSnippet: {
      title: 'Platform Normalized Job Matrix',
      language: 'json',
      badge: 'Normalized Worker Tasks',
      code: `{
  "post_id": "post_7e3a98c1",
  "normalized_jobs": [
    {"platform": "instagram", "type": "carousel", "media_count": 2, "char_count": 312, "token_valid": true},
    {"platform": "facebook", "type": "album", "media_count": 2, "char_count": 312, "token_valid": true},
    {"platform": "x", "type": "tweet_media", "media_count": 2, "char_count": 248, "token_valid": true},
    {"platform": "linkedin", "type": "ugc_post", "media_count": 2, "char_count": 312, "token_valid": true}
  ]
}`
    },
    backendTrace: {
      component: 'Cross-Platform Normalizer ➔ OAuth PKCE Controller',
      action: 'socialService.publishPost() ➔ normalizePlatformPayloads()',
      latency: '45ms (Quota & Preflight Check)',
      details: 'Validated 4 target platforms; verified OAuth token expiry for all accounts; verified media limits (2 poster pages <= max limits).'
    }
  },
  {
    id: 'async-social-dispatch',
    title: 'Distributed Asynchronous Dispatch & Live Multi-Job Polling',
    category: 'Distributed Queues & Social Gateway',
    badge: 'Redis Asynq Multi-Job Worker',
    summary: 'Dispatches decoupled Redis worker tasks and exposes short-polling telemetry with deep link generation.',
    description:
      'Enqueues independent Asynq worker tasks per platform in Redis, preventing a failure on Twitter or LinkedIn from impacting Meta publishing. Workers handle chunked media uploads, container polling, and final post releases. The frontend executes 5-second short polling to render live execution telemetry and extract clickable post URLs.',
    highlights: [
      'Decoupled Redis Asynq workers: each platform runs in an isolated goroutine with its own retry backoff and rate limiter',
      'Meta Graph 2-phase container workflow: creates Instagram item containers, polls container status, triggers carousel release',
      'Twitter API v2 chunked media upload: executes INIT, APPEND, and FINALIZE stages before publishing the tweet status',
      'Short-polling telemetry pipeline: 5000ms cadence, max 60 attempts, batch-size 100 queries, auto-dismissing on completion',
      'Dynamic deep-link resolution: converts platform IDs into direct URLs (https://instagram.com/p/..., https://x.com/status/...)'
    ],
    inputSnippet: {
      title: 'Asynq Worker Task Definition & Queue Entry',
      language: 'go',
      badge: 'Redis Asynq Task',
      code: `// Enqueue decoupled per-platform publish jobs
for _, platform := range payload.Platforms {
    taskPayload, _ := json.Marshal(SocialPublishJob{
        PostID:    post.ID,
        Platform:  platform,
        AccountID: accountMap[platform].ID,
        MediaURLs: mediaURLs,
        Caption:   adaptedCaption[platform],
    })
    
    task := asynq.NewTask("social:publish:"+platform, taskPayload,
        asynq.MaxRetry(3),
        asynq.Timeout(2*time.Minute),
        asynq.Queue("social_publishing"),
    )
    asynqClient.Enqueue(task)
}`
    },
    outputSnippet: {
      title: 'Real-Time Job Telemetry & Resolved Deep Links',
      language: 'json',
      badge: 'GET /social/posts Response',
      code: `{
  "post_id": "post_7e3a98c1",
  "status": "PUBLISHED",
  "jobs": [
    {
      "platform": "instagram",
      "status": "PUBLISHED",
      "result_post_id": "1802938491820491",
      "result_url": "https://www.instagram.com/p/DGH38a9sK_1/"
    },
    {
      "platform": "facebook",
      "status": "PUBLISHED",
      "result_post_id": "104928172948192",
      "result_url": "https://www.facebook.com/104928172948192/posts/18293849102"
    },
    {
      "platform": "x",
      "status": "PUBLISHED",
      "result_post_id": "1892837491029384712",
      "result_url": "https://x.com/DealershipGlobal/status/1892837491029384712"
    },
    {
      "platform": "linkedin",
      "status": "PUBLISHED",
      "result_post_id": "urn:li:share:7182938471928374912",
      "result_url": "https://www.linkedin.com/feed/update/urn:li:share:7182938471928374912"
    }
  ]
}`
    },
    backendTrace: {
      component: 'Redis Asynq Worker Pool ➔ Social Publishing Service',
      action: 'SocialPublishService.startStatusPolling() ➔ GET /social/posts',
      latency: '5000ms Poll Interval · Sub-12s Total Syndication',
      details: 'All 4 platform jobs succeeded; resolved 4 deep links; updated PostgreSQL audit records; closed status modal.'
    }
  }
];

export const SOCIAL_POSTER_CHALLENGES: EngineeringChallenge[] = [
  {
    title: 'Omni-Platform Media Discrepancies & Strict Quota Enforcement',
    tag: 'API Normalization & Image Geometry',
    problem:
      'Commercial social media platforms enforce wildly conflicting media specifications: Twitter/X strictly caps at 4 images and 280 characters; Instagram requires square (1:1) or vertical (4:5) carousel containers up to 10 items; Facebook operates on photo album feeds; LinkedIn mandates distinct UGC media registration endpoints. Submitting mismatched aspect ratios or exceeding count quotas results in instant HTTP 400 Bad Request rejections.',
    tradeOff:
      'Creating manual, per-platform editing workflows burdens sales staff and slows syndication, while naive automated cropping can inadvertently decapitate vehicle grilles or alloy wheels.',
    solution:
      'Engineered a deterministic Cross-Platform Quota Normalizer in Go paired with an interactive client canvas. The engine auto-derives optimal crop coordinates and geometry based on vehicle aspect ratios, dynamically clamps photo arrays to platform ceiling limits (e.g. slicing to 4 images for Twitter while preserving the full carousel for Instagram), and adjusts caption length dynamically with graceful hashtag prioritization.'
  },
  {
    title: 'Multi-Tenant OAuth 2.0 PKCE Token Lifecycle & Silent Refresh',
    tag: 'Enterprise Identity & Cryptography',
    problem:
      'Managing OAuth credentials across Twitter/X, Meta, and LinkedIn requires handling widely divergent token lifespans (short-lived Twitter 2-hour bearer tokens vs Meta 60-day page tokens vs LinkedIn 60-day tokens). Storing raw tokens creates severe security risks, while expired tokens cause catastrophic publishing failures during batch syndication.',
    tradeOff:
      'Forcing users to re-authenticate manually on every post destroys operational velocity, but automatic refresh without synchronization can lead to race conditions and token invalidation.',
    solution:
      'Implemented an enterprise OAuth 2.0 PKCE broker with SHA-256 code verifiers and state HMACs to defeat CSRF and MITM attacks. Tokens are encrypted at rest using AES-256 GCM in PostgreSQL. The backend executes preflight token expiration evaluations with a 5-minute safety buffer, acquiring a Redis distributed mutex to perform atomic, silent token refreshes before enqueuing publish tasks.'
  },
  {
    title: 'Direct Cloud Storage Streaming & CORS Preflight Bypass',
    tag: 'Zero-Disk Architecture & Cloud Storage',
    problem:
      'High-resolution multi-page promotional posters (1080x1350 at 300 DPI) generate large image binaries. Routing these uploads through the Go backend API exhausts server memory, ties up Gin worker threads, and incurs expensive egress bandwidth. Furthermore, standard browser HTTP clients may append credentials or custom authorization headers, triggering CORS preflight rejections on cloud object storage buckets (S3 / TOS).',
    tradeOff:
      'Permitting public wildcard CORS policies on storage buckets compromises security, while streaming through the backend creates an unscalable architectural bottleneck.',
    solution:
      'Designed a two-phase presigned upload pipeline. The Go microservice generates cryptographically signed PUT URLs restricted to 15-minute validity and exact MIME types. On the client, a dedicated direct-upload client transfers the binary directly to the object storage bucket, eliminating custom authorization headers and bypassing CORS preflight failures with zero backend memory overhead.'
  },
  {
    title: 'Asynchronous Distributed Social Dispatch with Partial Failure Isolation',
    tag: 'Distributed Systems & Worker Queues',
    problem:
      'Publishing to 4 external social networks synchronously inside an HTTP request regularly times out due to third-party API latency (Instagram carousel container processing takes 5-15 seconds). Furthermore, if 3 networks succeed but Twitter rate-limits the account (HTTP 429), a monolithic transaction would fail entirely or re-post duplicates on retries.',
    tradeOff:
      'Synchronous publishing guarantees immediate client feedback but frequently times out, whereas naive fire-and-forget queues leave users blind to publishing failures.',
    solution:
      'Built a distributed Asynq/Redis task pipeline. The primary publish request is instantly recorded in PostgreSQL with status PENDING and decomposed into independent, per-platform child worker jobs (RawJob entity). Each worker executes in an isolated goroutine with its own platform-specific rate limiter and exponential retry backoff. A failure on one platform does not affect others, and users can selectively retry failed destinations without duplicating successful posts.'
  },
  {
    title: 'High-Efficiency Status Polling Pipeline & Deep Link Resolution',
    tag: 'Real-Time Telemetry & UX Architecture',
    problem:
      'Because social media container processing is asynchronous, the frontend needs to track progress without establishing persistent, resource-heavy WebSocket connections for low-frequency marketing actions. Moreover, raw platform API responses return obscure internal IDs (e.g. Meta media container ID) rather than user-clickable URLs.',
    tradeOff:
      'Long polling or WebSockets maintain persistent server state and consume memory, while naive rapid polling overloads relational database indexes.',
    solution:
      'Engineered a highly optimized short-polling telemetry pipeline. The client UI polls the Go REST API at 5000ms intervals (capped at 60 attempts). The backend executes index-optimized batch queries on (user_id, status) with a 100-record ceiling. Upon completion, the service translates internal social IDs into canonical public deep links (https://instagram.com/p/..., https://x.com/status/...), providing instant verification and auto-dismissing the progress modal.'
  }
];

export const SOCIAL_POSTER_CASE_STUDY: CaseStudyData = {
  id: 'social-poster-publisher',
  type: 'pipeline',
  tracesLabel: 'Studio & Publishing Traces (5)',
  title: 'Automated AI Vehicle Poster & Multi-Platform Social Publishing Engine',
  subtitle: 'Autonomous Multimodal Poster Generation & Omni-Channel Social Distribution (Meta, X, LinkedIn)',
  badge: 'Enterprise Architecture · Go Microservices · Multimodal AI',
  techPills: [
    'Go (Gin) Microservices',
    'Poster Studio & Campaign UI',
    'Google Gemini 2.5 / Doubao LLM',
    'Meta Graph API (IG & FB)',
    'Twitter/X API v2 (PKCE)',
    'LinkedIn REST API',
    'Redis Asynq Worker Queues',
    'Cloud Storage (TOS / S3)'
  ],
  overview:
    'A high-performance, enterprise-grade cloud marketing platform designed to automate automotive marketing and inventory syndication. Combines an intuitive web poster studio (dynamic 5-point photo framing, 5 aesthetic themes, presigned zero-disk upload streaming) with a robust Go microservice backend. Features cognitive AI caption and hashtag synthesis (Google Gemini 2.5 / Doubao LLM), multi-tenant OAuth 2.0 PKCE authentication with silent token refresh, and a resilient Redis Asynq background worker pipeline orchestrating parallel, rate-governed publishing across Instagram, Facebook, Twitter/X, and LinkedIn with real-time short-polling telemetry and live social deep links.',
  metrics: [
    {
      stat: '< 15s',
      label: 'Full Studio Pipeline',
      subtext: 'Asset selection to multi-page poster render & OSS upload'
    },
    {
      stat: '4 Networks',
      label: 'Simultaneous Syndication',
      subtext: 'Instagram, Facebook, Twitter/X & LinkedIn'
    },
    {
      stat: '100%',
      label: 'Zero-Disk Streaming',
      subtext: 'Client-to-OSS direct upload bypassing API bandwidth'
    },
    {
      stat: 'OAuth 2.0 PKCE',
      label: 'Enterprise Security',
      subtext: 'AES-256 encrypted tokens & zero-downtime silent refresh'
    },
    {
      stat: '4x Resilience',
      label: 'Partial Failure Isolation',
      subtext: 'Independent Redis worker jobs per social destination'
    }
  ],
  gallery: [],
  pipelineTraces: SOCIAL_POSTER_PIPELINE_TRACES,
  nodes: SOCIAL_POSTER_NODES,
  flows: SOCIAL_POSTER_FLOWS,
  challenges: SOCIAL_POSTER_CHALLENGES,
  mermaidCode: getSocialPosterMermaidCode('dark'),
  connectorLabels: {
    tier1To2: 'Poster Studio UI · Go Ingress Gateway · OAuth PKCE Handshake',
    tier2To3: 'Dynamic 5-Point Layout Framing · Multimodal AI Prompt Contextualization',
    tier3To45: 'Presigned OSS Zero-Disk Pipe · Redis Asynq FIFO Worker Queues',
    tier45To6: 'Multi-Platform Social Gateway ACK · Live Deep-Link Telemetry'
  }
};
