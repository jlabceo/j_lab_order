// ═══════════════════════════════════════════════════════════════
// J-Lab 주문 시스템 — Google Apps Script  v2
// ═══════════════════════════════════════════════════════════════
//
// [Script Properties]
//   KAKAO_CLIENT_ID     : 카카오 REST API 키
//   KAKAO_REFRESH_TOKEN : 카카오 리프레시 토큰 (인증 후 자동 저장)
//   SHARED_SHEET_ID     : 공유용 시트 ID (자동 생성)
//   ADMIN_SHEET_ID      : 관리자용 시트 ID (자동 생성)

// ── 이메일 설정 ────────────────────────────────────────────────
const ADMIN_EMAIL  = 'jnii1225@gmail.com';          // 관리자 (페이백 시트 접근)
const STAFF_EMAILS = [                               // 직원 공유 이메일 추가
  'jnii1225@gmail.com',
  // '직원1@gmail.com',
  // '직원2@gmail.com',
];

// ── 매입원가 조회 테이블 (제품 ID → 매입원가) ──────────────────
const COST_PRICES = {
  "P0":53000,
  "P1":56500,
  "P10":27000,
  "P100":8400,
  "P101":3600,
  "P102":1500,
  "P104":1980,
  "P105":1980,
  "P106":5100,
  "P107":1800,
  "P108":15840,
  "P109":900,
  "P11":23100,
  "P110":480,
  "P112":480,
  "P113":19140,
  "P114":8100,
  "P115":8100,
  "P116":1650,
  "P117":8100,
  "P118":660,
  "P122":16840,
  "P123":10890,
  "P126":8100,
  "P128":660,
  "P130":600,
  "P132":1320,
  "P133":8100,
  "P135":8100,
  "P137":8100,
  "P139":19800,
  "P140":40000,
  "P143":40000,
  "P145":0,
  "P146":0,
  "P147":0,
  "P148":0,
  "P149":0,
  "P15":27720,
  "P150":0,
  "P151":0,
  "P152":0,
  "P153":0,
  "P154":0,
  "P155":0,
  "P156":0,
  "P157":0,
  "P158":0,
  "P159":0,
  "P16":1680,
  "P160":0,
  "P161":0,
  "P162":0,
  "P163":0,
  "P164":1200,
  "P165":0,
  "P166":0,
  "P167":0,
  "P168":1500,
  "P169":1500,
  "P17":990,
  "P170":3000,
  "P171":40000,
  "P172":40000,
  "P173":40000,
  "P174":40000,
  "P175":40000,
  "P176":50000,
  "P177":9000,
  "P178":2970,
  "P179":3600,
  "P18":990,
  "P180":21600,
  "P181":660,
  "P182":6540,
  "P183":3630,
  "P184":4380,
  "P185":3600,
  "P186":3600,
  "P187":9900,
  "P188":5100,
  "P189":3600,
  "P19":15600,
  "P190":16500,
  "P191":5100,
  "P192":5100,
  "P193":5820,
  "P194":4380,
  "P195":9900,
  "P196":5100,
  "P197":11880,
  "P198":11880,
  "P199":5100,
  "P2":53000,
  "P20":21000,
  "P200":5082,
  "P201":7920,
  "P202":9900,
  "P203":3600,
  "P204":210,
  "P205":330,
  "P208":330,
  "P209":300,
  "P21":11880,
  "P210":330,
  "P211":240,
  "P212":210,
  "P213":210,
  "P214":330,
  "P215":360,
  "P217":360,
  "P218":780,
  "P219":294,
  "P22":2310,
  "P220":396,
  "P225":420,
  "P226":450,
  "P229":330,
  "P23":27720,
  "P230":960,
  "P233":60,
  "P234":120,
  "P235":8910,
  "P237":990,
  "P239":210,
  "P24":5940,
  "P240":792,
  "P242":78,
  "P244":132,
  "P245":780,
  "P247":90,
  "P248":330,
  "P249":330,
  "P25":31200,
  "P250":540,
  "P251":540,
  "P252":210,
  "P253":990,
  "P254":660,
  "P255":210,
  "P256":600,
  "P257":180,
  "P258":720,
  "P259":1650,
  "P26":9570,
  "P260":2310,
  "P261":2100,
  "P262":1320,
  "P263":3960,
  "P264":13200,
  "P265":13200,
  "P266":13200,
  "P267":2310,
  "P268":13200,
  "P269":13200,
  "P27":1200,
  "P270":3960,
  "P271":13200,
  "P272":44000,
  "P273":88000,
  "P274":27500,
  "P275":50000,
  "P276":38000,
  "P277":56000,
  "P278":5000,
  "P279":150,
  "P28":900,
  "P280":5000,
  "P281":5000,
  "P282":15000,
  "P283":6000,
  "P284":15000,
  "P285":2200,
  "P286":19250,
  "P287":110,
  "P288":110,
  "P289":4000,
  "P29":480,
  "P290":4000,
  "P291":4000,
  "P292":4000,
  "P293":40000,
  "P294":33000,
  "P295":11000,
  "P296":11000,
  "P297":33000,
  "P298":16500,
  "P299":11000,
  "P3":53000,
  "P30":900,
  "P300":5100,
  "P301":5500,
  "P302":1320,
  "P303":2700,
  "P304":30000,
  "P305":35000,
  "P306":660,
  "P307":72,
  "P308":330,
  "P309":330,
  "P31":120,
  "P310":60,
  "P311":60,
  "P312":264,
  "P313":72,
  "P314":396,
  "P315":462,
  "P316":462,
  "P317":60,
  "P318":210,
  "P319":990,
  "P32":390,
  "P320":240,
  "P321":198,
  "P322":8100,
  "P323":8100,
  "P324":3600,
  "P325":3600,
  "P326":3600,
  "P327":3600,
  "P328":3600,
  "P329":3600,
  "P33":180,
  "P330":3600,
  "P331":3600,
  "P332":3600,
  "P333":3600,
  "P334":3600,
  "P335":3600,
  "P336":3600,
  "P337":2970,
  "P338":2940,
  "P339":2940,
  "P34":150,
  "P340":2970,
  "P341":1800,
  "P342":120,
  "P343":1320,
  "P344":3600,
  "P345":2940,
  "P346":2250,
  "P347":1650,
  "P348":2310,
  "P349":1980,
  "P35":600,
  "P350":1650,
  "P352":50000,
  "P353":50000,
  "P354":50000,
  "P355":50000,
  "P356":50000,
  "P357":50000,
  "P36":462,
  "P361":21000,
  "P362":9900,
  "P37":3960,
  "P370":16500,
  "P371":3600,
  "P38":300,
  "P386":14520,
  "P387":5500,
  "P39":210,
  "P391":400,
  "P392":5760,
  "P4":53000,
  "P40":210,
  "P41":180,
  "P419":730,
  "P42":210,
  "P423":1650,
  "P427":528,
  "P428":1320,
  "P43":270,
  "P431":7200,
  "P432":7200,
  "P433":7200,
  "P434":7200,
  "P435":7200,
  "P436":7200,
  "P437":7000,
  "P438":55000,
  "P439":72600,
  "P44":390,
  "P440":59400,
  "P441":26400,
  "P442":29040,
  "P443":79200,
  "P444":69300,
  "P445":49500,
  "P446":99000,
  "P447":99000,
  "P448":52800,
  "P449":29040,
  "P45":240,
  "P450":26400,
  "P451":26400,
  "P452":99000,
  "P453":85800,
  "P454":79200,
  "P455":56100,
  "P456":72600,
  "P457":52800,
  "P458":49500,
  "P459":52800,
  "P46":1320,
  "P460":29040,
  "P461":33000,
  "P462":26400,
  "P463":99000,
  "P464":99000,
  "P465":82500,
  "P466":85800,
  "P467":92400,
  "P468":92400,
  "P469":89100,
  "P47":6600,
  "P470":79200,
  "P471":72600,
  "P472":49500,
  "P473":49500,
  "P474":52800,
  "P475":49500,
  "P476":49500,
  "P477":46200,
  "P478":33000,
  "P479":33000,
  "P48":90,
  "P480":26400,
  "P49":3960,
  "P5":53000,
  "P50":180,
  "P51":660,
  "P52":1560,
  "P53":1560,
  "P54":396,
  "P55":600,
  "P56":150,
  "P57":1320,
  "P58":14,
  "P59":9240,
  "P6":53000,
  "P60":17,
  "P61":198,
  "P62":14520,
  "P63":2700,
  "P64":33,
  "P65":990,
  "P66":5500,
  "P67":240,
  "P68":33,
  "P69":960,
  "P7":63000,
  "P70":1320,
  "P71":990,
  "P72":108,
  "P73":480,
  "P74":19800,
  "P75":720,
  "P76":5808,
  "P77":5760,
  "P78":570,
  "P79":396,
  "P8":102000,
  "P80":108,
  "P81":87,
  "P82":5760,
  "P83":27,
  "P84":330,
  "P85":21,
  "P86":15840,
  "P87":180,
  "P88":600,
  "P89":480,
  "P9":39000,
  "P91":528,
  "P92":990,
  "P93":8880,
  "P94":48,
  "P95":660,
  "P96":960,
  "P97":1914,
  "P98":2100,
  "P99":1980
};

