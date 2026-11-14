# 해음위키 v2.4

해음위키를 GitHub Pages에 배포하기 위한 분리형 파일 패키지입니다.

## 폴더 구조

```text
haeum-wiki/
├─ index.html
├─ assets/
│  ├─ css/
│  │  ├─ site.css
│  │  └─ responsive.css
│  ├─ js/
│  │  └─ app.js
│  └─ images/
│     ├─ haeum-wordmark.webp
│     └─ haeum-profile.jpg
├─ README.md
├─ PATCH_NOTES_v2.3.md
└─ PATCH_NOTES_v2.4.md
```

## GitHub 업로드 방법

1. 저장소 `haeum-wiki` 최상위 경로에 있는 기존 `index.html`을 새 `index.html`로 교체합니다.
2. `assets` 폴더를 최상위 경로에 업로드합니다. 하위 폴더 구조를 그대로 유지해야 합니다.
3. `README.md`와 `PATCH_NOTES_v2.3.md`도 선택적으로 업로드합니다.
4. Commit changes 후 GitHub Pages가 자동 배포될 때까지 기다립니다.

중요: `index.html`과 `assets` 폴더는 반드시 같은 최상위 경로에 있어야 합니다. 파일 이름과 폴더 이름의 대소문자를 변경하지 마세요.

## 로컬 확인

`index.html`을 브라우저에서 열어 확인할 수 있습니다. 외부 파일을 불러오는 구조이므로 전체 폴더를 유지한 상태에서 열어야 합니다.

## 방송 일러스트 원본
`assets/images/`에 원본 이미지 3종이 포함되어 있으며, 사이트의 '방송 일러스트' 문서에서 확인할 수 있습니다.
