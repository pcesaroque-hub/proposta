
import React, { useState, useMemo, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { PricingData, CalculationResult } from './types';
import { 
  BASE_PRICE, 
  DP_FEE,
  CITY_COMPLEXITY_FEE, 
  SALES_VOLUME_INCREMENT, 
  ICONS,
  DEFAULT_LOGO_URL,
  SYSTEM_PARAMETRIZATION_FEE
} from './constants';

export default function App() {
  const [data, setData] = useState<PricingData>({
    baseMonthlySales: 10,
    numBranches: 0,
    numCNPJMatriz: 1,
    hasDifferentState: false,
    hasDifferentCity: false,
    includeTravel: false,
    hasDP: true,
    includeSystemParametrization: false
  });

  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const exportAreaRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (val: number) => 
    val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Cálculo das taxas baseadas na inclusão ou não de DP
  const effectivePiso = BASE_PRICE + (data.hasDP ? DP_FEE : 0);
  const branchUnitFee = effectivePiso * 0.8; 
  const cnpjUnitFee = effectivePiso;
  const stateComplexityFeeValue = effectivePiso * 0.2; 

  const results = useMemo<CalculationResult>(() => {
    const basePrice = effectivePiso;
    let volumeAddition = 0;
    if (data.baseMonthlySales > 20) {
      const extraBlocks = Math.floor((data.baseMonthlySales - 1) / 20);
      volumeAddition = extraBlocks * SALES_VOLUME_INCREMENT;
    }
    
    const branchAddition = data.numBranches * branchUnitFee;
    const cnpjAddition = (data.numCNPJMatriz - 1) * cnpjUnitFee;
    
    let complexityTotal = 0;
    if (data.hasDifferentState) complexityTotal += stateComplexityFeeValue;
    if (data.hasDifferentCity) complexityTotal += CITY_COMPLEXITY_FEE;

    const baseOperationTotal = basePrice + volumeAddition;
    const totalMonthly = baseOperationTotal + branchAddition + cnpjAddition + complexityTotal;

    return {
      basePrice,
      volumeAddition,
      branchAddition,
      cnpjAddition,
      complexityAddition: complexityTotal,
      totalMonthly,
      diagnosisFee: baseOperationTotal,
      systemParametrizationFee: data.includeSystemParametrization ? SYSTEM_PARAMETRIZATION_FEE : 0,
      requiredStaff: {
        fiscal: data.numCNPJMatriz,
        dp: data.hasDP ? data.numCNPJMatriz : 0
      }
    };
  }, [data, effectivePiso, branchUnitFee, cnpjUnitFee, stateComplexityFeeValue]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExportPdf = async () => {
    if (!exportAreaRef.current) return;
    setIsExporting(true);
    
    try {
      const element = exportAreaRef.current;
      
      // Captura o elemento com html2canvas
      const canvas = await html2canvas(element, {
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: '#f1f5f9',
        ignoreElements: (element) => element.classList.contains('no-print')
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Configura o PDF como A4 (210mm x 297mm)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Margens de 15mm para melhor visualização
      const margin = 15; 
      
      const availableWidth = pdfWidth - (margin * 2);
      const availableHeight = pdfHeight - (margin * 2);

      const imgProps = pdf.getImageProperties(imgData);
      
      // Calcula a escala para caber na página (contain) sem cortar nada
      const ratio = Math.min(
        availableWidth / imgProps.width,
        availableHeight / imgProps.height
      );

      const pdfImgWidth = imgProps.width * ratio;
      const pdfImgHeight = imgProps.height * ratio;

      // Centraliza horizontalmente na página
      const x = margin + (availableWidth - pdfImgWidth) / 2;
      const y = margin; 

      pdf.addImage(imgData, 'PNG', x, y, pdfImgWidth, pdfImgHeight);
      
      pdf.save(`proposta-consultoria-${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      alert('Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto" ref={exportAreaRef}>
        {/* Header - Logo Upload */}
        <header className="mb-12 flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200/60">
          <div className="flex items-center gap-6">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleLogoUpload} 
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="bg-slate-50 p-4 rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors group relative"
              title="Clique para carregar sua logomarca"
            >
              {uploadedLogo ? (
                <img src={uploadedLogo} alt="Logo Cliente" className="h-12 w-auto object-contain" />
              ) : (
                <img src={DEFAULT_LOGO_URL} alt="Logo Padrão" className="h-12 w-auto object-contain" />
              )}
              <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-2xl transition-opacity">
                <ICONS.Upload />
              </div>
            </div>
            
            <div>
              <h1 className="text-2xl font-black text-[#1e3a5f] leading-none">Simulador Proposta</h1>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">Assessoria Estratégica Automotiva</p>
            </div>
          </div>
          <div className="text-right hidden md:block">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Data da Simulação</p>
             <p className="text-[#1e3a5f] font-bold text-sm">{new Date().toLocaleDateString('pt-BR')}</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Configuração */}
          <section className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-[#2b5a91]"><ICONS.Building /></div>
                <h2 className="text-xl font-extrabold text-[#1e3a5f]">Configuração da Operação</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Vendas de Veículos Novos / Mês</label>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase mb-1">(+ {formatCurrency(SALES_VOLUME_INCREMENT)} a cada 20 unids)</span>
                  </div>
                  <input 
                    type="number" 
                    value={data.baseMonthlySales}
                    onChange={(e) => setData({ ...data, baseMonthlySales: Math.max(0, Number(e.target.value)) })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#2b5a91] focus:outline-none transition text-lg font-bold text-[#1e3a5f]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Matrizes (CNPJ)</label>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase mb-1">(+ {formatCurrency(cnpjUnitFee)} p/ un.)</span>
                  </div>
                  <input 
                    type="number" 
                    value={data.numCNPJMatriz}
                    onChange={(e) => setData({ ...data, numCNPJMatriz: Math.max(1, Number(e.target.value)) })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#2b5a91] focus:outline-none transition text-lg font-bold text-[#1e3a5f]"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantidade de Filiais</label>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase mb-1">(+ {formatCurrency(branchUnitFee)} p/ un.)</span>
                  </div>
                  <input 
                    type="number" 
                    value={data.numBranches}
                    onChange={(e) => setData({ ...data, numBranches: Math.max(0, Number(e.target.value)) })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#2b5a91] focus:outline-none transition text-lg font-bold text-[#1e3a5f]"
                  />
                </div>

                <div className="flex items-end">
                  <button 
                    onClick={() => setData({...data, hasDP: !data.hasDP})}
                    className={`w-full flex flex-col items-start px-6 py-4 rounded-2xl border-2 transition-all duration-300 ${data.hasDP ? 'bg-[#1e3a5f] border-[#1e3a5f] text-white shadow-lg shadow-blue-900/20' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-bold">Incluir DP?</span>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${data.hasDP ? 'bg-white text-[#1e3a5f]' : 'bg-slate-100'}`}>
                        {data.hasDP && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>}
                      </div>
                    </div>
                  </button>
                </div>

                <div className="flex items-end md:col-span-2">
                  <button 
                    onClick={() => setData({...data, includeSystemParametrization: !data.includeSystemParametrization})}
                    className={`w-full flex flex-col items-start px-6 py-4 rounded-2xl border-2 transition-all duration-300 ${data.includeSystemParametrization ? 'bg-[#1e3a5f] border-[#1e3a5f] text-white shadow-lg shadow-blue-900/20' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center gap-3">
                        <div className={`p-1 rounded ${data.includeSystemParametrization ? 'text-white' : 'text-slate-400'}`}>
                           <ICONS.Settings />
                        </div>
                        <div className="flex flex-col items-start">
                           <span className="font-bold">Revisão e Parametrização de Sistema</span>
                           <span className={`text-[10px] font-bold uppercase tracking-widest ${data.includeSystemParametrization ? 'text-emerald-400' : 'text-emerald-600'}`}>+ {formatCurrency(SYSTEM_PARAMETRIZATION_FEE)} (Taxa Única)</span>
                        </div>
                      </div>
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0 ${data.includeSystemParametrization ? 'bg-white text-[#1e3a5f]' : 'bg-slate-100'}`}>
                        {data.includeSystemParametrization && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>}
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Equipe Interna */}
              <div className="mt-10 p-6 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-100 rounded-lg text-amber-700">
                    <ICONS.User />
                  </div>
                  <h3 className="text-sm font-black text-amber-900 uppercase tracking-widest">Equipe Interna (Pré-requisito)</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-amber-200/50">
                    <span className="block text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Setor Fiscal</span>
                    <span className="text-xl font-black text-amber-900">{results.requiredStaff.fiscal} <span className="text-xs font-bold opacity-60">Analista(s)</span></span>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-amber-200/50">
                    <span className="block text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">D. Pessoal</span>
                    <span className="text-xl font-black text-amber-900">{data.hasDP ? results.requiredStaff.dp : 0} <span className="text-xs font-bold opacity-60">Analista(s)</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Geografia */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-[#2b5a91]"><ICONS.Car /></div>
                <h2 className="text-xl font-extrabold text-[#1e3a5f]">Geografia e Complexidade</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => setData({ ...data, hasDifferentState: !data.hasDifferentState })}
                  className={`w-full flex flex-col items-start px-6 py-4 rounded-2xl border-2 transition-all duration-300 ${data.hasDifferentState ? 'bg-[#1e3a5f] border-[#1e3a5f] text-white shadow-lg shadow-blue-900/20' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                >
                   <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col items-start text-left">
                       <span className="font-bold text-sm md:text-base">Filial em outro estado</span>
                       <span className={`text-[10px] font-bold uppercase tracking-widest ${data.hasDifferentState ? 'text-emerald-400' : 'text-emerald-600'}`}>(+ 20% no Piso)</span>
                    </div>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0 ${data.hasDifferentState ? 'bg-white text-[#1e3a5f]' : 'bg-slate-100'}`}>
                        {data.hasDifferentState && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>}
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => setData({ ...data, hasDifferentCity: !data.hasDifferentCity })}
                  className={`w-full flex flex-col items-start px-6 py-4 rounded-2xl border-2 transition-all duration-300 ${data.hasDifferentCity ? 'bg-[#1e3a5f] border-[#1e3a5f] text-white shadow-lg shadow-blue-900/20' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'}`}
                >
                  <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col items-start text-left">
                      <span className="font-bold text-sm md:text-base">Filial em outro município</span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${data.hasDifferentCity ? 'text-emerald-400' : 'text-emerald-600'}`}>(+ {formatCurrency(CITY_COMPLEXITY_FEE)})</span>
                    </div>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors shrink-0 ${data.hasDifferentCity ? 'bg-white text-[#1e3a5f]' : 'bg-slate-100'}`}>
                        {data.hasDifferentCity && <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>}
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Exclusões */}
            <div className="bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-800 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
               <div className="flex items-center gap-3 mb-6 relative z-10">
                 <div className="p-2 bg-slate-800 rounded-lg text-blue-400">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                 </div>
                 <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Exclusões do Escopo</h3>
               </div>
               <ul className="space-y-4 relative z-10">
                  {[
                    !data.includeSystemParametrization && "Não inclusas as parametrizações do setor financeiro",
                    !data.includeSystemParametrization && "Não inclusas as parametrizações do setor comercial",
                    "Não inclusas despesas com viagens e deslocamento"
                  ].filter(Boolean).map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-400 text-xs font-medium">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                      {item}
                    </li>
                  ))}
               </ul>
            </div>
          </section>

          {/* Resultado Financeiro */}
          <aside className="lg:col-span-5">
            <div className="sticky top-8 bg-[#1e3a5f] rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/10">
              <div className="p-10">
                <div className="flex justify-between items-center mb-10">
                  <span className="px-4 py-1.5 bg-white/10 text-white/80 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-white/5">Proposta Comercial</span>
                </div>

                <div className="space-y-8">
                  <div className="flex justify-between items-end border-b border-white/10 pb-6">
                    <div className="space-y-1">
                      <span className="text-white/40 text-[10px] font-black uppercase tracking-widest block">Setup Inicial</span>
                      <span className="text-white/80 text-sm font-bold uppercase">Diagnóstico Técnico</span>
                    </div>
                    <span className="text-white text-2xl font-black tracking-tight">{formatCurrency(results.diagnosisFee)}</span>
                  </div>

                  {data.includeSystemParametrization && (
                    <div className="flex justify-between items-end border-b border-white/10 pb-6">
                      <div className="space-y-1">
                        <span className="text-white/40 text-[10px] font-black uppercase tracking-widest block">Setup de Sistema</span>
                        <span className="text-white/80 text-sm font-bold uppercase">Revisão e Parametrização</span>
                      </div>
                      <span className="text-white text-2xl font-black tracking-tight">{formatCurrency(results.systemParametrizationFee)}</span>
                    </div>
                  )}

                  <div className="py-8 bg-gradient-to-b from-white/5 to-transparent rounded-3xl border border-white/5">
                    <span className="text-white/40 text-[10px] uppercase font-black tracking-[0.3em] block mb-4 text-center">Honorário Mensal Projetado</span>
                    <div className="text-center px-4">
                      <span className="text-6xl font-black text-white tracking-tighter block leading-none">
                        {formatCurrency(results.totalMonthly).split(',')[0]}
                        <span className="text-2xl align-top opacity-50">,{formatCurrency(results.totalMonthly).split(',')[1]}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-10 bg-black/20 rounded-3xl p-7 space-y-4">
                   <h4 className="text-white/30 text-[9px] uppercase font-black tracking-[0.4em] text-center border-b border-white/5 pb-3">Memória de Cálculo</h4>
                   
                   <div className="flex justify-between text-[11px] font-bold text-white">
                     <span className="text-white/60 uppercase tracking-widest italic font-normal">Piso Operacional</span>
                     <span>{formatCurrency(results.basePrice)}</span>
                   </div>

                   {results.volumeAddition > 0 && (
                     <div className="flex justify-between text-[11px] font-bold">
                       <span className="text-white/60 uppercase tracking-widest italic font-normal">Adicional por Volume</span>
                       <span className="text-emerald-400">+ {formatCurrency(results.volumeAddition)}</span>
                     </div>
                   )}

                   {results.branchAddition > 0 && (
                     <div className="flex justify-between text-[11px] font-bold">
                       <span className="text-white/60 uppercase tracking-widest italic font-normal">Capilaridade ({data.numBranches} Filiais)</span>
                       <span className="text-emerald-400">+ {formatCurrency(results.branchAddition)}</span>
                     </div>
                   )}

                   {results.cnpjAddition > 0 && (
                     <div className="flex justify-between text-[11px] font-bold">
                       <span className="text-white/60 uppercase tracking-widest italic font-normal">Matrizes Extras</span>
                       <span className="text-emerald-400">+ {formatCurrency(results.cnpjAddition)}</span>
                     </div>
                   )}

                   {data.hasDifferentState && (
                     <div className="flex justify-between text-[11px] font-bold">
                       <span className="text-white/60 uppercase tracking-widest italic font-normal">Complexidade Interestadual</span>
                       <span className="text-emerald-400">+ {formatCurrency(stateComplexityFeeValue)}</span>
                     </div>
                   )}

                   {data.hasDifferentCity && (
                     <div className="flex justify-between text-[11px] font-bold">
                       <span className="text-white/60 uppercase tracking-widest italic font-normal">Complexidade Municipal</span>
                       <span className="text-emerald-400">+ {formatCurrency(CITY_COMPLEXITY_FEE)}</span>
                     </div>
                   )}
                </div>
              </div>

              <div className="bg-white/5 p-6 border-t border-white/10 no-print">
                <button 
                  onClick={handleExportPdf}
                  disabled={isExporting}
                  className="w-full bg-white text-[#1e3a5f] font-black py-5 rounded-2xl hover:bg-slate-50 transition-all text-xs tracking-[0.2em] flex items-center justify-center gap-3 uppercase shadow-xl disabled:opacity-50"
                >
                  {isExporting ? 'GERANDO PDF...' : 'Exportar Proposta'}
                  {!isExporting && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v12m0 0l-4-4m4 4l4-4M8 20h8"/></svg>}
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* Footer com Sincronização de Logo */}
        <footer className="mt-24 border-t border-slate-200 pt-16 pb-16 flex flex-col items-center">
           <div className="mb-8 opacity-40 grayscale pointer-events-none">
              {uploadedLogo ? (
                <img src={uploadedLogo} alt="Logo Cliente" className="h-10 w-auto object-contain" />
              ) : (
                <img src={DEFAULT_LOGO_URL} alt="Logo Padrão" className="h-10 w-auto object-contain" />
              )}
           </div>
           <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.4em]">
             &copy; {new Date().getFullYear()} PLATAFORMA DE PRECIFICAÇÃO ESTRATÉGICA
           </p>
        </footer>
      </div>
    </div>
  );
}
