# Module 4, Meeting 2 - Quick Reference

## 🎯 Meeting Info
- **Module:** Bahasa Indonesia & Literasi (ID: 99)
- **Meeting:** Kata Sederhana dan Gambar
- **Order:** 2
- **Activity Type:** Reading Race

---

## 📺 Videos
1. https://youtu.be/lt-hAsZ4bBE
2. https://youtu.be/ipmcPCLnRTY

---

## 📖 Reading Race Activity

### Sentences (5 Complex Sentences)
1. "Di sebuah sudut kota yang tersembunyi, terdapat sebuah toko buku tua yang konon hanya bisa ditemukan oleh orang-orang yang sedang merasa tersesat."
2. "Proses kimia di dalam baterai litium-ion bekerja dengan memindahkan ion litium dari anoda ke katoda melalui larutan elektrolit."
3. "Kucing oranye itu terlihat sangat percaya diri saat berjalan di atas pagar kayu, seolah-olah ia adalah penguasa tunggal di lingkungan tersebut."
4. "Robot penjelajah di Mars mengirimkan data sensorik tentang komposisi tanah yang mengandung mineral oksida besi yang sangat tinggi."
5. "Aroma kopi hitam yang baru diseduh di pagi hari selalu berhasil membangunkan semangat seseorang untuk menghadapi kemacetan kota."

### Stages
- **Percobaan 1 (Santai):** 120 seconds (2 minutes)
- **Percobaan 2 (Cepat):** 60 seconds (1 minute)

---

## ❓ Quiz (Top-Bottom Layout)

### Q1: Apa yang dipakai Rani saat mandi?
**Context:** "Rani sedang mandi. Rani memakai sabun agar bersih."
- A) Sabun ✅
- B) Sisir
- C) Baju
- D) Topi

### Q2: Di mana Adit bermain bola?
**Context:** "Adit suka bermain bola. Adit bermain di lapangan."
- A) Di rumah
- B) Di lapangan ✅
- C) Di sekolah
- D) Di taman

### Q3: Apa yang digoreng oleh Ibu?
**Context:** "Ibu menggoreng telur. Ibu memasak di dapur."
- A) Ikan
- B) Telur ✅
- C) Ayam
- D) Sayur

### Q4: Apa warna topi Budi?
**Context:** "Budi memakai topi. Topi Budi berwarna biru."
- A) Merah
- B) Kuning
- C) Hijau
- D) Biru ✅

### Q5: Naik apa Iwan pulang sekolah?
**Context:** "Iwan pulang sekolah naik sepeda. Sepeda Iwan ada dua roda."
- A) Mobil
- B) Motor
- C) Sepeda ✅
- D) Bus

---

## 🎨 UI Components

### Reading Race
- **Top:** Timer (02:00 / 01:00)
- **Center:** 5 sentence cards
- **Bottom:** Mulai / Selesai buttons
- **Theme:** Orange/Amber gradient

### Quiz
- **Top Card (35%):** Yellow bg + Context text
- **Bottom Card (65%):** White bg + Question + Options
- **Stacked:** Vertical layout, no scrolling

---

## 🔧 Component Usage

### ReadingRaceActivity
```tsx
<ReadingRaceActivity
  sentences={[...]}
  stages={[
    { label: "Percobaan 1 (Santai)", duration: 120 },
    { label: "Percobaan 2 (Cepat)", duration: 60 }
  ]}
  onComplete={() => setStep('quiz')}
/>
```

### Hardware Buttons
❌ Disabled during Reading Race activity

---

## ✅ Status
**SEEDED & READY** - Module 4 now has 2 meetings!
