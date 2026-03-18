## Tech Stack

- React, Vite, Typescript, Tailwind, TanStack Query

## 이슈 사항

- API 에서 각 객관식, 주관식의 문항 수가 없어, /api/exams - responseData.data.totalQuestions 를 객관식 문항 수 (25) 로 맞췄습니다.
- 주관식 문항 수는 피그마 기준으로 맞춰놨습니다.
- /api/exams/submit - request.answers[].answer 은 서버에서 number 로만 받고 있는 걸 확인했습니다. 복수정답은 어떻게 할지 몰라, 가장 첫번째 입력값을 넣었습니다. 또한 프론트엔드에 기능 구현만 해놓았습니다.
