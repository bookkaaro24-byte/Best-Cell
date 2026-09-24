import { PricingCalculatorInputs, PricingCalculatorResults } from '../types';

export function calculatePricingResults(inputs: PricingCalculatorInputs): PricingCalculatorResults {
  const {
    productCost = 0,
    sellingPrice = 0,
    packagingCost = 0,
    shippingCost = 0,
    platformFeePercent = 0,
    paymentFeePercent = 0,
    paymentGatewayFeePercent = 0,
    advertisingCost = 0,
    advertisingCostPerSale = 0,
    otherCosts = 0,
    discountPercent = 0
  } = inputs;

  const actualPaymentFeePercent = paymentFeePercent || paymentGatewayFeePercent || 0;
  const actualAdCost = advertisingCost || advertisingCostPerSale || 0;

  const discountedSellingPrice = sellingPrice * (1 - (discountPercent / 100));
  
  // Platform and payment fees apply to discounted selling price
  const platformFee = discountedSellingPrice * (platformFeePercent / 100);
  const paymentFee = discountedSellingPrice * (actualPaymentFeePercent / 100);

  // Total cost per unit sold
  const totalCost = productCost + packagingCost + shippingCost + actualAdCost + otherCosts + platformFee + paymentFee;

  // Gross profit: selling price - direct product cost
  const grossProfit = discountedSellingPrice - productCost;

  // Net estimated profit: revenue - all costs
  const netEstimatedProfit = discountedSellingPrice - totalCost;

  // Margin % = (Net profit / selling price) * 100
  const profitMarginPercent = discountedSellingPrice > 0 ? (netEstimatedProfit / discountedSellingPrice) * 100 : 0;

  // Markup % = (Selling price - product cost) / product cost * 100
  const markupPercent = productCost > 0 ? ((discountedSellingPrice - productCost) / productCost) * 100 : 0;

  // Break-even price
  const fixedPerUnit = productCost + packagingCost + shippingCost + actualAdCost + otherCosts;
  const variableFeeFraction = (platformFeePercent + actualPaymentFeePercent) / 100;
  const breakEvenPrice = variableFeeFraction < 1 ? fixedPerUnit / (1 - variableFeeFraction) : fixedPerUnit;

  // Scenarios
  const regularPrice = sellingPrice;
  const regPlatformFee = regularPrice * (platformFeePercent / 100);
  const regPaymentFee = regularPrice * (actualPaymentFeePercent / 100);
  const regTotalCost = productCost + packagingCost + shippingCost + actualAdCost + otherCosts + regPlatformFee + regPaymentFee;
  const regProfit = regularPrice - regTotalCost;
  const regMargin = regularPrice > 0 ? (regProfit / regularPrice) * 100 : 0;

  const discountScenarioPrice = sellingPrice * 0.85; // 15% off
  const discPlatformFee = discountScenarioPrice * (platformFeePercent / 100);
  const discPaymentFee = discountScenarioPrice * (actualPaymentFeePercent / 100);
  const discTotalCost = productCost + packagingCost + shippingCost + actualAdCost + otherCosts + discPlatformFee + discPaymentFee;
  const discProfit = discountScenarioPrice - discTotalCost;
  const discMargin = discountScenarioPrice > 0 ? (discProfit / discountScenarioPrice) * 100 : 0;

  const premiumScenarioPrice = sellingPrice * 1.25; // 25% markup
  const premPlatformFee = premiumScenarioPrice * (platformFeePercent / 100);
  const premPaymentFee = premiumScenarioPrice * (actualPaymentFeePercent / 100);
  const premTotalCost = productCost + packagingCost + shippingCost + actualAdCost + otherCosts + premPlatformFee + premPaymentFee;
  const premProfit = premiumScenarioPrice - premTotalCost;
  const premMargin = premiumScenarioPrice > 0 ? (premProfit / premiumScenarioPrice) * 100 : 0;

  return {
    totalCost: Math.round(totalCost * 100) / 100,
    grossProfit: Math.round(grossProfit * 100) / 100,
    netProfit: Math.round(netEstimatedProfit * 100) / 100,
    netEstimatedProfit: Math.round(netEstimatedProfit * 100) / 100,
    profitMarginPercent: Math.round(profitMarginPercent * 10) / 10,
    markupPercent: Math.round(markupPercent * 10) / 10,
    breakEvenPrice: Math.round(breakEvenPrice * 100) / 100,
    recommendedPriceRange: {
      budget: Math.round(breakEvenPrice * 1.15),
      target: Math.round(sellingPrice),
      premium: Math.round(sellingPrice * 1.3)
    },
    scenarios: [
      {
        name: 'Regular Price',
        sellingPrice: Math.round(regularPrice),
        netProfit: Math.round(regProfit),
        estimatedProfit: Math.round(regProfit),
        marginPercent: Math.round(regMargin * 10) / 10
      },
      {
        name: 'Sale (15% Off)',
        sellingPrice: Math.round(discountScenarioPrice),
        netProfit: Math.round(discProfit),
        estimatedProfit: Math.round(discProfit),
        marginPercent: Math.round(discMargin * 10) / 10
      },
      {
        name: 'Premium / Gift Pack (+25%)',
        sellingPrice: Math.round(premiumScenarioPrice),
        netProfit: Math.round(premProfit),
        estimatedProfit: Math.round(premProfit),
        marginPercent: Math.round(premMargin * 10) / 10
      }
    ]
  };
}

export const calculatePricingDetails = calculatePricingResults;
