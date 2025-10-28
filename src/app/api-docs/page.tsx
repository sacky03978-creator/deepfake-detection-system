"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, ArrowLeft, Code, Copy, Check, FileCode, Zap, Globe, Webhook } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function APIDocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ code, language, id }: { code: string; language: string; id: string }) => (
    <div className="relative">
      <div className="absolute right-2 top-2 z-10">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => copyToClipboard(code, id)}
          className="h-8 gap-2"
        >
          {copiedCode === id ? (
            <>
              <Check className="h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy
            </>
          )}
        </Button>
      </div>
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );

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
          <FileCode className="h-3 w-3 mr-1" />
          API Documentation
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          API Reference
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Complete REST API documentation with authentication, endpoints, and code examples
        </p>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-4 sticky top-20">
              <nav className="space-y-1">
                <a href="#authentication" className="block px-3 py-2 rounded hover:bg-muted transition text-sm">
                  Authentication
                </a>
                <a href="#detect" className="block px-3 py-2 rounded hover:bg-muted transition text-sm">
                  POST /detect
                </a>
                <a href="#result" className="block px-3 py-2 rounded hover:bg-muted transition text-sm">
                  GET /result
                </a>
                <a href="#batch" className="block px-3 py-2 rounded hover:bg-muted transition text-sm">
                  POST /batch
                </a>
                <a href="#websocket" className="block px-3 py-2 rounded hover:bg-muted transition text-sm">
                  WebSocket Stream
                </a>
                <a href="#webhooks" className="block px-3 py-2 rounded hover:bg-muted transition text-sm">
                  Webhooks
                </a>
                <a href="#errors" className="block px-3 py-2 rounded hover:bg-muted transition text-sm">
                  Error Handling
                </a>
                <a href="#rate-limits" className="block px-3 py-2 rounded hover:bg-muted transition text-sm">
                  Rate Limits
                </a>
              </nav>
            </Card>
          </div>

          {/* Main Documentation */}
          <div className="lg:col-span-3 space-y-12">
            {/* Base URL */}
            <Card className="p-8">
              <h2 className="text-3xl font-bold mb-4">Base URL</h2>
              <CodeBlock
                id="base-url"
                language="bash"
                code="https://api.deepguard.ai/v1"
              />
            </Card>

            {/* Authentication */}
            <Card className="p-8" id="authentication">
              <h2 className="text-3xl font-bold mb-4">Authentication</h2>
              <p className="text-muted-foreground mb-6">
                All API requests require authentication using Bearer tokens (JWT) or API keys.
              </p>

              <Tabs defaultValue="jwt" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="jwt">JWT Token</TabsTrigger>
                  <TabsTrigger value="apikey">API Key</TabsTrigger>
                </TabsList>

                <TabsContent value="jwt" className="space-y-4">
                  <h3 className="font-bold text-lg">OAuth2 / JWT</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Obtain a JWT token by authenticating with your credentials.
                  </p>
                  
                  <h4 className="font-semibold mb-2">Login Request</h4>
                  <CodeBlock
                    id="auth-login"
                    language="bash"
                    code={`curl -X POST https://api.deepguard.ai/v1/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "your_password"
  }'`}
                  />

                  <h4 className="font-semibold mb-2 mt-6">Response</h4>
                  <CodeBlock
                    id="auth-response"
                    language="json"
                    code={`{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@example.com",
    "organization": "Acme Corp"
  }
}`}
                  />

                  <h4 className="font-semibold mb-2 mt-6">Using the Token</h4>
                  <CodeBlock
                    id="auth-usage"
                    language="bash"
                    code={`curl https://api.deepguard.ai/v1/detect \\
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."`}
                  />
                </TabsContent>

                <TabsContent value="apikey" className="space-y-4">
                  <h3 className="font-bold text-lg">API Key Authentication</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Use your API key in the Authorization header for simpler authentication.
                  </p>
                  
                  <CodeBlock
                    id="apikey-usage"
                    language="bash"
                    code={`curl https://api.deepguard.ai/v1/detect \\
  -H "Authorization: ApiKey sk_live_1234567890abcdef"`}
                  />

                  <Alert className="mt-4">
                    <AlertDescription>
                      <strong>Security:</strong> Never expose your API key in client-side code. 
                      Always use environment variables and make API calls from your backend.
                    </AlertDescription>
                  </Alert>
                </TabsContent>
              </Tabs>
            </Card>

            {/* POST /detect */}
            <Card className="p-8" id="detect">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-green-500">POST</Badge>
                <code className="text-xl font-bold">/api/v1/detect</code>
              </div>
              <p className="text-muted-foreground mb-6">
                Submit a video, audio, or image file for deepfake detection.
              </p>

              <h3 className="font-bold text-lg mb-3">Parameters</h3>
              <div className="space-y-3 mb-6">
                {[
                  { name: "file", type: "File", required: true, desc: "Video, audio, or image file (max 2GB)" },
                  { name: "mode", type: "String", required: false, desc: "Detection mode: 'fast', 'balanced', 'thorough' (default: 'balanced')" },
                  { name: "webhook_url", type: "String", required: false, desc: "URL to receive result notification" }
                ].map((param, i) => (
                  <div key={i} className="flex gap-4 p-3 bg-muted rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="font-bold">{param.name}</code>
                        {param.required && <Badge variant="destructive" className="text-xs">Required</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{param.desc}</p>
                    </div>
                    <Badge variant="outline">{param.type}</Badge>
                  </div>
                ))}
              </div>

              <Tabs defaultValue="curl" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                </TabsList>

                <TabsContent value="curl">
                  <CodeBlock
                    id="detect-curl"
                    language="bash"
                    code={`curl -X POST https://api.deepguard.ai/v1/detect \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -F "file=@/path/to/video.mp4" \\
  -F "mode=balanced" \\
  -F "webhook_url=https://your-server.com/webhook"`}
                  />
                </TabsContent>

                <TabsContent value="python">
                  <CodeBlock
                    id="detect-python"
                    language="python"
                    code={`import requests

url = "https://api.deepguard.ai/v1/detect"
headers = {
    "Authorization": "Bearer YOUR_TOKEN"
}
files = {
    "file": open("video.mp4", "rb")
}
data = {
    "mode": "balanced",
    "webhook_url": "https://your-server.com/webhook"
}

response = requests.post(url, headers=headers, files=files, data=data)
result = response.json()

print(f"Job ID: {result['job_id']}")
print(f"Status: {result['status']}")
print(f"Estimated Time: {result['estimated_time']}s")`}
                  />
                </TabsContent>

                <TabsContent value="javascript">
                  <CodeBlock
                    id="detect-javascript"
                    language="javascript"
                    code={`const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

const form = new FormData();
form.append('file', fs.createReadStream('video.mp4'));
form.append('mode', 'balanced');
form.append('webhook_url', 'https://your-server.com/webhook');

axios.post('https://api.deepguard.ai/v1/detect', form, {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    ...form.getHeaders()
  }
})
.then(response => {
  console.log('Job ID:', response.data.job_id);
  console.log('Status:', response.data.status);
})
.catch(error => {
  console.error('Error:', error.response.data);
});`}
                  />
                </TabsContent>
              </Tabs>

              <h3 className="font-bold text-lg mb-3 mt-6">Response</h3>
              <CodeBlock
                id="detect-response"
                language="json"
                code={`{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "submitted",
  "estimated_time": 5,
  "message": "Your submission is being processed",
  "created_at": "2024-01-15T10:30:00Z"
}`}
              />
            </Card>

            {/* GET /result */}
            <Card className="p-8" id="result">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-blue-500">GET</Badge>
                <code className="text-xl font-bold">/api/v1/result/{"{job_id}"}</code>
              </div>
              <p className="text-muted-foreground mb-6">
                Retrieve the detection result for a specific job.
              </p>

              <Tabs defaultValue="curl" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                </TabsList>

                <TabsContent value="curl">
                  <CodeBlock
                    id="result-curl"
                    language="bash"
                    code={`curl https://api.deepguard.ai/v1/result/550e8400-e29b-41d4-a716-446655440000 \\
  -H "Authorization: Bearer YOUR_TOKEN"`}
                  />
                </TabsContent>

                <TabsContent value="python">
                  <CodeBlock
                    id="result-python"
                    language="python"
                    code={`import requests

job_id = "550e8400-e29b-41d4-a716-446655440000"
url = f"https://api.deepguard.ai/v1/result/{job_id}"
headers = {"Authorization": "Bearer YOUR_TOKEN"}

response = requests.get(url, headers=headers)
result = response.json()

print(f"Verdict: {result['verdict']}")
print(f"Confidence: {result['confidence']}%")
print(f"Processing Time: {result['processing_time_ms']}ms")`}
                  />
                </TabsContent>

                <TabsContent value="javascript">
                  <CodeBlock
                    id="result-javascript"
                    language="javascript"
                    code={`const axios = require('axios');

const jobId = "550e8400-e29b-41d4-a716-446655440000";
axios.get(\`https://api.deepguard.ai/v1/result/\${jobId}\`, {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
})
.then(response => {
  console.log('Verdict:', response.data.verdict);
  console.log('Confidence:', response.data.confidence);
})
.catch(error => console.error('Error:', error));`}
                  />
                </TabsContent>
              </Tabs>

              <h3 className="font-bold text-lg mb-3 mt-6">Response</h3>
              <CodeBlock
                id="result-response"
                language="json"
                code={`{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "verdict": "deepfake",
  "confidence": 87.3,
  "tier_completed": 3,
  "processing_time_ms": 943,
  "tier_scores": {
    "tier1": 0.65,
    "tier2": 0.82,
    "tier3": 0.873
  },
  "model_breakdown": {
    "spatial_cnn": 0.91,
    "temporal_lstm": 0.84,
    "audio_cnn": 0.89,
    "av_sync": 0.78,
    "ppg_analyzer": 0.72,
    "gan_detector": 0.95
  },
  "explanation": {
    "top_signals": [
      {
        "detector": "gan_detector",
        "score": 0.95,
        "interpretation": "Strong GAN fingerprint detected in frequency domain"
      },
      {
        "detector": "spatial_cnn",
        "score": 0.91,
        "interpretation": "Spatial artifacts consistent with face manipulation"
      },
      {
        "detector": "audio_cnn",
        "score": 0.89,
        "interpretation": "Synthetic audio patterns detected"
      }
    ],
    "confidence_level": "HIGH"
  },
  "heatmap_url": "https://storage.deepguard.ai/heatmaps/550e8400.png",
  "submitted_at": "2024-01-15T10:30:00Z",
  "completed_at": "2024-01-15T10:30:01Z"
}`}
              />
            </Card>

            {/* POST /batch */}
            <Card className="p-8" id="batch">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-green-500">POST</Badge>
                <code className="text-xl font-bold">/api/v1/batch</code>
              </div>
              <p className="text-muted-foreground mb-6">
                Submit multiple files for batch processing (max 100 files per request).
              </p>

              <CodeBlock
                id="batch-curl"
                language="bash"
                code={`curl -X POST https://api.deepguard.ai/v1/batch \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -F "files[]=@video1.mp4" \\
  -F "files[]=@video2.mp4" \\
  -F "files[]=@video3.mp4" \\
  -F "mode=balanced"`}
              />

              <h3 className="font-bold text-lg mb-3 mt-6">Response</h3>
              <CodeBlock
                id="batch-response"
                language="json"
                code={`{
  "batch_id": "batch_123e4567-e89b-12d3",
  "job_ids": [
    "job_1_550e8400-e29b-41d4",
    "job_2_550e8400-e29b-41d5",
    "job_3_550e8400-e29b-41d6"
  ],
  "total_files": 3,
  "status": "submitted",
  "estimated_completion": "2024-01-15T10:35:00Z"
}`}
              />
            </Card>

            {/* WebSocket */}
            <Card className="p-8" id="websocket">
              <div className="flex items-center gap-3 mb-4">
                <Badge className="bg-purple-500">WebSocket</Badge>
                <code className="text-xl font-bold">wss://api.deepguard.ai/ws/stream</code>
              </div>
              <p className="text-muted-foreground mb-6">
                Real-time streaming detection for live video feeds.
              </p>

              <CodeBlock
                id="websocket-example"
                language="javascript"
                code={`const WebSocket = require('ws');

const ws = new WebSocket('wss://api.deepguard.ai/ws/stream?token=YOUR_TOKEN');

ws.on('open', () => {
  console.log('Connected to streaming endpoint');
  
  // Send video frame data
  const frameData = Buffer.from(/* frame bytes */);
  ws.send(frameData);
});

ws.on('message', (data) => {
  const result = JSON.parse(data);
  console.log('Frame result:', result);
  // {
  //   "frame_id": 1234,
  //   "verdict": "real",
  //   "confidence": 0.94,
  //   "processing_time_ms": 45
  // }
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});`}
              />
            </Card>

            {/* Webhooks */}
            <Card className="p-8" id="webhooks">
              <div className="flex items-center gap-3 mb-4">
                <Webhook className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Webhooks</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Receive real-time notifications when detection jobs complete.
              </p>

              <h3 className="font-bold text-lg mb-3">Webhook Payload</h3>
              <CodeBlock
                id="webhook-payload"
                language="json"
                code={`{
  "event": "detection.completed",
  "timestamp": "2024-01-15T10:30:01Z",
  "data": {
    "job_id": "550e8400-e29b-41d4-a716-446655440000",
    "verdict": "deepfake",
    "confidence": 87.3,
    "tier_completed": 3,
    "processing_time_ms": 943,
    "result_url": "https://api.deepguard.ai/v1/result/550e8400-e29b-41d4"
  },
  "signature": "sha256=..."
}`}
              />

              <h3 className="font-bold text-lg mb-3 mt-6">Verifying Webhook Signatures</h3>
              <CodeBlock
                id="webhook-verify"
                language="python"
                code={`import hmac
import hashlib

def verify_webhook_signature(payload, signature, secret):
    """Verify webhook signature for security"""
    expected_signature = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(
        f"sha256={expected_signature}",
        signature
    )

# Usage
webhook_secret = "your_webhook_secret"
payload = request.body.decode('utf-8')
signature = request.headers.get('X-Deepguard-Signature')

if verify_webhook_signature(payload, signature, webhook_secret):
    # Process webhook
    data = json.loads(payload)
    print(f"Job {data['data']['job_id']} completed")
else:
    print("Invalid signature!")`}
              />
            </Card>

            {/* Error Handling */}
            <Card className="p-8" id="errors">
              <h2 className="text-2xl font-bold mb-4">Error Handling</h2>
              <p className="text-muted-foreground mb-6">
                Standard HTTP status codes are used. Error responses include detailed messages.
              </p>

              <div className="space-y-4">
                {[
                  { code: 400, message: "Bad Request", desc: "Invalid parameters or malformed request" },
                  { code: 401, message: "Unauthorized", desc: "Missing or invalid authentication token" },
                  { code: 403, message: "Forbidden", desc: "Insufficient permissions" },
                  { code: 404, message: "Not Found", desc: "Resource not found" },
                  { code: 413, message: "Payload Too Large", desc: "File exceeds 2GB limit" },
                  { code: 429, message: "Too Many Requests", desc: "Rate limit exceeded" },
                  { code: 500, message: "Internal Server Error", desc: "Server-side error occurred" }
                ].map((error, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-muted rounded-lg">
                    <Badge variant="destructive" className="h-fit">{error.code}</Badge>
                    <div className="flex-1">
                      <h4 className="font-bold mb-1">{error.message}</h4>
                      <p className="text-sm text-muted-foreground">{error.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="font-bold text-lg mb-3 mt-6">Error Response Format</h3>
              <CodeBlock
                id="error-format"
                language="json"
                code={`{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "You have exceeded your rate limit of 1000 requests per hour",
    "details": {
      "limit": 1000,
      "remaining": 0,
      "reset_at": "2024-01-15T11:00:00Z"
    }
  }
}`}
              />
            </Card>

            {/* Rate Limits */}
            <Card className="p-8" id="rate-limits">
              <h2 className="text-2xl font-bold mb-4">Rate Limits</h2>
              <p className="text-muted-foreground mb-6">
                Rate limits are enforced per user/organization based on subscription tier.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {[
                  { tier: "Free", limit: "100/hour", burst: "10/min" },
                  { tier: "Professional", limit: "1,000/hour", burst: "50/min" },
                  { tier: "Enterprise", limit: "10,000/hour", burst: "500/min" }
                ].map((tier, i) => (
                  <Card key={i} className="p-4 text-center">
                    <h4 className="font-bold mb-2">{tier.tier}</h4>
                    <p className="text-2xl font-bold mb-1">{tier.limit}</p>
                    <p className="text-sm text-muted-foreground">Burst: {tier.burst}</p>
                  </Card>
                ))}
              </div>

              <h3 className="font-bold text-lg mb-3">Rate Limit Headers</h3>
              <CodeBlock
                id="rate-limit-headers"
                language="http"
                code={`X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1705316400`}
              />

              <Alert className="mt-4">
                <AlertDescription>
                  When rate limited, wait for the time specified in <code>X-RateLimit-Reset</code> 
                  or implement exponential backoff.
                </AlertDescription>
              </Alert>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