// ═══════════════════════════════════════════════════════════════
// GET : 카카오 인증 + 상태 확인
// ═══════════════════════════════════════════════════════════════
function doGet(e) {
  const props = PropertiesService.getScriptProperties();

  if (e.parameter.code) return handleKakaoCallback(e.parameter.code);

  if (e.parameter.action === 'kakao_auth') {
    const clientId = props.getProperty('KAKAO_CLIENT_ID');
    if (!clientId) return page('❌ 설정 필요', 'Script Properties에 <b>KAKAO_CLIENT_ID</b>를 먼저 입력해주세요.');
    const redirectUri = ScriptApp.getService().getUrl();
    const url = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}` +
                `&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=talk_message`;
    return HtmlService.createHtmlOutput(`<script>location.href='${url}';</script>`);
  }

  const hasToken   = !!props.getProperty('KAKAO_REFRESH_TOKEN');
  const sharedId   = props.getProperty('SHARED_SHEET_ID')  || '(미생성)';
  const adminId    = props.getProperty('ADMIN_SHEET_ID')   || '(미생성)';
  const sharedUrl  = sharedId  !== '(미생성)' ? `https://docs.google.com/spreadsheets/d/${sharedId}`  : '#';
  const adminUrl   = adminId   !== '(미생성)' ? `https://docs.google.com/spreadsheets/d/${adminId}`   : '#';

  if (e.parameter.action === 'verify_pin') return verifyAdminPin(e.parameter.pin||'');
  if (e.parameter.action === 'admin_orders') return getAdminOrders(e.parameter.token||'', e.parameter);
  // 주문 내역 조회 (강사용)
  if (e.parameter.action === 'history') {
    return getInstructorHistory(e.parameter.uid || '');
  }

  // 주문 취소 처리
  if (e.parameter.action === 'cancel') {
    return cancelOrder(e.parameter.uid || '', e.parameter.orderId || '');
  }

  return page('J-Lab 주문 시스템 API', `
    <table>
      <tr><td>카카오 토큰</td><td>${hasToken ? '✅ 설정됨' : '❌ 미설정'}</td></tr>
      <tr><td>공유용 시트</td><td>${sharedId !== '(미생성)' ? `<a href="${sharedUrl}" target="_blank">열기</a>` : '(미생성)'}</td></tr>
      <tr><td>관리자용 시트</td><td>${adminId !== '(미생성)' ? `<a href="${adminUrl}" target="_blank">열기</a>` : '(미생성)'}</td></tr>
    </table><br>
    <a href="?action=kakao_auth" style="padding:10px 20px;background:#FEE500;color:#000;text-decoration:none;border-radius:8px;font-weight:bold;">🟡 카카오 인증 시작하기</a>
  `);
}

