/**
 * 115-1 中興大學教發中心學生學習社群申請系統 (sGroup_application_create1.php)
 * 專用一鍵自動填表腳本 (支援 CKEditor 富文本編輯器與傳統輸入框)
 */
(function() {
  const proposalData = {
    title: "匹克球體感遊戲化教學與果蠅大腦仿生對戰研習社群",
    category: "自訂學習主題 / 多元探索與跨領域學習",
    advisor: "許銘華",
    advisorDept: "體育室",
    advisorTitle: "助理教授",
    budgetTotal: "8000",
    motivation: `本團隊於 114-2 學期執行《匹克球器材特質與新手運動表現之實證研究》，在校園推廣匹克球的過程中，深刻體會到大專院校體育性學習社群面臨的真實運營瓶頸：

1. 揪打工作人力嚴重不足的窘境：
匹克球規則特殊（雙發球制、發球落地兩跳原則 Two-Bounce Rule、廚房區 Non-Volley Zone 禁截擊），新手入門極度仰賴幹部在場上一對一講解示範。然而幹部平時課業繁重，每次籌辦實體「揪打」都必須面臨搶借場地、扛球袋球拍、現場排班輪替、逐人教學規則等龐大體力與時間成本。每週能開辦的實體場次有限，導致推廣量能嚴重受限於幹部人力上限。

2. 實體活動空檔期的社群黏著度斷層：
過去只要幹部平日沒有開揪打，學員就失去涉入這項運動的觸角，對「匹克球學習社群」這個品牌的互動隨之中斷。新手因為平常沒有練習對象與場地，好不容易燃起的運動熱情往往很快冷卻。

3. 解法：以遊戲化教學為出路，打造平時也能自主涉入的專屬數位服務：
我們認為推廣運動不應再依賴高大上的名詞包裝，而應回歸最樸實的痛點解決：「做一個方便大家快速理解規則，甚至平常社群沒有揪打時，大家也會想要持續涉入匹克球、想隨時打開來玩的專屬服務」。我們初步規劃製作一套全新的《匹克球遊戲化教學系統》，並非單純無趣的手機點擊遊戲，而是深度融合兩大創新系統：
- 一般視訊鏡頭「體感系統」：不需購買昂貴感應穿戴設備，學員只要在宿舍打開電腦或手機鏡頭，就能透過身體肢體揮拍、步伐移動來進行遊戲，在小空間內即時練習站位與發力感，打破球場空間與天候限制。
  【校園場域延伸亮點】：實體匹克球在球場擊球時聲音清脆響亮（具噪音干擾），難以進駐安靜室內空間；然而本系統採用純視訊體感捕捉，具備「無實體球拍、無物理碰撞、零噪音」特性，恰好能翻轉限制！本團隊前期在程式碼審查（Code Review）階段善用興大圖書館提供之 ChatNCHU AI 電腦專區（企業級 API 運算環境）協作完成；因此我們擬以「善用圖書館 AI 資源、回饋校園公共空間」為合作出發點，向圖書館提案於一樓數位展演或體驗專區佈置「無聲虛擬互動球場」，讓讀書備考高壓的師生能在此動態揮拍舒壓（*註：本項為社群主動規劃之校園延伸推動計畫，實際落地形式與期程將充分尊重圖書館館方空間規範與合作意願穩健推進*）。
- 「果蠅大腦仿生對戰系統」：捨棄耗電肥大且昂貴的雲端大型 AI 伺服器，借鑑自然界果蠅大腦的極速光流反應與超輕量神經反射迴路，開發出在前端瀏覽器就能秒級極速回擊的仿生陪打 AI。即便幹部不在身邊、找不到球友，新手也能隨時與仿生 AI 進行具備節奏感的高擬真對抗，在遊戲中迅速搞懂規則、維持手感。
- 雲端模型訓練與參數調優（研發核心）：雖然系統在前端追求免高階顯卡的秒級推論，但在前期的仿生反射模型微調與動態擊球特徵訓練中，仍需透過雲端算力針對球路軌跡與肢體特徵進行模型訓練與參數優化，以確保陪打 AI 的回球反應與真實對抗感。`,
    outcomes: `【質化成效】
1. 規則極速上手：將複雜的匹克球計分、廚房區禁區規則轉化為遊戲關卡，讓新手在 5 分鐘體感互動內自然學會規則，大幅降低幹部現場教學人力負擔。
2. 品牌持續黏著：提供 24 小時不打烊的數位互動入口，讓社員即使在平日非揪打時段，也能透過自主練習與排行榜保持對匹克球社群的熱度。
3. 跨領域技能共創與校園場域反哺：結合運動休閒、遊戲化設計、視訊體感與仿生演算法；同時實踐將圖書館 ChatNCHU AI 資源開發成果反哺校園空間，探索圖書館一樓設置無聲健康解壓互動區之可行性。

【量化成效】
1. 完成 6 次正式社群專題研習與實體練球測試。
2. 完成一套可於一般瀏覽器執行的「體感遊戲化教學系統」原型，包含基礎教學關卡與果蠅仿生對戰模組。
3. 完成果蠅仿生對抗模型與體感參數之微調訓練，前端推論延遲小於 30ms。
4. 累計吸引至少 30 人次校內跨系學生進行實機體感測試與規則闖關體驗。
5. 產出一部 3～10 分鐘 1080P 高畫質成果影片（包含研習歷程、體感遊戲實測、林教練指導與全員心得）。
6. 全員出席教發中心主辦之期末成果發表會。`,
    roles: [
      { no: 1, title: "社群召集人", person: "學生代表", duties: "擔任官方窗口，統籌接洽教發中心與指導顧問；主持6次聚會，掌控計畫總進度；出席期末發表會。" },
      { no: 2, title: "財務", person: "學生幹部", duties: "統籌管理8,000元經費，嚴守100%消耗性耗材與合規誤餐；採購匹克球、模型訓練算力發票與耗材核銷。" },
      { no: 3, title: "教練", person: "林冠辰 教練", duties: "主導實體練球技術指導；審定遊戲化教學規則標準；指導仿生對戰系統擊球參數與回球真實度校準。" },
      { no: 4, title: "資訊組", person: "學生幹部", duties: "開發視訊鏡頭肢體追蹤與揮拍邏輯；運用雲端訓練算力微調果蠅仿生模型；串接排行榜與優化跨平台體驗。" },
      { no: 5, title: "影紀", person: "學生幹部", duties: "負責6次研習簽到表整理與現場照片記錄；收集試玩回饋；期末剪輯3-10分鐘成果影片、海報成果冊。" }
    ],
    schedules: [
      { time: "10月中旬 18:00~20:00", location: "校內球場/討論室", topic: "期初籌備與新手教學痛點覆盤", output: "簽到表、新手常見規則盲點整理表" },
      { time: "10月下旬 18:00~20:00", location: "校內球場", topic: "實體規則解析與揮拍物理數據採集", output: "簽到表、匹克球運動物理參數手冊" },
      { time: "11月上旬 18:00~20:00", location: "電腦教室/研討室", topic: "果蠅大腦仿生對戰模型與規則關卡建置", output: "簽到表、仿生對戰演算法與關卡雛形" },
      { time: "11月中旬 18:00~20:00", location: "研討室/球場", topic: "顧問諮詢與體感交互實測調優", output: "顧問諮詢紀錄表、指導照片、系統調優報告" },
      { time: "11月下旬 18:00~20:00", location: "球場/圖書館或討論室", topic: "遊戲化教學實機公測與圖書館場域合作提案評估", output: "簽到表、學員試玩側拍、問卷滿意度統計、場域合作提案草案" },
      { time: "12月上旬 18:00~20:00", location: "研討室", topic: "成果發表會籌備與影音總結覆盤", output: "完整成果影片剪輯檔、發表海報、期末結案報告" }
    ],
    budget: [
      { cat: "材料費", name: "果蠅仿生對戰模型與體感演算法訓練算力材料費", price: 2400, qty: 1, total: 2400, desc: "用於果蠅大腦仿生對抗神經反射模型微調、體感動態揮拍特徵訓練之雲端模型訓練算力消耗材料（憑國內三聯式統一發票實報實銷）。" },
      { cat: "材料費", name: "40孔標準比賽匹克球消耗材料", price: 500, qty: 4, total: 2000, desc: "供社群研習實體練球、採集真實擊球動態與高頻率人機對抗測試之主要消耗性用球（高強度擊球極易龜裂磨損，屬主要耗材）。" },
      { cat: "材料費", name: "運動視覺標記與廚房區定位標線耗材", price: 600, qty: 1, total: 600, desc: "包含實體球場劃設 Non-Volley Zone 禁區落點標線、鏡頭動態追蹤反差標記貼紙，以及學員實測吸汗防滑握把布，均為消耗性耗材。" },
      { cat: "材料費", name: "高速動態採集與模型測試存儲耗材", price: 600, qty: 1, total: 600, desc: "供高幀率影像動態採集、仿生對抗模型回饋日誌與測試數據高速寫入之消耗性材料（避免掉幀延遲，確保資料完整）。" },
      { cat: "誤餐費", name: "社群討論研習誤餐費", price: 100, qty: 24, total: 2400, desc: "每次研習每人 100 元（6 次研習 × 每次 4 人），編滿基本補助 8,000 元之 30% 上限（2,400 元），非用餐時段不予支領。" }
    ]
  };

  function smartAutoFill() {
    let filledCount = 0;

    // 1. 處理 CKEditor 實例（教發中心常見 rich textarea）
    if (window.CKEDITOR && CKEDITOR.instances) {
      for (let instanceName in CKEDITOR.instances) {
        const editor = CKEDITOR.instances[instanceName];
        const lowerName = instanceName.toLowerCase();
        if (lowerName.includes('motive') || lowerName.includes('reason') || lowerName.includes('動機') || lowerName.includes('背景') || lowerName.includes('content') || lowerName.includes('1')) {
          editor.setData(proposalData.motivation.replace(/\n/g, '<br>'));
          filledCount++;
          console.log(`[CKEditor] 填入動機與背景 -> ${instanceName}`);
        } else if (lowerName.includes('effect') || lowerName.includes('outcome') || lowerName.includes('成效') || lowerName.includes('2')) {
          editor.setData(proposalData.outcomes.replace(/\n/g, '<br>'));
          filledCount++;
          console.log(`[CKEditor] 填入預期成效 -> ${instanceName}`);
        }
      }
    }

    // 2. 處理標準 input, textarea, select
    const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
    function fillInput(el, val) {
      if (!el) return;
      el.value = val;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      filledCount++;
    }

    inputs.forEach(el => {
      const combined = `${el.name || ''} ${el.id || ''} ${el.placeholder || ''} ${el.parentElement ? el.parentElement.innerText : ''}`.toLowerCase();
      
      // 社群名稱
      if (combined.includes('社群名稱') || combined.includes('計畫名稱') || combined.includes('主題名稱') || el.name === 'plan_name' || el.name === 'group_name') {
        fillInput(el, proposalData.title);
      }
      // 申請類別 (select)
      else if (el.tagName === 'SELECT' && (combined.includes('類別') || combined.includes('組別') || combined.includes('主題'))) {
        for (let i = 0; i < el.options.length; i++) {
          if (el.options[i].text.includes('自訂') || el.options[i].text.includes('多元') || el.options[i].text.includes('跨領域')) {
            el.selectedIndex = i;
            el.dispatchEvent(new Event('change', { bubbles: true }));
            filledCount++;
            break;
          }
        }
      }
      // 指導顧問 / 老師
      else if (combined.includes('顧問') || combined.includes('指導老師') || el.name === 'teacher_name') {
        if (combined.includes('系') || combined.includes('單位')) fillInput(el, proposalData.advisorDept);
        else if (combined.includes('職稱')) fillInput(el, proposalData.advisorTitle);
        else fillInput(el, proposalData.advisor);
      }
      // 動機背景 (非 CKEditor 時的純 textarea)
      else if (el.tagName === 'TEXTAREA' && (combined.includes('動機') || combined.includes('背景') || el.name === 'plan_motive' || el.name === 'plan_content')) {
        fillInput(el, proposalData.motivation);
      }
      // 預期成效 (非 CKEditor 時的純 textarea)
      else if (el.tagName === 'TEXTAREA' && (combined.includes('成效') || combined.includes('預期成果') || el.name === 'plan_effect')) {
        fillInput(el, proposalData.outcomes);
      }
      // 申請金額
      else if (combined.includes('總金額') || combined.includes('申請金額') || combined.includes('經費總額') || el.name === 'money' || el.name === 'budget') {
        fillInput(el, proposalData.budgetTotal);
      }
    });

    return filledCount;
  }

  // 移除舊面板
  const oldPanel = document.getElementById('picklefit-helper-panel');
  if (oldPanel) oldPanel.remove();

  // 建立右側常駐浮動小面板
  const panel = document.createElement('div');
  panel.id = 'picklefit-helper-panel';
  panel.style.cssText = `
    position: fixed; right: 24px; top: 30px; z-index: 2147483647;
    width: 360px; max-height: 88vh; background: #ffffff;
    box-shadow: 0 12px 36px rgba(0,0,0,0.3); border-radius: 14px;
    font-family: -apple-system, BlinkMacSystemFont, "Microsoft JhengHei", sans-serif;
    display: flex; flex-direction: column; overflow: hidden; border: 2.5px solid #004B97;
  `;

  panel.innerHTML = `
    <div style="background: linear-gradient(135deg, #004B97, #1d4ed8); color: #fff; padding: 14px 18px; font-weight: 700; font-size: 14.5px; display: flex; justify-content: space-between; align-items: center;">
      <span>🏓 匹克球社群自動填表工具</span>
      <button id="pk-close" style="background:transparent; border:none; color:#fff; font-size:20px; cursor:pointer; line-height:1;">×</button>
    </div>
    <div style="padding: 16px; overflow-y: auto; flex: 1; font-size: 13px;">
      <button id="pk-btn-autofill" style="width: 100%; background: #059669; color: #fff; border: none; padding: 12px; border-radius: 8px; font-weight: 700; cursor: pointer; margin-bottom: 12px; font-size: 14.5px; box-shadow: 0 4px 12px rgba(5,150,105,0.3);">
        ⚡ 一鍵自動填入所有欄位
      </button>
      <div id="pk-toast" style="color: #059669; font-weight: 700; text-align: center; font-size: 12.5px; min-height: 20px; margin-bottom: 8px;"></div>
      
      <div style="font-size: 11.5px; color: #64748b; margin-bottom: 10px; line-height: 1.5; border-top: 1px dashed #cbd5e1; padding-top: 10px;">
        💡 <b>手動輔助</b>：若部分欄位為特殊格式，點擊按鈕即可一鍵複製，直接貼上：
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 7px;">
        <button class="pk-copy-btn" data-key="title" style="background:#f8fafc; border:1px solid #cbd5e1; padding:8px 10px; border-radius:6px; text-align:left; cursor:pointer; font-weight:600; color:#0f2745;">📋 複製：社群名稱</button>
        <button class="pk-copy-btn" data-key="advisor" style="background:#f8fafc; border:1px solid #cbd5e1; padding:8px 10px; border-radius:6px; text-align:left; cursor:pointer; font-weight:600; color:#0f2745;">📋 複製：指導顧問 (許銘華/體育室)</button>
        <button class="pk-copy-btn" data-key="motivation" style="background:#f8fafc; border:1px solid #cbd5e1; padding:8px 10px; border-radius:6px; text-align:left; cursor:pointer; font-weight:600; color:#0f2745;">📋 複製：動機與背景 (全文)</button>
        <button class="pk-copy-btn" data-key="outcomes" style="background:#f8fafc; border:1px solid #cbd5e1; padding:8px 10px; border-radius:6px; text-align:left; cursor:pointer; font-weight:600; color:#0f2745;">📋 複製：預期成效 (質化與量化)</button>
        <button class="pk-copy-btn" data-key="schedules" style="background:#f8fafc; border:1px solid #cbd5e1; padding:8px 10px; border-radius:6px; text-align:left; cursor:pointer; font-weight:600; color:#0f2745;">📋 複製：6次活動排程 (文字摘要)</button>
        <button class="pk-copy-btn" data-key="budget" style="background:#f8fafc; border:1px solid #cbd5e1; padding:8px 10px; border-radius:6px; text-align:left; cursor:pointer; font-weight:600; color:#0f2745;">📋 複製：經費預算表 (5項共8,000元)</button>
      </div>
    </div>
  `;

  document.body.appendChild(panel);

  function copyText(str, label) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(str).then(() => showToast(`✅ 已複製「${label}」！`));
    } else {
      const ta = document.createElement('textarea');
      ta.value = str;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      showToast(`✅ 已複製「${label}」！`);
    }
  }

  function showToast(msg) {
    const toast = document.getElementById('pk-toast');
    if (toast) {
      toast.innerText = msg;
      setTimeout(() => { if (toast.innerText === msg) toast.innerText = ''; }, 3000);
    }
  }

  document.getElementById('pk-close').onclick = () => panel.remove();
  document.getElementById('pk-btn-autofill').onclick = () => {
    const count = smartAutoFill();
    showToast(`⚡ 成功填入 ${count} 個欄位！請檢查`);
  };

  panel.querySelectorAll('.pk-copy-btn').forEach(btn => {
    btn.onclick = () => {
      const key = btn.getAttribute('data-key');
      if (key === 'title') copyText(proposalData.title, '社群名稱');
      else if (key === 'advisor') copyText(`${proposalData.advisor} (${proposalData.advisorDept} ${proposalData.advisorTitle})`, '指導顧問');
      else if (key === 'motivation') copyText(proposalData.motivation, '動機與背景');
      else if (key === 'outcomes') copyText(proposalData.outcomes, '預期成效');
      else if (key === 'schedules') {
        const text = proposalData.schedules.map((s, i) => `【第${i+1}次】${s.time} | 地點：${s.location}\n主題：${s.topic}\n預期產出：${s.output}`).join('\n\n');
        copyText(text, '6次活動排程');
      } else if (key === 'budget') {
        const text = proposalData.budget.map((b, i) => `${i+1}. [${b.cat}] ${b.name} - 單價${b.price} x ${b.qty} = ${b.total}元\n說明：${b.desc}`).join('\n\n') + '\n\n合計：8,000 元整';
        copyText(text, '經費預算明細');
      }
    };
  });

  // 初次執行自動匹配
  const initialCount = smartAutoFill();
  showToast(`⚡ 已自動偵測並填入 ${initialCount} 個欄位！`);
})();
