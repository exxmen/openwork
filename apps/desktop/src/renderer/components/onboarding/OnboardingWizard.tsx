'use client';

import { useEffect, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { getAccomplish } from '../../lib/accomplish';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Zap,
  Globe,
  Code,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { springs, staggerContainer, staggerItem } from '@/lib/animations';

type FeatureTone = 'blue' | 'teal' | 'purple' | 'green';

interface OnboardingWizardProps {
  onComplete: () => void;
}

export default function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const accomplish = getAccomplish();

  useEffect(() => {
    accomplish.logEvent({
      level: 'info',
      message: 'Onboarding wizard started',
    });
  }, [accomplish]);

  const handleGetStarted = () => {
    accomplish.logEvent({
      level: 'info',
      message: 'Onboarding completed',
    });
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={springs.bouncy}
      >
        <Card className="w-full max-w-2xl overflow-hidden p-8">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...springs.gentle, delay: 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                <Zap className="h-7 w-7" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">Welcome to Openwork</h1>
                <p className="mt-1 text-sm text-muted-foreground">Your AI-powered automation assistant</p>
              </div>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-base leading-relaxed text-muted-foreground"
            >
              With Openwork, you can create complex AI-powered workflows with browser control capabilities.
              We can&apos;t wait to see what you build.
            </motion.p>
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 gap-4 text-left md:grid-cols-2"
            >
              <FeatureCard
                tone="blue"
                icon={<Code className="h-5 w-5" />}
                title="Code Generation"
                description="Generate and modify code with natural language instructions"
              />
              <FeatureCard
                tone="teal"
                icon={<Globe className="h-5 w-5" />}
                title="Browser Automation"
                description="Automate browser tasks with Dev Browser"
              />
              <FeatureCard
                tone="purple"
                icon={<CheckCircle2 className="h-5 w-5" />}
                title="Task Management"
                description="Track and manage your AI-assisted workflows"
              />
              <FeatureCard
                tone="green"
                icon={<Lock className="h-5 w-5" />}
                title="Secure & Local"
                description="Your data stays on your machine"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button onClick={handleGetStarted} size="lg" className="w-full">
                Get Started
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  tone,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  tone: FeatureTone;
}) {
  const toneStyles: Record<FeatureTone, string> = {
    blue: 'bg-blue-500/10 text-blue-600',
    teal: 'bg-teal-500/10 text-teal-600',
    purple: 'bg-purple-500/10 text-purple-600',
    green: 'bg-green-500/10 text-green-600',
  };

  return (
    <motion.div
      variants={staggerItem}
      transition={springs.gentle}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md"
    >
      <div className={cn('mb-3 flex h-10 w-10 items-center justify-center rounded-lg', toneStyles[tone])}>
        {icon}
      </div>
      <h3 className="mb-1 text-sm font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
}