function handleKakaoCallback(code) {
  const props      = PropertiesService.getScriptProperties();
  const clientId   = props.getProperty('KAKAO_CLIENT_ID');
  const redirectUri = ScriptApp.getService().getUrl();
  try {
    const res    = UrlFetchApp.fetch('https://kauth.kakao.com/oauth/token', {
      method:'POST',
      payload:{ grant_type:'authorization_code', client_id:clientId, redirect_uri:redirectUri, code:code }
    });
    const tokens = JSON.parse(res.getContentText());
    props.setProperty('KAKAO_ACCESS_TOKEN',  tokens.access_token);
    props.setProperty('KAKAO_REFRESH_TOKEN', tokens.refresh_token);
    return page('✅ 카카오 인증 완료', '주문이 들어오면 카카오톡으로 실시간 알림이 발송됩니다.<br>이 창을 닫아도 됩니다.');
  } catch(err) {
    return page('❌ 인증 실패', err.toString());
  }
}

// ═══════════════════════════════════════════════════════════════
// POST : 주문 수신
// ═══════════════════════════════════════════════════════════════
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if(data.action==='update_order') return updateOrderAdmin(data.token||'',data);
    saveToSharedSheet(data);
    saveToAdminSheet(data);
    sendEmail(data);
    sendKakao(data);
    return json({status:'ok'});
  } catch(err) {
    console.error(err);
    return json({status:'error', message:err.toString()});
  }
}

