
# ✅ CRA + NGINX EC2 배포 후 동작 테스트 체크리스트

---

## 1. 💡 기본 동작 확인 (브라우저)

### ✅ 진입점 동작
- `http://[EC2-PUBLIC-IP]:3000` 접속 → 화면이 정상적으로 보이는지

### ✅ SPA 라우팅 테스트
- 버튼 클릭 없이 직접 주소창에 입력
  - 예: `http://[IP]:3000/about`, `/products/123`
- 정상 렌더링되는지, 새로고침에도 작동하는지

### ✅ 개발자 도구 (DevTools)에서 확인
- `Sources` → JS, CSS 파일 잘 로드되는지
- `Network` 탭
  - `index.html`: `200 OK`, `Cache-Control: no-store`
  - JS/CSS: `200 OK`, `max-age=31536000, immutable`

---

## 2. 🔄 캐시 시나리오 테스트

### ✅ 오래된 index.html 테스트
- `index.html`을 옛날 버전으로 강제로 덮어쓰기
- 이후 새 빌드된 JS가 없는 상황에서 새로고침
  → 이 때 흰 화면이 발생하면 index.html 캐시 정책이 잘 작동하는지 점검 필요

### ✅ 캐시된 JS 요청 테스트
- 브라우저 DevTools → Application → Clear Site Data → 강제 새로고침 (Ctrl + Shift + R)
- JS 요청 실패 여부 확인

---

## 3. 🧪 시나리오별 실패 테스트

| 테스트 시나리오 | 목표 |
|----------------|------|
| `/non-existent-page` 접근 | SPA 라우팅 fallback 확인 |
| `/static/js/없는파일.js` 요청 | JS 404 응답 & index.html fallback 차단 확인 |
| `/index.html` 접근 후 새로고침 | 항상 최신 파일 응답 확인 |
| 브라우저 캐시 강하게 남은 상태 | index.html이 잘 갱신되는지 확인 |

---

## 4. 🔧 curl로 직접 서버 응답 확인

```bash
# index.html의 헤더 확인
curl -I http://[IP]:3000/index.html

# JS 파일 캐시 확인
curl -I http://[IP]:3000/static/js/main.[hash].js

# 없는 JS 요청이 index.html로 fallback되는지 테스트
curl -i http://[IP]:3000/static/js/not-found.js
```

> `not-found.js` 요청이 `index.html` 내용으로 응답된다면 설정 문제야.  
> 응답 body의 `<html` 확인으로 index.html 여부 판별 가능

---

## 5. 🧼 S3/CloudFront-style 버전 업 테스트 (선택사항)

1. 새로 빌드된 JS 파일만 SFTP로 덮어쓰기
2. JS 해시 바뀐 것 확인
3. index.html은 캐시되지 않고 새로 반영되었는지 확인

---

## 6. 🛡 모니터링 및 로그 확인

```bash
# NGINX 로그 확인
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

> JS 요청 시 어떤 응답코드가 발생하는지, 404 발생 여부 등 로그를 통해 빠르게 감지 가능

---

## 💡 보너스: JS 로딩 실패 감지 스크립트

index.html에 아래 스크립트를 삽입하면, JS 로딩이 실패했을 때 사용자에게 알림을 띄울 수 있어:

```html
<script>
  window.addEventListener('error', function (e) {
    if (e.target.tagName === 'SCRIPT') {
      document.body.innerHTML = '<h2>앱 로딩에 실패했습니다.<br>새로고침 하거나 캐시를 지워보세요.</h2>';
    }
  }, true);
</script>
```

---

## ✅ 테스트 핵심 요약

> `"404가 index.html로 fallback 되지 않는가"`, `"JS/CSS 파일이 정확히 응답되는가"`, `"캐시가 과도하게 남지 않는가"`를 확인하면 배포 후 문제가 거의 생기지 않아.
