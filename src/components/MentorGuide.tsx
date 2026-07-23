import React, { useState } from 'react';
import { CURRICULUM_STEPS } from '../data/curriculum';
import { GraduationCap, ChevronLeft, ChevronRight, CheckCircle2, HelpCircle, Code2, BookOpen, Layers, Award, Copy, Check } from 'lucide-react';

interface MentorGuideProps {
  currentStep: number;
  onSetStep: (stepNumber: number) => void;
  onClose: () => void;
}

export function MentorGuide({ currentStep, onSetStep, onClose }: MentorGuideProps) {
  const activeStep = CURRICULUM_STEPS.find((s) => s.stepNumber === currentStep) || CURRICULUM_STEPS[0];
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showInterviewAnswers, setShowInterviewAnswers] = useState<Record<number, boolean>>({});
  const [copiedCode, setCopiedCode] = useState(false);

  const handleNextStep = () => {
    if (currentStep < 20) {
      onSetStep(currentStep + 1);
      setSelectedQuizOption(null);
      setQuizSubmitted(false);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      onSetStep(currentStep - 1);
      setSelectedQuizOption(null);
      setQuizSubmitted(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeStep.codeSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const toggleInterviewAnswer = (index: number) => {
    setShowInterviewAnswers((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-end transition-opacity animate-fade-in">
      <div className="bg-white w-full max-w-3xl h-full shadow-2xl flex flex-col overflow-hidden border-l border-slate-200">
        {/* Drawer Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Full Stack Mentorship Bootcamp
              </div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Step {activeStep.stepNumber}: {activeStep.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {/* Horizontal Step Selector Pill Strip */}
        <div className="bg-slate-100 p-3 border-b border-slate-200 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {CURRICULUM_STEPS.map((step) => (
            <button
              key={step.stepNumber}
              onClick={() => {
                onSetStep(step.stepNumber);
                setSelectedQuizOption(null);
                setQuizSubmitted(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1 ${
                step.stepNumber === currentStep
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : step.stepNumber < currentStep
                  ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                  : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
              }`}
            >
              {step.stepNumber < currentStep && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
              <span>Step {step.stepNumber}</span>
            </button>
          ))}
        </div>

        {/* Step Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 text-slate-800">
          {/* Summary Box */}
          <div className="bg-indigo-50/80 border border-indigo-100 rounded-2xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-900 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              Lesson Objective & Core Topic
            </h3>
            <p className="text-sm font-semibold text-indigo-950">{activeStep.topic}</p>
            <p className="text-xs text-indigo-800 mt-1">{activeStep.summary}</p>
          </div>

          {/* 1. Theory Section */}
          <section className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-extrabold flex items-center justify-center">1</span>
              Theoretical Concepts & Architecture
            </h3>
            <div className="text-sm text-slate-600 leading-relaxed space-y-2 whitespace-pre-line font-normal">
              {activeStep.theory}
            </div>
          </section>

          {/* 2. System Diagram */}
          <section className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-extrabold flex items-center justify-center">2</span>
              Architecture Flow Diagram
            </h3>
            <div className="bg-slate-950 text-emerald-400 p-4 rounded-2xl font-mono text-xs overflow-x-auto shadow-inner border border-slate-800 leading-tight">
              <pre>{activeStep.diagram.trim()}</pre>
            </div>
          </section>

          {/* 3. Code Implementation & Line-by-Line */}
          <section className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-extrabold flex items-center justify-center">3</span>
                Code Walkthrough
              </h3>
              <button
                onClick={handleCopyCode}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg flex items-center gap-1 font-semibold transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode ? 'Copied!' : 'Copy Code'}
              </button>
            </div>

            <div className="bg-slate-900 rounded-2xl p-4 text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800">
              <pre>{activeStep.codeSnippet}</pre>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2">
                <Code2 className="w-4 h-4 text-indigo-600" /> Line-by-Line Breakdown
              </h4>
              {activeStep.lineByLine.map((line, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                  <span className="font-bold text-indigo-600 text-[11px] font-mono min-w-[20px]">{idx + 1}.</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Mini Quiz */}
          <section className="bg-white border-2 border-indigo-100 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
              Interactive Mini Quiz: Step {activeStep.stepNumber}
            </h3>
            <p className="text-xs font-medium text-slate-700">{activeStep.quiz.question}</p>

            <div className="space-y-2 pt-1">
              {activeStep.quiz.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedQuizOption(idx);
                    setQuizSubmitted(true);
                  }}
                  className={`w-full text-left p-3 rounded-xl text-xs font-medium border transition-all flex items-center justify-between ${
                    quizSubmitted
                      ? idx === activeStep.quiz.correctIndex
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                        : selectedQuizOption === idx
                        ? 'bg-rose-50 border-rose-300 text-rose-900'
                        : 'bg-slate-50 border-slate-200 text-slate-500 opacity-60'
                      : selectedQuizOption === idx
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-900'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span>{option}</span>
                  {quizSubmitted && idx === activeStep.quiz.correctIndex && (
                    <span className="text-emerald-600 text-xs font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                      Correct ✓
                    </span>
                  )}
                </button>
              ))}
            </div>

            {quizSubmitted && (
              <div
                className={`p-3 rounded-xl text-xs ${
                  selectedQuizOption === activeStep.quiz.correctIndex
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-indigo-50 text-indigo-900 border border-indigo-200'
                }`}
              >
                <p className="font-bold mb-0.5">
                  {selectedQuizOption === activeStep.quiz.correctIndex ? '🎉 Excellent Job!' : '💡 Explanation:'}
                </p>
                <p>{activeStep.quiz.explanation}</p>
              </div>
            )}
          </section>

          {/* 5. Common Interview Questions */}
          <section className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Common Senior Developer Interview Questions
            </h3>
            <div className="space-y-2">
              {activeStep.interviewQuestions.map((iq, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <button
                    onClick={() => toggleInterviewAnswer(idx)}
                    className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 font-semibold text-slate-800 flex items-center justify-between"
                  >
                    <span>Q: {iq.q}</span>
                    <span className="text-indigo-600 text-xs font-bold">
                      {showInterviewAnswers[idx] ? 'Hide Answer' : 'Reveal Answer'}
                    </span>
                  </button>
                  {showInterviewAnswers[idx] && (
                    <div className="p-3 bg-white text-slate-700 border-t border-slate-100 leading-relaxed">
                      <span className="font-bold text-indigo-700">A: </span>
                      {iq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 6. Mini Exercise & Best Practices */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs space-y-1">
              <h4 className="font-bold text-amber-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Award className="w-4 h-4 text-amber-600" /> Hands-On Challenge
              </h4>
              <p className="text-amber-950 font-medium">{activeStep.exercise}</p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs space-y-1">
              <h4 className="font-bold text-emerald-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Best Practices
              </h4>
              <ul className="list-disc list-inside text-emerald-950 space-y-0.5">
                {activeStep.bestPractices.map((bp, i) => (
                  <li key={i}>{bp}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Drawer Footer Navigation Bar */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Previous Step
          </button>

          <span className="text-xs font-bold text-slate-500">
            Step {currentStep} of 20
          </span>

          <button
            onClick={handleNextStep}
            disabled={currentStep === 20}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow-md shadow-indigo-100 transition-all"
          >
            <span>Next Step</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
