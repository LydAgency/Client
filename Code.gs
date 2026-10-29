// CoachLinkQ — réception de la liste d'attente des bénéficiaires.
// Script lié à la Google Sheet : chaque inscription ajoute une ligne et envoie l'email de confirmation.
// Le fichier HTML de l'email doit s'appeler « email » dans le projet Apps Script.

const SHEET_NAME = 'Liste d\'attente';
const SUBJECT = 'Tu es sur la liste d\'attente CoachLinkQ';
const SENDER_NAME = 'CoachLinkQ';
// Adresse publique du logo une fois la page en ligne, ex. https://ton-domaine.be/assets/logo-coachlinkq.png
const LOGO_URL = '';
const HEADERS = ['Date', 'Prénom', 'Email', 'Ville', 'Objectif', 'Format', 'Budget par séance', 'Frein', 'Source'];

function doPost(e) {
  const p = JSON.parse(e.postData.contents);
  const email = String(p.email || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json_({ ok: false });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSheet_();
    if (p.stage === 'inscription') {
      sheet.appendRow([new Date(), clean_(p.prenom), email, clean_(p.ville), clean_(p.objectif), '', '', '', clean_(p.source)]);
      sendConfirmation_(email, p.prenom);
    } else if (p.stage === 'details') {
      const answers = [clean_(p.format), clean_(p.budget), clean_(p.frein)];
      const row = findRow_(sheet, email);
      if (row) sheet.getRange(row, 6, 1, 3).setValues([answers]);
    }
  } finally {
    lock.releaseLock();
  }
  return json_({ ok: true });
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Dernière ligne portant cet email (l'inscription la plus récente).
function findRow_(sheet, email) {
  const last = sheet.getLastRow();
  if (last < 2) return 0;
  const emails = sheet.getRange(2, 3, last - 1, 1).getValues();
  for (let i = emails.length - 1; i >= 0; i--) {
    if (String(emails[i][0]).toLowerCase() === email.toLowerCase()) return i + 2;
  }
  return 0;
}

function sendConfirmation_(email, prenom) {
  const name = String(prenom || '').trim();
  const html = HtmlService.createHtmlOutputFromFile('email').getContent()
    .replace(/{{prenom}}/g, escapeHtml_(name || 'toi'))
    .replace(/{{logoUrl}}/g, LOGO_URL);
  MailApp.sendEmail({
    to: email,
    subject: SUBJECT,
    name: SENDER_NAME,
    htmlBody: html,
    body: 'Bienvenue ' + (name || '') + ' !\n\n' +
      'Ton inscription à la liste d\'attente CoachLinkQ est bien enregistrée.\n\n' +
      'On prépare une nouvelle façon de trouver un coach sportif adapté à ta ville et à tes objectifs. ' +
      'Les inscrits de la liste d\'attente seront prévenus en premier du lancement.\n\n' +
      'À très vite,\nL\'équipe CoachLinkQ'
  });
}

// Empêche une réponse du formulaire d'être lue comme une formule par la Sheet.
function clean_(v) {
  const s = String(v == null ? '' : v).trim().slice(0, 2000);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function escapeHtml_(s) {
  return s.replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
