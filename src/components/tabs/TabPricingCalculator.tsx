import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  Percent, 
  ShieldAlert, 
  Sparkles,
  Layers,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { PricingCalculationInput, CurrencyCode } from '../../types';
import { calculatePricingDetails } from '../../utils/pricingCalculator';

interface TabPricingCalculatorProps {
  initialPrice?: number;
  initialCurrency?: CurrencyCode;
  productName: string;
}

export const TabPricingCalculator: React.FC<TabPricingCalculatorProps> = ({
  initialPrice = 18500,
  initialCurrency = 'PKR',
  productName
}) => {
  const [currency, setCurrency] = useState<CurrencyCode>(initialCurrency);
  const [params, setParams] = useState<PricingCalculationInput>({
    productCost: Math.round(initialPrice * 0.45) || 8000,
    sellingPrice: initialPrice || 18500,
    packagingCost: currency === 'PKR' ? 400 : currency === 'AED' ? 15 : 5,
    shippingCost: currency === 'PKR' ? 350 : currency === 'AED' ? 25 : 10,
    platformFeePercent: 3.5,
    paymentGatewayFeePercent: 2.0,
    advertisingCostPerSale: currency === 'PKR' ? 1200 : currency === 'AED' ? 30 : 15,
    discountPercent: 0
  });

  const result = useMemo(() => calculatePricingDetails(params), [params]);

  const updateParam = (key: keyof PricingCalculationInput, val: number) => {
    setParams((prev) => ({ ...prev, [key]: val }));
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-600" />
            <span>Pricing & Unit Economics Profit Calculator</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Evaluate exact unit margins, break-even thresholds, packaging, ad spend, and gateway fees.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Currency:</span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
          >
            {(['PKR', 'AED', 'USD', 'GBP', 'EUR'] as CurrencyCode[]).map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
            Net Profit per Unit
          </span>
          <div className={`text-xl sm:text-2xl font-black ${result.netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
            {currency} {result.netProfit.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            After all costs, shipping & ads
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
            Profit Margin %
          </span>
          <div className={`text-xl sm:text-2xl font-black ${result.profitMarginPercent >= 20 ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-600'}`}>
            {result.profitMarginPercent}%
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Target healthy margin: 25%+
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
            Total Unit Cost
          </span>
          <div className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {currency} {result.totalCost.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            COGS + Ops + Fees + Ads
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
            Break-Even Price
          </span>
          <div className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400">
            {currency} {result.breakEvenPrice.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Never sell below this price
          </span>
        </div>

      </div>

      {/* Two Column: Input Sliders & Breakdown Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Input Variables (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-2">
            Adjust Cost & Selling Parameters
          </span>

          {/* Selling Price */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <span>Selling Price ({currency})</span>
              <span className="font-bold text-indigo-600">{params.sellingPrice.toLocaleString()}</span>
            </div>
            <input
              type="number"
              value={params.sellingPrice}
              onChange={(e) => updateParam('sellingPrice', Number(e.target.value))}
              className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-semibold"
            />
          </div>

          {/* Sourcing Cost */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <span>Product Cost / Sourcing Cost ({currency})</span>
              <span className="font-bold">{params.productCost.toLocaleString()}</span>
            </div>
            <input
              type="number"
              value={params.productCost}
              onChange={(e) => updateParam('productCost', Number(e.target.value))}
              className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
            />
          </div>

          {/* Ad Cost per Sale */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <span>Advertising Spend per Sale (CAC) ({currency})</span>
              <span className="font-bold">{(params.advertisingCostPerSale || 0).toLocaleString()}</span>
            </div>
            <input
              type="number"
              value={params.advertisingCostPerSale || 0}
              onChange={(e) => updateParam('advertisingCostPerSale', Number(e.target.value))}
              className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
            />
          </div>

          {/* Shipping & Packaging */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Packaging ({currency})</label>
              <input
                type="number"
                value={params.packagingCost}
                onChange={(e) => updateParam('packagingCost', Number(e.target.value))}
                className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Shipping ({currency})</label>
              <input
                type="number"
                value={params.shippingCost}
                onChange={(e) => updateParam('shippingCost', Number(e.target.value))}
                className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              />
            </div>
          </div>

          {/* Platform & Gateway Fee % */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Platform Fee %</label>
              <input
                type="number"
                step="0.5"
                value={params.platformFeePercent}
                onChange={(e) => updateParam('platformFeePercent', Number(e.target.value))}
                className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">Payment Gateway %</label>
              <input
                type="number"
                step="0.5"
                value={params.paymentGatewayFeePercent}
                onChange={(e) => updateParam('paymentGatewayFeePercent', Number(e.target.value))}
                className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              />
            </div>
          </div>

        </div>

        {/* Right: Recommended Pricing Tiers & Scenarios (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Recommended Tiers */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
              Strategic Price Recommendations
            </span>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                    Budget / Quick Liquidation Price
                  </span>
                  <span className="text-[11px] text-slate-400">Low margins, fast order velocity</span>
                </div>
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {currency} {result.recommendedPriceRange.budget.toLocaleString()}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border-2 border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 block flex items-center gap-1.5">
                    <span>Target Sweet Spot (Recommended)</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  </span>
                  <span className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80">Optimal balance of conversion & net profit</span>
                </div>
                <span className="font-extrabold text-base text-indigo-600 dark:text-indigo-400">
                  {currency} {result.recommendedPriceRange.target.toLocaleString()}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">
                    Premium Boutique Price
                  </span>
                  <span className="text-[11px] text-slate-400">For high-end branding & gift packaging</span>
                </div>
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {currency} {result.recommendedPriceRange.premium.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Scenario Comparison Table */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
              Scenario Simulation Table
            </span>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400">
                    <th className="pb-2 font-semibold">Scenario</th>
                    <th className="pb-2 font-semibold">Price</th>
                    <th className="pb-2 font-semibold">Net Profit</th>
                    <th className="pb-2 font-semibold">Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {result.scenarios.map((sc, i) => (
                    <tr key={i} className="py-2">
                      <td className="py-2 font-medium text-slate-900 dark:text-white">{sc.name}</td>
                      <td className="py-2 text-slate-600 dark:text-slate-300">{currency} {sc.sellingPrice.toLocaleString()}</td>
                      <td className={`py-2 font-bold ${(sc.netProfit ?? sc.estimatedProfit ?? 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {currency} {(sc.netProfit ?? sc.estimatedProfit ?? 0).toLocaleString()}
                      </td>
                      <td className="py-2 text-slate-600 dark:text-slate-300">{sc.marginPercent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
