/**
 * 🏓 115-1 中興大學匹克球學生學習社群｜Google Sheets 後端 API (Apps Script)
 * 
 * 特色：
 * 1. 智慧適配：無論是「綁定試算表」還是「獨立專案 (Standalone)」，皆能自動連線。
 * 2. 自動自我修復：若尚未綁定試算表，會自動在你的 Google Drive 建立新試算表！
 * 3. 支援線上報名 (register) 與 聚會簽到 (checkin)。
 */

// ── 全域設定 ──
// 若已有特定的試算表，可將其網址中的 ID 填於此處 (例如: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms)
// 若留空，系統會自動使用當前試算表，或自動在你的雲端建立一個名為「115-1 匹克球社群資料庫」的試算表！
var SPECIFIC_SPREADSHEET_ID = ""; 

var SHEET_RECRUIT = "報名名冊";
var SHEET_ATTENDANCE = "出席簽到";

/**
 * 取得或自動建立目標 Google 試算表 (超強自我修復容錯)
 */
function getTargetSpreadsheet(optSheetId) {
  // 1. 優先檢查傳入參數或全域指定 ID
  var targetId = optSheetId || SPECIFIC_SPREADSHEET_ID;
  if (targetId) {
    try {
      return SpreadsheetApp.openById(targetId);
    } catch (e) {}
  }

  // 2. 嘗試獲取容器綁定之試算表
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss) return ss;

  // 3. 檢查 ScriptProperties 中是否已有先前自動建立的試算表 ID
  var props = PropertiesService.getScriptProperties();
  var savedId = props.getProperty("AUTO_CREATED_SHEET_ID");
  if (savedId) {
    try {
      return SpreadsheetApp.openById(savedId);
    } catch (e) {}
  }

  // 4. 若皆無，自動在使用者 Google Drive 建立一個全新的試算表
  var newSs = SpreadsheetApp.create("115-1 匹克球學生學習社群 (報名與簽到資料庫)");
  props.setProperty("AUTO_CREATED_SHEET_ID", newSs.getId());
  return newSs;
}

/**
 * 處理 POST 請求 (表單提交)
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return createJsonResponse({ success: false, message: "伺服器忙碌中，請稍候重試！" });
  }

  try {
    var data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        data = e.parameter || {};
      }
    } else {
      data = e.parameter || {};
    }

    var ss = getTargetSpreadsheet(data.sheetId);
    var action = data.action || "register";
    var timestamp = new Date();
    var formattedDate = Utilities.formatDate(timestamp, "Asia/Taipei", "yyyy/MM/dd HH:mm:ss");

    if (action === "register") {
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
        message: "報名成功！資料已成功寫入 Google 試算表！",
        sheetUrl: ss.getUrl()
      });

    } else if (action === "checkin") {
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
        message: "未知的 action 指令"
      });
    }

  } catch (error) {
    return createJsonResponse({
      success: false,
      message: "寫入失敗: " + error.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * 處理 GET 請求 (測試連線)
 */
function doGet(e) {
  try {
    var sheetId = (e && e.parameter) ? e.parameter.sheetId : null;
    var ss = getTargetSpreadsheet(sheetId);
    var sheet = ss.getSheetByName(SHEET_RECRUIT);
    var count = 0;
    if (sheet) {
      count = Math.max(0, sheet.getLastRow() - 1);
    }
    return createJsonResponse({
      status: "online",
      message: "🟢 Google Sheets ＆ Apps Script 後端連線正常！",
      spreadsheetName: ss.getName(),
      spreadsheetUrl: ss.getUrl(),
      totalRegistered: count
    });
  } catch (err) {
    return createJsonResponse({
      status: "error",
      message: "連線異常: " + err.toString()
    });
  }
}

/**
 * 自動建立工作表與標題行 (防呆機制)
 */
function getOrCreateSheet(ss, sheetName, headers) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(headers);
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
 * 封裝 JSON 回應
 */
function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
