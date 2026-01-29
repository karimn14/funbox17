# WebSerial Quiz Integration - Quick Reference 🚀

**Feature:** ESP32 Serial Commands on Quiz Completion

---

## 🎯 Quick Overview

- **"FINISH"** → Sent immediately when quiz completes
- **"GOOD"** → Sent after 500ms if score ≥ 70%
- **"RETRY"** → Sent after 500ms if score < 70%

---

## 📍 Connection Button Location

**Position:** Top-right corner of every screen

**States:**
- 🔵 **Blue "Hubungkan USB"** → Not connected (clickable)
- 🟢 **Green "Terhubung"** → Connected (status only)

---

## 🔧 ESP32 Setup

### Serial Configuration
```cpp
void setup() {
  Serial.begin(115200);  // ⚠️ Must match browser (115200)
}
```

### Command Handler
```cpp
void loop() {
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    cmd.trim();
    
    if (cmd == "FINISH") {
      // Quiz done - prepare for result
    } else if (cmd == "GOOD") {
      // GREEN LED + Victory sound
    } else if (cmd == "RETRY") {
      // YELLOW LED + Try again sound
    }
  }
}
```

---

## 🧪 Testing Checklist

### 1. Connection Test
- [ ] Open app in Chrome/Edge
- [ ] Click "Hubungkan USB" (top-right)
- [ ] Select ESP32 from list
- [ ] Verify "Terhubung" appears

### 2. Pass Test (Score ≥ 70%)
- [ ] Complete quiz with 7+ correct answers (out of 10)
- [ ] Check console: `FINISH` → `GOOD`
- [ ] Verify ESP32 shows success feedback

### 3. Fail Test (Score < 70%)
- [ ] Complete quiz with 6 or fewer correct (out of 10)
- [ ] Check console: `FINISH` → `RETRY`
- [ ] Verify ESP32 shows retry feedback

### 4. Disconnected Test
- [ ] Complete quiz WITHOUT connecting device
- [ ] Verify app works normally (no errors)
- [ ] Console shows: `Cannot send command - not connected`

---

## 🔍 Console Commands

### Check Connection Status
```javascript
// In browser console
console.log(isConnected); // true or false
```

### Manual Command Test
```javascript
// Send test command
sendCommand("TEST");
```

---

## 📊 Scoring System

| Score Range | Percentage | Command | Feedback |
|-------------|-----------|---------|----------|
| 10/10 | 100% | `GOOD` | 🟢 Perfect! |
| 9/10 | 90% | `GOOD` | 🟢 Excellent! |
| 8/10 | 80% | `GOOD` | 🟢 Great job! |
| 7/10 | 70% | `GOOD` | 🟢 Good! |
| 6/10 | 60% | `RETRY` | 🟡 Try again |
| 5/10 | 50% | `RETRY` | 🟡 Keep trying |
| ≤4/10 | ≤40% | `RETRY` | 🟡 Study more |

**KKM (Passing Grade):** 70%

---

## 🐛 Common Issues

| Problem | Solution |
|---------|----------|
| No serial port list | Install ESP32 drivers (CP210x) |
| Commands not received | Check baud rate (115200) |
| "Not supported" error | Use Chrome/Edge (not Firefox) |
| Can't connect | Close Arduino IDE/other serial apps |
| Button doesn't appear | Refresh page, check SerialProvider |

---

## 📁 Key Files

```
client/src/
├── hooks/
│   └── use-web-serial.ts          ✅ Already complete
├── context/
│   └── SerialContext.tsx          ✅ Already wired
└── pages/
    └── MeetingDetail.tsx          ✅ Updated with integration
```

---

## 🎮 Hardware Button Mapping

While connected, physical buttons also work:

| Button | Letter | Action |
|--------|--------|--------|
| Red | A | Select option A |
| Blue | B | Select option B |
| Green | C | Select option C |
| Yellow | D | Select option D |
| E | E | Next/Enter |
| F | F | Back |

---

## 🚀 Quick Start

1. **Open app** in Chrome/Edge
2. **Click** "Hubungkan USB" (top-right)
3. **Select** ESP32 device
4. **Complete** a quiz
5. **Watch** commands in console
6. **Verify** ESP32 feedback

---

## 💡 Pro Tips

- **Always connect BEFORE starting quiz** for best experience
- **Check browser console** (F12) to debug commands
- **Use 500ms delay** between commands to avoid overlap
- **Test both pass/fail scenarios** before production
- **Graceful degradation** - app works without device too!

---

## 📞 Need Help?

Check these docs:
- `WEBSERIAL_QUIZ_INTEGRATION_COMPLETE.md` - Full documentation
- `SERIAL_RESULT_COMMAND_COMPLETE.md` - Command specifications
- `GLOBAL_NAVIGATION_COMPLETE.md` - Button details

---

**Last Updated:** January 29, 2026  
**Status:** ✅ Production Ready
