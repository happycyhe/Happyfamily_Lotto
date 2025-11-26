import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateLuckyMessage = async (excludedNumbers: number[], generatedNumbers: number[]): Promise<string> => {
  const ai = getClient();
  if (!ai) return "행운이 가득하시길 바랍니다! (AI 키 확인 필요)";

  try {
    const prompt = `
      상황: 로또 번호 추천 앱 'HappyFamily'입니다.
      사용자가 가족/친구들에게 물어봐서 '제외할 숫자'를 선택했습니다.
      제외된 숫자: [${excludedNumbers.join(', ')}]
      
      이 제외된 숫자를 피해서 AI가 생성한 행운의 번호: [${generatedNumbers.join(', ')}]
      
      요청:
      이 번호 조합이 왜 행운을 가져다줄지, 제외된 숫자들을 피한 것이 어떤 좋은 기운을 가져왔는지
      재미있고 희망찬 점술가 말투로 1문장~2문장 정도로 짧게 코멘트해주세요.
      한국어로 답변해주세요.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.8,
      }
    });

    return response.text || "오늘의 기운이 아주 좋습니다! 대박 나세요!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "별들이 당신의 행운을 비추고 있습니다. 좋은 결과가 있을 거예요!";
  }
};