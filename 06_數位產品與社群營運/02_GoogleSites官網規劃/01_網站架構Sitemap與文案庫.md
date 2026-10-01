# Google Sites 官方網站｜架構 Sitemap 與內容規劃

> **定位**：社群的「官方數位門面」與「永久知識庫 Wiki」。不必頻繁修改，建立後即可長期作為信任背書與教學沉澱。

---

## 一、 網站階層結構 (Sitemap)

```mermaid
flowchart TD
    Home["🏠 首頁 (Home)<br>• 社群核心願景<br>• 最新公告與輪播圖<br>• 快速行動按鈕 (加入LINE/報名)"]

    Home --> About["📖 關於我們 (About Us)"]
    About --> About_1["社群理念與中興教發中心計畫背景"]
    About --> About_2["團隊幹部與指導老師 (許銘華老師)"]

    Home --> Guide["📚 匹克球新手學院 (Wiki)"]
    Guide --> Guide_1["3分鐘看懂規則與 Non-Volley Zone"]
    Guide --> Guide_2["球拍材質指南 (木拍 vs 玻纖 vs 碳纖打感評測)"]
    Guide --> Guide_3["基本功動態教學 (Dink, Drop, Drive)"]

    Home --> Events["📅 活動與賽事 (Events)"]
    Events --> Events_1["每週練球時間表與報名入口"]
    Events --> Events_2["歷次活動照片回顧與精彩瞬間"]

    Home --> Tech["🎮 數位創發專區 (Innovation)"]
    Tech --> Tech_1["內嵌：互動測驗 / 遊戲網站 (iframe)"]
    Tech --> Tech_2["社群積分打卡與 DUPR 等級介紹"]
```

---

## 二、 首頁 Hero 區塊核心文案

- **主標題**：跨越球場的界線，找到你的揮拍節奏！
- **副標題**：國立中興大學學生學習社群｜結合運動科學、器材實測與友善新手的匹克球推廣平台
- **CTA 按鈕**：
  1. [立即加入 LINE 掌握練球動態]
  2. [探索新手指南]
