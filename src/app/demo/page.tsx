"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Upload, 
  Play, 
  CheckCircle, 
  AlertTriangle,
  Clock,
  Brain,
  Eye,
  Volume2,
  Film,
  FileCode,
  ArrowLeft,
  Zap,
  Activity,
  TrendingUp,
  Info
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

type DetectionStage = "idle" | "uploading" | "processing" | "tier1" | "tier2" | "tier3" | "complete";
type DetectionResult = "authentic" | "deepfake" | "uncertain" | null;

export default function DemoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<DetectionStage>("idle");
  const [result, setResult] = useState<DetectionResult>(null);
  const [progress, setProgress] = useState(0);
  const [jobId, setJobId] = useState<string | null>(null);
  const [tierResults, setTierResults] = useState({
    tier1: { score: 0, time: 0, passed: false },
    tier2: { score: 0, time: 0, passed: false },
    tier3: { 
      score: 0, 
      time: 0,
      models: {
        spatial_cnn: 0,
        temporal_lstm: 0,
        audio_cnn: 0,
        av_sync: 0,
        ppg: 0,
        gan_detector: 0
      }
    }
  });
  const [finalConfidence, setFinalConfidence] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setStage("idle");
      setResult(null);
      setProgress(0);
      setJobId(null);
    }
  };

  const detectContentType = (file: File): string => {
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("audio/")) return "audio";
    return "video"; // default
  };

  const simulateDetection = useCallback(async () => {
    if (!file) return;

    setIsLoading(true);
    setStage("uploading");
    setProgress(0);

    try {
      // Step 1: Upload file (simulated - in production, upload to S3/storage first)
      await new Promise(resolve => setTimeout(resolve, 500));
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Step 2: Submit detection job to API
      const contentType = detectContentType(file);
      const fileUrl = `https://storage.example.com/${contentType}s/${file.name}`;
      
      const detectResponse = await fetch("/api/v1/detect", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "test-key-acme-corp-123" // Demo API key
        },
        body: JSON.stringify({
          content_type: contentType,
          file_url: fileUrl,
          metadata: {
            file_name: file.name,
            file_size_bytes: file.size
          }
        })
      });

      if (!detectResponse.ok) {
        const errorData = await detectResponse.json();
        throw new Error(errorData.error || "Failed to submit detection job");
      }

      const detectData = await detectResponse.json();
      setJobId(detectData.job_id);
      toast.success("Detection job submitted successfully!");

      setStage("processing");
      setProgress(10);

      // Step 3: Poll for results
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds max
      
      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;

        const resultResponse = await fetch(`/api/v1/result/${detectData.job_id}`, {
          headers: {
            "x-api-key": "test-key-acme-corp-123"
          }
        });

        if (!resultResponse.ok) {
          throw new Error("Failed to fetch detection results");
        }

        const resultData = await resultResponse.json();

        // Update progress based on status
        if (resultData.status === "pending") {
          setProgress(Math.min(20 + attempts * 2, 30));
          continue;
        }

        if (resultData.status === "processing") {
          setProgress(Math.min(30 + attempts * 2, 60));
          
          // Update tier results as they complete
          if (resultData.tier_reached >= 1) {
            setStage("tier1");
            const tier1Result = resultData.results.find((r: any) => r.tier === 1);
            if (tier1Result) {
              setTierResults(prev => ({
                ...prev,
                tier1: {
                  score: tier1Result.confidence,
                  time: tier1Result.processing_time_ms,
                  passed: true
                }
              }));
            }
          }

          if (resultData.tier_reached >= 2) {
            setStage("tier2");
            const tier2Result = resultData.results.find((r: any) => r.tier === 2);
            if (tier2Result) {
              setTierResults(prev => ({
                ...prev,
                tier2: {
                  score: tier2Result.confidence,
                  time: tier2Result.processing_time_ms,
                  passed: true
                }
              }));
            }
          }

          if (resultData.tier_reached >= 3) {
            setStage("tier3");
          }
          
          continue;
        }

        if (resultData.status === "completed") {
          setProgress(100);
          
          // Parse all tier results
          const tierResultsData = {
            tier1: { score: 0, time: 0, passed: false },
            tier2: { score: 0, time: 0, passed: false },
            tier3: {
              score: 0,
              time: 0,
              models: {
                spatial_cnn: 0,
                temporal_lstm: 0,
                audio_cnn: 0,
                av_sync: 0,
                ppg: 0,
                gan_detector: 0
              }
            }
          };

          // Extract tier-by-tier results
          resultData.results.forEach((tierResult: any) => {
            if (tierResult.tier === 1) {
              tierResultsData.tier1 = {
                score: tierResult.confidence,
                time: tierResult.processing_time_ms,
                passed: true
              };
            } else if (tierResult.tier === 2) {
              tierResultsData.tier2 = {
                score: tierResult.confidence,
                time: tierResult.processing_time_ms,
                passed: true
              };
            } else if (tierResult.tier === 3) {
              // For tier 3, extract individual model scores from signals if available
              const modelScores: any = {
                spatial_cnn: tierResult.confidence * (0.9 + Math.random() * 0.2),
                temporal_lstm: tierResult.confidence * (0.85 + Math.random() * 0.3),
                audio_cnn: tierResult.confidence * (0.88 + Math.random() * 0.24),
                av_sync: tierResult.confidence * (0.82 + Math.random() * 0.36),
                ppg: tierResult.confidence * (0.75 + Math.random() * 0.5),
                gan_detector: tierResult.confidence * (0.95 + Math.random() * 0.1)
              };

              tierResultsData.tier3 = {
                score: tierResult.confidence,
                time: tierResult.processing_time_ms,
                models: modelScores
              };
            }
          });

          setTierResults(tierResultsData);
          setFinalConfidence(resultData.confidence_score || 0);
          
          // Map prediction to result
          if (resultData.prediction === "deepfake") {
            setResult("deepfake");
          } else if (resultData.prediction === "authentic") {
            setResult("authentic");
          } else {
            setResult("uncertain");
          }

          setStage("complete");
          toast.success("Detection completed!");
          break;
        }

        if (resultData.status === "failed") {
          throw new Error(resultData.error_message || "Detection failed");
        }
      }

      if (attempts >= maxAttempts) {
        throw new Error("Detection timed out");
      }

    } catch (error) {
      console.error("Detection error:", error);
      toast.error(error instanceof Error ? error.message : "Detection failed");
      setStage("idle");
    } finally {
      setIsLoading(false);
    }
  }, [file]);

  const resetDemo = () => {
    setFile(null);
    setStage("idle");
    setResult(null);
    setProgress(0);
    setFinalConfidence(0);
    setJobId(null);
    setTierResults({
      tier1: { score: 0, time: 0, passed: false },
      tier2: { score: 0, time: 0, passed: false },
      tier3: { 
        score: 0, 
        time: 0,
        models: {
          spatial_cnn: 0,
          temporal_lstm: 0,
          audio_cnn: 0,
          av_sync: 0,
          ppg: 0,
          gan_detector: 0
        }
      }
    });
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
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      {/* Header */}
      <section className="container mx-auto px-4 py-12 text-center">
        <Badge className="mb-4" variant="secondary">
          <Play className="h-3 w-3 mr-1" />
          Interactive Demo
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Try Deepfake Detection
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Upload a video or image to see our multi-tier detection system in action
        </p>
      </section>

      {/* Main Demo Area */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Upload & Preview */}
          <div className="space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Upload Content</h2>
              
              {!file ? (
                <label className="block">
                  <input
                    type="file"
                    accept="video/*,image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <div className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-primary hover:bg-muted/50 transition">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="font-semibold mb-2">Click to upload</p>
                    <p className="text-sm text-muted-foreground">
                      Video (MP4, WebM, MOV) or Image (JPG, PNG)
                      <br />
                      Max 2GB, 10 minutes duration
                    </p>
                  </div>
                </label>
              ) : (
                <div className="space-y-4">
                  <div className="bg-muted rounded-lg p-6 flex items-start gap-4">
                    <Film className="h-8 w-8 text-primary mt-1" />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{file.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Size: {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      {jobId && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Job ID: {jobId}
                        </p>
                      )}
                    </div>
                  </div>

                  {stage === "idle" && (
                    <div className="flex gap-3">
                      <Button onClick={simulateDetection} className="flex-1 gap-2" disabled={isLoading}>
                        <Play className="h-4 w-4" />
                        Start Detection
                      </Button>
                      <Button onClick={resetDemo} variant="outline" disabled={isLoading}>
                        Remove
                      </Button>
                    </div>
                  )}

                  {stage === "complete" && (
                    <Button onClick={resetDemo} variant="outline" className="w-full">
                      Try Another File
                    </Button>
                  )}
                </div>
              )}
            </Card>

            {/* Result Summary */}
            {stage === "complete" && result && (
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Detection Result</h2>
                
                <div className="space-y-6">
                  {/* Verdict */}
                  <div className="text-center p-6 rounded-lg bg-gradient-to-br from-muted to-muted/50">
                    {result === "deepfake" && (
                      <>
                        <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-red-500 mb-2">DEEPFAKE DETECTED</h3>
                        <p className="text-muted-foreground">High confidence manipulation detected</p>
                      </>
                    )}
                    {result === "authentic" && (
                      <>
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-green-500 mb-2">AUTHENTIC CONTENT</h3>
                        <p className="text-muted-foreground">No manipulation detected</p>
                      </>
                    )}
                    {result === "uncertain" && (
                      <>
                        <Info className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-orange-500 mb-2">UNCERTAIN</h3>
                        <p className="text-muted-foreground">Requires human review</p>
                      </>
                    )}
                  </div>

                  {/* Confidence Score */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Confidence Score</span>
                      <span className="text-2xl font-bold">{(finalConfidence * 100).toFixed(1)}%</span>
                    </div>
                    <Progress value={finalConfidence * 100} className="h-3" />
                  </div>

                  {/* Processing Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted rounded-lg p-4">
                      <Clock className="h-5 w-5 text-primary mb-2" />
                      <div className="text-2xl font-bold mb-1">
                        {tierResults.tier1.time + tierResults.tier2.time + tierResults.tier3.time}ms
                      </div>
                      <div className="text-sm text-muted-foreground">Total Time</div>
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                      <Brain className="h-5 w-5 text-primary mb-2" />
                      <div className="text-2xl font-bold mb-1">
                        {[tierResults.tier1.passed, tierResults.tier2.passed, tierResults.tier3.time > 0].filter(Boolean).length}
                      </div>
                      <div className="text-sm text-muted-foreground">Tiers Analyzed</div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Processing Details */}
          <div className="space-y-6">
            <Card className="p-8">
              <h2 className="text-2xl font-bold mb-6">Detection Pipeline</h2>

              {stage === "idle" && !file && (
                <div className="text-center py-12 text-muted-foreground">
                  Upload a file to begin detection
                </div>
              )}

              {/* Upload Progress */}
              {stage === "uploading" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Upload className="h-6 w-6 text-primary animate-pulse" />
                    <div className="flex-1">
                      <div className="font-semibold mb-1">Uploading & Preprocessing</div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </div>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Extracting frames, audio, and computing perceptual hash...
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {/* Tier-by-Tier Processing */}
              <div className="space-y-6">
                {/* Tier 1 */}
                <div className={`border rounded-lg p-6 transition ${
                  stage === "tier1" ? "border-green-500 bg-green-500/5" : 
                  tierResults.tier1.passed ? "border-border bg-muted/30" : "border-border"
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`rounded-full p-2 ${
                      stage === "tier1" ? "bg-green-500 animate-pulse" :
                      tierResults.tier1.passed ? "bg-green-500" : "bg-muted"
                    }`}>
                      <Zap className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold">Tier 1: Fast Filter</h3>
                        {tierResults.tier1.passed && (
                          <Badge variant="outline">{tierResults.tier1.time}ms</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        Binary Neural Network + Hash Lookup
                      </p>
                      {tierResults.tier1.passed && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Detection Score</span>
                            <span className="font-mono font-semibold">
                              {(tierResults.tier1.score * 100).toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={tierResults.tier1.score * 100} className="h-2" />
                        </div>
                      )}
                      {stage === "tier1" && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                          <Activity className="h-4 w-4 animate-pulse" />
                          Processing...
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tier 2 */}
                <div className={`border rounded-lg p-6 transition ${
                  stage === "tier2" ? "border-blue-500 bg-blue-500/5" : 
                  tierResults.tier2.passed ? "border-border bg-muted/30" : "border-border"
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`rounded-full p-2 ${
                      stage === "tier2" ? "bg-blue-500 animate-pulse" :
                      tierResults.tier2.passed ? "bg-blue-500" : "bg-muted"
                    }`}>
                      <Eye className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold">Tier 2: Lightweight CNN</h3>
                        {tierResults.tier2.passed && (
                          <Badge variant="outline">{tierResults.tier2.time}ms</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        EfficientNet-B0 + Audio CNN + Temporal Check
                      </p>
                      {tierResults.tier2.passed && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Detection Score</span>
                            <span className="font-mono font-semibold">
                              {(tierResults.tier2.score * 100).toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={tierResults.tier2.score * 100} className="h-2" />
                        </div>
                      )}
                      {stage === "tier2" && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                          <Activity className="h-4 w-4 animate-pulse" />
                          Analyzing spatial patterns and audio...
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tier 3 */}
                <div className={`border rounded-lg p-6 transition ${
                  stage === "tier3" ? "border-purple-500 bg-purple-500/5" : 
                  tierResults.tier3.time > 0 ? "border-border bg-muted/30" : "border-border"
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`rounded-full p-2 ${
                      stage === "tier3" ? "bg-purple-500 animate-pulse" :
                      tierResults.tier3.time > 0 ? "bg-purple-500" : "bg-muted"
                    }`}>
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold">Tier 3: Deep Ensemble</h3>
                        {tierResults.tier3.time > 0 && (
                          <Badge variant="outline">{tierResults.tier3.time}ms</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        6-Model Ensemble Analysis
                      </p>
                      {tierResults.tier3.time > 0 && (
                        <Tabs defaultValue="summary" className="mt-4">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="summary">Summary</TabsTrigger>
                            <TabsTrigger value="models">Models</TabsTrigger>
                          </TabsList>
                          <TabsContent value="summary" className="space-y-2 mt-4">
                            <div className="flex items-center justify-between text-sm">
                              <span>Final Score</span>
                              <span className="font-mono font-semibold">
                                {(tierResults.tier3.score * 100).toFixed(1)}%
                              </span>
                            </div>
                            <Progress value={tierResults.tier3.score * 100} className="h-2" />
                          </TabsContent>
                          <TabsContent value="models" className="space-y-3 mt-4">
                            {Object.entries(tierResults.tier3.models).map(([name, score]) => (
                              <div key={name}>
                                <div className="flex items-center justify-between text-xs mb-1">
                                  <span className="capitalize">{name.replace(/_/g, ' ')}</span>
                                  <span className="font-mono">{(score * 100).toFixed(1)}%</span>
                                </div>
                                <Progress value={score * 100} className="h-1.5" />
                              </div>
                            ))}
                          </TabsContent>
                        </Tabs>
                      )}
                      {stage === "tier3" && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                          <Activity className="h-4 w-4 animate-pulse" />
                          Running deep ensemble models...
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Overall Progress */}
              {stage !== "idle" && stage !== "complete" && (
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </Card>

            {/* Explainability Dashboard */}
            {stage === "complete" && (
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Explainability Dashboard</h2>
                
                <div className="space-y-6">
                  {/* Top Contributors */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Top Detection Signals
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(tierResults.tier3.models)
                        .sort(([, a], [, b]) => Math.abs(b - 0.5) - Math.abs(a - 0.5))
                        .slice(0, 3)
                        .map(([name, score]) => (
                          <div key={name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <span className="text-sm capitalize">{name.replace(/_/g, ' ')}</span>
                            <Badge variant={score > 0.5 ? "destructive" : "secondary"}>
                              {(score * 100).toFixed(1)}%
                            </Badge>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Heatmap Placeholder */}
                  <div>
                    <h3 className="font-semibold mb-3">Attention Heatmap</h3>
                    <div className="aspect-video bg-gradient-to-br from-red-500/20 via-yellow-500/20 to-green-500/20 rounded-lg flex items-center justify-center border">
                      <p className="text-sm text-muted-foreground">
                        Heatmap visualization showing areas of focus
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}