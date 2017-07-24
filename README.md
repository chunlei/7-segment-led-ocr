# 7-segment-led-ocr
Home Camera + Python + OpenCV + TESSERACT + WebSite - 企业公共token（RSA、OTP）网络共享

# python 2.7 & dep
- OpenCV@3.2+
- pywin32
- 把lang里的token.traineddata放到tessdata里
- 环境变量 TESSDATA_PREFIX=C:\Program Files (x86)\Tesseract-OCR\
- python main.py
- 代码针对小蚁摄像头1080P，需要先安卓PC客户端，然后截屏出token数字区域

# WebSite
- 代码实现求快，直接用的es6语法，需要node 8.0+，Chrome 50+
- cd server
- node app.js
- 支持记录日志
- 支持反馈错误，用于后续强化训练

## Offline UUAP
- 仅限***REMOVED***内网访问的权限验证，取消注释app.use(***REMOVED***Auth);
- 不需要申请UUAP，配host token.***REMOVED***.***REMOVED*** server-ip，变相实现UUAP线下环境登录
- 通过 http://token.***REMOVED***.***REMOVED***:3000 访问