import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { GlowButton } from '@/components/ui/GlowButton';
import { UserProfile, VoiceProfile, DetailLevel } from '@/types';
import { generateId } from '@/lib/utils';

const steps = [
  {
    title: 'Welcome to ORBIT',
    description: 'Your futuristic AI companion. Let us personalize your experience.',
    field: null,
  },
  {
    title: 'What should I call you?',
    description: 'Enter your name or a nickname.',
    field: 'name' as const,
  },
  {
    title: 'Choose your voice',
    description: 'Select how you want ORBIT to sound.',
    field: 'voice' as const,
  },
  {
    title: 'Response detail level',
    description: 'How detailed should responses be?',
    field: 'detail' as const,
  },
  {
    title: 'You are all set!',
    description: 'ORBIT is ready. Speak or type to begin.',
    field: null,
  },
];

const voiceOptions: { id: VoiceProfile; label: string }[] = [
  { id: 'neutral', label: 'Neutral' },
  { id: 'male_natural', label: 'Natural Male' },
  { id: 'female_natural', label: 'Natural Female' },
  { id: 'male_deep', label: 'Deep Male' },
  { id: 'female_warm', label: 'Warm Female' },
];

const detailOptions: { id: DetailLevel; label: string; description: string }[] = [
  {
    id: 'brief',
    label: 'Brief',
    description: 'Short, to-the-point answers',
  },
  {
    id: 'balanced',
    label: 'Balanced',
    description: 'Informative but concise',
  },
  {
    id: 'comprehensive',
    label: 'Comprehensive',
    description: 'Deep, thorough explanations',
  },
];

export const SetupWizard: React.FC = () => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [voice, setVoice] = useState<VoiceProfile>('neutral');
  const [detail, setDetail] = useState<DetailLevel>('balanced');
  const { setUser } = useStore();

  const handleNext = () => {
    if (step === 4) {
      // Create user profile
      const user: UserProfile = {
        id: generateId(),
        name: name || 'Friend',
        voicePreference: voice,
        detailLevel: detail,
        interests: ['technology', 'science', 'design'],
        savedTopics: [],
        preferredSources: [],
        languageStyle: 'mixed',
        autoListen: true,
        wakeWordEnabled: true,
        speechSpeed: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUser(user);
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a1a]/90 backdrop-blur-xl">
      <motion.div
        className="w-full max-w-md mx-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            className="relative rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-2xl p-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Progress dots */}
            <div className="flex justify-center gap-1.5 mb-8">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i <= step
                      ? 'w-6 bg-gradient-to-r from-blue-400 to-purple-400'
                      : 'w-1.5 bg-white/10'
                  }`}
                />
              ))}
            </div>

            <h2 className="text-xl font-medium text-white/90 text-center mb-2">
              {currentStep.title}
            </h2>
            <p className="text-sm text-white/40 text-center mb-8">
              {currentStep.description}
            </p>

            {/* Step content */}
            {currentStep.field === 'name' && (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white/80 text-center outline-none focus:border-blue-400/50 transition-colors"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
              />
            )}

            {currentStep.field === 'voice' && (
              <div className="space-y-2">
                {voiceOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setVoice(opt.id)}
                    className={`w-full p-3 rounded-xl text-left transition-all ${
                      voice === opt.id
                        ? 'bg-blue-500/10 border border-blue-500/20 text-white'
                        : 'bg-white/[0.02] border border-white/5 text-white/50 hover:text-white/80'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {currentStep.field === 'detail' && (
              <div className="space-y-2">
                {detailOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setDetail(opt.id)}
                    className={`w-full p-3 rounded-xl text-left transition-all ${
                      detail === opt.id
                        ? 'bg-blue-500/10 border border-blue-500/20 text-white'
                        : 'bg-white/[0.02] border border-white/5 text-white/50 hover:text-white/80'
                    }`}
                  >
                    <span className="block text-sm">{opt.label}</span>
                    <span className="text-[10px] text-white/30">
                      {opt.description}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Step 0 and 4 are info-only */}
            {currentStep.field === null && (
              <div className="flex justify-center">
                {step === 0 && (
                  <motion.div
                    className="w-20 h-20 rounded-full"
                    style={{
                      background:
                        'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.4), rgba(100,150,255,0.3) 40%, rgba(50,50,100,0.5) 100%)',
                      boxShadow:
                        '0 0 60px rgba(100, 150, 255, 0.4), inset 0 0 30px rgba(255, 255, 255, 0.1)',
                    }}
                    animate={{
                      scale: [1, 1.08, 1],
                      boxShadow: [
                        '0 0 60px rgba(100, 150, 255, 0.4)',
                        '0 0 80px rgba(100, 150, 255, 0.6)',
                        '0 0 60px rgba(100, 150, 255, 0.4)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              {step > 0 && step < 4 && (
                <GlowButton variant="ghost" onClick={handleBack}>
                  Back
                </GlowButton>
              )}
              <div className="flex-1" />
              <GlowButton onClick={handleNext}>
                {step === 4 ? 'Start Exploring' : step === 0 ? 'Get Started' : 'Next'}
              </GlowButton>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
