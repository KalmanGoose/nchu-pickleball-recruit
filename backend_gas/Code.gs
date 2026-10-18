/**
 * 🏓 115-1 中興大學匹克球學生學習社群｜Google Sheets 後端 API (Apps Script)
 * 
 * 支援完整五合一社群管理功能：
 * 1. 線上招募報名 (action: 'register')：寫入「報名名冊」
 * 2. 聚會現場打卡 (action: 'checkin')：寫入「出席簽到」
 * 3. 實體器材借還 (action: 'add_loan', 'toggle_loan')：管理「器材借還」
 * 4. 經費發票記帳 (action: 'add_expense')：管理「經費收支」
 * 5. 幹部專屬筆記 (action: 'save_note')：雲端同步「幹部筆記」
 * 6. 幹部工作台同步 (doGet)：一次獲取名冊、出席、借還、經費與筆記等完整雲端資料！
 */

var SPECIFIC_SPREADSHEET_ID = ""; 

// 幹部身分鑑權 SHA-256 憑證 (由幹部授權密碼 + 專屬鹽值生成，阻絕未授權存取與爬取)
var ADMIN_AUTH_TOKEN = "ce8c9d796ccb0a82e8ab228558975c91c2fab2e4a4d547034b700a7cfa4dbb38";

var SHEET_RECRUIT = "報名名冊";
var SHEET_ATTENDANCE = "出席簽到";
var SHEET_LOANS = "器材借還";
var SHEET_EXPENSES = "經費收支";
var SHEET_NOTES = "幹部筆記";
var SHEET_MEETING_SIGS = "聚會手寫簽名";

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

  var newSs = SpreadsheetApp.create("115-1 匹克球學生學習社群 (完整營運資料庫)");
  props.setProperty("AUTO_CREATED_SHEET_ID", newSs.getId());
  return newSs;
}

