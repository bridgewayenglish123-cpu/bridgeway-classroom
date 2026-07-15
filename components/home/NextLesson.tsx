import { EnterClassroomButton } from './EnterClassroomButton'
import { formatLessonDayLabel } from '@/lib/utils/date'
import type { NextLessonVM } from '@/lib/types/home'

function LockIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className="flex-shrink-0"
    >
      <rect
        x="2"
        y="6"
        width="10"
        height="7"
        rx="1.5"
        stroke="rgba(247,244,238,0.5)"
        strokeWidth="1.2"
      />
      <path
        d="M4.5 6V4a2.5 2.5 0 015 0v2"
        stroke="rgba(247,244,238,0.5)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function NextLesson({ lesson }: { lesson: NextLessonVM | null }) {
  if (!lesson) {
    return (
      <div className="relative mb-3 overflow-hidden rounded-card bg-navy p-5 shadow-lesson sm:p-[26px] sm:px-7">
        <div className="mb-[18px] text-[10px] font-medium uppercase tracking-[0.14em] text-gold-light">
          下一堂課
        </div>
        <p className="text-[13px] leading-relaxed text-ivory/50">
          目前沒有排定的課程。請聯絡 Bridgeway 安排課表。
        </p>
      </div>
    )
  }

  const teacherName = lesson.teacherName ?? '老師'
  const timeLabel = lesson.time.slice(0, 5)
  const dayLabel = formatLessonDayLabel(lesson.date)
  const duration = lesson.duration ?? 50

  return (
    <div className="relative mb-3 overflow-hidden rounded-card bg-navy p-5 shadow-lesson sm:p-[26px] sm:px-7">
      <div className="pointer-events-none absolute -right-12 -top-12 h-[200px] w-[200px] rounded-full bg-[radial-gradient(circle,rgba(184,151,58,0.12),transparent_68%)]" />
      <div className="relative">
        <div className="mb-[18px] text-[10px] font-medium uppercase tracking-[0.14em] text-gold-light">
          下一堂課
        </div>

        <div className="mb-5 flex flex-col items-start justify-between gap-4 sm:flex-row sm:gap-5">
          <div>
            <div className="mb-1.5 font-serif text-[40px] font-normal leading-none text-ivory sm:text-[48px]">
              {timeLabel}
            </div>
            <div className="mb-2.5 text-[12px] text-ivory/50">
              {dayLabel} · {duration} 分鐘
            </div>
            <div className="flex items-center gap-[7px]">
              <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
              <span className="text-[13px] text-ivory/[0.82]">
                {teacherName} 老師
              </span>
            </div>
          </div>

          <div className="w-full sm:w-auto sm:self-center">
            <EnterClassroomButton date={lesson.date} time={lesson.time} />
          </div>
        </div>

        <div className="mb-3.5 flex items-center gap-2.5 rounded-field border border-white/[0.07] bg-white/5 px-3.5 py-3">
          <LockIcon />
          <span className="text-[12px] leading-snug text-ivory/[0.45]">
            <strong className="font-medium text-ivory/[0.65]">
              {teacherName} 老師
            </strong>
            為你準備了
            <strong className="font-medium text-ivory/[0.65]">本週主題</strong>
            ，上課前 10 分鐘解鎖
          </span>
        </div>

        <div className="text-[11px] text-ivory/[0.28]">
          教室將於上課前 10 分鐘開放
        </div>
      </div>
    </div>
  )
}
