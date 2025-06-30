# 🔒 Brat Generator 安全配置指南

## 📋 安全措施概览

Brat Generator 现在包含了多层安全保护措施，以确保用户数据安全和防止常见的网络攻击。

## 🛡️ 已实施的安全头部

### 1. X-Content-Type-Options
```
X-Content-Type-Options: nosniff
```
防止浏览器进行 MIME 类型嗅探，减少 XSS 攻击风险。

### 2. X-Frame-Options
```
X-Frame-Options: DENY
```
防止网站被嵌入到 iframe 中，避免点击劫持攻击。

### 3. X-XSS-Protection
```
X-XSS-Protection: 1; mode=block
```
启用浏览器的 XSS 过滤器，检测到 XSS 攻击时阻止页面加载。

### 4. Referrer-Policy
```
Referrer-Policy: strict-origin-when-cross-origin
```
控制 Referer 头部信息的发送，保护用户隐私。

### 5. Permissions-Policy
```
Permissions-Policy: geolocation=(), microphone=(), camera=(self)
```
限制浏览器 API 权限，只允许必要的功能。

### 6. Content Security Policy (CSP)
```
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; 
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
  font-src 'self' https://fonts.gstatic.com; 
  img-src 'self' data: https:; 
  connect-src 'self' https://www.google-analytics.com; 
  frame-src https://www.youtube-nocookie.com; 
  object-src 'none'; 
  base-uri 'self';
  form-action 'self'
```

## ⚙️ 服务器配置

### Apache (.htaccess)
项目中已包含 `.htaccess` 文件，包含完整的安全头部配置。

### Nginx
如果使用 Nginx，在服务器配置中添加：

```nginx
# Security Headers
add_header X-Frame-Options "DENY" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=(self)" always;

# Content Security Policy
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com; frame-src https://www.youtube-nocookie.com; object-src 'none'; base-uri 'self'; form-action 'self'" always;

# HSTS (只在 HTTPS 环境下启用)
# add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
```

### Cloudflare
如果使用 Cloudflare，可以在 Dashboard > Security > Headers 中配置安全头部。

## 🔐 HTTPS 配置建议

### 1. 启用 HSTS
当网站部署到 HTTPS 环境后，启用 HSTS：
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### 2. SSL/TLS 最佳实践
- 使用 TLS 1.2 或更高版本
- 禁用弱加密套件
- 启用 OCSP Stapling
- 使用强 DH 参数

## 🛠️ 性能优化配置

### 缓存控制
```apache
# Static assets caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### Gzip 压缩
```apache
# Enable compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>
```

## 🔍 安全监控

### 1. 定期检查
- 使用 [SecurityHeaders.com](https://securityheaders.com) 检测安全头部
- 使用 [SSL Labs](https://www.ssllabs.com/ssltest/) 检测 SSL 配置
- 监控 CSP 违规报告

### 2. 日志监控
监控以下可疑活动：
- 异常的文件访问请求
- 大量的 404 错误
- 可疑的用户代理字符串

## 📝 更新和维护

### 定期任务
1. **每月**: 检查安全头部配置
2. **每季度**: 更新 SSL 证书（如果不是自动续期）
3. **每半年**: 审查和更新 CSP 策略
4. **年度**: 进行全面的安全审计

### 联系方式
如发现安全问题，请联系：hilenhwong70@gmail.com

## 🚨 应急响应

### 发现安全问题时的步骤
1. 立即记录问题详情
2. 评估影响范围
3. 实施临时修复措施
4. 通知相关用户（如必要）
5. 实施永久修复
6. 更新安全文档

---

**最后更新**: 2025-06-30
**版本**: 1.0.0