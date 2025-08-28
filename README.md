# 🚀 Al-Dalil: Advanced AI-Powered English Learning Platform

A comprehensive English learning application powered by multiple state-of-the-art AI models through Cloudflare Workers.

## 🌟 Features

### 📚 **English Learning Platform**
- Interactive lessons and practice exercises
- Video learning carousel
- Embedded educational games
- Progress tracking and personalized learning paths
- Arabic language support for Arabic-speaking learners

### 🤖 **Advanced AI Integration**
- **20+ AI Models** from leading providers
- **Automatic Fallback System** for maximum reliability
- **Smart Model Selection** based on task requirements
- **Real-time AI-powered assistance** for learning

## 🧠 Available AI Models

### 📝 **Text Generation Models**

| Model | Size | Capabilities | Use Case |
|-------|------|--------------|----------|
| **Llama 2 7B Chat** | 7B | General conversation, story writing | Standard text generation |
| **GPT-OSS 120B** | 120B | High reasoning, complex analysis | Advanced reasoning tasks |
| **Llama 3.3 70B** | 70B | High performance, detailed analysis | Production-grade content |
| **Mistral 7B Instruct** | 7B | Enhanced instruction following | Educational content |
| **Gemma 3 12B** | 12B | Multimodal text + image | Visual learning support |

### 🎨 **Image Generation Models**

| Model | Capabilities | Speed | Quality |
|-------|--------------|-------|---------|
| **Stable Diffusion XL** | Standard generation | ⚡⚡⚡ | 🎨🎨🎨🎨 |
| **SDXL-Lightning** | Ultra-fast (4 steps) | ⚡⚡⚡⚡⚡ | 🎨🎨🎨 |
| **Dreamshaper-8-LCM** | Photorealistic | ⚡⚡⚡⚡ | 🎨🎨🎨🎨🎨 |
| **Stable Diffusion Inpainting** | Image enhancement | ⚡⚡⚡ | 🎨🎨🎨🎨 |

### 🔧 **Specialized Models**

| Model | Specialty | Capabilities |
|-------|-----------|--------------|
| **Qwen2.5 Coder 32B** | 💻 Code Generation | Programming, debugging, education |
| **QwQ 32B** | 🧮 Reasoning | Mathematical problems, logic analysis |
| **Llama Guard 3** | 🛡️ Content Safety | Moderation, educational filtering |
| **BGE Embeddings** | 🔢 Vector Embeddings | Semantic search, document similarity |

### 🖼️ **Multimodal Models**

| Model | Capabilities | Use Case |
|-------|--------------|----------|
| **Gemma 3 12B** | Text + Image understanding | Visual learning, image analysis |
| **Llama Vision 3.2** | Image understanding | Educational image interpretation |
| **LLaVA 1.5** | Image captioning | Learning material description |

### 🛠️ **Utility Models**

| Model | Function | Language Support |
|-------|----------|------------------|
| **M2M100** | Translation | 100+ languages |
| **MeloTTS** | Text-to-Speech | Multiple languages |
| **BART** | Text Summarization | English |
| **Flux 1 Schnell** | Creative generation | English |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Cloudflare account with AI access

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd al-dalil
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Configure environment variables**
```bash
# Create .env.local file
cp .env.example .env.local

# Add your Cloudflare configuration
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token
```

4. **Deploy Cloudflare Worker**
```bash
cd worker-ai
pnpm run deploy
```

5. **Start development server**
```bash
pnpm dev
```

## 🧪 Testing AI Models

### Comprehensive Testing Interface
Visit `/test-ai` to access the full AI model testing dashboard:

- **🔗 Connection Tests**: Verify all AI models are accessible
- **📝 Text Generation**: Test all text models with custom prompts
- **🎨 Image Generation**: Generate images with different models
- **🔧 Specialized**: Test code generation, reasoning, and safety
- **🛠️ Utilities**: Test translation, TTS, and analysis

### Quick Test Commands
```bash
# Test all models
curl -X POST https://your-worker.workers.dev/ai/test

# Generate text with Llama 2
curl -X POST https://your-worker.workers.dev/ai/text \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Write a story about learning English"}'

# Generate image with SDXL-Lightning
curl -X POST https://your-worker.workers.dev/ai/lightning \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A cat reading an English book"}'
```

