# Netlify 배포 가이드

**Netlify Expert(유료 컨설팅)는 필요 없습니다.**  
GitHub(또는 GitLab/Bitbucket) 저장소만 연결하면 빌드·배포됩니다.

---

## 1. Git에 올리기

- 이 저장소 루트가 `DD`이고 앱이 **`web` 폴더** 안에 있으면, 전체를 Git에 커밋·푸시합니다.

---

## 2. Netlify에서 사이트 만들기

1. [Netlify](https://www.netlify.com/) 로그인 → **Add new site** → **Import an existing project**
2. Git 제공자(GitHub 등) 연결 후 **이 저장소** 선택
3. **저장소 루트(`DD`)에 `netlify.toml`** 이 있으면 `base = "web"` 이 들어 있어, Netlify가 자동으로 `web` 에서 빌드합니다.  
   (예전에 **페이지 낫파운드**가 났다면, 루트에 설정 파일이 없어 `web` 이 무시됐을 가능성이 큽니다.)

4. Netlify UI에서 빌드 설정을 직접 쓰는 경우에만 아래를 맞춥니다.

| 항목 | 값 |
|------|-----|
| **Base directory** | `web` |
| **Build command** | `npm run build` |
| **Publish directory** | `.next` |

> UI의 Base directory 는 비워 두거나 `web` 과 같게 맞추면 됩니다. **루트 `netlify.toml`이 우선**하는 경우가 많습니다.

---

## 3. 환경 변수 (권장)

**Site settings → Environment variables** 에 추가:

| Name | Value (예시) |
|------|----------------|
| `NEXT_PUBLIC_SITE_URL` | 배포 후 나온 사이트 URL, 예: `https://your-site.netlify.app` |

→ Open Graph·`metadataBase` 등에 쓰입니다. 없으면 기본값으로 동작하지만, **실제 도메인**을 넣는 것이 좋습니다.

---

## 4. 배포 후

- **Deploys** 탭에서 로그 확인
- 첫 배포가 끝나면 `https://xxxx.netlify.app` 로 접속해 확인

---

## 5. Git 없이 올리고 싶다면

- **Netlify CLI**로 로컬에서 `npm run build` 후 `netlify deploy` 할 수는 있지만,  
  Next.js는 **소스에서 빌드**하는 Git 연동이 가장 단순합니다.

---

## 참고

- [Next.js on Netlify (공식)](https://docs.netlify.com/frameworks/next-js/overview/)
