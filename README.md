# 7-segment-led-ocr
企业公共token（RSA、OTP）网络共享

# 整体思路
- 小蚁摄像头1080P对着token监控，PC上打开小蚁监控客户端，运行Python脚本，从监控画面截屏出token数字区域
- 经过灰度、二值化、中值滤波，最后交给Tesseract去OCR，然后把结果存文件
- node起个Web服务，用户登录通过后，可以查看实时token值，并提供日志记录以及报错反馈功能
- 报错反馈的数据和图片日志文件可以用来强化训练Tesseract

# python & dep
- python 2.7
- OpenCV@3.2+
- pywin32
- 把lang里的token.traineddata放到tessdata里
- 环境变量 TESSDATA_PREFIX=C:\Program Files (x86)\Tesseract-OCR\
- python main.py
- 代码针对小蚁摄像头1080P，需要先安装PC客户端，然后从监控画面截屏出token数字区域

# WebSite
- 代码实现求快，直接用的es6语法，需要node 8.0+，Chrome 50+
- cd server
- node app.js
- 支持记录日志
- 支持反馈错误，用于后续强化训练