// ═══════════════════════════════════════════════════════════════
// 공유용 시트 (직원 열람 — 소비자가만)
// ═══════════════════════════════════════════════════════════════
function getSharedSheet() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty('SHARED_SHEET_ID');
  let ss;
  if (id) { try { ss = SpreadsheetApp.openById(id); } catch(_) { ss = null; } }
  if (!ss) {
    ss = SpreadsheetApp.create('📦 J-Lab 주문내역 (공유용)');
    id = ss.getId();
    props.setProperty('SHARED_SHEET_ID', id);
    setupSheet(ss.getSheets()[0], '주문내역', false, false);
    setupSheet(ss.insertSheet('반품내역'), '반품내역', true, false);
    STAFF_EMAILS.forEach(em => { try { ss.addEditor(em); } catch(_){} });
  }
  return ss;
}

function saveToSharedSheet(data) {
  const ss      = getSharedSheet();
  const isRet   = data.mode === 'return';
  const name    = isRet ? '반품내역' : '주문내역';
  let sheet     = ss.getSheetByName(name);
  if (!sheet) { sheet = ss.insertSheet(name); setupSheet(sheet, name, isRet, false); }

  const itemStr  = data.items.map(i => `${i.name}×${i.qty}`).join(' / ');
  const totalQty = data.items.reduce((s,i) => s+i.qty, 0);

  // orderId: 조회/취소에 사용할 고유 키 (접수일시+강사ID)
  const orderId = `${data.instId}_${Date.now()}`;

  const itemsJson = JSON.stringify(data.items||[]);
  const row = isRet
    ? [data.orderAt, orderId, data.instId, data.instName, data.school, data.schoolType,
       data.quarterLabel||'', data.returnReason||'', itemStr, totalQty, data.total, data.memo||'', '정상', itemsJson, '']
    : [data.orderAt, orderId, data.instId, data.instName, data.school, data.schoolType,
       data.quarterLabel||'', itemStr, totalQty, data.total, data.memo||'', '정상', itemsJson, ''];

  sheet.appendRow(row);
  const lastRow  = sheet.getLastRow();
  const totalCol = isRet ? 11 : 10;
  sheet.getRange(lastRow, totalCol).setNumberFormat('₩#,##0');
  data._orderId = orderId; // admin sheet에서 같은 ID 사용
}

// ═══════════════════════════════════════════════════════════════
// 관리자용 시트 (매입원가 + 페이백 포함)
// ═══════════════════════════════════════════════════════════════
function getAdminSheet() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty('ADMIN_SHEET_ID');
  let ss;
  if (id) { try { ss = SpreadsheetApp.openById(id); } catch(_) { ss = null; } }
  if (!ss) {
    ss = SpreadsheetApp.create('🔒 J-Lab 주문내역 (관리자용 — 페이백 포함)');
    id = ss.getId();
    props.setProperty('ADMIN_SHEET_ID', id);
    setupSheet(ss.getSheets()[0], '주문내역', false, true);
    setupSheet(ss.insertSheet('반품내역'), '반품내역', true, true);
    try { ss.addEditor(ADMIN_EMAIL); } catch(_){}
  }
  return ss;
}

function saveToAdminSheet(data) {
  const ss      = getAdminSheet();
  const orderId = data._orderId || `${data.instId}_${Date.now()}`;
  const isRet   = data.mode === 'return';
  const name    = isRet ? '반품내역' : '주문내역';
  let sheet     = ss.getSheetByName(name);
  if (!sheet) { sheet = ss.insertSheet(name); setupSheet(sheet, name, isRet, true); }

  // 페이백 계산
  let totalCost    = 0;
  let totalPayback = 0;
  data.items.forEach(i => {
    const cost = COST_PRICES[i.id] || 0;
    totalCost    += cost * i.qty;
    totalPayback += (i.price - cost) * i.qty;
  });

  const itemStr  = data.items.map(i => {
    const cost    = COST_PRICES[i.id] || 0;
    const payback = (i.price - cost) * i.qty;
    return `${i.name}×${i.qty}(페이백₩${payback.toLocaleString()})`;
  }).join(' / ');
  const totalQty = data.items.reduce((s,i) => s+i.qty, 0);

  const row = isRet
    ? [data.orderAt, orderId, data.instId, data.instName, data.school, data.schoolType,
       data.quarterLabel||'', data.returnReason||'', itemStr, totalQty,
       data.total, totalCost, totalPayback, data.memo||'', '정상']
    : [data.orderAt, orderId, data.instId, data.instName, data.school, data.schoolType,
       data.quarterLabel||'', itemStr, totalQty,
       data.total, totalCost, totalPayback, data.memo||'', '정상'];

  sheet.appendRow(row);
  const lastRow = sheet.getLastRow();
  const startCol = isRet ? 11 : 10;
  sheet.getRange(lastRow, startCol, 1, 3).setNumberFormat('₩#,##0');
}

