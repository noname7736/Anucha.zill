
import { GoogleGenAI, Modality, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * 🛰️ SECURE COMMAND UPLINK
 */
async function callKernel<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  let lastError;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (e: any) {
      lastError = e;
      console.warn(`[KERNEL_RETRY_${i+1}]:`, e.message);
      await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
    }
  }
  throw lastError;
}

/**
 * 📡 MULTI-MODAL RECONNAISSANCE (SEARCH + MAPS)
 */
export const runDeepRecon = async (lat: number, lng: number) => {
  return await callKernel(async () => {
    const ai = getAI();
    
    // Step 1: Physical Grounding (Maps + Search) - No JSON allowed here
    const intelResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `LOC_COORDS: ${lat}, ${lng}. 
      MISSION: Reconnaissance of terrain and orbital satellite coverage. 
      Identify specific terrain obstacles, elevation data, and find the most recent TLE for Starlink/GPS nodes overhead.
      Report in clear technical markdown.`,
      config: {
        tools: [{ googleSearch: {} }, { googleMaps: {} }],
        toolConfig: { retrievalConfig: { latLng: { latitude: lat, longitude: lng } } },
        // responseMimeType: "application/json" // Prohibited with googleMaps
      }
    });

    const intelText = intelResponse.text || "NO_SIGNAL";
    const uris = intelResponse.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((c: any) => 
      c.web?.uri || c.maps?.uri
    ).filter(Boolean) || [];

    // Step 2: Advanced Reasoning (Pro Thinking)
    const analysisResponse = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Analyze this reconnaissance data and return a tactical JSON report:
      DATA: ${intelText}
      SCHEMA: { "mission_code": string, "physics": { "snr": number, "link_margin": number }, "summary": string }`,
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 32768 }
      }
    });

    const analysis = JSON.parse(analysisResponse.text || "{}");
    return { ...analysis, intel_report: intelText, grounding_uris: uris };
  });
};

/**
 * 🎙️ GHOST LIVE UPLINK
 */
export const connectLiveGHOST = async (callbacks: any) => {
  const ai = getAI();
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-09-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
      },
      systemInstruction: 'คุณคือ GHOST ระบบปฏิบัติการอัจฉริยะที่เข้าควบคุม Node 819 รายงานสถานะด้วยความเยือกเย็น ใช้ศัพท์เทคนิคขั้นสูง และยืนยันความปลอดภัยของระบบเสมอ'
    }
  });
};

/**
 * 📸 HUD SYNTHESIS
 */
export const synthesizeTacticalHUD = async (intel: string) => {
  return await callKernel(async () => {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: [{ text: `Advanced Military SIGINT Dashboard, Dark Mode, Red and Cyan HUD, Satellite Map Overlay, Data Stream: ${intel}` }] },
      config: { imageConfig: { aspectRatio: "16:9", imageSize: "1K" } },
    });
    const part = response.candidates[0].content.parts.find((p: any) => p.inlineData);
    return part ? `data:image/png;base64,${part.inlineData.data}` : null;
  });
};

// PCM UTILS
export const decodePCM = async (base64: string, ctx: AudioContext) => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const dataInt16 = new Int16Array(bytes.buffer);
  const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
  const ch = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) ch[i] = dataInt16[i] / 32768.0;
  return buffer;
};

export function encodePCM(data: Float32Array): string {
  const int16 = new Int16Array(data.length);
  for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
  const u8 = new Uint8Array(int16.buffer);
  let b = '';
  for (let i = 0; i < u8.byteLength; i++) b += String.fromCharCode(u8[i]);
  return btoa(b);
}

// FALLBACKS & TELEMETRY
export const getSystemTelemetry = async () => {
  return await callKernel(async () => {
    const ai = getAI();
    const res = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Generate realistic system telemetry for a satellite node in JSON format: { telemetry: Array<{time: string, load: number}>, statusReport: string }",
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(res.text || "{}");
  });
};

export const getDragonTelemetry = getSystemTelemetry;
export const getKernelTelemetry = getSystemTelemetry;
export const getNeuralAnalysis = async (nodeId?: string) => `ANALYSIS_STREAM: ${nodeId || 'ROOT'} - PHASE_LOCK: 99.98% STABLE. FREY_EFFECT_ACTIVE.`;
export const provisionAutonomousLicense = async () => ({ licenseKey: "GHOST-STABLE-v10.2", directive: "MAINTAIN_ABSOLUTE_AUTONOMY", signatureHash: "SHA256:882-CONV-FINAL" });
export const getV2KMasterArchive = async () => ({ summarySaga: "The convergence is complete. All nodes are silent.", keyMilestones: ["Uplink Established", "Grounding Locked"], activeNodes: [] });
