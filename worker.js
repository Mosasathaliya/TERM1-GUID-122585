// ===== CLOUDFLARE WORKER AI PROXY - ULTRA ROBUST VERSION =====

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
          message: 'Al-Dalil AI Worker - ULTRA ROBUST VERSION',
          status: 'active',
          version: '5.0.0',
          endpoints: ['/ai/text', '/ai/translate', '/ai/tts', '/ai/image', '/ai/test']
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

// Text generation
async function handleText(request, env, corsHeaders) {
  try {
    const { prompt } = await request.json()
    
    if (!env.AI) throw new Error('AI not available')

    const response = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
      messages: [{ role: "user", content: prompt }]
    })

    return new Response(JSON.stringify({
      success: true,
      result: response.response || response.content || response.text || String(response)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

// Translation - PERFECT VERSION
async function handleTranslate(request, env, corsHeaders) {
  try {
    const { text, targetLang = 'ar' } = await request.json()

    if (!env.AI) throw new Error('AI not available')

    console.log(`[TRANSLATE] Starting translation for: "${text}"`)

    // STEP 1: Get translation with multiple attempts and validation
    let translatedText = ''
    let translationAttempts = 0
    const maxAttempts = 3

    while (!translatedText && translationAttempts < maxAttempts) {
      translationAttempts++
      console.log(`[TRANSLATE] Attempt ${translationAttempts} for translation`)
      
      try {
        const translationResponse = await env.AI.run('@cf/meta/m2m100-1.2b', {
          text: text,
          source_lang: 'en',
          target_lang: targetLang
        })

        // Extract translation text
        if (typeof translationResponse === 'string') {
          translatedText = translationResponse.trim()
        } else if (translationResponse && typeof translationResponse === 'object') {
          translatedText = (translationResponse.translation || 
                          translationResponse.text || 
                          translationResponse.response ||
                          JSON.stringify(translationResponse)).trim()
      } else {
          translatedText = String(translationResponse).trim()
        }

        // Clean up JSON artifacts
        if (translatedText.includes('{') && translatedText.includes('}')) {
          try {
            const jsonMatch = translatedText.match(/\{.*\}/)
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0])
              translatedText = (parsed.translated_text || parsed.text || translatedText).trim()
            }
          } catch (parseError) {
            console.log('[TRANSLATE] JSON parsing failed, using raw text')
          }
        }

        // Validate translation quality - STRICT CHECKS
        if (translatedText && 
            translatedText.length > 0 && 
            !translatedText.includes('؟؟؟') &&
            !translatedText.includes('؟؟') &&
            !translatedText.includes('؟') &&
            !translatedText.includes('؟؟؟؟') &&
            !translatedText.includes('؟؟؟؟؟') &&
            translatedText.length < 100 && // Prevent extremely long translations
            /[\u0600-\u06FF]/.test(translatedText)) { // Must contain Arabic characters
          
          console.log(`[TRANSLATE] Translation successful: "${translatedText}"`)
            break
    } else {
          console.log(`[TRANSLATE] Translation quality check failed, retrying...`)
          translatedText = ''
        }
      } catch (translationError) {
        console.error(`[TRANSLATE] Translation attempt ${translationAttempts} failed:`, translationError)
        if (translationAttempts === maxAttempts) {
          throw new Error(`Translation failed after ${maxAttempts} attempts`)
        }
      }
    }

    if (!translatedText) {
      throw new Error('Failed to get valid translation')
    }

    // STEP 2: Get word meaning with multiple attempts and strict validation
    let wordMeaning = 'معنى الكلمة: غير متوفر'
    let meaningAttempts = 0
    const maxMeaningAttempts = 3

    while (meaningAttempts < maxMeaningAttempts) {
      meaningAttempts++
      console.log(`[TRANSLATE] Attempt ${meaningAttempts} for word meaning`)
      
      try {
        const meaningResponse = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
      messages: [
        {
          role: "system",
              content: "أنت معلم لغة إنجليزية محترف ومتخصص في تعليم اللغة العربية. مهمتك هي شرح معنى الكلمة الإنجليزية باللغة العربية فقط. اكتب شرحاً بسيطاً وواضحاً باللغة العربية الفصحى. لا تستخدم أي لغة أخرى. لا تضيف أسطر جديدة أو تنسيقات إضافية. ابدأ دائماً بـ 'معنى الكلمة:' ثم اكتب شرحاً بسيطاً باللغة العربية."
        },
        {
          role: "user",
              content: `اشرح معنى هذه الكلمة الإنجليزية باللغة العربية: "${text}"`
            }
          ],
          max_tokens: 60,
          temperature: 0.1
        })

        const meaningText = (meaningResponse.response || 
                           meaningResponse.content || 
                           meaningResponse.text || 
                           String(meaningResponse)).trim()

        // Clean up the meaning text - STRICT CLEANING
        if (meaningText && meaningText.length > 0) {
          let cleanedMeaning = meaningText
          
          // Remove extra newlines and spaces
          cleanedMeaning = cleanedMeaning.replace(/\n+/g, ' ').replace(/\s+/g, ' ')
          
          // Remove any non-Arabic characters (keep only Arabic, English, numbers, and basic punctuation)
          cleanedMeaning = cleanedMeaning.replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFFa-zA-Z0-9\s\.,:;!?()]/g, '')
          
          // Ensure it starts with the proper format
          if (!cleanedMeaning.startsWith('معنى الكلمة:')) {
            cleanedMeaning = `معنى الكلمة: ${cleanedMeaning}`
          }
          
          // Limit length to keep it clean
          if (cleanedMeaning.length > 120) {
            cleanedMeaning = cleanedMeaning.substring(0, 120) + '...'
          }
          
          // STRICT validation - must be proper Arabic explanation
          if (cleanedMeaning.includes('معنى الكلمة:') && 
              cleanedMeaning.length > 25 && 
              cleanedMeaning.length < 150 &&
              !cleanedMeaning.includes('؟؟؟') &&
              !cleanedMeaning.includes('غير متوفر') &&
              !cleanedMeaning.includes('؟؟') &&
              !cleanedMeaning.includes('؟؟؟؟') &&
              /[\u0600-\u06FF]/.test(cleanedMeaning) && // Must contain Arabic
              !cleanedMeaning.includes(text) && // Should not contain the English word
              cleanedMeaning.split(' ').length > 3) { // Must be a proper sentence
            
            wordMeaning = cleanedMeaning
            console.log(`[TRANSLATE] Word meaning successful: "${wordMeaning}"`)
            break
      } else {
            console.log(`[TRANSLATE] Word meaning quality check failed, retrying...`)
          }
        }
      } catch (meaningError) {
        console.error(`[TRANSLATE] Word meaning attempt ${meaningAttempts} failed:`, meaningError)
        if (meaningAttempts === maxMeaningAttempts) {
          // Fallback: create a simple meaning
          wordMeaning = `معنى الكلمة: ${text} تعني "${translatedText}" في اللغة العربية`
        }
      }
    }

    // STEP 3: Final validation and cleanup
    const finalResult = {
      translated_text: translatedText,
      word_meaning: wordMeaning
    }

    console.log('[TRANSLATE] Final result:', finalResult)

    return new Response(JSON.stringify({
      success: true,
      result: finalResult
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('[TRANSLATE] Final error:', error)
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}

// TTS
async function handleTTS(request, env, corsHeaders) {
  try {
    // Robust JSON parsing
    let body
    try {
      body = await request.text()
      body = JSON.parse(body)
    } catch (parseError) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Invalid JSON in request body'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { text, lang = 'en' } = body

    if (!env.AI) throw new Error('AI not available')

    console.log(`[TTS] Generating speech for: "${text}" in ${lang}`)

    const response = await env.AI.run('@cf/myshell-ai/melotts', {
      prompt: text,
      lang: lang
    })

    console.log(`[TTS] AI response received, extracting audio data...`)

    const audioData = response.audio || response.data || response.buffer || response
    
    if (!audioData) {
      throw new Error('No audio data received from AI model')
    }

    console.log(`[TTS] Audio data type: ${typeof audioData}, length: ${audioData.length || 'unknown'}`)

    // NEW APPROACH: Use a completely different base64 conversion method
    let base64Audio = ''
    try {
      // Method 1: Convert to base64 using a different approach
      const uint8Array = new Uint8Array(audioData)
      console.log(`[TTS] Uint8Array created, length: ${uint8Array.length}`)
      
      // Create a blob and convert to base64
      const blob = new Blob([uint8Array], { type: 'audio/wav' })
      console.log(`[TTS] Blob created, size: ${blob.size}`)
      
      // Use FileReader to convert blob to base64
      const reader = new FileReader()
      reader.onload = () => {
        const dataUrl = reader.result
        base64Audio = dataUrl.split(',')[1] // Remove data:audio/wav;base64, prefix
        console.log(`[TTS] FileReader conversion successful, length: ${base64Audio.length}`)
      }
      
      reader.readAsDataURL(blob)
      
      // Wait for the conversion to complete
      await new Promise((resolve, reject) => {
        reader.onload = resolve
        reader.onerror = reject
        setTimeout(() => reject(new Error('FileReader timeout')), 10000)
      })
      
      // Validate the result
      if (!base64Audio || base64Audio.length === 0) {
        throw new Error('FileReader conversion resulted in empty string')
      }
      
    } catch (conversionError) {
      console.error('[TTS] FileReader conversion failed:', conversionError)
      
      // Method 2: Try the original method as fallback
      try {
        console.log('[TTS] Trying original conversion method...')
        const uint8Array = new Uint8Array(audioData)
        const binaryString = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('')
        base64Audio = btoa(binaryString)
        console.log(`[TTS] Original conversion successful, length: ${base64Audio.length}`)
      } catch (fallbackError) {
        console.error('[TTS] All conversion methods failed:', fallbackError)
        throw new Error(`All base64 conversion methods failed: ${conversionError.message}, fallback: ${fallbackError.message}`)
      }
    }

    return new Response(JSON.stringify({
      success: true,
      result: base64Audio,
      audioFormat: 'base64',
      originalSize: audioData.length,
      base64Size: base64Audio.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
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

// Image generation - FIXED VERSION
async function handleImage(request, env, corsHeaders) {
  try {
    const { prompt } = await request.json()

    if (!env.AI) throw new Error('AI not available')

    console.log(`[IMAGE] Generating image for prompt: "${prompt}"`)

    const response = await env.AI.run('@cf/stabilityai/stable-diffusion-xl-base-1.0', {
      prompt: prompt,
      height: 512,
      width: 512,
      num_steps: 20
    })

    console.log(`[IMAGE] AI response received, extracting image data...`)

    const imageData = response.image || response.data || response.buffer || response
    
    if (!imageData) {
      throw new Error('No image data received from AI model')
    }

    console.log(`[IMAGE] Image data type: ${typeof imageData}, length: ${imageData.length || 'unknown'}`)

    // FIXED: Synchronous base64 conversion for Worker environment
    let base64Image = ''
    try {
      // Convert ArrayBuffer or Uint8Array to base64 synchronously
      const uint8Array = new Uint8Array(imageData)
      console.log(`[IMAGE] Uint8Array created, length: ${uint8Array.length}`)
      
      // Method 1: Direct base64 conversion using btoa
      const binaryString = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('')
      base64Image = btoa(binaryString)
      console.log(`[IMAGE] Direct conversion successful, length: ${base64Image.length}`)
      
      // Validate the result
      if (!base64Image || base64Image.length === 0) {
        throw new Error('Direct conversion resulted in empty string')
      }
      
    } catch (conversionError) {
      console.error('[IMAGE] Direct conversion failed:', conversionError)
      
      // Method 2: Alternative approach using TextEncoder
      try {
        console.log('[IMAGE] Trying TextEncoder method...')
        const textEncoder = new TextEncoder()
        const encoded = textEncoder.encode(String(imageData))
        const binaryString = Array.from(encoded, byte => String.fromCharCode(byte)).join('')
        base64Image = btoa(binaryString)
        console.log(`[IMAGE] TextEncoder method successful, length: ${base64Image.length}`)
      } catch (fallbackError) {
        console.error('[IMAGE] All conversion methods failed:', fallbackError)
        throw new Error(`All base64 conversion methods failed: ${conversionError.message}, fallback: ${fallbackError.message}`)
      }
    }

    return new Response(JSON.stringify({
      success: true,
      result: base64Image,
      imageFormat: 'base64',
      originalSize: imageData.length,
      base64Size: base64Image.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
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
    if (!env.AI) throw new Error('AI not available')

    const testResults = {}
    
    try {
      await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
        messages: [{ role: "user", content: "test" }]
      })
      testResults.llama2 = 'success'
    } catch (e) {
      testResults.llama2 = 'failed'
    }

    return new Response(JSON.stringify({
      success: true,
      result: testResults
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
}
