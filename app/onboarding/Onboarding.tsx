'use client'

import { useState } from 'react'
import { useFormState } from 'react-dom'
import { AuthSubmit } from '@/components/auth/AuthSubmit'
import { saveGoal, type OnboardingState } from './actions'

const initialState: OnboardingState = { error: null }

const goalExamples = [
  '能夠在工作會議裡用英文發言',
  '能夠跟外國朋友自在聊天',
  '出國旅行時不再害怕開口',
]

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 block w-full text-center text-[12px] text-ink-muted transition hover:text-ink-mid"
    >
      上一步
    </button>
  )
}

export function Onboarding() {
  const [step, setStep] = useState(1)
  const [state, formAction] = useFormState(saveGoal, initialState)

  return (
    <main className="flex min-h-[100dvh] flex-col bg-ivory px-5 py-10">
      <div className="mx-auto flex w-full max-w-[440px] flex-1 flex-col">
        {/* 品牌 */}
        <div className="text-center font-serif text-[20px] font-medium tracking-[0.05em] text-navy">
          Bridgeway <span className="text-gold">Classroom</span>
        </div>

        {/* 進度點 */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {[1, 2, 3].map((n) => (
            <span
              key={n}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                n === step ? 'w-6 bg-gold' : 'w-1.5 bg-ivory-dim'
              }`}
            />
          ))}
        </div>

        {step === 3 ? (
          <form action={formAction} className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col justify-center py-10">
              <h1 className="font-serif text-[26px] font-medium leading-snug text-navy">
                你學英文最想做到的一件事是什麼？
              </h1>
              <textarea
                name="goal"
                required
                rows={3}
                placeholder="寫下你的目標…"
                className="mt-6 w-full resize-none rounded-field border border-ivory-dim bg-white px-4 py-3 text-[15px] leading-relaxed text-ink outline-none transition placeholder:text-ink-muted/60 focus:border-gold focus:ring-2 focus:ring-gold/25"
              />
              <div className="mt-3 text-[12px] leading-[1.85] text-ink-muted">
                <div>
                  <span className="text-ink-mid">例：</span>
                  {goalExamples[0]}
                </div>
                <div className="pl-[1.9em]">{goalExamples[1]}</div>
                <div className="pl-[1.9em]">{goalExamples[2]}</div>
              </div>
              {state.error ? (
                <p
                  role="alert"
                  className="mt-4 rounded-field bg-[#fdf0ef] px-3 py-2 text-[13px] text-[#b3261e]"
                >
                  {state.error}
                </p>
              ) : null}
            </div>

            <AuthSubmit label="開始我的學習旅程" pendingLabel="儲存中…" />
            <BackLink onClick={() => setStep(2)} />
          </form>
        ) : (
          <>
            <div className="flex flex-1 flex-col justify-center py-10">
              {step === 1 ? (
                <div className="flex flex-col gap-5">
                  <h1 className="font-serif text-[32px] font-medium leading-tight text-navy">
                    Bridgeway <span className="italic text-gold">Classroom</span>
                  </h1>
                  <p className="text-[15px] leading-[1.9] text-ink-mid">
                    這裡是你專屬的學習空間。每一堂課後，你會在這裡看到你的學習報告和進步記錄。
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  <h1 className="font-serif text-[30px] font-medium leading-tight text-navy">
                    AI 課堂分析報告
                  </h1>
                  <p className="text-[15px] leading-[1.9] text-ink-mid">
                    每堂課結束後，系統會自動分析你的課堂錄音，生成專屬的學習報告。包含本課單字、片語、進步點，和下堂課的思考題。
                  </p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="w-full rounded-field bg-gold px-4 py-3 text-[14px] font-semibold text-navy shadow-[0_2px_12px_rgba(184,151,58,0.35)] transition hover:bg-gold-light"
            >
              繼續
            </button>
            {step === 2 ? <BackLink onClick={() => setStep(1)} /> : null}
          </>
        )}
      </div>
    </main>
  )
}
