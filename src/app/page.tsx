"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Zap, 
  Network, 
  Brain, 
  Eye, 
  Lock, 
  TrendingUp, 
  Server,
  Database,
  Workflow,
  CheckCircle,
  ArrowRight,
  Activity,
  Cpu,
  Globe
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">DeepGuard AI</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm hover:text-primary transition">Features</Link>
            <Link href="#architecture" className="text-sm hover:text-primary transition">Architecture</Link>
            <Link href="/demo" className="text-sm hover:text-primary transition">Demo</Link>
            <Link href="/api-docs" className="text-sm hover:text-primary transition">API Docs</Link>
            <Link href="/dashboard" className="text-sm hover:text-primary transition">Dashboard</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/demo">
              <Button>Try Demo</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge className="mb-4" variant="secondary">
          <Activity className="h-3 w-3 mr-1" />
          Production-Ready v1.0
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Enterprise Deepfake
          <br />
          Detection System
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Real-time, multi-modal AI detection with <span className="text-primary font-semibold">&gt;90% accuracy</span>.
          Process 1M videos/hour with &lt;100ms latency.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/demo">
            <Button size="lg" className="gap-2">
              <Zap className="h-5 w-5" />
              Try Live Demo
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/architecture">
            <Button size="lg" variant="outline" className="gap-2">
              <Network className="h-5 w-5" />
              View Architecture
            </Button>
          </Link>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { label: "Detection Accuracy", value: ">90%", icon: CheckCircle },
            { label: "False Positive Rate", value: "<1%", icon: Shield },
            { label: "Processing Latency", value: "<100ms", icon: Zap },
            { label: "Scalability", value: "1M/hour", icon: TrendingUp }
          ].map((metric, i) => (
            <Card key={i} className="p-6 hover:shadow-lg transition">
              <metric.icon className="h-8 w-8 text-primary mb-3 mx-auto" />
              <div className="text-3xl font-bold mb-1">{metric.value}</div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* 4-Tier Detection System */}
      <section className="container mx-auto px-4 py-20" id="features">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Multi-Tier Detection Pipeline</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Intelligent routing through four detection tiers for optimal speed and accuracy
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              tier: "Tier 1",
              name: "Fast Filter",
              time: "<10ms",
              tech: "BNN + Hash Check",
              desc: "Binary Neural Network with perceptual hash lookup for instant detection of known deepfakes",
              color: "text-green-500"
            },
            {
              tier: "Tier 2",
              name: "Lightweight CNN",
              time: "<100ms",
              tech: "MobileNet/EfficientNet",
              desc: "Efficient spatial and audio analysis with temporal consistency checking",
              color: "text-blue-500"
            },
            {
              tier: "Tier 3",
              name: "Deep Ensemble",
              time: "<1000ms",
              tech: "Multi-modal AI",
              desc: "6-model ensemble: Spatial CNN, Temporal LSTM, Audio CNN, AV Sync, PPG, GAN detector",
              color: "text-purple-500"
            },
            {
              tier: "Tier 4",
              name: "Human Review",
              time: "Manual",
              tech: "Expert Analysis",
              desc: "Human-in-the-loop for uncertain cases (40-60% confidence) with feedback integration",
              color: "text-orange-500"
            }
          ].map((tier, i) => (
            <Card key={i} className="p-6 hover:shadow-xl transition border-t-4" style={{ borderTopColor: tier.color.replace('text-', '') }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge variant="outline" className="mb-2">{tier.tier}</Badge>
                  <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                  <div className={`text-2xl font-mono font-bold ${tier.color}`}>{tier.time}</div>
                </div>
                <Brain className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="text-sm font-semibold mb-2 text-primary">{tier.tech}</div>
              <p className="text-sm text-muted-foreground">{tier.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Key Features */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Enterprise-Grade Features</h2>
            <p className="text-xl text-muted-foreground">Built for scale, security, and continuous improvement</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Eye,
                title: "Multi-Modal Detection",
                desc: "Analyzes video, audio, image, and metadata simultaneously for comprehensive detection"
              },
              {
                icon: Zap,
                title: "Real-Time Processing",
                desc: "Stream API and batch processing with <100ms latency for Tier 1-2 detection"
              },
              {
                icon: Brain,
                title: "Continuous Learning",
                desc: "Automatic model retraining with feedback loop, A/B testing, and gradual rollout"
              },
              {
                icon: Network,
                title: "API-First Architecture",
                desc: "RESTful API, WebSocket streaming, webhooks, and SDKs for seamless integration"
              },
              {
                icon: Lock,
                title: "Security & Compliance",
                desc: "GDPR, CCPA, SOC 2 ready with OAuth2/JWT authentication and audit logging"
              },
              {
                icon: TrendingUp,
                title: "Explainable AI",
                desc: "Confidence scoring, heatmap visualization, and detailed reasoning for every detection"
              },
              {
                icon: Server,
                title: "Kubernetes Native",
                desc: "Horizontal autoscaling from 10K to 10M videos/hour with GPU acceleration"
              },
              {
                icon: Database,
                title: "Multi-Tenant Support",
                desc: "Organization-based isolation with per-tenant quotas and rate limiting"
              },
              {
                icon: Activity,
                title: "Full Observability",
                desc: "Prometheus metrics, Grafana dashboards, ELK logging, and real-time alerting"
              }
            ].map((feature, i) => (
              <Card key={i} className="p-6 hover:shadow-lg transition">
                <feature.icon className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Stack */}
      <section className="container mx-auto px-4 py-20" id="architecture">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Production-Grade Tech Stack</h2>
          <p className="text-xl text-muted-foreground">Battle-tested technologies for enterprise deployment</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              category: "ML Framework",
              items: ["PyTorch 2.x", "TorchServe", "ONNX Runtime", "MLflow", "W&B"]
            },
            {
              category: "Backend",
              items: ["Python 3.11+", "FastAPI", "Go Services", "gRPC", "GraphQL"]
            },
            {
              category: "Data Pipeline",
              items: ["Apache Kafka", "Redis", "PostgreSQL", "MongoDB", "S3/MinIO"]
            },
            {
              category: "Infrastructure",
              items: ["Kubernetes", "Helm", "Prometheus", "Grafana", "ELK Stack"]
            }
          ].map((stack, i) => (
            <Card key={i} className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Cpu className="h-6 w-6 text-primary" />
                <h3 className="text-lg font-bold">{stack.category}</h3>
              </div>
              <ul className="space-y-2">
                {stack.items.map((item, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* System Architecture Overview */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">System Architecture</h2>
            <p className="text-xl text-muted-foreground">Microservices-based, cloud-native design</p>
          </div>

          <Card className="p-8 max-w-5xl mx-auto">
            <div className="space-y-6">
              {[
                { layer: "Ingestion Layer", services: "REST API • Webhook • Stream API • Batch Upload • SDK", icon: Globe },
                { layer: "Preprocessing Layer", services: "Video Decoder • Audio Extractor • Frame Sampler • Hash Generator", icon: Workflow },
                { layer: "Detection Layer", services: "Tier 1-4 Inference Services • Model Registry • Result Aggregation", icon: Brain },
                { layer: "Response Layer", services: "Confidence Scorer • Explainability Engine • Webhook Dispatcher", icon: Activity },
                { layer: "Learning Layer", services: "Feedback Loop • Model Retraining • A/B Testing • Deployment", icon: TrendingUp }
              ].map((layer, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-background hover:bg-muted/50 transition">
                  <layer.icon className="h-8 w-8 text-primary mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-1">{layer.layer}</h3>
                    <p className="text-sm text-muted-foreground">{layer.services}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="text-center mt-8">
            <Link href="/architecture">
              <Button size="lg" variant="outline" className="gap-2">
                View Detailed Architecture
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="p-12 text-center bg-gradient-to-r from-primary/10 to-primary/5">
          <h2 className="text-4xl font-bold mb-4">Ready to Deploy?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start detecting deepfakes at scale with our production-ready system
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/demo">
              <Button size="lg" className="gap-2">
                <Zap className="h-5 w-5" />
                Try Live Demo
              </Button>
            </Link>
            <Link href="/api-docs">
              <Button size="lg" variant="outline" className="gap-2">
                Read API Documentation
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">DeepGuard AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Enterprise deepfake detection powered by advanced AI
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/demo" className="hover:text-primary transition">Demo</Link></li>
                <li><Link href="/architecture" className="hover:text-primary transition">Architecture</Link></li>
                <li><Link href="/api-docs" className="hover:text-primary transition">API Docs</Link></li>
                <li><Link href="/dashboard" className="hover:text-primary transition">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition">Case Studies</a></li>
                <li><a href="#" className="hover:text-primary transition">Research Papers</a></li>
                <li><a href="#" className="hover:text-primary transition">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition">About</a></li>
                <li><a href="#" className="hover:text-primary transition">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition">Privacy</a></li>
                <li><a href="#" className="hover:text-primary transition">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 DeepGuard AI. Enterprise Deepfake Detection System v1.0</p>
          </div>
        </div>
      </footer>
    </div>
  );
}