// ── 시트 초기화 ────────────────────────────────────────────────
function setupSheet(sheet, sheetName, isReturn, isAdmin) {
  sheet.setName(sheetName);
  let h;
  if (isReturn && isAdmin)
    h = ['접수일시','주문ID','강사ID','강사명','학교','유형','분기','반품사유','제품목록(페이백포함)','수량','소비자가합계','매입원가합계','페이백금액','메모','상태'];
  else if (isReturn && !isAdmin)
    h = ['접수일시','주문ID','강사ID','강사명','학교','유형','분기','반품사유','제품목록','수량','총액(소비자가)','메모','상태','제품JSON','관리자메모'];
  else if (!isReturn && isAdmin)
    h = ['접수일시','주문ID','강사ID','강사명','학교','유형','분기','제품목록(페이백포함)','수량','소비자가합계','매입원가합계','페이백금액','메모','상태'];
  else
    h = ['접수일시','주문ID','강사ID','강사명','학교','유형','분기','제품목록','수량','총액(소비자가)','메모','상태','제품JSON','관리자메모'];

  const hdr = sheet.getRange(1,1,1,h.length);
  hdr.setValues([h]).setFontWeight('bold')
     .setBackground(isAdmin ? '#7F0000' : '#1F4E79').setFontColor('#FFFFFF');
  sheet.setFrozenRows(1);
  sheet.setColumnWidths(1, h.length, 110);
  sheet.setColumnWidth(1, 160);
  // 제품목록 컬럼 넓게
  const prodCol = isReturn ? 7 : 6;
  sheet.setColumnWidth(prodCol, isAdmin ? 400 : 280);
}

// ═══════════════════════════════════════════════════════════════
// 이메일 알림
// ─ 직원: 강사명/학교/제품명/수량만
// ─ 관리자: 소비자가 + 페이백 금액 포함
// ═══════════════════════════════════════════════════════════════
function sendEmail(data) {
  const isRet = data.mode === 'return';
  const tag   = isRet ? '↩️ 반품' : '📦 주문';
  const subject = `[J-Lab ${tag}] ${data.instName} / ${data.school} / ${data.quarterLabel||''}`;

  // ── 직원용 이메일 (금액 없음) ──
  const staffItemLines = data.items
    .map(i => `  • ${i.name} × ${i.qty}개`)
    .join('\n');

  const staffBody = [
    isRet ? '↩️ 반품 신청이 접수되었습니다.' : '✅ 새 주문이 접수되었습니다.',
    '',
    `강사: ${data.instName}`,
    `학교: ${data.school} (${data.schoolType})`,
    `분기: ${data.quarterLabel||''}`,
    `접수: ${data.orderAt}`,
    isRet ? `반품사유: ${data.returnReason}` : null,
    '',
    `── ${tag} 목록 ──`,
    staffItemLines,
    data.memo ? `\n메모: ${data.memo}` : null,
  ].filter(l => l !== null).join('\n');

  // ── 관리자용 이메일 (소비자가 + 페이백 포함) ──
  let totalCons = 0, totalPayback = 0;
  const adminItemLines = data.items.map(i => {
    const cost    = COST_PRICES[i.id] || 0;
    const payback = (i.price - cost) * i.qty;
    totalCons    += i.sub;
    totalPayback += payback;
    return `  • ${i.name} × ${i.qty}개  |  ₩${i.sub.toLocaleString()}  (페이백 ₩${payback.toLocaleString()})`;
  }).join('\n');

  const adminBody = [
    isRet ? '↩️ 반품 신청이 접수되었습니다.' : '✅ 새 주문이 접수되었습니다.',
    '',
    `강사: ${data.instName}`,
    `학교: ${data.school} (${data.schoolType})`,
    `분기: ${data.quarterLabel||''}`,
    `접수: ${data.orderAt}`,
    isRet ? `반품사유: ${data.returnReason}` : null,
    '',
    `── ${tag} 목록 (소비자가 | 페이백) ──`,
    adminItemLines,
    '',
    `소비자가 합계: ₩${totalCons.toLocaleString()}`,
    `페이백 합계:   ₩${totalPayback.toLocaleString()}`,
    data.memo ? `메모: ${data.memo}` : null,
  ].filter(l => l !== null).join('\n');

  // 직원 발송 (관리자 제외)
  STAFF_EMAILS
    .filter(em => em !== ADMIN_EMAIL)
    .forEach(em => {
      try { GmailApp.sendEmail(em, subject, staffBody); } catch(err) { console.error('직원 메일 실패:', em, err); }
    });

  // 관리자 발송 (페이백 포함)
  try { GmailApp.sendEmail(ADMIN_EMAIL, subject, adminBody); } catch(err) { console.error('관리자 메일 실패:', err); }
}

