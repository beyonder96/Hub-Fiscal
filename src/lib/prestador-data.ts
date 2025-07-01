
import type { Prestador } from './definitions';

// This is the initial data set. The component will manage this data in localStorage.
export const initialPrestadores: Omit<Prestador, 'id' | 'nomeBusca'>[] = [
  {
    "empresa": "MATRIZ", "nome": "26 TAB. DE NOTAS", "fornecedor": "798109", "descricao": "SERVICOS DE REGISTROS PUBLICOS, CARTORARIOS E NOTARIAIS.",
    "servico": "03878 ou 06816", "tes": "1A4", "conta": "311213", "vencimento": "FINAL DO MÊS", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": "https://nfe.prefeitura.sp.gov.br/publico/verificacao.aspx"
  },
  {
    "empresa": "MATRIZ", "nome": "2HTI SOLUTIONS INFORMATICA LTDA ME", "fornecedor": "INPSFD", "descricao": "REPRESENTACAO DE QUALQUER NATUREZA, INCL COMERCIAL",
    "servico": "06009", "tes": "1A4", "conta": "317219", "vencimento": "2 DIAS UTEIS", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "SOLICITADO",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "57.721.134 ANTONIO AIRTON DOS SANTOS", "fornecedor": "STATFG", "descricao": "REPRESENTACAO DE QUALQUER NATUREZA, INCL COMERCIAL",
    "servico": "10.05", "tes": "1A4", "conta": "317219", "vencimento": "2 DIAS UTEIS", "municipio": "LUIS EDUARDO MAGALHAES", "nfts": "SIM",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "SOLICITADO",
    "autenticidadeUrl": "https://www.nfse.gov.br/consultapublica"
  },
  {
    "empresa": "MATRIZ", "nome": "ABE ASSESSORIA BRASILEIRA DE EMPRESAS LTDA", "fornecedor": "797983", "descricao": "COBRANCAS E RECEBIMENTOS POR CONTA DE TERCEIROS",
    "servico": "06564", "tes": "1A4", "conta": "311213", "vencimento": "MESMO DIA", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": "https://nfe.prefeitura.sp.gov.br/publico/verificacao.aspx"
  },
  {
    "empresa": "MATRIZ", "nome": "ADILSON ELISIARIO CARVALHO 34539358880", "fornecedor": "INPS8Y", "descricao": "REPRESENTACAO DE QUALQUER NATUREZA, INCL COMERCIAL",
    "servico": "06009", "tes": "1A4", "conta": "317219", "vencimento": "2 DIAS UTEIS", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "SOLICITADO",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "ADT SERVICOS DE MONITORAMENTO LTDA", "fornecedor": "798894", "descricao": "VIGILANCIA, SEGURANCA OU MONITORAMENTO DE BENS",
    "servico": "07870", "tes": "1A5", "conta": "Departamento + final 213", "vencimento": "CONFORME NOTA", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "SIM", "ir": "NÃO", "pcc": "SIM", "inss": "NÃO", "codIr": "-", "codPcc": "5952", "email": "OK",
    "autenticidadeUrl": "https://nfe.prefeitura.sp.gov.br/publico/verificacao.aspx"
  },
  {
    "empresa": "MATRIZ", "nome": "AGENDOR SERVIÇOS", "fornecedor": "799826", "descricao": "LICENCIAMENTO OU CESSAO DE DIREITO DE USO DE PROGRAMAS DE COMPUTACAO",
    "servico": "02800", "tes": "1A4", "conta": "CONSULTAR", "vencimento": "CONSULTAR", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "OK",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "AIDC TECNOLOGIA", "fornecedor": "798255", "descricao": "CONSERTO, RESTAURACAO, MANUTENCAO E CONSERVACAO DE MAQUINAS",
    "servico": "1401", "tes": "1A6", "conta": "301111", "vencimento": "CONSULTAR", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "OK",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "ARQUIVEI/QIVE", "fornecedor": "INPSH8", "descricao": "LICENCIAMENTO DE PROGRAMA DE COMPUTADOR",
    "servico": "1.05", "tes": "1A4", "conta": "311213", "vencimento": "CONFORME BOLETO", "municipio": "SÃO CARLOS", "nfts": "SIM",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "AUTOMASSUL INFORMATICA LTDA", "fornecedor": "800517", "descricao": "REPRESENTACAO DE QUALQUER NATUREZA, INCL COMERCIAL",
    "servico": "06009", "tes": "1A4", "conta": "317219", "vencimento": "2 DIAS UTEIS", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "SOLICITADO",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "BAETA ADMINISTRCAO E PARTICIPACOES LTDA", "fornecedor": "798716", "descricao": "ASSESSORIA OU CONSULT DE QUALQUER NATUREZA",
    "servico": "03115", "tes": "1A4", "conta": "311213 (Fim) ou 317213 (Inicio)", "vencimento": "ULTIMO DIA UTIL", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": "https://nfe.prefeitura.sp.gov.br/publico/verificacao.aspx"
  },
  {
    "empresa": "MATRIZ", "nome": "BAETA ROCHA SA DUARTE E VIANA", "fornecedor": "71500", "descricao": "ADVOCACIA",
    "servico": "03220", "tes": "1A4", "conta": "311213", "vencimento": "10", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "SIM", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "PORTO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": "https://nfe.prefeitura.sp.gov.br/publico/verificacao.aspx"
  },
  {
    "empresa": "MATRIZ/SERRA", "nome": "BIONEXO S.A.", "fornecedor": "INPSC3", "descricao": "LICENCIAMENTO OU CESSAO DE DIREITO DE USO DE PROGRAMAS DE COMPUTACAO",
    "servico": "02800", "tes": "1A4", "conta": "316213 ou 318213", "vencimento": "CONFORME NOTA", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": "https://nfe.prefeitura.sp.gov.br/publico/verificacao.aspx"
  },
  {
    "empresa": "MATRIZ", "nome": "BOA VISTA S.A.", "fornecedor": "79670", "descricao": "ASSESSORIA OU CONSULT DE QUALQUER NATUREZA",
    "servico": "03115", "tes": "1A4", "conta": "311213", "vencimento": "CONFORME BOLETO", "municipio": "BARUERI", "nfts": "SIM",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "SIM", "pcc": "SIM", "inss": "NÃO", "codIr": "1708", "codPcc": "5952", "email": "",
    "autenticidadeUrl": "https://www.barueri.sp.gov.br/nfe/"
  },
  {
    "empresa": "MATRIZ", "nome": "BRASCIN SERVIÇOS", "fornecedor": "INPSEE", "descricao": "REPRESENTACAO DE QUALQUER NATUREZA, INCL COMERCIAL",
    "servico": "06009", "tes": "1A4", "conta": "317219", "vencimento": "2 DIAS UTEIS", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "SIM", "pcc": "NÃO", "inss": "NÃO", "codIr": "8045", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": "https://nfe.prefeitura.sp.gov.br/publico/verificacao.aspx"
  },
  {
    "empresa": "MATRIZ", "nome": "BRASPRESS TRANSPORTES URGENTES LTDA", "fornecedor": "800053", "descricao": "TRANSPORTE DE BENS OU VALORES, DENTRO DO TERRITORIO DO MUNICIPIO",
    "servico": "16.03", "tes": "1A4", "conta": "Departamento + final 211", "vencimento": "CONFORME BOLETO", "municipio": "FORTALEZA", "nfts": "SIM",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "BRASTORAGE COMERCIO", "fornecedor": "INPSC9", "descricao": "SUPORTE TECNICO, INSTAL, CONFIG, E MANUT DE PROGRAMAS",
    "servico": "2919", "tes": "1A4", "conta": "CONSULTAR", "vencimento": "CONSULTAR", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "CELEBRE ADMINISTRAÇÃO", "fornecedor": "798082", "descricao": "AGENCIAMENTO, CORRETAGEM OU INTERMEDIACAO DE BENS MOVEIS, NAO ABRANGI",
    "servico": "06297", "tes": "1A4", "conta": "CONSULTAR", "vencimento": "CONSULTAR", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "CIDADANIA PORTUGAL ASSESSORIA E MARKETING LTDA", "fornecedor": "INPSAX", "descricao": "MARKETING",
    "servico": "17.06", "tes": "1A4", "conta": "316213", "vencimento": "16", "municipio": "GURULHOS", "nfts": "SIM",
    "simplesNacional": "SIM", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "SOLICITADO",
    "autenticidadeUrl": "https://guarulhos.ginfes.com.br/"
  },
  {
    "empresa": "MATRIZ", "nome": "CIEE", "fornecedor": "798209", "descricao": "SERVICO DE ASSISTENCIA SOCIAL",
    "servico": "02097", "tes": "1A4", "conta": "RATEIO 311213 e 317213", "vencimento": "DIA 30", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": "https://nfe.prefeitura.sp.gov.br/publico/verificacao.aspx"
  },
  {
    "empresa": "MATRIZ", "nome": "CLICK DATA SUPRIMENTOS", "fornecedor": "INPSAV", "descricao": "REPRESENTACAO DE QUALQUER NATUREZA, INCL COMERCIAL",
    "servico": "06009", "tes": "1A4", "conta": "317219", "vencimento": "2 DIAS UTEIS", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "SIM", "pcc": "NÃO", "inss": "NÃO", "codIr": "8045", "codPcc": "5952", "email": "SOLICITADO",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "CLODOALDO ANTONIO LUJAN", "fornecedor": "800550", "descricao": "RECRUTAMENTO AGENCIAMENTO E SELEÇÃO DE MÃO DE OBRA",
    "servico": "17.04", "tes": "1A4", "conta": "CONFORME DEPARTAMENTO SOLICITANTE", "vencimento": "2 DIAS UTEIS", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "CM MARTINS", "fornecedor": "800535", "descricao": "REPRESENTACAO DE QUALQUER NATUREZA, INCL COMERCIAL",
    "servico": "06009", "tes": "1A4", "conta": "317219", "vencimento": "2 DIAS UTEIS", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "SOLICITADO",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "COMERCIO DE CHAVES E FECHADURAS", "fornecedor": "800058", "descricao": "SERVIÇOS DE CHAVEIROS, CARIMBOS, PLACAS, SINALIZAÇÃO",
    "servico": "06963", "tes": "1A4", "conta": "CONFORME DEPARTAMENTO SOLICITANTE", "vencimento": "JÁ PAGO", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "CORREA COMERCIO DE EQUIP DE COMBATE", "fornecedor": "800109", "descricao": "CARGA E RECARGA DE APARELHOS, EQUIPAMENTOS E OBJETOS DE QUALQUER NATUREZA",
    "servico": "07447", "tes": "1A4", "conta": "311213", "vencimento": "CONFORME BOLETO", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "SIM", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "CORREIOS", "fornecedor": "798970", "descricao": "SERVICO S/ RETENCAO",
    "servico": "8884", "tes": "265", "conta": "Departamento + final 211", "vencimento": "CONFORME BOLETO", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": "-"
  },
  {
    "empresa": "MATRIZ", "nome": "DANIEL F DE ALCANTARA EPP", "fornecedor": "INPS96", "descricao": "REPRESENTACAO DE QUALQUER NATUREZA, INCL COMERCIAL",
    "servico": "10.05", "tes": "1A4", "conta": "317219", "vencimento": "2 DIAS UTEIS", "municipio": "SÃO CAETANO", "nfts": "SIM",
    "simplesNacional": "SIM", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "SOLICITADO",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "DATASITE INVENTARIOS E CONTROLE DE ESTOQUE LTDA", "fornecedor": "800564", "descricao": "SERVICO S/ RETENCAO",
    "servico": "8884", "tes": "1A4", "conta": "CONSULTAR", "vencimento": "CONSULTAR", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "DIOGO BAPTISTA", "fornecedor": "STATEJ", "descricao": "INSTALAÇÃO E MONTAGEM DE APARELHOS E MAQUINAS",
    "servico": "14.06", "tes": "1a4", "conta": "316213", "vencimento": "CONSULTAR", "municipio": "CAMPINAS", "nfts": "SIM",
    "simplesNacional": "NÃO", "iss": "-", "ir": "-", "pcc": "-", "inss": "-", "codIr": "-", "codPcc": "-", "email": "",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "DOCSERVICE IT SOLUTIONS LTDA", "fornecedor": "STATFS", "descricao": "ASSESSORIA OU CONSULT DE QUALQUER NATUREZA",
    "servico": "17.01", "tes": "1A4", "conta": "317213", "vencimento": "CONFORME BOLETO", "municipio": "SANTO ANTONIO DA PATRULHA/", "nfts": "SIM",
    "simplesNacional": "SIM", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "DORIVALDO MELO VIEIRA JUNIOR 63725142220", "fornecedor": "800575", "descricao": "SUPORTE TECNICO, INSTAL, CONFIG, E MANUT DE PROGRAMAS",
    "servico": "02919", "tes": "1A4", "conta": "CONSULTAR", "vencimento": "CONSULTAR", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "D-SAAS TECNOLOGIA", "fornecedor": "INPSD9", "descricao": "LICENCIAMENTO OU CESSAO DE DIREITO DE USO DE PROGRAMAS DE COMPUTACAO",
    "servico": "1.05", "tes": "1A4", "conta": "311213", "vencimento": "CONFORME BOLETO", "municipio": "EXTREMA", "nfts": "SIM",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "EBP SOLUCOES COMERCIAL E INDUSTRIAL LTDA", "fornecedor": "STATGB", "descricao": "REPRESENTACAO DE QUALQUER NATUREZA, INCL COMERCIAL",
    "servico": "10.02", "tes": "1A4", "conta": "317219", "vencimento": "2 DIAS UTEIS", "municipio": "SÃO VICENTE", "nfts": "SIM",
    "simplesNacional": "SIM", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "SOLICITADO",
    "autenticidadeUrl": "https://www.issnetonline.com.br/saovicente/online/NotaDigital/VerificaAutenticidade.aspx"
  },
  {
    "empresa": "MATRIZ", "nome": "ELECTRONIC SERVICES AND SOLUTIONS LTDA ME", "fornecedor": "STATE6", "descricao": "REPRESENTACAO DE QUALQUER NATUREZA, INCL COMERCIAL",
    "servico": "06009", "tes": "1A4", "conta": "317219", "vencimento": "2 DIAS UTEIS", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "SIM", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "SOLICITADO",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "ELETRONICA FLEURY LTDA - ME", "fornecedor": "799426", "descricao": "CONSERTO, RESTAURACAO, MANUTENCAO E CONSERVACAO DE MAQUINAS",
    "servico": "07498", "tes": "1A4", "conta": "CONSULTAR", "vencimento": "CONSULTAR", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "ENEL SP", "fornecedor": "798090", "descricao": "COMPRA DE ENERGIA ELETRICA",
    "servico": "9999", "tes": "170", "conta": "Departamento + final 204", "vencimento": "CONFORME NOTA", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "-", "ir": "-", "pcc": "-", "inss": "-", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": "-"
  },
  {
    "empresa": "MATRIZ", "nome": "ERIC DE CASTRO BRANDI", "fornecedor": "STATGH", "descricao": "REPRESENTACAO DE QUALQUER NATUREZA, INCL COMERCIAL",
    "servico": "10.09", "tes": "1A4", "conta": "317219", "vencimento": "2 DIAS UTEIS", "municipio": "SÃO BERNARDO", "nfts": "SIM",
    "simplesNacional": "SIM", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": "https://sbc.giss.com.br/portal/home#/verificacao-autenticidade-nfse"
  },
  {
    "empresa": "MATRIZ", "nome": "ERIDE LEARTE MESQUITA", "fornecedor": "INPSAO", "descricao": "TREINAMENTO",
    "servico": "8.02", "tes": "1A4", "conta": "311213", "vencimento": "CONFORME NOTA", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "ESTACIONAMENTOS TREVO LTDA", "fornecedor": "800338", "descricao": "GUARDA E ESTACIONAMENTO DE VEICULOS TERRESTRES AUTOMOTORES, DE AERONA",
    "servico": "07811", "tes": "1A4", "conta": "311220", "vencimento": "CONFORME BOLETO", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "EZ SERVICOS INFORMATICA", "fornecedor": "798187", "descricao": "REPRESENTACAO DE QUALQUER NATUREZA, INCL COMERCIAL",
    "servico": "06009", "tes": "1A4", "conta": "317219", "vencimento": "2 DIAS UTEIS", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "SIM", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "SOLICITADO",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "FABIO V. COELHO SERRALHERIA LTDA", "fornecedor": "INPSEX", "descricao": "CARPINTARIA E SERRALHERIA",
    "servico": "01104", "tes": "1A4", "conta": "311213", "vencimento": "02 DIAS UTEIS", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "OK",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "FACEBOOK SERVICOS", "fornecedor": "800545", "descricao": "INSERÇÃO DE TEXTOS, DESENHOS PUBLICITÁRIOS",
    "servico": "02498", "tes": "1A4", "conta": "317213", "vencimento": "6", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": "https://nfe.prefeitura.sp.gov.br/publico/verificacao.aspx"
  },
  {
    "empresa": "MATRIZ", "nome": "FAWAY TI", "fornecedor": "INPSHP", "descricao": "REPRESENTACAO DE QUALQUER NATUREZA, INCL COMERCIAL",
    "servico": "10.09", "tes": "1A4", "conta": "317219", "vencimento": "02 DIAS UTEIS", "municipio": "SÃO BERNARDO", "nfts": "SIM",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "SOLICITADO",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "FLY INFORMATICA", "fornecedor": "INPSDG", "descricao": "REPRESENTACAO DE QUALQUER NATUREZA, INCL COMERCIAL",
    "servico": "06009", "tes": "1A4", "conta": "317219", "vencimento": "02 DIAS UTEIS", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "SIM", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "SOLICITADO",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "FOCUS CENTER", "fornecedor": "800521", "descricao": "CONSERTO, RESTAURACAO, MANUTENCAO E CONSERVACAO DE MAQUINAS",
    "servico": "07498", "tes": "1A4", "conta": "CONSULTAR", "vencimento": "CONSULTAR", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "EQUIPA2", "nome": "G & T GESTÃO DE TECNOLOGGIA DIGITAL LTDA", "fornecedor": "INPSAK", "descricao": "ASSESSORIA OU CONSULT DE QUALQUER NATUREZA",
    "servico": "03115", "tes": "1A4", "conta": "316213", "vencimento": "JÁ PAGO", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "SIM", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "G & T GESTÃO DE TECNOLOGGIA DIGITAL LTDA", "fornecedor": "STATE8", "descricao": "ASSESSORIA OU CONSULT DE QUALQUER NATUREZA",
    "servico": "03115", "tes": "1A4", "conta": "311213", "vencimento": "JÁ PAGO", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "SIM", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "GABRIEL DE JESUS HAAG", "fornecedor": "STATE7", "descricao": "TRANSPORTE DE BENS OU VALORES, DENTRO DO TERRITORIO DO MUNICIPIO",
    "servico": "16.02", "tes": "1A4", "conta": "Departamento + final 211", "vencimento": "2 DIAS UTEIS", "municipio": "CANOAS", "nfts": "SIM",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "GUARACYAMA ADMINISTRACAO E PARTICIPACOES LTDA", "fornecedor": "798017", "descricao": "AGENCIAMENTO, CORRETG, INETRMED , DE BENS IMOVEIS N ABRANGIDOS EM OUT",
    "servico": "10.09", "tes": "1A4", "conta": "316213", "vencimento": "ULTIMO DIA UTIL", "municipio": "ITUPEVA", "nfts": "SIM",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "HATIKVA REPRESENTAÇÃO COMERCIAL", "fornecedor": "798211", "descricao": "REPRESENTACAO DE QUALQUER NATUREZA, INCL COMERCIAL",
    "servico": "06009", "tes": "1A4", "conta": "317219", "vencimento": "2 DIAS UTEIS", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "SOLICITADO",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "HOSTGATOR BRASIL LTDA", "fornecedor": "INPSE9", "descricao": "PROCESSAMENTO, ARMAZENAMENTO OU HOSPEDAGEM DE DADOS, TEXTOS, IMAGENS,",
    "servico": "1.03", "tes": "1A4", "conta": "311213", "vencimento": "2 DIAS UTEIS", "municipio": "FLORIANOPOLIS", "nfts": "SIM",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "HP BRASIL", "fornecedor": "799353", "descricao": "MANUT DE EPTO P INFOR E AUT",
    "servico": "1401", "tes": "1A6", "conta": "301111", "vencimento": "45 DIAS", "municipio": "BARUERI", "nfts": "SIM",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "SIM", "inss": "NÃO", "codIr": "-", "codPcc": "5952", "email": "OK",
    "autenticidadeUrl": "https://www.barueri.sp.gov.br/nfe/"
  },
  {
    "empresa": "MATRIZ", "nome": "INFOTECH LTDA", "fornecedor": "STATE9", "descricao": "REPRESENTACAO DE QUALQUER NATUREZA, INCL COMERCIAL",
    "servico": "10.09", "tes": "1A4", "conta": "317219", "vencimento": "2 DIAS UTEIS", "municipio": "CASCAVÉL", "nfts": "SIM",
    "simplesNacional": "SIM", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "SOLICITADO",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "INSERVICE LIMPEZA E INFRA-ESTRUTURA LTDA", "fornecedor": "000003", "descricao": "LIMPEZA, MANUTENCAO E CONSERVACAO DE IMOVEIS, CHAMINES, PISCINAS E",
    "servico": "01406 ou 06491", "tes": "1A5", "conta": "RATEIO", "vencimento": "VERIFICAR BOLETO", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "SIM", "ir": "SIM", "pcc": "SIM", "inss": "SIM", "codIr": "1708", "codPcc": "5952", "email": "OK",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "IOB INFORMACOES", "fornecedor": "INPSAD", "descricao": "LICENCIAMENTO OU DISPONIBILIZAÇÃO",
    "servico": "02800 ou 02964", "tes": "1A4", "conta": "311213", "vencimento": "10", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": "https://nfe.prefeitura.sp.gov.br/publico/verificacao.aspx"
  },
  {
    "empresa": "MATRIZ", "nome": "JANETE DE OLIVEIRA BARRETO SILVA 15093884863", "fornecedor": "INPS1Z", "descricao": "PROCESSAMENTO, ARMAZENAMENTO OU HOSPEDAGEM DE DADOS, TEXTOS, IMAGENS,",
    "servico": "1.03", "tes": "1A4", "conta": "316213", "vencimento": "5", "municipio": "SÃO BERNARDO", "nfts": "SIM",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "JP COPIADORA LTDA ME", "fornecedor": "798692", "descricao": "REPROGRAFIA, MICROFILMAGEM E DIGITALIZAÇÃO",
    "servico": "06817", "tes": "1A4", "conta": "Departamento + final 213", "vencimento": "CONSULTAR", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "SIM", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "JR EXPRESS ENCOMENDAS LTDA", "fornecedor": "INPS7X", "descricao": "COLEA E ENTREGA DE BENS E VALORES",
    "servico": "15.06", "tes": "1A4", "conta": "DEPARTAMENTO + FINAL 211", "vencimento": "2 DIAS UTEIS", "municipio": "PORTO ALEGRE", "nfts": "SIM",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "JULIO CESAR CORDEIRO MENEZES", "fornecedor": "INPSG5", "descricao": "FORNECIMENTO DE MÃO DE OBRA",
    "servico": "17.05", "tes": "1A4", "conta": "CONSULTAR", "vencimento": "2 DIAS UTEIS", "municipio": "CARAPICUIBA", "nfts": "SIM",
    "simplesNacional": "SIM", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": "https://www.nfse.gov.br/consultapublica"
  },
  {
    "empresa": "MATRIZ", "nome": "KANAI DEDETIZADORA E DESENTUPIDORA LTDA", "fornecedor": "800592", "descricao": "DEDETIZACAO DESINFECCAO DESINSETIZACAO IMUNIZACAO HIGIENIZACAO",
    "servico": "01465", "tes": "1A4", "conta": "RATEIO", "vencimento": "CONFORME BOLETO", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "SIM", "iss": "-", "ir": "-", "pcc": "-", "inss": "-", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "KAUE MATEUS CONCEICAO LOPES", "fornecedor": "STATEM", "descricao": "TRANSPORTE DE BENS OU VALORES, DENTRO DO TERRITORIO DO MUNICIPIO",
    "servico": "16.02", "tes": "1A4", "conta": "Departamento + final 211", "vencimento": "2 DIAS UTEIS", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "SIM", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "KELLY VANESSA CRESCENCIO FERREIRA 28427305850", "fornecedor": "800409", "descricao": "SUPORTE TECNICO, INSTAL, CONFIG, E MANUT DE PROGRAMAS",
    "servico": "02919 ou 07285", "tes": "1A4", "conta": "CONSULTAR", "vencimento": "CONSULTAR", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "KONICA MINOLTA", "fornecedor": "INPSEJ", "descricao": "TREINAMENTO",
    "servico": "05762", "tes": "1A4", "conta": "Departamento + final 213", "vencimento": "JÁ PAGO", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "SIM", "pcc": "SIM", "inss": "NÃO", "codIr": "1708", "codPcc": "5952", "email": "OK",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "SERRA", "nome": "KR TRANSPORTES", "fornecedor": "800239", "descricao": "TRANSPORTE",
    "servico": "02447", "tes": "398", "conta": "318211", "vencimento": "CONFORME BOLETO", "municipio": "SERRA", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": "https://tributacao.serra.es.gov.br:8080/tbserra/loginWeb.jsp?execobj=NFSENotaFiscalBuscarDireto"
  },
  {
    "empresa": "MATRIZ", "nome": "L S COMERCIO DE EQUIPAMENTOS DE INFORMATICA", "fornecedor": "INPSHM", "descricao": "REPRESENTACAO DE QUALQUER NATUREZA, INCL COMERCIAL",
    "servico": "10.05", "tes": "1A4", "conta": "317219", "vencimento": "2 DIAS UTEIS", "municipio": "GUARATINGUETA", "nfts": "SIM",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "SIM", "pcc": "NÃO", "inss": "NÃO", "codIr": "8045", "codPcc": "-", "email": "SOLICITADO",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "LEANDRO PATRICIO FERNANDES", "fornecedor": "INPSAX", "descricao": "DISTRIBUIÇÃO DE BENS DE TERCEIROS",
    "servico": "06041", "tes": "1A4", "conta": "CONSULTAR", "vencimento": "CONSULTAR", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "LEONARDO CEZAR", "fornecedor": "INPSEG", "descricao": "REPRESENTACAO DE QUALQUER NATUREZA, INCL COMERCIAL",
    "servico": "06009", "tes": "1A4", "conta": "317219", "vencimento": "2 DIAS UTEIS", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "SOLICITADO",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "SERRA", "nome": "LISA ARMAZEM", "fornecedor": "799877", "descricao": "ARMAZENAGEM",
    "servico": "11.04", "tes": "399", "conta": "318213", "vencimento": "10", "municipio": "SERRA", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "",
    "autenticidadeUrl": "https://tributacao.serra.es.gov.br:8080/tbserra/loginWeb.jsp?execobj=NFSENotaFiscalBuscarDireto"
  },
  {
    "empresa": "SERRA", "nome": "LISA LOGISTICA", "fornecedor": "799877", "descricao": "LOGISTICA",
    "servico": "11.04", "tes": "398", "conta": "318213", "vencimento": "10", "municipio": "SERRA", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "",
    "autenticidadeUrl": "https://tributacao.serra.es.gov.br:8080/tbserra/loginWeb.jsp?execobj=NFSENotaFiscalBuscarDireto"
  },
  {
    "empresa": "MATRIZ", "nome": "LOGGI TECNOLOGIA LTDA", "fornecedor": "800571", "descricao": "INTERMEDIACAO, VIA PLATAFORMA DIGITAL, DE ENTREGAS",
    "servico": "06302", "tes": "1A4", "conta": "CONSULTAR", "vencimento": "CONSULTAR", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "LWSA S/A", "fornecedor": "799452", "descricao": "LICENCIAMENTO OU CESSAO DE DIREITO DE USO DE PROGRAMAS DE COMPUTACAO",
    "servico": "02800", "tes": "1A4", "conta": "317213", "vencimento": "CONFORME NOTA", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": "https://nfe.prefeitura.sp.gov.br/publico/verificacao.aspx"
  },
  {
    "empresa": "MATRIZ", "nome": "MANUEL DE SOUSA PEREIRA LOPES", "fornecedor": "STATER", "descricao": "OUTROS SERVIÇOS DE TRASNPORTE DE NATUREZA MUNICIPAL",
    "servico": "16.02", "tes": "1A4", "conta": "Departamento + final 211", "vencimento": "2 DIAS UTEIS", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": "https://www.nfse.gov.br/consultapublica"
  },
  {
    "empresa": "MATRIZ", "nome": "MARIANA ARECO REPRESENTACOES LTDA", "fornecedor": "800572", "descricao": "REPRESENTACAO DE QUALQUER NATUREZA, INCL COMERCIAL",
    "servico": "06009", "tes": "1A4", "conta": "317219", "vencimento": "2 DIAS UTEIS", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "SOLICITADO",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "MARLI MARIA DA CONCEICAO", "fornecedor": "800261", "descricao": "TRANSPORTE DE BENS OU VALORES, DENTRO DO TERRITORIO DO MUNICIPIO",
    "servico": "16.02", "tes": "1A4", "conta": "Departamento + final 211", "vencimento": "2 DIAS UTEIS", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "SIM", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "MAURICIO LUIS", "fornecedor": "INPSCY", "descricao": "REPRESENTACAO DE QUALQUER NATUREZA, INCL COMERCIAL",
    "servico": "06009", "tes": "1A4", "conta": "317219", "vencimento": "2 DIAS UTEIS", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "SOLICITADO",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "MERCADO ELETRONICO SA", "fornecedor": "799144", "descricao": "LICENCIAMENTO OU CESSAO DE DIREITO DE USO DE PROGRAMAS DE COMPUTACAO",
    "servico": "02800", "tes": "1A4", "conta": "CONSULTAR", "vencimento": "CONSULTAR", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "MERCADO PUBLICO SISTEMA", "fornecedor": "STATEA", "descricao": "LICENCIAMENTO OU CESSAO DE DIREITO DE USO DE PROGRAMAS DE COMPUTACAO",
    "servico": "1.05", "tes": "1A4", "conta": "316213", "vencimento": "CONSULTAR", "municipio": "ITAJAÍ", "nfts": "SIM",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "SOLICITADO",
    "autenticidadeUrl": "https://nfse.itajai.sc.gov.br/jsp/nfs/nfp/externo/consulta.jsp"
  },
  {
    "empresa": "MATRIZ", "nome": "METAR LOGISTICA LTDA (BUSLOG)", "fornecedor": "798164", "descricao": "TRANSPORTE DE BENS OU VALORES, DENTRO DO TERRITORIO DO MUNICIPIO",
    "servico": "02447", "tes": "1A5", "conta": "312211", "vencimento": "CONFORME BOLETO", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "SIM", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "MIKAELA CASTANHEIRA", "fornecedor": "INPSGZ", "descricao": "EXPLORAÇÃO DE SALÕES DE FESTAS, CENTRO DE CONVENÇÕES, ESCRITÓRIOS VIRTUAIS",
    "servico": "3.03", "tes": "1A4", "conta": "317213", "vencimento": "2 DIAS UTEIS", "municipio": "MOGI DAS CRUZES", "nfts": "SIM",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "MONICA COELHO FERNANDES", "fornecedor": "INPSHC", "descricao": "REPRESENTACAO DE QUALQUER NATUREZA, INCL COMERCIAL",
    "servico": "10.09", "tes": "1A4", "conta": "317219", "vencimento": "2 DIAS UTEIS", "municipio": "VILA VELHA", "nfts": "SIM",
    "simplesNacional": "SIM", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "SOLICITADO",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "SERRA", "nome": "MOVVI TRANSPORTES", "fornecedor": "800512", "descricao": "TRANSPORTE",
    "servico": "16.02", "tes": "1A7", "conta": "318211", "vencimento": "CONFORME BOLETO", "municipio": "SERRA", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "SOLICITADO",
    "autenticidadeUrl": "https://tributacao.serra.es.gov.br:8080/tbserra/loginWeb.jsp?execobj=NFSENotaFiscalBuscarDireto"
  },
  {
    "empresa": "MATRIZ", "nome": "NEO-TAGUS INDUSTRIAL LTDA", "fornecedor": "INPS8R", "descricao": "LICENCIAMENTO OU CESSAO DE DIREITO DE USO DE PROGRAMAS DE COMPUTACAO",
    "servico": "02800", "tes": "1A4", "conta": "CONSULTAR", "vencimento": "CONSULTAR", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "NIC.BR", "fornecedor": "798405", "descricao": "SERVICO S/ RETENCAO",
    "servico": "8884", "tes": "265", "conta": "311213", "vencimento": "CONFORME BOLETO", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": "-"
  },
  {
    "empresa": "MATRIZ", "nome": "PARTNER ADMINISTRACAO E PARTICIPACOES LTDA", "fornecedor": "42053", "descricao": "ADMINISTRACAO EM GERAL, INCLUSIVE DE BENS E NEGOCIOS DE TERCEIROS",
    "servico": "01712", "tes": "1A4", "conta": "CONSULTAR", "vencimento": "CONSULTAR", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "PORTO SEGURO", "fornecedor": "1508", "descricao": "MEDICINA E BIOMEDICINA",
    "servico": "04030", "tes": "1A4", "conta": "102701000000011", "vencimento": "CONSULTAR", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "SIM", "pcc": "SIM", "inss": "NÃO", "codIr": "1708", "codPcc": "5952", "email": "OK",
    "autenticidadeUrl": "https://nfe.prefeitura.sp.gov.br/publico/verificacao.aspx"
  },
  {
    "empresa": "MATRIZ", "nome": "POTENCY GESTAO", "fornecedor": "INPSAL", "descricao": "RECRUTAMENTO AGENCIAMENTO E SELEÇÃO DE MÃO DE OBRA",
    "servico": "06475", "tes": "1A4", "conta": "CONSULTAR", "vencimento": "CONSULTAR", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "PRINTTEC AUTOMACAO", "fornecedor": "INPSB3", "descricao": "AGENCIAMENTO, CORRETAGEM OU INTERMEDIACAO DE BENS MOVEIS, NAO ABRANGI",
    "servico": "06298", "tes": "1A4", "conta": "CONSULTAR", "vencimento": "CONSULTAR", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "Q.I. INFORMATICA", "fornecedor": "799957", "descricao": "REPRESENTACAO DE QUALQUER NATUREZA, INCL COMERCIAL",
    "servico": "10.09", "tes": "1A4", "conta": "317219", "vencimento": "2 DIAS UTEIS", "municipio": "FRANCA", "nfts": "SIM",
    "simplesNacional": "SIM", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "SOLICITADO",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "QSDOBRASIL INFORMATICA LTDA", "fornecedor": "INPS1H", "descricao": "ELABORACAO DE PROGRAMA DE COMPUTADOR (SOTTWARE)",
    "servico": "02692", "tes": "1A4", "conta": "RATEIO + FINAL 213", "vencimento": "CONFORME BOLETO", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "SIM", "pcc": "SIM", "inss": "NÃO", "codIr": "1708", "codPcc": "5952", "email": "OK",
    "autenticidadeUrl": "https://nfe.prefeitura.sp.gov.br/publico/verificacao.aspx"
  },
  {
    "empresa": "MATRIZ", "nome": "RF PETRI INFORMATICA", "fornecedor": "INPSHO", "descricao": "REPRESENTACAO DE QUALQUER NATUREZA, INCL COMERCIAL",
    "servico": "10.09", "tes": "1A4", "conta": "317219", "vencimento": "2 DIAS UTEIS", "municipio": "CARAPICUIBA", "nfts": "SIM",
    "simplesNacional": "SIM", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "SOLICITADO",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "ROSA IARA", "fornecedor": "799989", "descricao": "TRANSPORTE DE BENS OU VALORES, DENTRO DO TERRITORIO DO MUNICIPIO",
    "servico": "02447", "tes": "1A4", "conta": "CONSULTAR", "vencimento": "CONSULTAR", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "SAIDATA TECNOLOGIA E AUTOMACAO LTDA", "fornecedor": "800569", "descricao": "SERVICO S/ RETENCAO",
    "servico": "8884", "tes": "1A4", "conta": "CONSULTAR", "vencimento": "CONSULTAR", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "SAN HARDWARE COMERCIO", "fornecedor": "799576", "descricao": "REPRESENTACAO DE QUALQUER NATUREZA, INCL COMERCIAL",
    "servico": "06009", "tes": "1A4", "conta": "317219", "vencimento": "2 DIAS UTEIS", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "SOLICITADO",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "SCANSOURCE DO BRASIL", "fornecedor": "800010", "descricao": "MANUT DE EPTO P INFOR E AUT",
    "servico": "07498", "tes": "1A4", "conta": "CONSULTAR", "vencimento": "CONSULTAR", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "SERASA S.A", "fornecedor": "800056", "descricao": "ASSESSORIA OU CONSULT DE QUALQUER NATUREZA",
    "servico": "03115", "tes": "1A4", "conta": "311213", "vencimento": "CONSULTAR", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "SIM", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "5952", "email": "",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "SERGIO PASQUAL", "fornecedor": "797983", "descricao": "CONSERTO, RESTAURACAO, MANUTENCAO E CONSERVACAO DE MAQUINAS",
    "servico": "07498", "tes": "1A4", "conta": "CONSULTAR", "vencimento": "CONSULTAR", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "SLADATA SUPORTE", "fornecedor": "INPSEZ", "descricao": "REPRESENTACAO DE QUALQUER NATUREZA, INCL COMERCIAL",
    "servico": "10.09", "tes": "1A4", "conta": "317219", "vencimento": "2 DIAS UTEIS", "municipio": "VITORIA", "nfts": "SIM",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "SIM", "pcc": "NÃO", "inss": "NÃO", "codIr": "8045", "codPcc": "-", "email": "SOLICITADO",
    "autenticidadeUrl": "https://nfse.vitoria.es.gov.br/aberto/formAutenticacao.cfm"
  },
  {
    "empresa": "MATRIZ", "nome": "STANDARD AUDIVISUAIS", "fornecedor": "INPSHR", "descricao": "SUPORTE TECNICO, INSTAL, CONFIG, E MANUT DE PROGRAMAS",
    "servico": "1.07", "tes": "1A4", "conta": "313213", "vencimento": "CONFORME BOLETO", "municipio": "FLORIANOPOLIS", "nfts": "SIM",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "SWITCH SERVICOS ELETRONICOS LTDA EPP", "fornecedor": "STATEL", "descricao": "REPRESENTACAO DE QUALQUER NATUREZA, INCL COMERCIAL",
    "servico": "10.09", "tes": "1A4", "conta": "317219", "vencimento": "2 DIAS UTEIS", "municipio": "SÃO CAETANO", "nfts": "SIM",
    "simplesNacional": "SIM", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "SOLICITADO",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "TDF 1 ASSESSORIA CONTABIL SOCIEDADE SIMPLES LTDA", "fornecedor": "800548", "descricao": "CONTABILIDADE, INCLUSIVE SERVICOS TECNICOS E AUXILIARES",
    "servico": "17.19", "tes": "1A4", "conta": "311213", "vencimento": "CONFORME BOLETO", "municipio": "PORTO ALEGRE", "nfts": "SIM",
    "simplesNacional": "SIM", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "EQUIPA2", "nome": "TDF 2 ASSESSORIA CONTABIL SOCIEDADE SIMPLES LTDA", "fornecedor": "800477", "descricao": "CONTABILIDADE, INCLUSIVE SERVICOS TECNICOS E AUXILIARES",
    "servico": "17.19", "tes": "1A4", "conta": "316213", "vencimento": "CONFORME BOLETO", "municipio": "PORTO ALEGRE", "nfts": "SIM",
    "simplesNacional": "SIM", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "TECH BRASIL INFORMATICA LTDA ME", "fornecedor": "800395", "descricao": "REPRESENTACAO DE QUALQUER NATUREZA, INCL COMERCIAL",
    "servico": "10.09", "tes": "1A4", "conta": "317219", "vencimento": "2 DIAS UTEIS", "municipio": "LONDRINA", "nfts": "SIM",
    "simplesNacional": "SIM", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "SOLICITADO",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "TECNOSYS INFORMATICA", "fornecedor": "800556", "descricao": "REPRESENTACAO DE QUALQUER NATUREZA, INCL COMERCIAL",
    "servico": "10.09", "tes": "1A4", "conta": "317219", "vencimento": "2 DIAS UTEIS", "municipio": "BELO HORIZONTE", "nfts": "SIM",
    "simplesNacional": "SIM", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "SOLICITADO",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "TI PARTNER", "fornecedor": "800528", "descricao": "REPRESENTACAO DE QUALQUER NATUREZA, INCL COMERCIAL",
    "servico": "06009", "tes": "1A4", "conta": "317219", "vencimento": "2 DIAS UTEIS", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "SOLICITADO",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "TICKET SERVICOS SA", "fornecedor": "INPS7Q", "descricao": "FORNECIMENTO E ADM DE VALES",
    "servico": "03205", "tes": "1A4", "conta": "102701000000013", "vencimento": "PGTO ANTEC. (A VISTA)", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": "https://nfe.prefeitura.sp.gov.br/publico/verificacao.aspx"
  },
  {
    "empresa": "MATRIZ", "nome": "TOTVS BH", "fornecedor": "797993", "descricao": "SUPORTE TECNICO, INSTAL, CONFIG, E MANUT DE PROGRAMAS",
    "servico": "1.07", "tes": "1A4", "conta": "RATEIO+FINAL 213", "vencimento": "CONFORME BOLETO", "municipio": "BELO HORIZONTE", "nfts": "SIM",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "",
    "autenticidadeUrl": "https://bhissdigital.pbh.gov.br/nfse/pages/consultaNFS-e_cidadao_creditoIPTU.jsf"
  },
  {
    "empresa": "MATRIZ", "nome": "TOTVS S/A", "fornecedor": "797951", "descricao": "LICENCIAMENTO OU CESSAO DE DIREITO DE USO DE PROGRAMAS DE COMPUTACAO",
    "servico": "02800", "tes": "1A4", "conta": "RATEIO", "vencimento": "CONFORME BOLETO", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": "https://nfe.prefeitura.sp.gov.br/publico/verificacao.aspx"
  },
  {
    "empresa": "SERRA", "nome": "UNICON SERVICOS CONTABEIS", "fornecedor": "799202", "descricao": "SERVIÇOS CONTABEIS",
    "servico": "03476", "tes": "398", "conta": "318213", "vencimento": "CONFORME BOLETO", "municipio": "VITORIA", "nfts": "NÃO",
    "simplesNacional": "SIM", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "SOLICITADO",
    "autenticidadeUrl": "https://nfse.vitoria.es.gov.br/aberto/formAutenticacao.cfm"
  },
  {
    "empresa": "MATRIZ", "nome": "VB-SERVICOS COMERCIO E ADMINSTRACAO LTDA", "fornecedor": "799539", "descricao": "FORNECIMENTO E ADM DE VALE REFEICAO",
    "servico": "03205", "tes": "1A4", "conta": "102701000000013", "vencimento": "PGTO ANTEC. (A VISTA)", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "SIM", "pcc": "NÃO", "inss": "NÃO", "codIr": "1708", "codPcc": "5952", "email": "OK",
    "autenticidadeUrl": "https://nfe.prefeitura.sp.gov.br/publico/verificacao.aspx"
  },
  {
    "empresa": "MATRIZ", "nome": "VB-SERVICOS COMERCIO E ADMINSTRACAO LTDA", "fornecedor": "799539", "descricao": "SERVICO S/ RETENCAO",
    "servico": "8884", "tes": "265", "conta": "102701000000013", "vencimento": "PGTO ANTEC. (A VISTA)", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": "-"
  },
  {
    "empresa": "MATRIZ", "nome": "VECTORSUPRI COMERCIAL", "fornecedor": "INPSCI", "descricao": "REPRESENTACAO DE QUALQUER NATUREZA, INCL COMERCIAL",
    "servico": "06009", "tes": "1A4", "conta": "317219", "vencimento": "2 DIAS UTEIS", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "SOLICITADO",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "VICENTE DE P ARSENES ESTACIONAMENTO", "fornecedor": "STATG6", "descricao": "GUARDA E ESTACIONAMENTO DE VEICULOS TERRESTRES AUTOMOTORES, DE AERONA",
    "servico": "07811", "tes": "1A4", "conta": "311213", "vencimento": "CONSULTAR", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "",
    "autenticidadeUrl": ""
  },
  {
    "empresa": "MATRIZ", "nome": "VIVO", "fornecedor": "798037", "descricao": "AQUISIÇÃO DE SERVIÇO DE COMUNICAÇÃO",
    "servico": "9999", "tes": "137", "conta": "RATEIO + FINAL 202", "vencimento": "CONFORME NOTA", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "-", "ir": "-", "pcc": "-", "inss": "-", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": "-"
  },
  {
    "empresa": "MATRIZ", "nome": "VR TICKET SERVICOS SA", "fornecedor": "INPS7Q", "descricao": "SERVICO S/ RETENCAO",
    "servico": "8884", "tes": "265", "conta": "102701000000012", "vencimento": "PGTO ANTEC. (A VISTA)", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": "-"
  },
  {
    "empresa": "MATRIZ", "nome": "VT TICKET SERVICOS SA", "fornecedor": "INPS7Q", "descricao": "SERVICO S/ RETENCAO",
    "servico": "8884", "tes": "265", "conta": "102701000000013", "vencimento": "PGTO ANTEC. (A VISTA)", "municipio": "SP", "nfts": "NÃO",
    "simplesNacional": "NÃO", "iss": "NÃO", "ir": "NÃO", "pcc": "NÃO", "inss": "NÃO", "codIr": "-", "codPcc": "-", "email": "OK",
    "autenticidadeUrl": "-"
  },
  {
    "empresa": "MATRIZ", "nome": "VTEX BRASIL TECNOLOGIA PARA E-COMMERCE LTDA", "fornecedor": "INPS81", "descricao": "LICENCIAMENTO OU CESSAO DE DIREITO DE USO DE PROGRAMAS DE COMPUTACAO",
    "servico": "02800", "tes": "1A4", "conta": "CONSULTAR", "vencimento": "CONSULTAR", "municipio": "CONSULTAR", "nfts": "SIM",
    "simplesNacional": "", "iss": "", "ir": "", "pcc": "", "inss": "", "codIr": "", "codPcc": "", "email": "",
    "autenticidadeUrl": ""
  }
];
