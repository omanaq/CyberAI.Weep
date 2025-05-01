# CyberAI OS - دليل التثبيت

## بيئة Termux (Debian عبر proot-distro)

1. ثبت `proot-distro`:
```bash
pkg install proot-distro
```

2. ثبت Debian:
```bash
proot-distro install debian
```

3. قم بتسجيل الدخول:
```bash
proot-distro login debian
```

4. شغل السكربت التالي:
```bash
chmod +x setup_full_cyberai.sh
./setup_full_cyberai.sh
```

## المتطلبات
- Android 8+
- RAM: 3GB+
- مساحة فارغة: 4GB