## 🏗️ Architecture

### Frontend (Next.js 15)
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Radix UI** components for accessibility

### Backend (Cloudflare Workers)
- **AI Model Proxy** with automatic fallback
- **CORS handling** for cross-origin requests
- **Response caching** for performance
- **Error handling** and retry mechanisms

### AI Service Layer
- **Smart model selection** based on task
- **Automatic fallback** to alternative models
- **Performance monitoring** and logging
- **Response validation** and sanitization

## 🔧 Configuration

### Cloudflare Worker Configuration
```toml
# wrangler.toml
name = "al-dalil-ai-worker"
main = "worker.js"
compatibility_date = "2024-01-01"

[ai]
binding = "AI"

[env.production]
name = "al-dalil-ai-worker"
vars = { ENVIRONMENT = "production" }
```

### AI Model Endpoints
```javascript
// Available endpoints in worker.js
'/ai/text'           // Llama 2 7B Chat
'/ai/gpt-oss'        // GPT-OSS 120B
'/ai/llama-3-3'      // Llama 3.3 70B
'/ai/mistral'         // Mistral 7B
'/ai/gemma'           // Gemma 3 12B
'/ai/image'           // Stable Diffusion XL
'/ai/lightning'       // SDXL-Lightning
'/ai/dreamshaper'     // Dreamshaper-8-LCM
'/ai/qwen-coder'      // Qwen2.5 Coder
'/ai/qwq'             // QwQ Reasoning
'/ai/llama-guard'     // Llama Guard 3
'/ai/embeddings'      // BGE Embeddings
'/ai/translate'       // M2M100 Translation
'/ai/tts'             // MeloTTS
'/ai/analyze'         // Story Analysis
'/ai/caption'         // Image Captioning
'/ai/summarize'       // Text Summarization
'/ai/enhance'         // Image Enhancement
```

## 📊 Performance Features

### 🚀 **Optimization Features**
- **Response Caching**: 5-minute TTL for text responses
- **Smart Fallbacks**: Automatic model switching on failure
- **Retry Logic**: Exponential backoff for failed requests
- **Performance Monitoring**: Request duration tracking

### 🔄 **Fallback System**
```javascript
// Example: Text generation with automatic fallback
const result = await cloudflareAI.generateTextWithFallback(
  "Explain quantum computing",
  "gpt-oss" // Preferred model
)

// Falls back to: GPT-OSS → Llama 3.3 → Mistral → Gemma → Llama 2
```

## 🌍 Language Support

### **Primary Languages**
- **English**: Main learning language
- **Arabic**: Interface and support language
- **100+ Languages**: Translation support via M2M100

### **Multilingual Features**
- Arabic interface with English learning content
- Real-time translation between languages
- Multilingual text-to-speech support
- Cultural context awareness

## 🔒 Security & Safety

### **Content Safety**
- **Llama Guard 3** integration for content filtering
- **Educational content validation**
- **Safe learning environment** for all ages

### **API Security**
- **CORS protection** for cross-origin requests
- **Rate limiting** and abuse prevention
- **Secure API key management**

## 📈 Monitoring & Analytics

### **Performance Metrics**
- Response times for each AI model
- Success/failure rates
- Cache hit ratios
- Model usage statistics

### **Error Handling**
- Comprehensive error logging
- Automatic retry mechanisms
- User-friendly error messages
- Fallback system activation

## 🚀 Deployment

### **Production Deployment**
```bash
# Build the application
pnpm build

# Deploy to Cloudflare Pages
pnpm run deploy

# Deploy worker
cd worker-ai && pnpm run deploy
```

### **Environment Variables**
```bash
# Required for production
NEXT_PUBLIC_WORKER_URL=https://your-worker.workers.dev
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token
```

## 🤝 Contributing

### **Development Setup**
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### **Code Style**
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Conventional commits for version control

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Cloudflare** for providing the AI infrastructure
- **Meta** for Llama models
- **OpenAI** for GPT-OSS
- **Stability AI** for image generation models
- **Qwen** for specialized models
- **Google** for Gemma models

## 📞 Support

For support and questions:
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-repo/discussions)
- **Documentation**: [Wiki](https://github.com/your-repo/wiki)

---

**Built with ❤️ for English learners worldwide**
