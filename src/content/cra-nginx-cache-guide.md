# 💡 CRA + NGINX 배포 시 디자인 깨짐 방지 완전 가이드

React로 만든 SPA를 CRA(Create React App)로 빌드하고,  
이를 Nginx로 서빙할 때 **배포 직후 사용자 화면이 깨지거나, 스타일이 적용되지 않는 문제**를 경험한 적 있으신가요?

이 글에서는 **그 원인과 근본적인 해결 방법**, 그리고 **실전 Nginx 설정 예시까지** 총정리합니다.

---

## 😵 문제 현상

- 배포 후 기존 사용자가 새로고침 없이 앱을 계속 사용하는데 **스타일이 깨짐**
- 콘솔에는 `404 for main.[hash].css` 또는 `chunk load failed` 에러가 뜨기도 함
- 새로고침하면 정상 동작

---

## 🧨 원인 분석

CRA 앱은 빌드시 파일명에 해시가 포함된 정적 리소스를 생성합니다:

```html
<!-- index.html -->
<link href="/static/css/main.7a40f1c7.css" />
<script src="/static/js/main.39f28c9d.js"></script>
```

그럼에도 깨지는 이유는 다음과 같습니다:

1. **브라우저는 캐시된 index.html을 계속 사용**
2. 그 index.html이 참조하는 JS/CSS 해시 파일은 **서버에서 삭제되었거나 갱신됨**
3. 브라우저는 캐시된 리소스를 다시 요청하지만:
   - 조건부 요청(`If-None-Match`, `If-Modified-Since`)을 보냄
   - 서버에 해당 파일이 없으면 **404 응답**
4. 👉 스타일/JS 깨짐 발생

---

## ✅ 방지 전략 요약

| 대상 | 조치 | 이유 |
|------|------|------|
| `index.html` | 항상 새로 받도록 | 최신 리소스 해시를 반영해야 함 |
| 정적 리소스(JS/CSS) | 캐시 강하게 유지 | 해시 기반 → 버전 관리됨 |
| 조건부 요청 | 비활성화 | 리소스 삭제 시 404 방지 |
| 정적 리소스 파일 | 일정 기간 보존 | 이전 사용자도 안전하게 사용 가능 |

---

## 🛠 실전 NGINX 설정 예시

```nginx
server {
  listen 3000;
  server_name localhost;

  root /usr/share/nginx/html;
  index index.html;

  server_tokens off;
  etag off;
  if_modified_since off;

  include mime.types;
  default_type application/octet-stream;

  # 보안 헤더 (선택)
  add_header X-Content-Type-Options "nosniff";
  add_header X-Frame-Options "SAMEORIGIN";
  add_header X-XSS-Protection "1; mode=block";

  # HTML: 항상 최신 요청 + 조건부 요청 차단
  location ~* \.html$ {
    add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate";
    add_header Last-Modified "";
    try_files $uri =404;
  }

  # 정적 리소스: 강한 캐시 + 조건부 요청 차단
  location ~* \.(js|css|woff2?|ttf|eot|svg|png|jpe?g|gif|ico)$ {
    add_header Cache-Control "public, max-age=31536000, immutable";
    add_header Last-Modified "";
    try_files $uri =404;
  }

  # SPA 라우팅
  location / {
    try_files $uri $uri/ /index.html;
  }

  # gzip 압축 (선택)
  gzip on;
  gzip_min_length 1024;
  gzip_types text/plain text/css application/javascript application/json application/xml application/font-woff2;
}
```

---

## 🧪 배포 주의사항

1. ✅ **정적 리소스는 절대 삭제하지 마세요**
   - 해시된 파일들은 중복되지 않으므로 **여러 버전을 함께 보관해도 안전합니다**
2. 🔥 `build/` 디렉토리를 통째로 덮어쓰는 경우, **이전 사용자에게 404 발생 가능성 있음**
   - Docker 이미지 내부에서 `COPY build/ ...`만 사용하면 예전 파일은 사라짐
   - → **CI/CD에서 이전 static 리소스를 병합하거나, 볼륨 또는 S3로 분리 권장**
3. ❌ **자동 새로고침(version mismatch → reload)은 신중하게**
   - 사용자가 입력 중일 수 있으므로 자동 강제 새로고침은 UX 리스크 있음

---

## 🔚 마무리

React 앱을 안정적으로 배포하려면 단순히 "캐시 설정"만이 아니라  
**리소스 삭제 시나리오, 브라우저의 조건부 요청, Nginx 동작 원리**까지 함께 이해하는 것이 중요합니다.

이 글의 설정을 반영하면 다음과 같은 이점을 얻을 수 있습니다:

- ✅ 사용자 입장에서 갑작스런 깨짐 없이 자연스러운 화면 유지
- ✅ 서버 입장에서 불필요한 조건부 요청 감소
- ✅ 성능 최적화(gzip)까지 함께 가능

