// src/pages/Signup.jsx
import SignupForm from '../components/SignupForm';
import { Confetti } from '../components/Confetti';
import logo from '../assets/promptbuilder_logo.png';
import { useTranslation } from 'react-i18next';

export default function Signup() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex min-h-screen w-full">
        {/* Signup Form Section (Left) */}
        <div className="w-full md:w-1/3 p-8 flex items-center justify-center">
          <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('signup.title')}
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {t('signup.subtitle')}
              </p>
            </div>
            <SignupForm />
          </div>
        </div>

        {/* Welcome Section (Right) */}
        <div className="hidden md:flex md:w-2/3 relative overflow-hidden bg-gradient-to-b from-white via-red-500 via-orange-300 to-yellow-300">
          <Confetti
            className="absolute inset-0 z-20"
            options={{
              particleCount: 30,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#ffffff', '#fbbf24', '#f59e0b'],
              gravity: 0.15,
              ticks: 200
            }}
            manualStart={false}
          />

          <div className="relative z-10 w-full h-full flex items-center justify-center p-12">
            <div className="max-w-xl text-center">
              <img src={logo} alt="PromptBuilder" className="h-14 mb-8 mx-auto" />
              <h1 className="text-3xl font-bold text-white mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                {t('signup.welcome')}
              </h1>
              <p className="text-1xl text-white/90 leading-relaxed mb-12 whitespace-pre-line">
                {t('signup.welcomeText')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}