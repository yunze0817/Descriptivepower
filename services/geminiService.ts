import { GoogleGenAI, Type } from "@google/genai";
import { EvaluationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an image based on the user's description.
 * Represents what a listener "imagines".
 */
export const generateImaginedImage = async (userDescription: string): Promise<string> => {
  try {
    // Use gemini-2.5-flash-image for generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: userDescription }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1", 
          // We use 1:1 to simplify comparison, assuming target images are cropped or centered.
        }
      }
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    throw new Error("No image generated.");
  } catch (error: any) {
    console.error("Image Gen Error:", error);
    throw new Error("AI 无法根据您的描述生成图片，请检查描述是否合规。");
  }
};

/**
 * Compares the original image (A) and the imagined image (B)
 * to evaluate the quality of the user's description.
 */
export const evaluateSimilarity = async (
  originalBase64: string,
  originalMimeType: string,
  imaginedBase64: string,
  userDescription: string
): Promise<EvaluationResult> => {
  try {
    const prompt = `
      你是一位专业的视觉口述影像（Audio Description）评估专家。
      
      任务：
      1. 左边的图（或者第一张图）是【原图 A】。
      2. 右边的图（或者第二张图）是【AI想象图 B】。
      3. 【AI想象图 B】是完全根据用户的【文字描述】生成的。
      4. 评估用户的描述是否准确传达了【原图 A】的关键视觉信息（构图、主体、颜色、氛围）。
      
      注意：请务必基于【原图 A】作为标准答案来检查【AI想象图 B】的缺失之处。如果【AI想象图 B】出现了【原图 A】中不存在的东西（幻觉），也请指出。
      
      用户的文字描述是: "${userDescription}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { text: prompt },
          { 
            inlineData: { mimeType: originalMimeType, data: originalBase64 } 
          },
          { text: "【原图 A (Target)】" },
          { 
            inlineData: { mimeType: 'image/png', data: imaginedBase64 } 
          },
          { text: "【AI想象图 B (Imagined)】" }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER, description: "0 to 100 score" },
            feedback: { type: Type.STRING, description: "Short overall comment on the success of the description" },
            missingDetails: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "List of key visual elements present in Original Target but missing/wrong in Imagined version"
            },
            goodDetails: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of visual elements that were accurately described and rendered"
            }
          },
          required: ["score", "feedback", "missingDetails", "goodDetails"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from evaluation");
    
    return JSON.parse(jsonText) as EvaluationResult;

  } catch (error) {
    console.error("Evaluation Error:", error);
    // Fallback result
    return {
      score: 0,
      feedback: "无法完成评估，请稍后重试。",
      missingDetails: [],
      goodDetails: []
    };
  }
};