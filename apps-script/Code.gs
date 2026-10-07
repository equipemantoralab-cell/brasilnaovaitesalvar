/**
 * Apps Script Web App — recebe leads via POST e grava na planilha.
 *
 * COMO INSTALAR:
 * 1. Abra a planilha Google Sheets que vai receber os leads.
 * 2. Menu Extensões → Apps Script.
 * 3. Apague o conteúdo padrão do arquivo Code.gs e cole TODO este arquivo.
 * 4. Clique em "Implantar" (Deploy) → "Nova implantação" (New deployment).
 * 5. Tipo: "App da Web" (Web app).
 * 6. Configuração:
 *    - Executar como: "Eu" (sua conta)
 *    - Quem pode acessar: "Qualquer pessoa" (Anyone)
 * 7. Clique em "Implantar". Autorize o acesso quando solicitado (sua própria conta Google).
 * 8. Copie a URL gerada (termina em /exec) — essa é a GOOGLE_APPS_SCRIPT_URL
 *    que vamos usar no projeto Next.js.
 * 9. Garanta que existe uma aba chamada exatamente "Sheet1" (leads da página
 *    de captura) e outra chamada exatamente "Quiz Leads" (leads do quiz).
 *    Se não existirem, crie-as manualmente (botão + no rodapé da planilha).
 *
 * Sempre que você editar este script, precisa criar uma NOVA implantação
 * (ou editar a implantação existente) para as mudanças valerem.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheetName = data.sheet === 'quiz' ? 'Quiz Leads' : 'Sheet1';
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);

    if (!sheet) {
      return respond({ status: 'error', message: 'Aba "' + sheetName + '" não encontrada.' });
    }

    var timestamp = new Date();

    if (data.sheet === 'quiz') {
      sheet.appendRow([
        timestamp,
        data.nome || '',
        data.email || '',
        data.whatsapp || '',
        data.pontuacaoTotal || '',
        data.perfilResultado || '',
        data.respostaSegmentacao || ''
      ]);
    } else {
      sheet.appendRow([
        timestamp,
        data.nome || '',
        data.email || '',
        data.whatsapp || ''
      ]);
    }

    return respond({ status: 'ok' });
  } catch (err) {
    return respond({ status: 'error', message: err.message });
  }
}

function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Função de teste manual — rode pelo editor do Apps Script pra conferir
// se a gravação funciona antes de ligar ao site.
function testeManual() {
  var fakeEvent = {
    postData: {
      contents: JSON.stringify({
        sheet: 'lead',
        nome: 'Teste',
        email: 'teste@teste.com',
        whatsapp: '11999999999'
      })
    }
  };
  Logger.log(doPost(fakeEvent).getContent());
}