// ═══════════════════════════════════════════════════════════════
// 카카오톡 알림
// ═══════════════════════════════════════════════════════════════
function getKakaoToken() {
  const props   = PropertiesService.getScriptProperties();
  const clientId     = props.getProperty('KAKAO_CLIENT_ID');
  const refreshToken = props.getProperty('KAKAO_REFRESH_TOKEN');
  if (!clientId || !refreshToken) return null;
  try {
    const res    = UrlFetchApp.fetch('https://kauth.kakao.com/oauth/token', {
      method:'POST',
      payload:{ grant_type:'refresh_token', client_id:clientId, refresh_token:refreshToken }
    });
    const tokens = JSON.parse(res.getContentText());
    props.setProperty('KAKAO_ACCESS_TOKEN', tokens.access_token);
    if (tokens.refresh_token) props.setProperty('KAKAO_REFRESH_TOKEN', tokens.refresh_token);
    return tokens.access_token;
  } catch(err) { console.error('토큰 갱신 실패:', err); return null; }
}

function sendKakao(data) {
  const token = getKakaoToken();
  if (!token) return;

  const isRet = data.mode === 'return';
  const top5 = data.items.slice(0,5).map(i => `• ${i.name} ×${i.qty}`).join('\n');
  const more = data.items.length > 5 ? `\n외 ${data.items.length-5}개 품목` : '';

  const text = [
    isRet ? '↩️ 반품 신청 접수' : '📦 새 주문 접수',
    '━━━━━━━━━━━━━━━━━',
    `강사: ${data.instName}`,
    `학교: ${data.school}`,
    `분기: ${data.quarterLabel||''}`,
    `접수: ${data.orderAt}`,
    isRet ? `사유: ${data.returnReason}` : null,
    '',
    top5 + more,
    data.memo ? `\n메모: ${data.memo}` : null,
  ].filter(Boolean).join('\n');

  try {
    UrlFetchApp.fetch('https://kapi.kakao.com/v2/api/talk/memo/default/send', {
      method:'POST',
      headers:{ Authorization:'Bearer ' + token },
      payload:{ template_object: JSON.stringify({
        object_type:'text', text:text,
        link:{ web_url:'https://jlabceo.github.io/j_lab_order/' }
      })}
    });
    console.log('카카오 발송 완료');
  } catch(err) { console.error('카카오 발송 실패:', err); }
}

// ═══════════════════════════════════════════════════════════════
// 유틸
// ═══════════════════════════════════════════════════════════════
function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
         .setMimeType(ContentService.MimeType.JSON);
}
function page(title, body) {
  return HtmlService.createHtmlOutput(`<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>body{font-family:sans-serif;padding:40px;max-width:600px}
table{border-collapse:collapse;margin:16px 0}
td{padding:8px 16px;border:1px solid #ddd}
td:first-child{font-weight:bold;background:#f5f5f5}</style>
</head><body><h2>${title}</h2>${body}</body></html>`);
}

// ═══════════════════════════════════════════════════════════════
// 강사 주문내역 조회 (GET ?action=history&uid=xxx)
// ═══════════════════════════════════════════════════════════════
function getInstructorHistory(uid) {
  if (!uid || !/^[a-z0-9\-]+$/.test(uid)) {
    return jsonGet({error: 'invalid uid'});
  }

  const results = [];

  try {
    const ss = getSharedSheet();

    ['주문내역', '반품내역'].forEach(sheetName => {
      const sheet = ss.getSheetByName(sheetName);
      if (!sheet) return;
      const isRet = sheetName === '반품내역';
      const rows  = sheet.getDataRange().getValues();

      rows.slice(1).forEach(r => {
        if (String(r[2]) !== uid) return;   // 강사ID = col[2]
        if (String(r[12] || r[13] || '') === '취소') return; // 취소된 주문 제외

        results.push({
          mode         : isRet ? 'return' : 'order',
          orderId      : String(r[1]),        // 주문ID
          orderAt      : String(r[0]),        // 접수일시
          school       : String(r[4]),        // 학교
          quarterLabel : String(r[6]),        // 분기
          returnReason : isRet ? String(r[7]) : '',
          items        : String(isRet ? r[8] : r[7]),  // 제품목록
          qty          : isRet ? r[9]  : r[8],         // 수량합계
          total        : isRet ? r[10] : r[9],         // 총액
          status       : String(isRet ? (r[12]||'정상') : (r[11]||'정상')),
          itemsJson    : String(isRet ? (r[13]||'[]') : (r[12]||'[]')),
          adminMemo    : String(isRet ? (r[14]||'') : (r[13]||'')),
        });
      });
    });
  } catch(err) {
    return jsonGet({error: err.toString()});
  }

  // 최신순 정렬, 최대 100건
  results.sort((a,b) => new Date(b.orderAt) - new Date(a.orderAt));
  return jsonGet(results.slice(0, 100));
}

