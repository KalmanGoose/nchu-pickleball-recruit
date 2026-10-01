/**
 * 🏓 115-1 中興大學匹克球學生學習社群｜Google Sheets 後端 API (Apps Script)
 * 
 * 功能：
 * 1. 接收招募落地頁 (index.html) 的成員報名表單，自動寫入「報名名冊」工作表。
 * 2. 接收聚會簽到打卡，自動寫入「出席簽到」工作表。
 * 3. 支援跨網域 (CORS) 請求，安全且無需使用者登入 Google 帳號。
 */

// ── 全域設定：工作表名稱 ──
var SHEET_RECRUIT = "報名名冊";
var SHEET_ATTENDANCE = "出席簽到";

/**
 * 處理 POST 請求 (表單提交)
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  // 最多等待 10 秒鎖定，避免多人同時送出資料衝突
  try {
    lock.waitLock(10000);
  } catch (err) {
    return createJsonResponse({ success: false, message: "伺服器忙碌中，請稍後再試！" });
  }

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var data = {};
    
    // 解析傳入資料 (支援 JSON 或 Form Post)
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }

    var action = data.action || "register";
    var timestamp = new Date();
    var formattedDate = Utilities.formatDate(timestamp, "Asia/Taipei", "yyyy/MM/dd HH:mm:ss");

    if (action === "register") {
      // ── 處理線上報名 ──
      var sheet = getOrCreateSheet(ss, SHEET_RECRUIT, [
        "登記時間", "姓名", "系所年級", "學號", "LINE ID", "聯絡 Email", "感興趣角色", "備註 / 自我介紹"
      ]);

      var name = data.name || "";
      var department = data.department || "";
      var studentId = data.studentId || "";
      var lineId = data.lineId || "";
      var email = data.email || "";
      var roles = Array.isArray(data.roles) ? data.roles.join(", ") : (data.roles || "尚未選擇");
      var note = data.note || "";

      // 寫入新資料行
      sheet.appendRow([
        formattedDate,
        name,
        department,
        studentId,
        lineId,
        email,
        roles,
        note
      ]);

      return createJsonResponse({
        success: true,
        message: "報名資料已成功寫入 Google 試算表！歡迎加入匹克球社群！"
      });

    } else if (action === "checkin") {
      // ── 處理活動簽到 ──
      var sheet = getOrCreateSheet(ss, SHEET_ATTENDANCE, [
        "簽到時間", "學號", "姓名", "聚會次數", "備註"
      ]);

      var studentId = data.studentId || "";
      var name = data.name || "";
      var session = data.session || "第 1 次聚會";
      var note = data.note || "";

      sheet.appendRow([
        formattedDate,
        studentId,
        name,
        session,
        note
      ]);

      return createJsonResponse({
        success: true,
        message: "簽到成功！時間：" + formattedDate
      });

    } else {
      return createJsonResponse({
        success: false,
        message: "未知的操作指令 (action)"
      });
    }

  } catch (error) {
    return createJsonResponse({
      success: false,
      message: "發生錯誤: " + error.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * 處理 GET 請求 (測試連線或取得簡易統計)
 */
function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_RECRUIT);
    var count = 0;
    if (sheet) {
      count = Math.max(0, sheet.getLastRow() - 1);
    }
    return createJsonResponse({
      status: "online",
      message: "匹克球學習社群後端 API 正常運行中！",
      totalRegistered: count,
      spreadsheetName: ss.getName()
    });
  } catch (err) {
    return createJsonResponse({
      status: "error",
      message: err.toString()
    });
  }
}

/**
 * 取得或自動建立工作表與標題行 (防呆機制)
 */
function getOrCreateSheet(ss, sheetName, headers) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    // 自動建立第一行標題列
    sheet.appendRow(headers);
    // 標題列美化 (深藍背景 + 白字 + 粗體)
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#004B97");
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * 封裝 JSON 回應與 CORS Header
 */
function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
