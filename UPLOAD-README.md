# 해음위키 v2.8.0 업로드 파일

이 패키지는 전체 교체용 파일 2개와 index.html에 추가할 한 줄 안내로 구성됩니다.

## 1) 업로드할 파일

- `assets/css/mobile-polish.css` — 새 파일로 추가
- `assets/js/app.js` — 기존 파일을 전체 교체

## 2) index.html에 CSS 연결 한 줄 추가

기존 `index.html`의 `</head>` 바로 위에 다음 한 줄을 추가합니다.
```html
<link rel="stylesheet" href="assets/css/mobile-polish.css">
```
반드시 기존 스타일시트 및 인라인 style 블록 뒤에 배치합니다.

## 3) 메인 배너 로딩 속성

`index.html`의 메인 배너 이미지에서 `loading="lazy"`를 `loading="eager"`로 변경합니다.
`fetchpriority="high"`는 유지합니다.

이 패키지는 GitHub에 자동 커밋하지 않았습니다. 사용자가 직접 업로드할 수 있도록 파일을 준비한 것입니다.