// ═══════════════════════════════════════════════════════════════
// 주문 취소 (GET ?action=cancel&uid=xxx&orderId=xxx)
// ═══════════════════════════════════════════════════════════════
function cancelOrder(uid, orderId) {
  if (!uid || !orderId) return jsonGet({ok: false, msg: '파라미터 오류'});

  const canceledAt = new Date().toLocaleString('ko-KR');
  let found = false;

  try {
    // 공유 시트
    const shared = getSharedSheet();
    ['주문내역','반품내역'].forEach(name => {
      const sheet = shared.getSheetByName(name);
      if (!sheet) return;
      const isRet  = name === '반품내역';
      const statusCol = isRet ? 13 : 12; // 상태 컬럼
      const rows   = sheet.getDataRange().getValues();
      rows.slice(1).forEach((r, i) => {
        if (String(r[1]) === orderId && String(r[2]) === uid) {
          sheet.getRange(i+2, statusCol).setValue('취소');
          found = true;
        }
      });
    });

    // 관리자 시트에도 동일하게 처리
    const admin = getAdminSheet();
    ['주문내역','반품내역'].forEach(name => {
      const sheet = admin.getSheetByName(name);
      if (!sheet) return;
      const isRet  = name === '반품내역';
      const statusCol = isRet ? 16 : 15;
      const rows   = sheet.getDataRange().getValues();
      rows.slice(1).forEach((r, i) => {
        if (String(r[1]) === orderId && String(r[2]) === uid) {
          sheet.getRange(i+2, statusCol).setValue('취소');
        }
      });
    });

    if (found) {
      // 취소 알림 카카오 발송
      sendCancelKakao(uid, orderId);
    }
  } catch(err) {
    return jsonGet({ok: false, msg: err.toString()});
  }

  return jsonGet({ok: found, msg: found ? '취소 완료' : '주문을 찾을 수 없습니다'});
}

function sendCancelKakao(uid, orderId) {
  const token = getKakaoToken();
  if (!token) return;
  const text = `🚫 주문 취소 접수\n주문ID: ${orderId}\n강사ID: ${uid}\n취소시각: ${new Date().toLocaleString('ko-KR')}`;
  try {
    UrlFetchApp.fetch('https://kapi.kakao.com/v2/api/talk/memo/default/send', {
      method:'POST',
      headers:{ Authorization:'Bearer ' + token },
      payload:{ template_object: JSON.stringify({
        object_type:'text', text,
        link:{ web_url:'https://jlabceo.github.io/j_lab_order/' }
      })}
    });
  } catch(e) { console.error('취소 카카오 실패:', e); }
}

function jsonGet(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
         .setMimeType(ContentService.MimeType.JSON);
}

// ═══════════════════════════════════════════════════════════════
// 관리자 기능
// ═══════════════════════════════════════════════════════════════

function verifyAdminPin(pin) {
  const stored = PropertiesService.getScriptProperties().getProperty('ADMIN_PIN') || '0000';
  if (pin !== stored) return jsonGet({ok:false, msg:'PIN 오류'});
  const token = Utilities.getUuid();
  PropertiesService.getScriptProperties().setProperty('ADMIN_TOKEN_'+token, String(Date.now()));
  return jsonGet({ok:true, token});
}

function isValidToken(token) {
  if (!token) return false;
  const ts = PropertiesService.getScriptProperties().getProperty('ADMIN_TOKEN_'+token);
  if (!ts) return false;
  return (Date.now() - parseInt(ts)) < 8*60*60*1000; // 8시간
}

