import { GoogleGenAI } from "@google/genai";
import { PricingData, CalculationResult } from "../types";

export async function generateProposalJustification(data: PricingData, result: CalculationResult) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
Atue como um consultor comercial especialista em precificação de serviços de contabilidade e BPO financeiro.
Escreva uma justificativa curta, persuasiva e profissional para uma proposta comercial com os seguintes dados:

Dados do Cliente:
- Vendas Mensais: ${data.baseMonthlySales}
- Filiais: ${data.numBranches}
- Matrizes (CNPJ): ${data.numCNPJMatriz}
- Diferença de Estado: ${data.hasDifferentState ? 'Sim' : 'Não'}
- Diferença de Cidade: ${data.hasDifferentCity ? 'Sim' : 'Não'}
- Inclui Departamento Pessoal: ${data.hasDP ? 'Sim' : 'Não'}

Resultados da Precificação:
- Valor Mensal Total: R$ ${result.totalMonthly.toFixed(2)}
- Taxa de Diagnóstico: R$ ${result.diagnosisFee.toFixed(2)}

Destaque a complexidade da operação e o valor agregado da consultoria. Mantenha o tom profissional e focado em valor.
Máximo de 1 parágrafo.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Erro ao gerar justificativa:", error);
    return "Não foi possível gerar a justificativa automática no momento.";
  }
}
