# 실행 방법 (중요)

이 Next 앱은 **`web` 폴더가 프로젝트 루트**입니다.

```bash
cd web
npm install
npm run dev
```

- 상위 폴더(`DD`)에서 `npm run dev`를 실행하면 `node_modules`를 찾지 못해  
  `styled-components` 같은 패키지를 **못 찾는다**는 에러가 납니다.
- 반드시 **`web` 폴더로 이동한 뒤** 위 명령을 실행하세요.

## `styled-components`를 못 찾을 때

1. **반드시 `web` 폴더**에서 설치했는지 확인 (`npm ls styled-components` 가 버전을 보여야 함).

2. 이 프로젝트는 개발 서버를 **Webpack**으로 띄웁니다 (`package.json`의 `"dev": "next dev --webpack"`).  
   Next.js 16 기본 **Turbopack**에서만 모듈을 못 찾는 경우가 있어 그렇게 설정했습니다.  
   Turbopack으로 쓰고 싶으면: `npm run dev:turbo`

3. 캐시 꼬임이 의심되면:

```bash
cd web
rm -rf .next
npm install
npm run dev
```

4. 그래도 안 되면:

```bash
cd web
npm install styled-components @types/styled-components
npm run dev
```

## Windows에서 `UNKNOWN: open '.next\...'` / errno -4094

개발 서버가 `.next` 안의 청크 파일을 못 열 때 나는 오류입니다. **캐시가 꼬였거나** 백신/동기화 앱이 파일을 잠근 경우가 많습니다.

1. **개발 서버 중지** (터미널에서 Ctrl+C)
2. `web` 폴더에서 `.next` 폴더 **삭제**
3. 다시 실행:

```bash
cd web
rm -rf .next
npm run dev
```

PowerShell/CMD:

```bat
cd web
rmdir /s /q .next
npm run dev
```

삭제 후에는 **코드 수정이 브라우저에 반드시 반영**됩니다.