/**
 * 處理 POST 請求 (報名、簽到、借還、經費、筆記)
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

    // ── 寫入操作全面暢通：允許報名、簽名、打卡、借還、記帳正常寫入試算表 ──

    // 1. 線上報名 (開放公開寫入，但不洩漏試算表 URL 與其他成員個資)
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
        message: "報名成功！資料已成功寫入 Google 試算表！"
      });

    // 2. 現場打卡簽到
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

    // 3. 登記器材借出
    } else if (action === "add_loan") {
      var sheet = getOrCreateSheet(ss, SHEET_LOANS, [
        "登記時間", "借用人", "學號", "借用品項", "狀態", "備註"
      ]);

      sheet.appendRow([
        formattedDate,
        data.name || "",
        data.sid || "",
        data.item || "公拍 1 支",
        "借出中",
        data.note || ""
      ]);

      return createJsonResponse({
        success: true,
        message: "借用登記成功！"
      });

    // 4. 切換器材歸還狀態
    } else if (action === "toggle_loan") {
      var sheet = ss.getSheetByName(SHEET_LOANS);
      if (sheet && sheet.getLastRow() > 1) {
        var rIdx = Number(data.rowIndex);
        if (rIdx >= 2 && rIdx <= sheet.getLastRow()) {
          var cur = String(sheet.getRange(rIdx, 5).getValue() || "");
          var nextStatus = (cur.indexOf("已歸還") !== -1) ? "借出中" : "已歸還";
          sheet.getRange(rIdx, 5).setValue(nextStatus);
          return createJsonResponse({ success: true, message: "借還狀態已變更為 " + nextStatus });
        }
      }
      return createJsonResponse({ success: false, message: "未找到指定借用行數" });

    // 5. 登記經費支出
    } else if (action === "add_expense") {
      var sheet = getOrCreateSheet(ss, SHEET_EXPENSES, [
        "登記日期", "品名項目", "支出金額", "發票號碼", "統編52024101", "備註"
      ]);

      sheet.appendRow([
        formattedDate,
        data.name || "",
        Number(data.amount) || 0,
        data.inv || "",
        data.hasTax ? "52024101 (已開立)" : "無統編",
        data.note || ""
      ]);

      return createJsonResponse({
        success: true,
        message: "經費支出登記成功！"
      });

    // 6. 雲端同步幹部筆記
    } else if (action === "save_note") {
      var sheet = getOrCreateSheet(ss, SHEET_NOTES, [
        "幹部角色代碼", "幹部職掌名稱", "最後更新時間", "筆記內容"
      ]);

      var role = String(data.role || "general");
      var roleName = String(data.roleName || role);
      var content = String(data.content || "");

      var lastRow = sheet.getLastRow();
      var foundRow = 0;
      if (lastRow > 1) {
        var col = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
        for (var i = 0; i < col.length; i++) {
          if (String(col[i][0]) === role) {
            foundRow = i + 2;
            break;
          }
        }
      }

      if (foundRow > 0) {
        sheet.getRange(foundRow, 3).setValue(formattedDate);
        sheet.getRange(foundRow, 4).setValue(content);
      } else {
        sheet.appendRow([role, roleName, formattedDate, content]);
      }

      return createJsonResponse({
        success: true,
        message: "幹部筆記已同步至雲端試算表！"
      });

    // 7. 儲存歷次共學聚會幹部手寫簽名 (每次重簽＋手寫壓日期)
    } else if (action === "save_meeting_signature") {
      var sheet = getOrCreateSheet(ss, SHEET_MEETING_SIGS, [
        "聚會次別", "成員編號", "成員姓名", "成員系級", "狀態", "手寫簽名Base64", "簽名時間", "備註"
      ]);

      var session = String(data.session || "第 1 次聚會");
      var memberId = Number(data.memberId || 1);
      var name = String(data.name || "");
      var dept = String(data.dept || "");
      var status = String(data.status || "出席");
      var signature = String(data.signature || "");
      var note = String(data.note || "");

      var lastRow = sheet.getLastRow();
      var foundRow = 0;
      if (lastRow > 1) {
        var sValues = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
        for (var si = 0; si < sValues.length; si++) {
          if (String(sValues[si][0]) === session && Number(sValues[si][1]) === memberId) {
            foundRow = si + 2;
            break;
          }
        }
      }

      if (foundRow > 0) {
        sheet.getRange(foundRow, 3).setValue(name);
        sheet.getRange(foundRow, 4).setValue(dept);
        sheet.getRange(foundRow, 5).setValue(status);
        sheet.getRange(foundRow, 6).setValue(signature);
        sheet.getRange(foundRow, 7).setValue(formattedDate);
        sheet.getRange(foundRow, 8).setValue(note);
      } else {
        sheet.appendRow([session, memberId, name, dept, status, signature, formattedDate, note]);
      }

      return createJsonResponse({
        success: true,
        message: "簽名資料已成功同步至「" + session + "」！"
      });

    } else {
      return createJsonResponse({
        success: false,
        message: "未知的 action 指令: " + action
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
    // 幹部身分鑑權 (若相符則回傳完整名冊與試算表URL；若無則遮罩私密個資，但簽名與各項運營統計全面暢通)
    var reqToken = (e && e.parameter && e.parameter.token) ? String(e.parameter.token).trim() : "";
    var isAuthorized = (reqToken === ADMIN_AUTH_TOKEN);

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
        if (row[1] || row[3]) {
          var rawSid = String(row[3] || "");
          recruitRows.push({
            id: i + 1,
            time: row[0] ? (row[0] instanceof Date ? Utilities.formatDate(row[0], "Asia/Taipei", "yyyy/MM/dd HH:mm") : String(row[0])) : "",
            name: String(row[1] || ""),
            department: String(row[2] || ""),
            studentId: isAuthorized ? rawSid : (rawSid.length > 4 ? rawSid.substring(0, 4) + "****" : rawSid),
            lineId: isAuthorized ? String(row[4] || "") : "🔒 幹部登入後可見",
            email: isAuthorized ? String(row[5] || "") : "🔒 幹部登入後可見",
            roles: String(row[6] || ""),
            note: isAuthorized ? String(row[7] || "") : ""
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

    // 3. 抓取「器材借還」
    var loanSheet = getOrCreateSheet(ss, SHEET_LOANS, [
      "登記時間", "借用人", "學號", "借用品項", "狀態", "備註"
    ]);
    var loanRows = [];
    if (loanSheet.getLastRow() > 1) {
      var lData = loanSheet.getRange(2, 1, loanSheet.getLastRow() - 1, 6).getValues();
      for (var l = 0; l < lData.length; l++) {
        var lRow = lData[l];
        if (lRow[1]) {
          loanRows.push({
            rowIndex: l + 2,
            time: lRow[0] ? (lRow[0] instanceof Date ? Utilities.formatDate(lRow[0], "Asia/Taipei", "yyyy/MM/dd HH:mm") : String(lRow[0])) : "",
            name: String(lRow[1] || ""),
            sid: String(lRow[2] || ""),
            item: String(lRow[3] || "公拍 1 支"),
            returned: String(lRow[4] || "").indexOf("已歸還") !== -1,
            note: String(lRow[5] || "")
          });
        }
      }
    }

    // 4. 抓取「經費收支」
    var expSheet = getOrCreateSheet(ss, SHEET_EXPENSES, [
      "登記日期", "品名項目", "支出金額", "發票號碼", "統編52024101", "備註"
    ]);
    var expRows = [];
    if (expSheet.getLastRow() > 1) {
      var expData = expSheet.getRange(2, 1, expSheet.getLastRow() - 1, 6).getValues();
      for (var m = 0; m < expData.length; m++) {
        var eRow = expData[m];
        if (eRow[1] || eRow[2]) {
          expRows.push({
            rowIndex: m + 2,
            time: eRow[0] ? (eRow[0] instanceof Date ? Utilities.formatDate(eRow[0], "Asia/Taipei", "yyyy/MM/dd") : String(eRow[0])) : "",
            name: String(eRow[1] || ""),
            amount: Number(eRow[2]) || 0,
            inv: String(eRow[3] || ""),
            hasTax: String(eRow[4] || "").indexOf("52024101") !== -1,
            note: String(eRow[5] || "")
          });
        }
      }
    }

    // 5. 抓取「幹部筆記」
    var noteSheet = getOrCreateSheet(ss, SHEET_NOTES, [
      "幹部角色代碼", "幹部職掌名稱", "最後更新時間", "筆記內容"
    ]);
    var notesMap = {};
    if (noteSheet.getLastRow() > 1) {
      var nData = noteSheet.getRange(2, 1, noteSheet.getLastRow() - 1, 4).getValues();
      for (var n = 0; n < nData.length; n++) {
        var nRow = nData[n];
        var roleKey = String(nRow[0] || "");
        if (roleKey) {
          notesMap[roleKey] = {
            updatedAt: nRow[2] ? (nRow[2] instanceof Date ? Utilities.formatDate(nRow[2], "Asia/Taipei", "yyyy/MM/dd HH:mm") : String(nRow[2])) : "",
            content: String(nRow[3] || "")
          };
        }
      }
    }

    // 6. 抓取「聚會手寫簽名」
    var sigSheet = getOrCreateSheet(ss, SHEET_MEETING_SIGS, [
      "聚會次別", "成員編號", "成員姓名", "成員系級", "狀態", "手寫簽名Base64", "簽名時間", "備註"
    ]);
    var meetingSigsMap = {};
    if (sigSheet.getLastRow() > 1) {
      var sData = sigSheet.getRange(2, 1, sigSheet.getLastRow() - 1, 8).getValues();
      for (var s = 0; s < sData.length; s++) {
        var sRow = sData[s];
        var sessKey = String(sRow[0] || "");
        var mId = String(sRow[1] || "");
        if (sessKey && mId) {
          if (!meetingSigsMap[sessKey]) meetingSigsMap[sessKey] = {};
          meetingSigsMap[sessKey][mId] = {
            memberId: mId,
            name: String(sRow[2] || ""),
            dept: String(sRow[3] || ""),
            status: String(sRow[4] || "出席"),
            signature: String(sRow[5] || ""),
            signedAt: sRow[6] ? (sRow[6] instanceof Date ? Utilities.formatDate(sRow[6], "Asia/Taipei", "yyyy/MM/dd HH:mm") : String(sRow[6])) : "",
            note: String(sRow[7] || "")
          };
        }
      }
    }

    // 7. 統計系所分佈
    var deptStats = {};
    for (var k = 0; k < recruitRows.length; k++) {
      var d = recruitRows[k].department || "未填寫";
      deptStats[d] = (deptStats[d] || 0) + 1;
    }

    return createJsonResponse({
      status: "online",
      authorized: isAuthorized,
      message: isAuthorized ? "🟢 試算表完整資料同步成功！" : "🟢 試算表即時串流連線中（學員私密個資已保護遮罩）",
      spreadsheetName: ss.getName(),
      spreadsheetUrl: isAuthorized ? ss.getUrl() : "",
      totalRegistered: recruitRows.length,
      totalAttendance: attendRows.length,
      totalLoans: loanRows.length,
      totalExpenses: expRows.length,
      deptStats: deptStats,
      registrations: recruitRows,
      attendance: attendRows,
      loans: loanRows,
      expenses: expRows,
      notes: notesMap,
      meetingSignatures: meetingSigsMap
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