function getAdminOrders(token, params) {
  if (!isValidToken(token)) return jsonGet({error:'unauthorized'});
  const results = [];
  try {
    const ss = getSharedSheet();
    ['주문내역','반품내역'].forEach(sheetName => {
      const sheet = ss.getSheetByName(sheetName);
      if (!sheet) return;
      const isRet = sheetName === '반품내역';
      const rows  = sheet.getDataRange().getValues();
      rows.slice(1).forEach((r,i) => {
        if (!r[0]) return;
        // 필터
        if (params.instId && r[2] !== params.instId) return;
        if (params.quarter && !String(r[6]).includes(params.quarter)) return;
        if (params.status && params.status !== 'all' && (isRet ? r[12] : r[11]) !== params.status) return;
        results.push({
          rowIndex  : i+2,
          sheetName,
          mode      : isRet ? 'return' : 'order',
          orderId   : String(r[1]),
          orderAt   : String(r[0]),
          instId    : String(r[2]),
          instName  : String(r[3]),
          school    : String(r[4]),
          schoolType: String(r[5]),
          quarter   : String(r[6]),
          returnReason: isRet ? String(r[7]) : '',
          itemsStr  : String(isRet ? r[8] : r[7]),
          itemsJson : String(isRet ? (r[13]||'[]') : (r[12]||'[]')),
          qty       : isRet ? r[9]  : r[8],
          total     : isRet ? r[10] : r[9],
          memo      : String(isRet ? (r[11]||'') : (r[10]||'')),
          status    : String((isRet ? r[12] : r[11])||'정상'),
          adminMemo : String(isRet ? (r[14]||'') : (r[13]||'')),
        });
      });
    });
  } catch(err) { return jsonGet({error:err.toString()}); }
  results.sort((a,b) => new Date(b.orderAt)-new Date(a.orderAt));
  return jsonGet(results);
}

function updateOrderAdmin(token, data) {
  if (!isValidToken(token)) return json({error:'unauthorized'});
  try {
    const ss = getSharedSheet();
    const sheet = ss.getSheetByName(data.sheetName||'주문내역');
    if (!sheet) return json({error:'sheet not found'});
    const isRet = data.sheetName === '반품내역';
    const row = parseInt(data.rowIndex);

    // 컬럼 인덱스 (1-based for GAS setValues)
    const colStatus    = isRet ? 13 : 12; // 상태 (주문:col12, 반품:col13)
    const colItemsStr  = isRet ? 9 : 8;
    const colQty       = isRet ? 10 : 9;
    const colTotal     = isRet ? 11 : 10;
    const colItemsJson = isRet ? 14 : 13;
    const colAdminMemo = isRet ? 15 : 14;

    if (data.status)    sheet.getRange(row, colStatus).setValue(data.status);
    if (data.adminMemo !== undefined) sheet.getRange(row, colAdminMemo).setValue(data.adminMemo);

    if (data.items) {
      const items = data.items; // [{id,name,price,qty,sub}]
      const itemStr = items.map(i=>`${i.name}×${i.qty}`).join(' / ');
      const totalQty = items.reduce((s,i)=>s+i.qty,0);
      const total    = items.reduce((s,i)=>s+i.sub,0);
      sheet.getRange(row, colItemsStr).setValue(itemStr);
      sheet.getRange(row, colQty).setValue(totalQty);
      sheet.getRange(row, colTotal).setValue(total);
      sheet.getRange(row, colItemsJson).setValue(JSON.stringify(items));
      sheet.getRange(row, colTotal).setNumberFormat('₩#,##0');

      // 관리자 시트도 동기화
      syncAdminSheet(data.orderId, data.sheetName, itemStr, totalQty, total, JSON.stringify(items), data.status, data.adminMemo);
    } else {
      // 상태/메모만 변경 시 관리자 시트 동기화
      syncAdminSheet(data.orderId, data.sheetName, null, null, null, null, data.status, data.adminMemo);
    }
    return json({ok:true});
  } catch(err) {
    console.error(err);
    return json({error:err.toString()});
  }
}

function syncAdminSheet(orderId, sheetName, itemStr, qty, total, itemsJson, status, adminMemo) {
  try {
    const ss    = getAdminSheet();
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) return;
    const isRet = sheetName === '반품내역';
    const rows  = sheet.getDataRange().getValues();
    rows.slice(1).forEach((r,i) => {
      if (String(r[1]) !== String(orderId)) return;
      const rowN = i+2;
      if (status)    sheet.getRange(rowN, isRet?15:14).setValue(status);
      if (itemStr !== null) {
        sheet.getRange(rowN, isRet?9:8).setValue(itemStr);
        sheet.getRange(rowN, isRet?10:9).setValue(qty);
        sheet.getRange(rowN, isRet?11:10).setValue(total);
        sheet.getRange(rowN, isRet?11:10).setNumberFormat('₩#,##0');
      }
    });
  } catch(e) { console.error('admin sync error:', e); }
}
