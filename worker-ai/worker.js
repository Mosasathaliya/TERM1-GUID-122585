// ===== CLOUDFLARE WORKER AI - CLEAN TEMPLATE VERSION =====

export default {
  async fetch(request, env, ctx) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders })
    }

    try {
      const url = new URL(request.url)
      const path = url.pathname

      console.log(`[WORKER] Request to: ${path}`)

      // Root endpoint
      if (path === '/' || path === '') {
        return new Response(JSON.stringify({
          message: 'Al-Dalil AI Worker - CLEAN TEMPLATE VERSION',
          status: 'active',
          version: '7.0.0',
          endpoints: ['/ai/text', '/ai/translate', '/ai/tts', '/ai/image', '/ai/test', '/ai/comprehensive-test'],
          features: [
            'Clean Cloudflare template implementation',
            'Fixed translation and TTS',
            'Proper error handling',
            'Performance optimized'
          ]
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      
      // AI endpoints
      if (path === '/ai/text' && request.method === 'POST') {
        return await handleText(request, env, corsHeaders)
      } else if (path === '/ai/translate' && request.method === 'POST') {
        return await handleTranslate(request, env, corsHeaders)
      } else if (path === '/ai/tts' && request.method === 'POST') {
        return await handleTTS(request, env, corsHeaders)
      } else if (path === '/ai/image' && request.method === 'POST') {
        return await handleImage(request, env, corsHeaders)
      } else if (path === '/ai/test' && request.method === 'POST') {
        return await handleTest(request, env, corsHeaders)
      } else if (path === '/ai/comprehensive-test' && request.method === 'GET') {
        return await handleComprehensiveTest(request, env, corsHeaders)
      } else {
        return new Response(JSON.stringify({ error: 'Endpoint not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
    } catch (error) {
      console.error('[WORKER] Error:', error)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }
  }
}

// Text generation - Clean template approach
async function handleText(request, env, corsHeaders) {
  try {
    const { prompt, model = '@cf/meta/llama-2-7b-chat-int8' } = await request.json()
    
    if (!env.AI) throw new Error('AI not available')

    console.log(`[TEXT] Generating text with model: ${model}`)

    let requestParams

    // Handle different model formats based on Cloudflare templates
    if (model === '@cf/openai/gpt-oss-120b') {
      requestParams = { input: prompt }
    } else {
      requestParams = { messages: [{ role: "user", content: prompt }] }
    }

    const response = await env.AI.run(model, requestParams)

    // Extract text from response using template approach
    let resultText = ''
    
    if (model === '@cf/openai/gpt-oss-120b') {
      // GPT-OSS specific handling
      if (response && Array.isArray(response)) {
        for (const item of response) {
          if (item && typeof item === 'object' && item.contentItem && item.contentItem.text) {
            resultText = item.contentItem.text
            break
          }
        }
      }
      if (!resultText && response && typeof response === 'object') {
        resultText = response.text || response.content || response.response || JSON.stringify(response)
      }
    } else {
      // Standard models
      resultText = response.response || response.content || response.text || String(response)
    }

    // Clean up the result
    if (typeof resultText === 'string') {
      resultText = resultText.trim()
    }

    console.log(`[TEXT] Success, result length: ${resultText.length}`)

    return new Response(JSON.stringify({
      success: true,
      result: resultText,
      model: model
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('[TEXT] Error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

// Translation - Clean template approach
async function handleTranslate(request, env, corsHeaders) {
  try {
    const { text, targetLang = 'ar' } = await request.json()
    
    if (!env.AI) throw new Error('AI not available')

    console.log(`[TRANSLATE] Translating: "${text}" to ${targetLang}`)

    // Get translation using M2M100 model
    const translationResponse = await env.AI.run('@cf/meta/m2m100-1.2b', {
      text: text,
      source_lang: 'en',
      target_lang: targetLang
    })

    // Extract translation text
    const translatedText = (translationResponse.translated_text || 
                          translationResponse.text || 
                          translationResponse.response || 
                          String(translationResponse)).trim()

    if (!translatedText) {
      throw new Error('No translation received')
    }

    // Get word meaning using Llama 2
    const meaningResponse = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
      messages: [
        {
          role: "system",
          content: "أنت معلم لغة إنجليزية محترف ومتخصص في تعليم اللغة العربية. مهمتك هي شرح معنى الكلمة الإنجليزية باللغة العربية فقط. اكتب شرحاً بسيطاً وواضحاً باللغة العربية الفصحى. لا تستخدم أي لغة أخرى. ابدأ دائماً بـ 'معنى الكلمة:' ثم اكتب شرحاً بسيطاً باللغة العربية."
        },
        {
          role: "user",
          content: `اشرح معنى هذه الكلمة الإنجليزية باللغة العربية: "${text}"`
        }
      ],
      max_tokens: 60,
      temperature: 0.1
    })

    const wordMeaning = (meaningResponse.response || 
                        meaningResponse.content || 
                        meaningResponse.text || 
                        String(meaningResponse)).trim()

    // Clean up meaning text
    let cleanedMeaning = wordMeaning
    if (cleanedMeaning && !cleanedMeaning.startsWith('معنى الكلمة:')) {
      cleanedMeaning = `معنى الكلمة: ${cleanedMeaning}`
    }

    console.log(`[TRANSLATE] Success - Translation: "${translatedText}", Meaning: "${cleanedMeaning}"`)

    return new Response(JSON.stringify({
      success: true,
      result: {
        translated_text: translatedText,
        word_meaning: cleanedMeaning
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('[TRANSLATE] Error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

// TTS - Clean template approach
async function handleTTS(request, env, corsHeaders) {
  try {
    const { text, lang = 'en' } = await request.json()
    
    if (!env.AI) throw new Error('AI not available')

    console.log(`[TTS] Generating speech for: "${text}" in ${lang}`)

    // Use the official Cloudflare template approach
    const response = await env.AI.run('@cf/myshell-ai/melotts', {
      prompt: text,
      lang: lang
    })

    console.log(`[TTS] AI response received, type: ${typeof response}`)

    // Handle the correct response format from Cloudflare AI
    if (response instanceof Uint8Array) {
      // Direct Uint8Array response - convert to base64
      const binaryString = Array.from(response, byte => String.fromCharCode(byte)).join('')
      const base64Audio = btoa(binaryString)
      
      return new Response(JSON.stringify({
        success: true,
        result: base64Audio,
        audioFormat: 'base64'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } else if (response && typeof response === 'object' && response.audio) {
      // Object with audio property (base64 string)
      return new Response(JSON.stringify({
        success: true,
        result: response.audio,
        audioFormat: 'base64'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } else if (typeof response === 'string' && response.length > 100) {
      // Direct base64 string response
      return new Response(JSON.stringify({
        success: true,
        result: response,
        audioFormat: 'base64'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } else {
      throw new Error(`Unsupported TTS response type: ${typeof response}`)
    }
  } catch (error) {
    console.error('[TTS] Error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

// Image generation - Clean template approach
async function handleImage(request, env, corsHeaders) {
  try {
    const { prompt } = await request.json()
    
    if (!env.AI) throw new Error('AI not available')

    console.log(`[IMAGE] Generating image for prompt: "${prompt}"`)

    // Use the official Cloudflare template approach
    const response = await env.AI.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', {
      prompt: prompt
    })

    console.log(`[IMAGE] AI response received, type: ${typeof response}`)

    // Handle ReadableStream response from Cloudflare AI
    if (response instanceof ReadableStream) {
      // Convert ReadableStream to Uint8Array
      const reader = response.getReader()
      const chunks = []
      
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          chunks.push(value)
        }
        
        // Combine all chunks into a single Uint8Array
        const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
        const combinedArray = new Uint8Array(totalLength)
        let offset = 0
        
        for (const chunk of chunks) {
          combinedArray.set(chunk, offset)
          offset += chunk.length
        }
        
        // Convert to base64
        const binaryString = Array.from(combinedArray, byte => String.fromCharCode(byte)).join('')
        const base64Image = btoa(binaryString)
        
        return new Response(JSON.stringify({
          success: true,
          result: base64Image,
          imageFormat: 'base64'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      } finally {
        reader.releaseLock()
      }
    } else if (response instanceof Uint8Array) {
      // Direct Uint8Array response
      const binaryString = Array.from(response, byte => String.fromCharCode(byte)).join('')
      const base64Image = btoa(binaryString)
      
      return new Response(JSON.stringify({
        success: true,
        result: base64Image,
        imageFormat: 'base64'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } else if (typeof response === 'string' && response.length > 100) {
      // Direct base64 string response
      return new Response(JSON.stringify({
        success: true,
        result: response,
        imageFormat: 'base64'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    } else {
      throw new Error(`Unsupported image response type: ${typeof response}`)
    }
  } catch (error) {
    console.error('[IMAGE] Error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

// Test endpoint
async function handleTest(request, env, corsHeaders) {
  try {
    const { prompt, model = '@cf/meta/llama-2-7b-chat-int8' } = await request.json()
    
    if (!env.AI) throw new Error('AI not available')

    console.log(`[TEST] Testing model: ${model}`)

    const response = await env.AI.run(model, {
      messages: [{ role: "user", content: prompt }]
    })

    const resultText = response.response || response.content || response.text || String(response)

    return new Response(JSON.stringify({
      success: true,
      result: resultText.trim(),
      model: model
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('[TEST] Error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

// Comprehensive testing endpoint
async function handleComprehensiveTest(request, env, corsHeaders) {
  try {
    if (!env.AI) throw new Error('AI not available')

    console.log('[COMPREHENSIVE] Starting comprehensive AI models test')

    const startTime = Date.now()
    const results = {
      timestamp: new Date().toISOString(),
      totalModels: 0,
      workingModels: 0,
      failedModels: 0,
      models: {},
      successRate: '0%',
      summary: '0/0 models working'
    }

    // Test language models
    const languageModels = [
      '@cf/meta/llama-2-7b-chat-int8',
      '@cf/openai/gpt-oss-120b',
      '@cf/meta/llama-3.3-70b-instruct-fp8-fast',
      '@cf/qwen/qwen2.5-coder-32b-instruct',
      '@cf/qwen/qwq-32b',
      '@cf/google/gemma-3-12b-it'
    ]

    // Test translation model
    const translationModels = [
      '@cf/meta/m2m100-1.2b'
    ]

    // Test TTS model
    const ttsModels = [
      '@cf/myshell-ai/melotts'
    ]

    // Test image models
    const imageModels = [
      '@cf/stabilityai/stable-diffusion-xl-base-1.0',
      '@cf/bytedance/stable-diffusion-xl-lightning',
      '@cf/lykon/dreamshaper-8-lcm'
    ]

    const allModels = [...languageModels, ...translationModels, ...ttsModels, ...imageModels]
    results.totalModels = allModels.length

    // Test each model
    for (const model of allModels) {
      const modelStartTime = Date.now()
      try {
        let response
        let testPrompt = 'Hello, how are you?'
        
        if (translationModels.includes(model)) {
          response = await env.AI.run(model, {
            text: 'Hello',
            source_lang: 'en',
            target_lang: 'ar'
          })
          testPrompt = 'Translation test'
        } else if (ttsModels.includes(model)) {
          response = await env.AI.run(model, {
            prompt: 'Hello',
            lang: 'en'
          })
          testPrompt = 'TTS test'
        } else if (imageModels.includes(model)) {
          response = await env.AI.run(model, {
            prompt: 'simple red circle'
          })
          testPrompt = 'Image generation test'
        } else {
          // Language models
          if (model === '@cf/openai/gpt-oss-120b') {
            response = await env.AI.run(model, { input: testPrompt })
          } else {
            response = await env.AI.run(model, {
              messages: [{ role: "user", content: testPrompt }]
            })
          }
        }

        const duration = Date.now() - modelStartTime
        let responseText = ''
        let isValidResponse = false

        if (translationModels.includes(model)) {
          responseText = response.translated_text || response.text || response.response || String(response)
          isValidResponse = responseText && responseText.length > 0 && /[\u0600-\u06FF]/.test(responseText)
        } else if (ttsModels.includes(model)) {
          responseText = 'Audio data received'
          isValidResponse = response && (response instanceof ArrayBuffer || response instanceof Uint8Array || 
                       (typeof response === 'object' && (response.audio || response.data || response.buffer)))
        } else if (imageModels.includes(model)) {
          responseText = 'Image data received'
          isValidResponse = response && (response instanceof ArrayBuffer || response instanceof Uint8Array)
        } else {
          // Language models
          if (model === '@cf/openai/gpt-oss-120b') {
            responseText = JSON.stringify(response)
            isValidResponse = responseText && responseText.length > 50 && !responseText.includes('[object Object]')
          } else {
            responseText = response.response || response.content || response.text || String(response)
            isValidResponse = responseText && responseText.length > 10
          }
        }

        if (isValidResponse) {
          results.workingModels++
          results.models[model] = {
            status: 'success',
            duration: duration,
            responseLength: responseText.length,
            type: translationModels.includes(model) ? 'translation-model' : 
                  ttsModels.includes(model) ? 'tts-model' : 
                  imageModels.includes(model) ? 'image-model' : 'language-model'
          }
        } else {
          results.failedModels++
          results.models[model] = {
            status: 'failed',
            error: 'Response too short or empty',
            duration: duration,
            type: translationModels.includes(model) ? 'translation-model' : 
                  ttsModels.includes(model) ? 'tts-model' : 
                  imageModels.includes(model) ? 'image-model' : 'language-model'
          }
        }

      } catch (error) {
        results.failedModels++
        results.models[model] = {
          status: 'failed',
          error: error.message,
          duration: Date.now() - modelStartTime,
          type: translationModels.includes(model) ? 'translation-model' : 
                ttsModels.includes(model) ? 'tts-model' : 
                imageModels.includes(model) ? 'image-model' : 'language-model'
        }
      }
    }

    // Calculate success rate
    results.successRate = `${Math.round((results.workingModels / results.totalModels) * 100)}%`
    results.summary = `${results.workingModels}/${results.totalModels} models working`

    const totalDuration = Date.now() - startTime
    console.log(`[COMPREHENSIVE] Test completed in ${totalDuration}ms. ${results.summary}`)

    return new Response(JSON.stringify({
      success: true,
      result: results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('[COMPREHENSIVE] Error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}
