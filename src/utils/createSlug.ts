export const createSlug = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-ㄱ-ㅎㅏ-ㅣ가-힣]/g, '') // 특수문자 제거, 한글은 허용
