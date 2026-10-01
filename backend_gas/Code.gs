/**
 * 🏓 115-1 中興大學匹克球學生學習社群｜Google Sheets 後端 API (Apps Script)
 * 
 * 支援功能：
 * 1. 線上報名 (action: 'register')：寫入「報名名冊」
 * 2. 現場簽到 (action: 'checkin')：寫入「出席簽到」
 * 3. 幹部工作台資料同步 (doGet)：自動抓取完整名冊、簽到紀錄與統計數據
 * 4. 自癒容錯：自動建立並格式化工作表，支援獨立或綁定試算表
 */

var SPECIFIC_SPREADSHEET_ID = ""; 

var SHEET_RECRUIT = "報名名冊";
var SHEET_ATTENDANCE = "出席簽到";

/**
 * 取得或自動建立目標 Google 試算表
 */
function getTargetSpreadsheet(optSheetId) {
  var targetId = optSheetId || SPECIFIC_SPREADSHEET_ID;
  if (targetId) {
    try {
      return SpreadsheetApp.openById(targetId);
    } catch (e) {}
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss) return ss;

  var props = PropertiesService.getScriptProperties();
  var savedId = props.getProperty("AUTO_CREATED_SHEET_ID");
  if (savedId) {
    try {
      return SpreadsheetApp.openById(savedId);
    } catch (e) {}
  }

  var newSs = SpreadsheetApp.create("115-1 匹克球學生學習社群 (報名與簽到資料庫)");
  props.setProperty("AUTO_CREATED_SHEET_ID", newSs.getId());
  return newSs;
}

/**
 * 處理 POST 請求 (表單提交 & 現場簽到)
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
        message: "簽到成功！已記錄「" + name + "」於 " + session,
        time: formattedDate
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
 * 處理 GET 請求 (幹部工作台每次打開獲取完整資料)
 */
function doGet(e) {
  try {
    var sheetId = (e && e.parameter) ? e.parameter.sheetId : null;
    var ss = getTargetSpreadsheet(sheetId);
    
    // 1. 抓取「報名名冊」
    var recruitSheet = getOrCreateSheet(ss, SHEET_RECRUIT, [
      "登記時間", "姓名", "系所年級", "學號", "LINE ID", "聯絡 Email", "感興趣角色", "備註 / 自我介紹"
    ]);
    var recruitRows = [];
    if (recruitSheet.getLastRow() > 1) {
      var rData = recruitSheet.getRange(2, 1, recruitSheet.getLastRow() - 1, 8).getValues();
      for (var i = 0; i < rData.length; i++) {
        var row = rData[i];
        if (row[1] || row[3]) { // 有姓名或學號
          recruitRows.push({
            id: i + 1,
            time: row[0] ? (row[0] instanceof Date ? Utilities.formatDate(row[0], "Asia/Taipei", "yyyy/MM/dd HH:mm") : String(row[0])) : "",
            name: String(row[1] || ""),
            department: String(row[2] || ""),
            studentId: String(row[3] || ""),
            lineId: String(row[4] || ""),
            email: String(row[5] || ""),
            roles: String(row[6] || ""),
            note: String(row[7] || "")
          });
        }
      }
    }

    // 2. 抓取「出席簽到」
    var attendSheet = getOrCreateSheet(ss, SHEET_ATTENDANCE, [
      "簽到時間", "學號", "姓名", "聚會次數", "備註"
    ]);
    var attendRows = [];
    if (attendSheet.getLastRow() > 1) {
      var aData = attendSheet.getRange(2, 1, attendSheet.getLastRow() - 1, 5).getValues();
      for (var j = 0; j < aData.length; j++) {
        var aRow = aData[j];
        if (aRow[1] || aRow[2]) {
          attendRows.push({
            id: j + 1,
            time: aRow[0] ? (aRow[0] instanceof Date ? Utilities.formatDate(aRow[0], "Asia/Taipei", "yyyy/MM/dd HH:mm") : String(aRow[0])) : "",
            studentId: String(aRow[1] || ""),
            name: String(aRow[2] || ""),
            session: String(aRow[3] || "第 1 次聚會"),
            note: String(aRow[4] || "")
          });
        }
      }
    }

    // 3. 統計系所分佈
    var deptStats = {};
    for (var k = 0; k < recruitRows.length; k++) {
      var d = recruitRows[k].department || "未填寫";
      deptStats[d] = (deptStats[d] || 0) + 1;
    }

    return createJsonResponse({
      status: "online",
      message: "🟢 試算表資料同步成功！",
      spreadsheetName: ss.getName(),
      spreadsheetUrl: ss.getUrl(),
      totalRegistered: recruitRows.length,
      totalAttendance: attendRows.length,
      deptStats: deptStats,
      registrations: recruitRows,
      attendance: attendRows
    });

  } catch (err) {
    return createJsonResponse({
      status: "error",
      message: "讀取試算表失敗: " + err.toString()
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
 * 封裝 JSON 回應與 CORS
 */
function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
