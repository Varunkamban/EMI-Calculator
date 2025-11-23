import React, { useState, useEffect } from 'react';
import { Calculator, IndianRupee } from 'lucide-react';

export default function EMICalculator() {
  const [principal, setPrincipal] = useState(2000000);
  const [interestRate, setInterestRate] = useState(12);
  const [tenureMonths, setTenureMonths] = useState(180);
  const [emi, setEmi] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [extraEmi, setExtraEmi] = useState(0);

  useEffect(() => {
    calculateEMI();
  }, [principal, interestRate, tenureMonths, extraEmi]);

  const calculateEMI = () => {
    const P = parseFloat(principal);
    const r = parseFloat(interestRate) / 12 / 100; // Monthly interest rate
    const n = parseFloat(tenureMonths); // Total months
    const extra = parseFloat(extraEmi) || 0;

    if (P > 0 && r > 0 && n > 0) {
      // EMI Formula: EMI = [P × r × (1+r)^n] / [(1+r)^n - 1]
      const emiValue = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      
      if (extra > 0) {
        // Calculate with extra EMI payment
        let balance = P;
        let totalPaid = 0;
        let monthCount = 0;
        const monthlyPayment = emiValue + extra;
        
        while (balance > 0 && monthCount < n) {
          const interestForMonth = balance * r;
          const principalForMonth = monthlyPayment - interestForMonth;
          
          if (principalForMonth <= 0) {
            // Extra EMI too small
            break;
          }
          
          if (balance <= monthlyPayment) {
            // Last payment
            totalPaid += balance + (balance * r);
            balance = 0;
          } else {
            balance -= principalForMonth;
            totalPaid += monthlyPayment;
          }
          monthCount++;
        }
        
        setEmi(Math.round(monthlyPayment));
        setTotalAmount(Math.round(totalPaid));
        setTotalInterest(Math.round(totalPaid - P));
      } else {
        // Normal EMI calculation
        const totalAmountValue = emiValue * n;
        const totalInterestValue = totalAmountValue - P;
        
        setEmi(Math.round(emiValue));
        setTotalAmount(Math.round(totalAmountValue));
        setTotalInterest(Math.round(totalInterestValue));
      }
    } else {
      setEmi(0);
      setTotalAmount(0);
      setTotalInterest(0);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const principalPercentage = totalAmount > 0 ? (principal / totalAmount) * 100 : 50;
  const interestPercentage = totalAmount > 0 ? (totalInterest / totalAmount) * 100 : 50;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
            <div className="flex items-center gap-3">
              <Calculator size={32} />
              <h1 className="text-3xl font-bold">EMI Calculator</h1>
            </div>
            <p className="mt-2 text-blue-100">Calculate your loan EMI with ease</p>
          </div>

          <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Loan Amount (₹)
                </label>
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                  min="0"
                />
                <input
                  type="range"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  min="100000"
                  max="10000000"
                  step="100000"
                  className="w-full mt-2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rate of Interest (% p.a.)
                </label>
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                  min="0"
                  step="0.1"
                />
                <input
                  type="range"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  min="1"
                  max="30"
                  step="0.5"
                  className="w-full mt-2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Loan Tenure (Months)
                </label>
                <input
                  type="number"
                  value={tenureMonths}
                  onChange={(e) => setTenureMonths(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none text-lg"
                  min="0"
                />
                <input
                  type="range"
                  value={tenureMonths}
                  onChange={(e) => setTenureMonths(e.target.value)}
                  min="6"
                  max="360"
                  step="6"
                  className="w-full mt-2"
                />
                <p className="text-sm text-gray-500 mt-1">{(tenureMonths / 12).toFixed(1)} Years</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Extra EMI Payment (₹) - Optional
                </label>
                <input
                  type="number"
                  value={extraEmi}
                  onChange={(e) => setExtraEmi(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none text-lg"
                  min="0"
                  placeholder="0"
                />
                <p className="text-sm text-green-600 mt-1">Add extra amount to reduce tenure & interest</p>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <p className="text-sm text-gray-600 mb-1">Monthly EMI</p>
                <p className="text-4xl font-bold text-green-700">{formatCurrency(emi)}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Principal Amount</span>
                  <span className="font-semibold text-lg">{formatCurrency(principal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Interest</span>
                  <span className="font-semibold text-lg text-orange-600">{formatCurrency(totalInterest)}</span>
                </div>
                <div className="border-t-2 border-gray-300 pt-4 flex justify-between items-center">
                  <span className="text-gray-700 font-semibold">Total Amount</span>
                  <span className="font-bold text-xl text-blue-600">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              {/* Pie Chart */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                <h3 className="font-semibold text-gray-700 mb-4">Payment Breakdown</h3>
                <div className="flex items-center justify-center mb-4">
                  <svg width="200" height="200" viewBox="0 0 200 200">
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#e0e7ff"
                      strokeWidth="40"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="40"
                      strokeDasharray={`${(principalPercentage * 502.4) / 100} 502.4`}
                      transform="rotate(-90 100 100)"
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="80"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="40"
                      strokeDasharray={`${(interestPercentage * 502.4) / 100} 502.4`}
                      strokeDashoffset={`-${(principalPercentage * 502.4) / 100}`}
                      transform="rotate(-90 100 100)"
                    />
                  </svg>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-indigo-600 rounded"></div>
                      <span className="text-sm text-gray-600">Principal</span>
                    </div>
                    <span className="font-semibold">{principalPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-orange-500 rounded"></div>
                      <span className="text-sm text-gray-600">Interest</span>
                    </div>
                    <span className="font-semibold">{interestPercentage.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

