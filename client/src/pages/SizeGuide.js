import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';

const SizeGuide = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <>
      <Helmet>
        <title>Size Guide - Caper Sports</title>
        <meta name="description" content="Find your perfect fit with our comprehensive size guide for athletic wear and sports apparel." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Header */}
        <section className="pt-24 pb-12 px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl">📏</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Size <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">Guide</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Find your perfect fit with our comprehensive sizing guide. Get the right size every time for maximum comfort and performance.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Size Chart Section */}
        <section className="pb-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="bg-white rounded-3xl p-8 border border-gray-200 shadow-lg"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Men's T-Shirt Size Chart
                </h2>
                <p className="text-gray-600">
                  All measurements are in inches. For best fit, measure your body and compare with our size chart.
                </p>
              </div>

              {/* Measurement Guide Photo */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">Measurement Guide</h3>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 max-w-4xl mx-auto">
                  <img
                    src="/images/size-photo.png"
                    alt="How to measure your size"
                    className="w-full h-auto rounded-xl shadow-lg"
                    onError={(e) => {
                      console.error('Size guide image failed to load');
                      e.target.style.display = 'none';
                      const fallback = e.target.nextSibling;
                      if (fallback && fallback.classList) {
                        fallback.style.display = 'block';
                      }
                    }}
                  />
                  <div className="hidden">
                    <p className="text-center text-gray-600 text-sm">Measurement guide image not available</p>
                  </div>
                </div>
              </div>

              {/* Size Chart Table */}
              <div className="overflow-x-auto mb-8">
                <table className="w-full border-collapse bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                  <thead>
                    <tr className="bg-gradient-to-r from-red-600 to-blue-600 text-white">
                      <th className="px-4 py-3 text-left font-semibold text-white">T-SHIRT</th>
                      <th className="px-4 py-3 text-center font-semibold text-white">5XS<br/><span className="text-xs opacity-90 text-white">(26)</span></th>
                      <th className="px-4 py-3 text-center font-semibold text-white">4XS<br/><span className="text-xs opacity-90 text-white">(28)</span></th>
                      <th className="px-4 py-3 text-center font-semibold text-white">3XS<br/><span className="text-xs opacity-90 text-white">(30)</span></th>
                      <th className="px-4 py-3 text-center font-semibold text-white">2XS<br/><span className="text-xs opacity-90 text-white">(32)</span></th>
                      <th className="px-4 py-3 text-center font-semibold text-white">XS<br/><span className="text-xs opacity-90 text-white">(34)</span></th>
                      <th className="px-4 py-3 text-center font-semibold text-white">S<br/><span className="text-xs opacity-90 text-white">(36)</span></th>
                      <th className="px-4 py-3 text-center font-semibold text-white">M<br/><span className="text-xs opacity-90 text-white">(38)</span></th>
                      <th className="px-4 py-3 text-center font-semibold text-white">L<br/><span className="text-xs opacity-90 text-white">(40)</span></th>
                      <th className="px-4 py-3 text-center font-semibold text-white">XL<br/><span className="text-xs opacity-90 text-white">(42)</span></th>
                      <th className="px-4 py-3 text-center font-semibold text-white">2XL<br/><span className="text-xs opacity-90 text-white">(44)</span></th>
                      <th className="px-4 py-3 text-center font-semibold text-white">3XL<br/><span className="text-xs opacity-90 text-white">(46)</span></th>
                      <th className="px-4 py-3 text-center font-semibold text-white">4XL<br/><span className="text-xs opacity-90 text-white">(48)</span></th>
                      <th className="px-4 py-3 text-center font-semibold text-white">5XL<br/><span className="text-xs opacity-90 text-white">(50)</span></th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-900 bg-gray-100">LENGTH</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">21</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">22</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">23</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">24</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">25</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">26</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">27</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">28</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">29</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">30</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">31</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">32</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">33</td>
                    </tr>
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-900 bg-gray-100">CHEST</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">28</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">30</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">32</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">34</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">36</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">38</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">40</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">42</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">44</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">46</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">48</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">50</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">52</td>
                    </tr>
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-900 bg-gray-100">SHOULDER</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">14</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">14.5</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">15</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">15.5</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">16</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">16.5</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">17</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">17.5</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">18</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">18.5</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">19</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">19.5</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">20</td>
                    </tr>
                    <tr className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-900 bg-gray-100">SLEEVE LENGTH (HALF)</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">5.5</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">6</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">6.5</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">7</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">7.5</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">8</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">8.5</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">9</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">9.5</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">10</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">10.5</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">11</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">11.5</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-900 bg-gray-100">ARMHOLE</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">5</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">5.5</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">6</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">6.5</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">7</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">7.5</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">8</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">8.5</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">9</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">9.5</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">10</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">10.5</td>
                      <td className="px-4 py-3 text-center text-gray-900 font-medium">11</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Size Chart Notes */}
              <div className="bg-blue-50 rounded-xl p-6 mb-8">
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-2">📏 Important Notes:</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• All measurements are in inches</li>
                    <li>• Chest measurement is taken 1 inch below armhole (all around)</li>
                    <li>• For best fit, measure your body and compare with our size chart</li>
                    <li>• Contact us for custom sizing options</li>
                  </ul>
                </div>
              </div>

              {/* How to Measure Section */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">How to Measure</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">✂️ Chest</h4>
                    <p>Measure around the fullest part of your chest, keeping the tape horizontal.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">📏 Length</h4>
                    <p>Measure from the highest point of your shoulder down to your desired length.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">👔 Shoulder</h4>
                    <p>Measure from shoulder point to shoulder point across your back.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">💪 Sleeve</h4>
                    <p>Measure from shoulder seam to the desired sleeve end point.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default SizeGuide;
