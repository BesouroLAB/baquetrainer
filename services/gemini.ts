import { GoogleGenAI } from "@google/genai";

const getAI = () => {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
};

export interface RenderOptions {
  prompt: string;
  style: string;
  lighting: string;
  materials: string;
}

export const renderImage = async (base64Image: string, options: RenderOptions) => {
  const ai = getAI();
  const model = "gemini-2.5-flash-image";

  const prompt = `
    Como um especialista em visualização arquitetônica de alto nível, transforme este esboço ou foto em uma renderização fotorrealista.
    Estilo: ${options.style}
    Iluminação: ${options.lighting}
    Materiais: ${options.materials}
    Instruções adicionais: ${options.prompt}
    
    Mantenha a volumetria e a perspectiva originais, mas adicione texturas realistas, vegetação brasileira (se aplicável), e uma atmosfera profissional de portfólio de arquitetura.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image.split(",")[1],
            mimeType: "image/png",
          },
        },
        { text: prompt },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("Não foi possível gerar a imagem. Tente novamente.");
};
