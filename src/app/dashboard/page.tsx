"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Shield,
  ArrowLeft,
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Cpu,
  HardDrive,
  Network,
  Zap,
  Eye,
  Users,
  BarChart3,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";

// Demo API key for dashboard
const DEMO_API_KEY = "test-key-acme-corp-123";

export default function DashboardPage() {
  const [isLive, setIsLive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [usageData, setUsageData] = useState<any>(null);
  const [modelsData, setModelsData] = useState<any>(null);
  
  const [metrics, setMetrics] = useState({
    throughput: 847234,
    avgLatency: 87,
    accuracy: 91.2,
    uptime: 99.97,
    activeJobs: 0,
    queuedJobs: 0,
    completedToday: 0,
    errorRate: 0.02
  });

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/v1/organization/analytics", {
        headers: {
          "x-api-key": DEMO_API_KEY
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }

      const data = await response.json();
      setAnalyticsData(data);
      
      // Update metrics with real data
      setMetrics(prev => ({
        ...prev,
        completedToday: data.by_status?.completed || 0,
        activeJobs: data.by_status?.processing || 0,
        queuedJobs: data.by_status?.pending || 0,
        avgLatency: data.avg_processing_time_ms ? Math.round(data.avg_processing_time_ms) : prev.avgLatency
      }));
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      toast.error("Failed to load analytics data");
    }
  };

  // Fetch usage data
  const fetchUsage = async () => {
    try {
      const response = await fetch("/api/v1/organization/usage", {
        headers: {
          "x-api-key": DEMO_API_KEY
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch usage");
      }

      const data = await response.json();
      setUsageData(data);
    } catch (error) {
      console.error("Failed to fetch usage:", error);
      toast.error("Failed to load usage data");
    }
  };

  // Fetch models performance
  const fetchModels = async () => {
    try {
      const response = await fetch("/api/v1/models/performance", {
        headers: {
          "x-api-key": DEMO_API_KEY
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch models");
      }

      const data = await response.json();
      setModelsData(data);
    } catch (error) {
      console.error("Failed to fetch models:", error);
      toast.error("Failed to load models data");
    }
  };

  // Load all data on mount
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchAnalytics(),
        fetchUsage(),
        fetchModels()
      ]);
      setIsLoading(false);
    };

    loadAllData();
  }, []);

  // Simulate real-time updates when live
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        throughput: prev.throughput + Math.floor(Math.random() * 100 - 50),
        avgLatency: Math.max(50, Math.min(150, prev.avgLatency + Math.random() * 10 - 5)),
        activeJobs: Math.max(0, prev.activeJobs + Math.floor(Math.random() * 20 - 10)),
        queuedJobs: Math.max(0, prev.queuedJobs + Math.floor(Math.random() * 10 - 5))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Manual refresh
  const handleRefresh = async () => {
    toast.info("Refreshing dashboard data...");
    await Promise.all([
      fetchAnalytics(),
      fetchUsage(),
      fetchModels()
    ]);
    toast.success("Dashboard refreshed!");
  };

  // Calculate tier distribution from analytics
  const getTierDistribution = () => {
    if (!analyticsData) return [];
    
    const total = analyticsData.total_jobs || 1;
    // Simulate tier distribution based on total jobs
    return [
      { tier: "Tier 1: Fast Filter", percentage: 45, count: Math.floor(total * 0.45), color: "green" },
      { tier: "Tier 2: Lightweight", percentage: 35, count: Math.floor(total * 0.35), color: "blue" },
      { tier: "Tier 3: Deep Ensemble", percentage: 18, count: Math.floor(total * 0.18), color: "purple" },
      { tier: "Tier 4: Human Review", percentage: 2, count: Math.floor(total * 0.02), color: "orange" }
    ];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">DeepGuard AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button
              variant={isLive ? "default" : "outline"}
              size="sm"
              onClick={() => setIsLive(!isLive)}
              className="gap-2"
            >
              <Activity className={`h-4 w-4 ${isLive ? "animate-pulse" : ""}`} />
              {isLive ? "Live" : "Paused"}
            </Button>
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <Badge className="mb-3" variant="secondary">
              <BarChart3 className="h-3 w-3 mr-1" />
              System Dashboard
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Real-Time Monitoring
            </h1>
            <p className="text-muted-foreground">
              Live system metrics and performance analytics
            </p>
          </div>
          <Button variant="outline" className="gap-2" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 pb-20">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Throughput",
              value: `${(metrics.throughput / 1000).toFixed(1)}K`,
              unit: "videos/hour",
              icon: Zap,
              trend: "+12%",
              trendUp: true
            },
            {
              label: "Avg Latency",
              value: `${metrics.avgLatency}`,
              unit: "ms",
              icon: Clock,
              trend: "-3%",
              trendUp: true
            },
            {
              label: "Detection Accuracy",
              value: `${metrics.accuracy}`,
              unit: "%",
              icon: CheckCircle,
              trend: "+0.5%",
              trendUp: true
            },
            {
              label: "System Uptime",
              value: `${metrics.uptime}`,
              unit: "%",
              icon: Activity,
              trend: "stable",
              trendUp: true
            }
          ].map((metric, i) => (
            <Card key={i} className="p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <metric.icon className="h-8 w-8 text-primary" />
                <Badge variant={metric.trendUp ? "default" : "destructive"} className="text-xs">
                  {metric.trendUp ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {metric.trend}
                </Badge>
              </div>
              <div className="text-3xl font-bold mb-1">{metric.value}</div>
              <div className="text-sm text-muted-foreground">{metric.unit}</div>
              <div className="text-xs text-muted-foreground mt-2">{metric.label}</div>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Processing Queue */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-6">Processing Queue</h3>
                {isLoading ? (
                  <div className="text-center py-12 text-muted-foreground">Loading...</div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">Active Jobs</span>
                        <span className="text-2xl font-bold text-green-500">{metrics.activeJobs}</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">Queued Jobs</span>
                        <span className="text-2xl font-bold text-orange-500">{metrics.queuedJobs}</span>
                      </div>
                      <Progress value={12} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">Completed Today</span>
                        <span className="text-2xl font-bold text-blue-500">{metrics.completedToday.toLocaleString()}</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                  </div>
                )}
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-6">Tier Distribution</h3>
                {isLoading ? (
                  <div className="text-center py-12 text-muted-foreground">Loading...</div>
                ) : (
                  <div className="space-y-4">
                    {getTierDistribution().map((item, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="text-sm font-semibold">{item.tier}</span>
                            <p className="text-xs text-muted-foreground">{item.count.toLocaleString()} processed</p>
                          </div>
                          <span className="text-lg font-bold">{item.percentage}%</span>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Detection Results */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-6">Detection Results (All Time)</h3>
              {isLoading || !analyticsData ? (
                <div className="text-center py-12 text-muted-foreground">Loading...</div>
              ) : (
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                    <div className="text-3xl font-bold mb-1">{(analyticsData.by_prediction?.authentic || 0).toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Authentic Content</div>
                    <div className="text-xs text-green-600 mt-2">
                      {analyticsData.total_jobs > 0 
                        ? ((analyticsData.by_prediction?.authentic || 0) / analyticsData.total_jobs * 100).toFixed(1)
                        : 0}%
                    </div>
                  </div>
                  <div className="text-center p-6 rounded-lg bg-gradient-to-br from-red-500/10 to-red-500/5">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                    <div className="text-3xl font-bold mb-1">{(analyticsData.by_prediction?.deepfake || 0).toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Deepfakes Detected</div>
                    <div className="text-xs text-red-600 mt-2">
                      {analyticsData.total_jobs > 0 
                        ? ((analyticsData.by_prediction?.deepfake || 0) / analyticsData.total_jobs * 100).toFixed(1)
                        : 0}%
                    </div>
                  </div>
                  <div className="text-center p-6 rounded-lg bg-gradient-to-br from-orange-500/10 to-orange-500/5">
                    <Eye className="h-12 w-12 text-orange-500 mx-auto mb-3" />
                    <div className="text-3xl font-bold mb-1">{(analyticsData.by_prediction?.uncertain || 0).toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Uncertain / Review</div>
                    <div className="text-xs text-orange-600 mt-2">
                      {analyticsData.total_jobs > 0 
                        ? ((analyticsData.by_prediction?.uncertain || 0) / analyticsData.total_jobs * 100).toFixed(1)
                        : 0}%
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Error Monitoring */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-6">Error Monitoring</h3>
              <div className="space-y-3">
                {[
                  { service: "API Gateway", status: "healthy", errors: 0, latency: "12ms" },
                  { service: "Preprocessing Service", status: "healthy", errors: 2, latency: "145ms" },
                  { service: "Tier 1 Inference", status: "healthy", errors: 0, latency: "8ms" },
                  { service: "Tier 2 Inference", status: "healthy", errors: 1, latency: "87ms" },
                  { service: "Tier 3 Inference", status: "healthy", errors: 0, latency: "950ms" },
                  { service: "Result Aggregation", status: "healthy", errors: 0, latency: "23ms" }
                ].map((service, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        service.status === "healthy" ? "bg-green-500 animate-pulse" :
                        service.status === "degraded" ? "bg-orange-500 animate-pulse" : "bg-red-500"
                      }`} />
                      <div>
                        <div className="font-semibold">{service.service}</div>
                        <div className="text-xs text-muted-foreground">
                          {service.errors} errors • {service.latency} avg latency
                        </div>
                      </div>
                    </div>
                    <Badge variant={service.status === "healthy" ? "default" : "destructive"}>
                      {service.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Models Tab */}
          <TabsContent value="models" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-6">Model Performance Comparison</h3>
              {isLoading || !modelsData ? (
                <div className="text-center py-12 text-muted-foreground">Loading models data...</div>
              ) : (
                <div className="space-y-6">
                  {modelsData.models.map((model: any, i: number) => (
                    <Card key={i} className="p-6 bg-muted/50">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-lg">{model.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{model.version}</Badge>
                            <Badge variant={model.is_active ? "default" : "secondary"} className="text-xs">
                              {model.deployment_status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">{(model.accuracy * 100).toFixed(1)}%</div>
                          <div className="text-xs text-muted-foreground">Accuracy</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Tier</div>
                          <div className="font-bold">{model.tier}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">FP Rate</div>
                          <div className="font-bold">{(model.false_positive_rate * 100).toFixed(2)}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Rollout</div>
                          <div className="font-bold">{model.rollout_percentage}%</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Status</div>
                          <div className="font-bold">{model.is_active ? "Active" : "Inactive"}</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Infrastructure Tab */}
          <TabsContent value="infrastructure" className="space-y-6">
            {/* Resource Usage */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Cpu className="h-6 w-6 text-primary" />
                  CPU & GPU Usage
                </h3>
                <div className="space-y-4">
                  {[
                    { pool: "API Pool", cpu: 42, nodes: "6/10" },
                    { pool: "Preprocessing Pool", cpu: 78, nodes: "12/20" },
                    { pool: "GPU Pool (T4)", cpu: 85, nodes: "38/50" },
                    { pool: "GPU Pool (A100)", cpu: 92, nodes: "16/20" }
                  ].map((pool, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">{pool.pool}</span>
                        <span className="text-sm">
                          {pool.cpu}% • {pool.nodes} nodes
                        </span>
                      </div>
                      <Progress value={pool.cpu} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <HardDrive className="h-6 w-6 text-primary" />
                  Storage Usage
                </h3>
                <div className="space-y-4">
                  {[
                    { type: "S3 Hot Storage", used: 38.2, total: 50, unit: "TB" },
                    { type: "PostgreSQL", used: 1.2, total: 2, unit: "TB" },
                    { type: "MongoDB", used: 2.1, total: 3, unit: "TB" },
                    { type: "Redis Cache", used: 187, total: 256, unit: "GB" }
                  ].map((storage, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold">{storage.type}</span>
                        <span className="text-sm">
                          {storage.used} / {storage.total} {storage.unit}
                        </span>
                      </div>
                      <Progress value={(storage.used / storage.total) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Network Traffic */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Network className="h-6 w-6 text-primary" />
                Network Traffic
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { label: "Ingress", value: "42.3 Gbps", trend: "+8%", trendUp: true },
                  { label: "Egress", value: "18.7 Gbps", trend: "+5%", trendUp: true },
                  { label: "Inter-Service", value: "156.2 Gbps", trend: "+12%", trendUp: true }
                ].map((traffic, i) => (
                  <div key={i} className="text-center p-6 rounded-lg bg-muted">
                    <div className="text-sm text-muted-foreground mb-2">{traffic.label}</div>
                    <div className="text-3xl font-bold mb-2">{traffic.value}</div>
                    <Badge variant={traffic.trendUp ? "default" : "secondary"} className="text-xs">
                      {traffic.trendUp ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {traffic.trend}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            {/* Cost Analysis */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-6">Cost Analysis (Current Month)</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  {[
                    { category: "Compute (K8s)", cost: 15234, budget: 15000 },
                    { category: "GPU Instances", cost: 24567, budget: 25000 },
                    { category: "Storage", cost: 7892, budget: 8000 },
                    { category: "Database", cost: 4956, budget: 5000 },
                    { category: "Network/CDN", cost: 2845, budget: 3000 },
                    { category: "Monitoring", cost: 1923, budget: 2000 }
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold">{item.category}</span>
                        <span className="text-sm">${item.cost.toLocaleString()} / ${item.budget.toLocaleString()}</span>
                      </div>
                      <Progress value={(item.cost / item.budget) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center p-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-2">Total Spent</div>
                    <div className="text-5xl font-bold mb-2">$57,417</div>
                    <div className="text-sm text-muted-foreground mb-4">of $58,000 budget</div>
                    <Badge variant="default">98.9% utilized</Badge>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {/* Usage Statistics */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-6">Organization Usage</h3>
              {isLoading || !usageData ? (
                <div className="text-center py-12 text-muted-foreground">Loading usage data...</div>
              ) : (
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { label: "Quota Used", value: usageData.quota_used.toLocaleString(), change: null },
                    { label: "Quota Limit", value: usageData.quota_limit.toLocaleString(), change: null },
                    { label: "Remaining", value: usageData.quota_remaining.toLocaleString(), change: null },
                    { label: "This Month", value: usageData.usage_this_month.toLocaleString(), change: null }
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-4 rounded-lg bg-muted">
                      <div className="text-sm text-muted-foreground mb-2">{stat.label}</div>
                      <div className="text-3xl font-bold mb-1">{stat.value}</div>
                      {stat.change && (
                        <Badge variant="default" className="text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {stat.change}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Confidence Distribution */}
            {analyticsData && analyticsData.avg_confidence !== null && (
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-6">Average Confidence Score</h3>
                <div className="text-center p-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                  <div className="text-6xl font-bold mb-4 text-primary">
                    {(analyticsData.avg_confidence * 100).toFixed(1)}%
                  </div>
                  <p className="text-muted-foreground">
                    Average detection confidence across all completed jobs
                  </p>
                </div>
              </Card>
            )}

            {/* Jobs Timeline */}
            {analyticsData && analyticsData.jobs_by_day && analyticsData.jobs_by_day.length > 0 && (
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-6">Detection Jobs (Last 30 Days)</h3>
                <div className="space-y-3">
                  {analyticsData.jobs_by_day.slice(-7).reverse().map((day: any, i: number) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold">{new Date(day.date).toLocaleDateString()}</span>
                        <span className="text-sm">{day.count.toLocaleString()} jobs</span>
                      </div>
                      <Progress 
                        value={Math.min((day.count / Math.max(...analyticsData.jobs_by_day.map((d: any) => d.count))) * 100, 100)} 
                        className="h-2" 
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Detection Status Breakdown */}
            {analyticsData && analyticsData.by_status && (
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-6">Jobs by Status</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  {Object.entries(analyticsData.by_status).map(([status, count]: [string, any], i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <h4 className="font-bold mb-2 capitalize">{status}</h4>
                      <div className="text-2xl font-bold mb-1">{count.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">
                        {analyticsData.total_jobs > 0 
                          ? ((count / analyticsData.total_jobs) * 100).toFixed(1)
                          : 0}%
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}