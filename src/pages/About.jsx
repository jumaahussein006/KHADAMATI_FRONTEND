import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import { KhadamatiLogo } from '../components/KhadamatiLogo';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiTarget, FiEye } from 'react-icons/fi';

const About = ({ language }) => {
  const { t, i18n } = useTranslation();

  // Support language switching via prop or global i18n
  const currentLang = language || i18n.language;
  const isRTL = currentLang?.startsWith('ar');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
  };

  const cardVariants = {
    hover: {
      y: -10,
      boxShadow: '0 25px 50px -12px rgba(11, 165, 236, 0.15)',
      transition: { duration: 0.25 },
    },
  };

  const values = [
    {
      title: t('about.values.items.reliability.title', {
        defaultValue: isRTL ? 'الموثوقية' : 'Reliability',
      }),
      desc: t('about.values.items.reliability.text', {
        defaultValue: isRTL ? 'خدمة يمكن الاعتماد عليها.' : 'A service you can rely on.',
      }),
    },
    {
      title: t('about.values.items.transparency.title', {
        defaultValue: isRTL ? 'الشفافية' : 'Transparency',
      }),
      desc: t('about.values.items.transparency.text', {
        defaultValue: isRTL ? 'تواصل واضح وأسعار واضحة.' : 'Clear communication and clear pricing.',
      }),
    },
    {
      title: t('about.values.items.satisfaction.title', {
        defaultValue: isRTL ? 'رضا العملاء' : 'Satisfaction',
      }),
      desc: t('about.values.items.satisfaction.text', {
        defaultValue: isRTL ? 'تجربة أفضل للزبون.' : 'A better customer experience.',
      }),
    },
    {
      title: t('about.values.items.innovation.title', {
        defaultValue: isRTL ? 'الابتكار' : 'Innovation',
      }),
      desc: t('about.values.items.innovation.text', {
        defaultValue: isRTL ? 'حلول حديثة لخدمات يومية.' : 'Modern solutions for daily services.',
      }),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-10">
          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <KhadamatiLogo className="h-10 w-10" />
              <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                {t('about.title', { defaultValue: isRTL ? 'من نحن' : 'About Us' })}
              </h1>
            </div>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {t('about.description', {
                defaultValue: isRTL
                  ? 'خدماتي منصة تربط الزبائن بمقدمي الخدمات بشكل سريع وآمن.'
                  : 'Khadamati connects customers with service providers quickly and safely.',
              })}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={itemVariants} whileHover="hover" className="h-full" animate="visible">
              <motion.div variants={cardVariants} className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 h-full">
                <div className="flex items-center gap-3 mb-3">
                  <FiEye className="h-6 w-6 text-[#0BA5EC]" />
                  <h2 className="text-xl font-black text-gray-900 dark:text-white">
                    {t('about.vision.title', { defaultValue: isRTL ? 'رؤيتنا' : 'Our Vision' })}
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t('about.vision.text', {
                    defaultValue: isRTL
                      ? 'تبسيط خدمات الصيانة المنزلية عبر تجربة حديثة وموثوقة.'
                      : 'Simplify home maintenance services through a modern and reliable experience.',
                  })}
                </p>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} whileHover="hover" className="h-full" animate="visible">
              <motion.div variants={cardVariants} className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 h-full">
                <div className="flex items-center gap-3 mb-3">
                  <FiTarget className="h-6 w-6 text-[#0BA5EC]" />
                  <h2 className="text-xl font-black text-gray-900 dark:text-white">
                    {t('about.mission.title', { defaultValue: isRTL ? 'مهمتنا' : 'Our Mission' })}
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {t('about.mission.text', {
                    defaultValue: isRTL
                      ? 'ربط الزبائن بمقدمي خدمات محترفين مع التركيز على الجودة والشفافية.'
                      : 'Connect customers with professional providers while focusing on quality and transparency.',
                  })}
                </p>
              </motion.div>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <div className="flex items-center gap-3 mb-6">
              <FiCheckCircle className="h-6 w-6 text-[#0BA5EC]" />
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                {t('about.values.title', { defaultValue: isRTL ? 'قيمنا' : 'Our Values' })}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {values.map((v, idx) => (
                <motion.div key={idx} whileHover="hover" variants={cardVariants} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                  <h3 className="font-black text-gray-900 dark:text-white mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{v.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
