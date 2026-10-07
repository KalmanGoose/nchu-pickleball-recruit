/**
 * 115-1 中興大學教發中心學生學習社群申請系統 (sGroup_application_create1.php)
 * 專用輔助填表工具 (支援 CKEditor 富文本編輯器與傳統輸入框)
 * 
 * 核心安全防護：
 * 1. 預設不自動執行寫入，必須經使用者於預覽視窗明確點擊確認。
 * 2. 嚴格對齊 8,000 元合規退件修復主稿（6 位成員、7 週 7 次聚會、無雲端算力、無教練、許銘華老師為學習諮詢）。
 * 3. 僅填入欄位值，嚴禁自動送出表單，由召集人與成員人工逐項核對後手動送件。
 */
(function() {
  const proposalData = {
    title: "匹克球新手規則體感互動教學社群",
    category: "自訂學習主題：運動教學 × 人體姿態辨識 × 網頁互動",
    convener: "龔依吟",
    members: "陳皇秀、林冠丞、王雨欣、許沐鈞、吳佳叡、龔依吟",
    advisor: "許銘華（學習諮詢，非成員或指導顧問；學生自主共學）",
    advisorDept: "體育室",
    advisorTitle: "助理教授",
    budgetTotal: "8000",
    motivation: `一、問題背景與本期範圍
114-2 學期的活動紀錄顯示，新手尚未建立球感時，一次接收過多規則、直接上場，容易因反覆撿球而挫折。團隊因此討論先建立基礎擊球信心，再逐步加入規則的教學順序。6 月 1 日向許銘華老師諮詢時，亦獲得「釐清核心問題、收斂題目」的建議。

本期聚焦於一個問題：如何把新手容易混淆的規則改寫成可操作、有解說的情境教材，並運用既有姿態辨識工具增加互動？

本期主要交付成果為一套「匹克球新手規則體感互動教學網頁」：
1. 教學內容：發球、兩跳原則及非截擊區三個主題，各設計兩題，共六題情境練習；每題具答案、規則依據與易錯觀念解說。
2. 操作方式：基本操作使用按鈕；搭配一種受控制的揮拍輸入示範，例如揮動指定手臂觸發「開始／下一題」。鏡頭模組辨識動作事件，規則正誤由題目與答案邏輯處理。
3. 交付界線：完成上述六題及一種輸入示範，不新增多人對戰、排行榜、校園裝置展區或自訂模型訓練。姿態追蹤受限時可立即切換按鈕，仍能完成教材。

此網頁用於新手入門學習，不作為比賽裁判。它不直接辨識球、球拍、球網或場地線，不宣稱判定真實比賽中的發球合法性、球的落點或非截擊區違例。動作特徵工作服務於示範、觀察與輸入提示的教學設計。`,
    outcomes: `【質化成效】
1. 教材完整性：發球、兩跳原則、非截擊區三大主題共六題情境練習均可作答並顯示詳解，按鈕模式可完成全部教材。
2. 動作特徵與技術驗證：在限定情境下，以指定揮動召回率至少 80%、非目標動作誤觸發比例不高於 20% 為改善目標；建立動作特徵與參數對照表。
3. 跨裝置與失敗降級：支援筆電與手機瀏覽器，鏡頭未授權或遮擋時可一鍵切換按鈕模式繼續完成教材。
4. 學習諮詢與共學歷程：落實「問題記錄 → 去識別化 AI 輔助 → 同儕測試 → 學習諮詢」四層機制，累積真實跨域共學成果。

【量化成效】
1. 完成 7 次正式共學聚會與簽到紀錄（法定至少 6 次，本期規劃 7 次）。
2. 累計達成 30 人次校內新手實測體驗（至少 20 位不同新手），產出有效前後測配對數據與分析圖表。
3. 完成標準十題 SUS (System Usability Scale) 使用性問卷調查與改進分析。
4. 產出一套「匹克球新手規則體感互動教學網頁」原型與開源版本紀錄。
5. 製作一部 3 至 10 分鐘 1080P 成果分享影片，收錄主題介紹、共學歷程與全體六位成員心得。
6. 全體成員出席教發中心主辦之期末成果發表會。`,
    roles: [
      { no: 1, title: "動作特徵與規則教學", person: "林冠丞", duties: "將揮拍拆解為可觀察、可重複標記之特徵；與王雨欣交叉標記、討論分歧，向程式組說明特徵教學意義與誤用風險；複核六題教材規則。" },
      { no: 2, title: "動作特徵與學習觀察", person: "王雨欣", duties: "以固定鏡頭位置和標記表蒐集動作資料；與林冠丞交叉標記，並把新手操作回饋轉成題目或提示修訂；管理器材。" },
      { no: 3, title: "需求整合與驗證", person: "陳皇秀", duties: "將教學目標轉為網頁需求、前後測與可檢查回饋；與許沐鈞理解預訓練姿態模型；落實鏡頭同意、匿名化與資料最小化；統整影像素材。" },
      { no: 4, title: "程式與機器學習共學", person: "許沐鈞", duties: "深化對 MediaPipe 姿態節點、特徵工程與分類評估之理解；完成現成模型網頁串接與門檻基準，比較人工標記與系統輸出；維護網頁版本。" },
      { no: 5, title: "財務與經費管理", person: "吳佳叡", duties: "在既有預算範圍內進行成本估算、預算與實支差異對照、每人次體驗成本分析；檢查七次聚會支出需求，向全員說明預算使用原則。" },
      { no: 6, title: "召集人與場域規劃", person: "龔依吟", duties: "擔任對外窗口與進度總控；規劃鏡頭距離、拍攝角度、站位及動線，記錄光線條件、遮擋與辨識失敗對照；統整每週進度、學習諮詢與送件資料。" }
    ],
    schedules: [
      { week: 1, date: "10/12–10/18", topic: "聚會 1：需求與現況盤點 (2小時)", detail: "確認名冊與行政分工；盤點場地；實測 V4/V5，確立可沿用功能、六題主題及鏡頭輸入範圍。", output: "已有與待做功能清單、六題規格、簽到紀錄" },
      { week: 2, date: "10/19–10/25", topic: "聚會 2：動作觀察與規則轉譯 (2小時)", detail: "林冠丞、王雨欣示範標記動作特徵；許沐鈞、陳皇秀討論計算邏輯；準備第一輪學習諮詢資料。", output: "動作特徵表、題目初稿、第一輪諮詢提綱、簽到紀錄" },
      { week: 3, date: "10/26–11/01", topic: "聚會 3：六題教材及技術共學 (2小時)", detail: "結對完成按鈕式教材；許沐鈞示範姿態節點與 MediaPipe 流程；吳佳叡核對預算與採購項目。", output: "六題可操作初版、共學筆記、採購核對表、簽到紀錄" },
      { week: 4, date: "11/02–11/08", topic: "聚會 4：鏡頭輸入與內部驗證 (2小時)", detail: "整合節點、時間窗與事件；跨裝置測試並核對答案；龔依吟檢查站位距離光線；凍結主要功能。", output: "固定參數版、事件統計、裝置及失敗清單、簽到紀錄" },
      { week: 5, date: "11/09–11/15", topic: "聚會 5：體驗演練與流程整備 (2小時)", detail: "全員試跑前後測與招募表單；內部體驗分站演練；吳佳叡檢查支出憑據流程；整理第二輪學習諮詢問題。", output: "招募與前後測表、場地動線配置、經費核對、第二輪諮詢提綱、簽到紀錄" },
      { week: 6, date: "11/16–11/22", topic: "聚會 6：第一場新手體驗與檢討 (3小時)", detail: "三小時活動進行約 15 人次測試、前後測與回饋；體驗結束後立即進行一小時操作與教學檢討。", output: "第一場前後測及回饋資料、即時檢討筆記、聚會紀錄" },
      { week: 7, date: "11/23–11/29", topic: "聚會 7：第二場新手體驗與成效總結 (3小時)", detail: "三小時活動再測約 15 人次；體驗結束後進行一小時檢討，核對資料缺漏與規則理解問題，凍結成果版本。", output: "累計 30 人次目標、匿名資料表、問題修正紀錄、聚會紀錄" }
    ],
    budget: [
      { cat: "材料費", name: "戶外匹克球 (暫以四顆裝/桶估算)", price: 500, qty: 6, total: 3000, desc: "約 24 顆，用於七次聚會動作示範、實體規則說明及 30 人體驗用球。" },
      { cat: "材料費", name: "替換握把耗材", price: 80, qty: 10, total: 800, desc: "既有約八支球拍握把更換與防滑衛生耗材。" },
      { cat: "材料費", name: "可移除定位膠帶", price: 200, qty: 4, total: 800, desc: "固定示範站位、鏡頭距離、Non-Volley Zone 禁區落點動線標線。" },
      { cat: "材料費", name: "情境教材與測試表單印製", price: 5, qty: 200, total: 1000, desc: "30 人次前後測題本、SUS 問卷紙本備援、特徵記錄表及簽到單。" },
      { cat: "誤餐費", name: "正式聚會誤餐費 (便當)", price: 100, qty: 24, total: 2400, desc: "正式聚會遇用餐時段之便當（至多 24 人次，編滿基本補助 8,000 元之 30% 上限；新增一次聚會不增加總預算或餐費上限）。" }
    ]
  };

  function executeAutoFill() {
    let filledCount = 0;

    // 1. 處理 CKEditor 實例（教發系統富文本編輯器）
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
      // 召集人
      else if (combined.includes('召集人') || el.name === 'leader_name') {
        fillInput(el, proposalData.convener);
      }
      // 指導顧問 / 諮詢 (學生學習社群多為自主無指導老師，若系統強制填寫則填入諮詢資訊)
      else if (combined.includes('顧問') || combined.includes('指導老師') || el.name === 'teacher_name') {
        if (combined.includes('系') || combined.includes('單位')) fillInput(el, proposalData.advisorDept);
        else if (combined.includes('職稱')) fillInput(el, proposalData.advisorTitle);
        else fillInput(el, "許銘華（學習諮詢）");
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
    width: 380px; max-height: 88vh; background: #ffffff;
    box-shadow: 0 12px 36px rgba(0,0,0,0.3); border-radius: 14px;
    font-family: -apple-system, BlinkMacSystemFont, "Microsoft JhengHei", sans-serif;
    display: flex; flex-direction: column; overflow: hidden; border: 2.5px solid #004B97;
  `;

  panel.innerHTML = `
    <div style="background: linear-gradient(135deg, #004B97, #1d4ed8); color: #fff; padding: 14px 18px; font-weight: 700; font-size: 14px; display: flex; justify-content: space-between; align-items: center;">
      <span>🏓 匹克球社群輔助填表工具 (8,000元合規版)</span>
      <button id="pk-close" style="background:transparent; border:none; color:#fff; font-size:20px; cursor:pointer; line-height:1;">×</button>
    </div>
    <div style="padding: 16px; overflow-y: auto; flex: 1; font-size: 13px;">
      <div style="background: #fffbeb; border: 1px solid #fef3c7; color: #92400e; padding: 10px; border-radius: 8px; font-size: 11.5px; line-height: 1.5; margin-bottom: 12px;">
        🛡️ <b>防呆安全提示</b>：本工具已對齊退件修復主稿（6 位成員、7 週 7 次聚會、經費 8,000 元）。點擊下方按鈕將於確認後寫入表單，<b>絕不會自動送出</b>，請於填入後逐欄人工複核。
      </div>

      <button id="pk-btn-autofill" style="width: 100%; background: #059669; color: #fff; border: none; padding: 12px; border-radius: 8px; font-weight: 700; cursor: pointer; margin-bottom: 12px; font-size: 14px; box-shadow: 0 4px 12px rgba(5,150,105,0.25);">
        ⚡ 預覽並填入相容欄位
      </button>
      <div id="pk-toast" style="color: #059669; font-weight: 700; text-align: center; font-size: 12px; min-height: 20px; margin-bottom: 8px;"></div>
      
      <div style="font-size: 11.5px; color: #64748b; margin-bottom: 10px; line-height: 1.5; border-top: 1px dashed #cbd5e1; padding-top: 10px;">
        📋 <b>單項快速複製專區</b>（若表單欄位不支援自動抓取，可點擊複製後手動貼上）：
      </div>
      
      <div style="display: flex; flex-direction: column; gap: 7px;">
        <button class="pk-copy-btn" data-key="title" style="background:#f8fafc; border:1px solid #cbd5e1; padding:8px 10px; border-radius:6px; text-align:left; cursor:pointer; font-weight:600; color:#0f2745;">📋 複製：社群名稱</button>
        <button class="pk-copy-btn" data-key="members" style="background:#f8fafc; border:1px solid #cbd5e1; padding:8px 10px; border-radius:6px; text-align:left; cursor:pointer; font-weight:600; color:#0f2745;">📋 複製：成員名冊 (6人)</button>
        <button class="pk-copy-btn" data-key="advisor" style="background:#f8fafc; border:1px solid #cbd5e1; padding:8px 10px; border-radius:6px; text-align:left; cursor:pointer; font-weight:600; color:#0f2745;">📋 複製：學習諮詢 (許銘華/體育室)</button>
        <button class="pk-copy-btn" data-key="motivation" style="background:#f8fafc; border:1px solid #cbd5e1; padding:8px 10px; border-radius:6px; text-align:left; cursor:pointer; font-weight:600; color:#0f2745;">📋 複製：動機與背景 (全文)</button>
        <button class="pk-copy-btn" data-key="outcomes" style="background:#f8fafc; border:1px solid #cbd5e1; padding:8px 10px; border-radius:6px; text-align:left; cursor:pointer; font-weight:600; color:#0f2745;">📋 複製：預期成效 (質化與量化)</button>
        <button class="pk-copy-btn" data-key="roles" style="background:#f8fafc; border:1px solid #cbd5e1; padding:8px 10px; border-radius:6px; text-align:left; cursor:pointer; font-weight:600; color:#0f2745;">📋 複製：6位成員分工與產出</button>
        <button class="pk-copy-btn" data-key="schedules" style="background:#f8fafc; border:1px solid #cbd5e1; padding:8px 10px; border-radius:6px; text-align:left; cursor:pointer; font-weight:600; color:#0f2745;">📋 複製：7次活動排程 (純文字摘要)</button>
        <button class="pk-copy-btn" data-key="tech" style="background:#f8fafc; border:1px solid #cbd5e1; padding:8px 10px; border-radius:6px; text-align:left; cursor:pointer; font-weight:600; color:#0f2745;">📋 複製：技術原理與衡量指標</button>
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
  
  // 點擊填表時執行預覽確認
  document.getElementById('pk-btn-autofill').onclick = () => {
    const confirmMsg = 
      "【防呆確認】即將填入 115-1 匹克球學習社群（8,000元合規版）資料：\n\n" +
      "• 社群名稱：匹克球新手規則體感互動教學社群\n" +
      "• 申請金額：NT$ 8,000 元（材料費 5,600 + 誤餐費 2,400）\n" +
      "• 共學規劃：7 週 7 次聚會（滿足母法最低 6 次要求）\n" +
      "• 成員名單：陳皇秀、林冠丞、王雨欣、許沐鈞、吳佳叡、龔依吟 (共 6 位)\n" +
      "• 諮詢對象：許銘華老師（學習諮詢，非成員）\n\n" +
      "確定要寫入目前頁面的表單欄位嗎？\n（本腳本絕不自動送出表單，填入後請人工逐項檢查）";

    if (window.confirm(confirmMsg)) {
      console.log("[PickleFit AutoFill] 使用者已確認，開始填入資料：", proposalData);
      const count = executeAutoFill();
      showToast(`⚡ 成功填入 ${count} 個欄位！請逐欄人工複核。`);
    } else {
      console.log("[PickleFit AutoFill] 使用者已取消寫入。");
    }
  };

  panel.querySelectorAll('.pk-copy-btn').forEach(btn => {
    btn.onclick = () => {
      const key = btn.getAttribute('data-key');
      if (key === 'title') copyText(proposalData.title, '社群名稱');
      else if (key === 'members') copyText(proposalData.members, '成員名冊');
      else if (key === 'advisor') copyText(`${proposalData.advisor} (${proposalData.advisorDept} ${proposalData.advisorTitle})`, '學習諮詢');
      else if (key === 'motivation') copyText(proposalData.motivation, '動機與背景');
      else if (key === 'outcomes') copyText(proposalData.outcomes, '預期成效');
      else if (key === 'roles') {
        const text = proposalData.roles.map(r => `【${r.person}｜${r.title}】\n職責：${r.duties}`).join('\n\n');
        copyText(text, '6位成員分工與產出');
      } else if (key === 'tech') {
        const text = "【技術原理與實作】\n網頁使用 HTML/CSS/JavaScript 製作，人體姿態以 Google MediaPipe Pose Landmarker 的現成模型在使用者瀏覽器本地端推論，零雲端算力成本。\n\n【四項具體衡量指標】\n1. 教材完整性：六題均可作答、顯示解說，按鈕模式可完成全部教材。\n2. 揮動事件驗證：限定情境下，指定揮動召回率至少 80%、非目標動作誤觸發比例不高於 20%。\n3. 裝置表現：筆電與手機實際姿態推論影格率達 15 FPS 以上。\n4. 失敗安全回退：鏡頭未授權或遮擋時，可一鍵切換按鈕模式繼續完成教材。";
        copyText(text, '技術原理與衡量指標');
      } else if (key === 'schedules') {
        const text = proposalData.schedules.map(s => `【第 ${s.week} 週 / ${s.date}】${s.topic}\n工作內容：${s.detail}\n檢查點：${s.output}`).join('\n\n');
        copyText(text, '7次活動排程');
      } else if (key === 'budget') {
        const text = proposalData.budget.map((b, i) => `${i+1}. [${b.cat}] ${b.name} - 單價 ${b.price} 元 × ${b.qty} ＝ ${b.total} 元\n說明：${b.desc}`).join('\n\n') + '\n\n經費合計：8,000 元整（材料費 5,600 元，誤餐費 2,400 元）';
        copyText(text, '經費預算明細');
      }
    };
  });

  // 安全模式：僅載入浮動面板，不主動自動填入，等待使用者確認
  showToast(`💡 輔助面板已就緒，請點擊「預覽並填入」或單項複製。`);
})();
