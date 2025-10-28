"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  ArrowLeft,
  Network,
  Database,
  Server,
  Cloud,
  Cpu,
  GitBranch,
  Workflow,
  Box,
  Layers,
  Activity,
  HardDrive,
  Zap,
  Lock,
  CheckCircle,
  ArrowRight,
  Code,
  Container
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function ArchitecturePage() {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">DeepGuard AI</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="container mx-auto px-4 py-12">
        <Badge className="mb-4" variant="secondary">
          <Network className="h-3 w-3 mr-1" />
          System Architecture
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Technical Architecture
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Comprehensive overview of our enterprise-grade, cloud-native deepfake detection infrastructure
        </p>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 pb-20">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="dataflow">Data Flow</TabsTrigger>
            <TabsTrigger value="microservices">Services</TabsTrigger>
            <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <Card className="p-8">
              <h2 className="text-3xl font-bold mb-6">System Architecture Overview</h2>
              
              {/* Layer Diagram */}
              <div className="space-y-4">
                {[
                  {
                    layer: "Ingestion Layer",
                    icon: Cloud,
                    color: "blue",
                    components: ["REST API", "Webhook Handler", "Stream API", "Batch Upload", "SDK Integration"],
                    description: "Multi-protocol content submission with authentication and rate limiting"
                  },
                  {
                    layer: "Preprocessing Layer",
                    icon: Workflow,
                    color: "green",
                    components: ["Video Decoder", "Audio Extractor", "Frame Sampler", "Perceptual Hash", "Face Detection"],
                    description: "Content standardization and feature extraction pipeline"
                  },
                  {
                    layer: "Detection Layer (4-Tier)",
                    icon: Cpu,
                    color: "purple",
                    components: ["Tier 1: BNN + Hash", "Tier 2: Lightweight CNN", "Tier 3: Deep Ensemble", "Tier 4: Human Review"],
                    description: "Intelligent routing through detection tiers based on confidence"
                  },
                  {
                    layer: "Decision & Response Layer",
                    icon: Activity,
                    color: "orange",
                    components: ["Confidence Scorer", "Result Aggregator", "Explainability Engine", "Webhook Dispatcher"],
                    description: "Result synthesis and delivery with detailed explanations"
                  },
                  {
                    layer: "Continuous Learning Layer",
                    icon: GitBranch,
                    color: "pink",
                    components: ["Feedback Collector", "Model Retraining", "A/B Testing", "Gradual Rollout"],
                    description: "Automated model improvement and deployment pipeline"
                  }
                ].map((layer, i) => (
                  <Card key={i} className="p-6 hover:shadow-lg transition border-l-4" style={{ borderLeftColor: `var(--${layer.color}-500)` }}>
                    <div className="flex items-start gap-4">
                      <div className={`rounded-full p-3 bg-${layer.color}-500/10`}>
                        <layer.icon className={`h-6 w-6 text-${layer.color}-500`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{layer.layer}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{layer.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {layer.components.map((comp, j) => (
                            <Badge key={j} variant="secondary" className="text-xs">
                              {comp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>

            {/* Key Design Principles */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Horizontal Scalability",
                  icon: Network,
                  desc: "Auto-scaling from 10K to 10M videos/hour using Kubernetes HPA"
                },
                {
                  title: "Fault Tolerance",
                  icon: Shield,
                  desc: "Circuit breakers, retry logic, and graceful degradation"
                },
                {
                  title: "Event-Driven",
                  icon: Zap,
                  desc: "Kafka-based asynchronous processing with guaranteed delivery"
                }
              ].map((principle, i) => (
                <Card key={i} className="p-6">
                  <principle.icon className="h-10 w-10 text-primary mb-4" />
                  <h3 className="font-bold mb-2">{principle.title}</h3>
                  <p className="text-sm text-muted-foreground">{principle.desc}</p>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Data Flow Tab */}
          <TabsContent value="dataflow" className="space-y-8">
            <Card className="p-8">
              <h2 className="text-3xl font-bold mb-6">End-to-End Data Flow</h2>
              
              <div className="space-y-6">
                {[
                  {
                    step: "1. Content Submission",
                    details: [
                      "Client submits video via REST API with OAuth2 token",
                      "API Gateway validates authentication and rate limits",
                      "Generates unique job_id (UUID)",
                      "Uploads raw content to S3 bucket",
                      "Publishes message to Kafka topic: 'video.submitted'",
                      "Returns job_id and estimated processing time to client"
                    ]
                  },
                  {
                    step: "2. Preprocessing Pipeline",
                    details: [
                      "Consumer reads from 'video.submitted' topic",
                      "Downloads video from S3 to processing node",
                      "Standardizes video: H.264 codec, 720p, 30fps",
                      "Extracts 30 frames (1 per second) as JPEG 224x224",
                      "Extracts audio: AAC, 16kHz, mono channel",
                      "Computes perceptual hash (pHash algorithm)",
                      "Detects faces using RetinaFace model",
                      "Publishes to 'video.preprocessed' topic"
                    ]
                  },
                  {
                    step: "3. Tier 1 Detection (Fast Filter)",
                    details: [
                      "Checks Redis for perceptual hash match (O(1) lookup)",
                      "If match found: Return cached result (known deepfake)",
                      "If no match: Run Binary Neural Network on frames",
                      "Processing time: 5-10ms on GPU",
                      "If confidence > 95%: Flag as deepfake, return result",
                      "If confidence < 5%: Flag as real, return result",
                      "Else: Route to Tier 2 for deeper analysis"
                    ]
                  },
                  {
                    step: "4. Tier 2 Detection (Lightweight)",
                    details: [
                      "Run EfficientNet-B0 on extracted frames (spatial analysis)",
                      "Run Audio CNN on mel spectrogram (audio analysis)",
                      "Run 3D CNN on frame sequences (temporal consistency)",
                      "Combine scores with weighted average (0.5, 0.3, 0.2)",
                      "Processing time: 80-100ms on GPU",
                      "If confidence > 90%: Return deepfake result",
                      "If confidence < 10%: Return real result",
                      "Else: Route to Tier 3 (40-90% confidence range)"
                    ]
                  },
                  {
                    step: "5. Tier 3 Detection (Deep Ensemble)",
                    details: [
                      "Spatial CNN: XceptionNet for GAN artifacts (80ms)",
                      "Temporal LSTM: Cross-frame consistency analysis (150ms)",
                      "Audio CNN: Deep audio manipulation detection (100ms)",
                      "AV Sync Detector: Lip-sync verification (100ms)",
                      "PPG Analyzer: Biological signal extraction (200ms)",
                      "GAN Detector: Frequency domain analysis (40ms)",
                      "Weighted ensemble voting with learned weights",
                      "Confidence calibration using isotonic regression",
                      "Total processing: 800-1000ms",
                      "If confidence 40-60%: Route to Tier 4 (human review)",
                      "Else: Return final result with explanations"
                    ]
                  },
                  {
                    step: "6. Result Aggregation & Delivery",
                    details: [
                      "Aggregate scores from all completed tiers",
                      "Generate explainability report with top signals",
                      "Create attention heatmaps for visual explanation",
                      "Update job status in PostgreSQL database",
                      "Cache result in Redis (TTL: 7 days)",
                      "Publish to 'detection.final.result' topic",
                      "Send webhook notification to client (if configured)",
                      "Store detailed results in MongoDB for analysis"
                    ]
                  },
                  {
                    step: "7. Continuous Learning Loop",
                    details: [
                      "Client submits feedback on detection result",
                      "Feedback stored in PostgreSQL with job_id reference",
                      "Published to 'model.feedback' Kafka topic",
                      "Feedback buffer accumulates 10,000 samples",
                      "Triggers automated model retraining job",
                      "New model evaluated on validation set",
                      "A/B test: 10% traffic to new model for 48 hours",
                      "Statistical significance test on metrics",
                      "Gradual rollout: 10% → 25% → 50% → 75% → 100%",
                      "Winning model promoted to production"
                    ]
                  }
                ].map((stage, i) => (
                  <Accordion key={i} type="single" collapsible>
                    <AccordionItem value={`item-${i}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center text-sm font-bold">
                            {i + 1}
                          </div>
                          <span className="font-bold">{stage.step}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2 ml-11 mt-4">
                          {stage.details.map((detail, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm">
                              <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Microservices Tab */}
          <TabsContent value="microservices" className="space-y-8">
            <Card className="p-8">
              <h2 className="text-3xl font-bold mb-6">Microservices Architecture</h2>
              <p className="text-muted-foreground mb-8">
                12 core services orchestrated with Kubernetes, communicating via REST, gRPC, and Kafka
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    name: "API Gateway",
                    tech: "Kong / Nginx",
                    icon: Network,
                    responsibilities: [
                      "Request routing and load balancing",
                      "Authentication (OAuth2/JWT)",
                      "Rate limiting (Redis-backed)",
                      "Request/response transformation",
                      "CORS and security headers"
                    ],
                    ports: "80/443 (HTTP/HTTPS)"
                  },
                  {
                    name: "Authentication Service",
                    tech: "Go + PostgreSQL",
                    icon: Lock,
                    responsibilities: [
                      "User registration and login",
                      "JWT token generation/validation",
                      "API key management",
                      "Organization multi-tenancy",
                      "Audit logging"
                    ],
                    ports: "8001 (gRPC)"
                  },
                  {
                    name: "Video Ingestion Service",
                    tech: "Python FastAPI",
                    icon: Cloud,
                    responsibilities: [
                      "File upload handling (multipart)",
                      "S3 upload orchestration",
                      "Job record creation",
                      "Kafka message publishing",
                      "Webhook URL validation"
                    ],
                    ports: "8002 (REST)"
                  },
                  {
                    name: "Preprocessing Service",
                    tech: "Python + FFmpeg",
                    icon: Workflow,
                    responsibilities: [
                      "Video decoding and standardization",
                      "Frame extraction (uniform sampling)",
                      "Audio extraction and feature computation",
                      "Face detection (RetinaFace)",
                      "Perceptual hash computation"
                    ],
                    ports: "8003 (Internal)"
                  },
                  {
                    name: "Model Inference Service (Tier 1)",
                    tech: "TorchServe + BNN",
                    icon: Zap,
                    responsibilities: [
                      "Binary Neural Network inference",
                      "Hash lookup in Redis",
                      "Digital watermark detection",
                      "Result routing logic",
                      "GPU resource management"
                    ],
                    ports: "8080 (HTTP)"
                  },
                  {
                    name: "Model Inference Service (Tier 2)",
                    tech: "TorchServe + EfficientNet",
                    icon: Cpu,
                    responsibilities: [
                      "EfficientNet-B0 inference",
                      "Audio CNN inference",
                      "Temporal consistency checking",
                      "Score aggregation",
                      "GPU batching optimization"
                    ],
                    ports: "8081 (HTTP)"
                  },
                  {
                    name: "Model Inference Service (Tier 3)",
                    tech: "TorchServe + Ensemble",
                    icon: Layers,
                    responsibilities: [
                      "6-model ensemble orchestration",
                      "Parallel model inference",
                      "Weighted voting mechanism",
                      "Confidence calibration",
                      "Explainability generation"
                    ],
                    ports: "8082 (HTTP)"
                  },
                  {
                    name: "Result Aggregation Service",
                    tech: "Go",
                    icon: Activity,
                    responsibilities: [
                      "Multi-tier score aggregation",
                      "Final verdict computation",
                      "Uncertainty quantification",
                      "Result caching in Redis",
                      "Database persistence"
                    ],
                    ports: "8004 (gRPC)"
                  },
                  {
                    name: "Notification Service",
                    tech: "Go",
                    icon: Server,
                    responsibilities: [
                      "Webhook delivery with retries",
                      "Email notifications (optional)",
                      "Dead letter queue management",
                      "Delivery status tracking",
                      "Rate-limited dispatch"
                    ],
                    ports: "8005 (Internal)"
                  },
                  {
                    name: "Analytics Service",
                    tech: "Python + Pandas",
                    icon: Activity,
                    responsibilities: [
                      "Metrics aggregation",
                      "Usage statistics computation",
                      "Model performance tracking",
                      "Cost analysis",
                      "Report generation"
                    ],
                    ports: "8006 (REST)"
                  },
                  {
                    name: "ML Training Service",
                    tech: "Python + PyTorch",
                    icon: GitBranch,
                    responsibilities: [
                      "Automated model retraining",
                      "Dataset preparation from feedback",
                      "Distributed training (Ray)",
                      "Model evaluation and validation",
                      "MLflow experiment tracking"
                    ],
                    ports: "8007 (Internal)"
                  },
                  {
                    name: "Model Registry Service",
                    tech: "MLflow + S3",
                    icon: Box,
                    responsibilities: [
                      "Model version management",
                      "Model artifact storage",
                      "A/B test configuration",
                      "Deployment orchestration",
                      "Rollback capabilities"
                    ],
                    ports: "5000 (HTTP)"
                  }
                ].map((service, i) => (
                  <Card 
                    key={i} 
                    className="p-6 hover:shadow-xl transition cursor-pointer"
                    onClick={() => setSelectedService(selectedService === service.name ? null : service.name)}
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg bg-primary/10 p-3">
                        <service.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">{service.name}</h3>
                        <Badge variant="secondary" className="mb-3 text-xs">
                          {service.tech}
                        </Badge>
                        <p className="text-xs text-muted-foreground mb-2">Port: {service.ports}</p>
                        
                        {selectedService === service.name && (
                          <ul className="space-y-1 mt-4">
                            {service.responsibilities.map((resp, j) => (
                              <li key={j} className="flex items-start gap-2 text-sm">
                                <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                                <span className="text-muted-foreground">{resp}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Infrastructure Tab */}
          <TabsContent value="infrastructure" className="space-y-8">
            <Card className="p-8">
              <h2 className="text-3xl font-bold mb-6">Kubernetes Infrastructure</h2>
              
              <div className="space-y-8">
                {/* Node Pools */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Node Pools Configuration</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {[
                      {
                        name: "API Pool",
                        machine: "n2-standard-8",
                        specs: "8 vCPU, 32GB RAM",
                        nodes: "3-10 (autoscaling)",
                        workloads: "API Gateway, Auth Service, Notification Service"
                      },
                      {
                        name: "Preprocessing Pool",
                        machine: "n2-highcpu-16",
                        specs: "16 vCPU, 16GB RAM",
                        nodes: "5-20 (autoscaling)",
                        workloads: "Preprocessing Service, Result Aggregation"
                      },
                      {
                        name: "GPU Inference Pool (Tier 1-2)",
                        machine: "n1-standard-16 + NVIDIA T4",
                        specs: "16 vCPU, 60GB RAM, 1x T4 GPU",
                        nodes: "10-50 (autoscaling)",
                        workloads: "Tier 1 & 2 Model Inference"
                      },
                      {
                        name: "GPU Inference Pool (Tier 3)",
                        machine: "n1-standard-32 + NVIDIA A100",
                        specs: "32 vCPU, 120GB RAM, 2x A100 GPU",
                        nodes: "5-20 (autoscaling)",
                        workloads: "Tier 3 Ensemble Models"
                      },
                      {
                        name: "Database Pool",
                        machine: "n2-highmem-8",
                        specs: "8 vCPU, 64GB RAM, SSD",
                        nodes: "3 (stateful)",
                        workloads: "PostgreSQL, MongoDB, Redis Clusters"
                      }
                    ].map((pool, i) => (
                      <Card key={i} className="p-4 border-l-4 border-l-primary">
                        <h4 className="font-bold mb-2">{pool.name}</h4>
                        <div className="space-y-1 text-sm">
                          <p className="text-muted-foreground"><span className="font-semibold">Machine:</span> {pool.machine}</p>
                          <p className="text-muted-foreground"><span className="font-semibold">Specs:</span> {pool.specs}</p>
                          <p className="text-muted-foreground"><span className="font-semibold">Nodes:</span> {pool.nodes}</p>
                          <Badge variant="outline" className="mt-2 text-xs">{pool.workloads}</Badge>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Storage */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Storage Architecture</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    {[
                      {
                        type: "S3 / MinIO",
                        icon: HardDrive,
                        hot: "50TB (30 days)",
                        warm: "200TB (180 days)",
                        cold: "1PB (archive)",
                        desc: "Video files, model artifacts, preprocessed data"
                      },
                      {
                        type: "PostgreSQL",
                        icon: Database,
                        hot: "2TB SSD (Primary)",
                        warm: "2TB SSD × 2 (Replicas)",
                        cold: "Daily snapshots",
                        desc: "Jobs, users, results, feedback, model versions"
                      },
                      {
                        type: "MongoDB",
                        icon: Database,
                        hot: "3TB (3 shards)",
                        warm: "3 replicas/shard",
                        cold: "Backup retention",
                        desc: "Preprocessed videos, predictions, unstructured data"
                      },
                      {
                        type: "Redis Cluster",
                        icon: Zap,
                        hot: "256GB distributed",
                        warm: "RDB + AOF persistence",
                        cold: "Point-in-time recovery",
                        desc: "Cache, rate limiting, hash lookup, session storage"
                      }
                    ].map((storage, i) => (
                      <Card key={i} className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <storage.icon className="h-8 w-8 text-primary" />
                          <h4 className="font-bold">{storage.type}</h4>
                        </div>
                        <div className="space-y-2 text-xs mb-4">
                          <p><span className="font-semibold">Hot:</span> {storage.hot}</p>
                          <p><span className="font-semibold">Warm:</span> {storage.warm}</p>
                          <p><span className="font-semibold">Cold:</span> {storage.cold}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">{storage.desc}</p>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Infrastructure Costs (Monthly)</h3>
                  <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
                    <div className="grid md:grid-cols-3 gap-8">
                      {[
                        { category: "Compute (K8s)", cost: "$15,000" },
                        { category: "GPU Instances", cost: "$25,000" },
                        { category: "Storage (S3/GCS)", cost: "$8,000" },
                        { category: "Database (Managed)", cost: "$5,000" },
                        { category: "Network/CDN", cost: "$3,000" },
                        { category: "Monitoring/Logging", cost: "$2,000" }
                      ].map((item, i) => (
                        <div key={i}>
                          <p className="text-sm text-muted-foreground mb-1">{item.category}</p>
                          <p className="text-3xl font-bold">{item.cost}</p>
                        </div>
                      ))}
                    </div>
                    <div className="border-t mt-6 pt-6 flex items-center justify-between">
                      <span className="text-lg font-semibold">Total Monthly Cost</span>
                      <span className="text-4xl font-bold text-primary">$58,000</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Annual: ~$696,000 • Processes 1M videos/hour at peak capacity
                    </p>
                  </Card>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Database Tab */}
          <TabsContent value="database" className="space-y-8">
            <Card className="p-8">
              <h2 className="text-3xl font-bold mb-6">Database Schemas</h2>
              
              <Tabs defaultValue="postgresql" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="postgresql">PostgreSQL</TabsTrigger>
                  <TabsTrigger value="mongodb">MongoDB</TabsTrigger>
                  <TabsTrigger value="redis">Redis</TabsTrigger>
                </TabsList>

                <TabsContent value="postgresql" className="space-y-6">
                  <div className="space-y-4">
                    {[
                      {
                        table: "users",
                        desc: "User accounts and authentication",
                        fields: "id, email, hashed_password, api_key, organization_id, role, rate_limit, is_active, created_at"
                      },
                      {
                        table: "organizations",
                        desc: "Multi-tenant organization management",
                        fields: "id, name, subscription_tier, monthly_quota, used_quota, created_at"
                      },
                      {
                        table: "jobs",
                        desc: "Detection job tracking and status",
                        fields: "id, user_id, batch_id, file_url, file_size, mode, status, final_verdict, confidence, tier_completed, processing_time_ms, tier1_score, tier2_score, tier3_score, submitted_at, completed_at"
                      },
                      {
                        table: "detection_results",
                        desc: "Detailed model predictions",
                        fields: "id, job_id, spatial_cnn_score, temporal_lstm_score, audio_cnn_score, av_sync_score, ppg_score, gan_detector_score, metadata_forensics_score, detected_artifacts (JSONB), explanation (JSONB), heatmap_url"
                      },
                      {
                        table: "feedback",
                        desc: "User feedback for continuous learning",
                        fields: "id, job_id, user_id, is_correct, actual_label, comments, processed, used_in_training, created_at"
                      },
                      {
                        table: "known_deepfakes",
                        desc: "Registry of confirmed deepfakes",
                        fields: "id, video_hash, perceptual_hash, classification, deepfake_type, generation_method, first_detected, report_count, confidence, source_urls (array)"
                      },
                      {
                        table: "model_versions",
                        desc: "Model version management",
                        fields: "id, model_name, version, tier, architecture, framework, file_path, accuracy, auc, f1_score, precision, recall, status, deployed_at, traffic_percentage, mlflow_run_id"
                      },
                      {
                        table: "audit_log",
                        desc: "Security and compliance logging",
                        fields: "id, user_id, action, resource_type, resource_id, details (JSONB), ip_address, user_agent, created_at"
                      }
                    ].map((schema, i) => (
                      <Accordion key={i} type="single" collapsible>
                        <AccordionItem value={`table-${i}`}>
                          <AccordionTrigger>
                            <div className="flex items-center gap-3 text-left">
                              <Code className="h-5 w-5 text-primary" />
                              <div>
                                <div className="font-bold font-mono">{schema.table}</div>
                                <div className="text-sm text-muted-foreground font-normal">{schema.desc}</div>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="ml-8 mt-2 p-4 bg-muted rounded-lg">
                              <p className="text-xs font-mono text-muted-foreground whitespace-pre-wrap">
                                {schema.fields}
                              </p>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="mongodb" className="space-y-4">
                  {[
                    {
                      collection: "processed_videos",
                      desc: "Preprocessed video data and extracted features",
                      structure: `{
  _id: ObjectId,
  job_id: UUID,
  original_url: String,
  duration_seconds: Float,
  resolution: { width: Int, height: Int },
  fps: Int,
  frames: [{
    frame_number: Int,
    timestamp: Float,
    s3_url: String,
    faces: [{ bbox, landmarks, confidence }]
  }],
  audio: {
    url: String,
    mfcc_features_url: String,
    spectrogram_url: String
  },
  video_hash: String,
  perceptual_hash: String,
  processed_at: ISODate
}`
                    },
                    {
                      collection: "model_predictions",
                      desc: "Frame-by-frame predictions from each model",
                      structure: `{
  _id: ObjectId,
  job_id: UUID,
  model_version_id: UUID,
  predictions: [{
    frame_number: Int,
    prediction: String,
    confidence: Float,
    attention_map_url: String,
    face_predictions: [{
      face_id: Int,
      bbox: [x1, y1, x2, y2],
      prediction: String,
      confidence: Float
    }]
  }],
  aggregated_score: Float,
  inference_time_ms: Int,
  created_at: ISODate
}`
                    }
                  ].map((schema, i) => (
                    <Card key={i} className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Container className="h-6 w-6 text-primary" />
                        <div>
                          <h4 className="font-bold font-mono text-lg">{schema.collection}</h4>
                          <p className="text-sm text-muted-foreground">{schema.desc}</p>
                        </div>
                      </div>
                      <pre className="text-xs bg-muted p-4 rounded-lg overflow-x-auto">
                        <code>{schema.structure}</code>
                      </pre>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="redis" className="space-y-4">
                  {[
                    {
                      key: "hash:{video_hash}",
                      type: "Hash",
                      ttl: "7 days",
                      desc: "Perceptual hash lookup for known deepfakes",
                      example: `{ video_id, classification, confidence, first_seen, report_count }`
                    },
                    {
                      key: "result:{job_id}",
                      type: "String (JSON)",
                      ttl: "7 days",
                      desc: "Cached detection results",
                      example: `{ job_id, verdict, confidence, tier_scores, created_at }`
                    },
                    {
                      key: "rate_limit:{user_id}",
                      type: "Counter",
                      ttl: "1 hour",
                      desc: "Rate limiting counters",
                      example: `counter (incremented per request)`
                    },
                    {
                      key: "session:{token}",
                      type: "Hash",
                      ttl: "24 hours",
                      desc: "User session data",
                      example: `{ user_id, email, role, expires_at }`
                    }
                  ].map((schema, i) => (
                    <Card key={i} className="p-6">
                      <div className="grid md:grid-cols-4 gap-4 items-start">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Key Pattern</p>
                          <p className="font-mono text-sm font-bold">{schema.key}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Type</p>
                          <Badge variant="secondary">{schema.type}</Badge>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">TTL</p>
                          <p className="text-sm font-semibold">{schema.ttl}</p>
                        </div>
                        <div className="md:col-span-4">
                          <p className="text-sm text-muted-foreground mb-2">{schema.desc}</p>
                          <pre className="text-xs bg-muted p-3 rounded overflow-x-auto">
                            <code>{schema.example}</code>
                          </pre>
                        </div>
                      </div>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
