/**
 * CD1 旅程文字：依已完成堂數回傳鼓勵語（照規格文件 getJourneyText）。
 */
export function getJourneyText(completedLessons: number): string {
  if (completedLessons === 0)
    return '你的英文旅程從今天開始。每一堂課，都是一個新的自己。'
  if (completedLessons < 5)
    return `你已經完成了 ${completedLessons} 堂課。繼續說，繼續進步。`
  if (completedLessons < 10)
    return `你已經說了 ${completedLessons} 堂課的英文。你正在建立一個習慣。`
  if (completedLessons < 24)
    return `你已經說了 ${completedLessons} 堂課的英文。每一堂課，你都在成為一個不一樣的自己。`
  return `你已經說了 ${completedLessons} 堂課的英文。這不只是學英文，這是你在改變自己。`
}
