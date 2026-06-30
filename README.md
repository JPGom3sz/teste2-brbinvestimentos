# BRB Investimentos — Site Institucional

Site institucional da BRB Investimentos, com captação de leads via newsletter e popup, banner de consentimento de cookies (LGPD) e cotações de mercado em tempo real.

🔗 Deploy: https://brbinvestimentos.vercel.app/

---

## 📁 Estrutura do projeto

```
/
├── index.html                         # Página inicial
├── README.md
│
├── css/
│   ├── global.css                     # Estilos globais (tipografia, cores, reset, componentes base)
│   ├── style.css                      # Estilos gerais compartilhados
│   ├── assessores.css
│   ├── contato.css
│   ├── cookies.css
│   ├── newsletter.css
│   ├── popup.css
│   ├── sobrenos.css
│   ├── tutoriais.css
│   ├── produtos-base.css              # Base de estilo compartilhada pelas páginas de produtos
│   ├── produtos-educativo.css
│   ├── renda-fixa.css
│   ├── renda-variavel.css
│   ├── previdencia.css
│   ├── mercado-futuro.css
│   ├── tesouro-direto.css
│   ├── fundos.css
│   ├── fundos-informativos.css
│   ├── style-enhance-assessores.css
│   └── fonts/                         # Fontes locais (se houver)
│
├── js/
│   ├── script.js                      # Lógica geral do site (header, menu, carrossel, cotações etc.)
│   ├── newsletter.js                  # Formulário de newsletter
│   ├── popup.js                       # Popup de captação de leads
│   └── cookies.js                     # Banner de consentimento de cookies (LGPD)
│
├── institucional/
│   ├── assessores.html
│   ├── contato.html
│   ├── guias-praticos.html
│   ├── newsletter.html
│   ├── popup-snippet.html
│   ├── siteemconstrução.html
│   └── sobrenos.html
│
├── produtos/
│   ├── fundos.html
│   ├── mercado-futuro.html
│   ├── previdencia.html
│   ├── renda-fixa.html
│   ├── renda-variavel.html
│   └── tesouro-direto.html
│
├── fundos-tipos/
│   ├── fundos-acoes.html
│   ├── fundos-estruturados.html
│   ├── fundos-multimercado.html
│   ├── fundos-plataforma.html
│   ├── fundos-renda-fixa-simples.html
│   ├── fundos-renda-fixa.html
│   └── fundos-todos.html
│
├── img/                                # Imagens e ícones
├── videos/                             # Vídeos institucionais/educativos
└── pdfs/                               # Documentos (Política de Privacidade, regulamentos, etc.)
    ├── pdfs-assembleias/
    ├── pdfs-demonstrações-finan-fundos/
    ├── pdfs-fundos/
    ├── pdfs-historicos-de-rentabilidade/
    ├── pdfs-informes-mensais/
    ├── pdfs-regulamento-fundos/
    └── pdfs-regulatorios-fundos/
```

### Páginas HTML desenvolvidas

O site é dividido em três grandes grupos de páginas, além da `index.html`:

**Institucionais** (`/institucional`) — páginas de relacionamento e suporte ao usuário:
- `assessores.html` — apresentação da equipe/ e procedimentos pra ser assessorado na brb investimentos;
- `contato.html` — canal de contato com a BRB Investimentos;
- `guias-praticos.html` — conteúdo educativo para investidores;
- `newsletter.html` — página dedicada ao formulário de inscrição na newsletter (`newsletter.js`);
- `popup-snippet.html` — versão isolada/teste do popup de captação de leads, usada para ajustes de layout sem depender do site inteiro;
- `sobrenos.html` — institucional "Sobre nós", com sistema de abas (tabs) controlado em `script.js`;
- `siteemconstrução.html` — página de fallback para seções ainda não finalizadas.

**Produtos** (`/produtos`) — uma página por categoria de investimento, todas compartilhando `produtos-base.css` e `produtos-educativo.css` como base visual:
- `renda-fixa.html`, `renda-variavel.html`, `previdencia.html`, `mercado-futuro.html`, `tesouro-direto.html`, `fundos.html`.

**Fundos** (`/fundos-tipos`) — desdobramento da página `fundos.html`, detalhando cada tipo de fundo oferecido:
- `fundos-acoes.html`, `fundos-multimercado.html`, `fundos-estruturados.html`, `fundos-renda-fixa.html`, `fundos-renda-fixa-simples.html`, `fundos-plataforma.html` e `fundos-todos.html` (visão geral/listagem de todos os fundos).

Cada página de produto/fundo segue o mesmo padrão de cabeçalho, ticker de cotações e rodapé carregados de `script.js`, `cookies.js` e `popup.js` (componentes globais presentes em todas as páginas do site), mantendo consistência visual e de captação de leads em todo o site.

---

##  Tecnologias utilizadas

O projeto foi construído com **HTML5, CSS3 e JavaScript puro (Vanilla JS)**, sem frameworks ou bibliotecas externas no front-end. Essa escolha foi feita por:

- Simplicidade de manutenção e hospedagem (não exige build/bundler);
- Leveza e bom desempenho (sem overhead de framework);
- Facilidade de deploy estático (atualmente hospedado na Vercel).
- Facilidade ao importar o site para a ferramenta WordPress

### Integrações externas em uso

| Serviço | Onde é usado | Finalidade |
|---|---|---|
| **Google Apps Script (Web App)** | `newsletter.js`, `popup.js`, `cookies.js` | Recebe os dados via `fetch` (POST) e grava em uma planilha do **Google Sheets**, funcionando como um back-end leve/serverless |
| **AwesomeAPI** (`economia.awesomeapi.com.br`) | `script.js` | Cotações de USD, EUR, BTC em tempo real (ticker do topo do site) |
| **API do Banco Central (BCB/SGS)** | `script.js` | Indicador de taxa Selic |
| **ipify** (`api.ipify.org`) | `cookies.js` | Captura o IP público do visitante no momento do consentimento de cookies |
| **Google Fonts** | `index.html` | Fonte Montserrat |

> Todas as requisições para o Google Apps Script usam `mode: 'no-cors'`, o que é necessário porque o Apps Script não retorna headers CORS configuráveis. Isso significa que **o front-end não consegue ler a resposta** (sucesso/erro) — o envio é "fire and forget". Por isso, os formulários assumem sucesso visualmente assim que o `fetch` é disparado, mesmo sem confirmação real do servidor.

### Tecnologias que podem ser usadas no futuro (conforme demanda)

Conforme o projeto crescer, algumas evoluções fazem sentido dependendo da necessidade:

- **Back-end próprio (Node.js + Express, ou similar)**: caso o Google Apps Script se torne um gargalo (limites de cota, falta de validação server-side, necessidade de resposta confirmada ao usuário).
- **Banco de dados real (PostgreSQL, MySQL, Firebase, Supabase)**: caso o volume de leads do Google Sheets cresça demais ou seja necessário cruzar dados, criar dashboards, etc.
- **Framework front-end (React, Vue ou similar)**: se o site evoluir para uma área logada/autenticada com mais interatividade (ex: painel do investidor).
- **TypeScript**: para reduzir bugs à medida que os arquivos JS crescem em complexidade.
- **Bundler (Vite, Webpack)**: caso o número de arquivos JS/CSS justifique otimização, minificação e organização em módulos.
- **Serviço de e-mail transacional (SendGrid, Resend, Amazon SES)**: para enviar e-mails de confirmação automática aos leads cadastrados.
- **Plataforma de CRM/Marketing (RD Station, Mailchimp, HubSpot)**: caso a captação de leads precise de automações mais robustas (fluxos de nutrição, segmentação avançada).
- **Service Worker / PWA**: se houver demanda por funcionamento offline ou instalação como app.

A escolha de qualquer uma dessas tecnologias deve ser avaliada conforme a demanda e necessidade da BRB Investimentos, evitando complexidade desnecessária enquanto o site funciona bem como está.

---

##  Newsletter (`newsletter.js`)

Formulário de inscrição na newsletter, presente na página `institucional/newsletter.html`.

**Campos:** nome, e-mail, telefone (opcional, com máscara automática), e dois checkboxes de interesse (Análises BRB / Carteiras Recomendadas) + checkbox obrigatório de política de privacidade.

**Regras de validação:**
- Nome e e-mail são obrigatórios (e-mail validado via `checkValidity()` do HTML5);
- Telefone, se preenchido, também precisa ser válido;
- O checkbox de **privacidade é obrigatório**;
- É necessário marcar **ao menos 1 tema de interesse** além da privacidade (mínimo de 2 checkboxes no total).

**Fluxo de envio:**
1. Valida os campos no front-end, exibindo mensagens de erro inline por campo;
2. Monta um objeto `lead` com `origem: 'newsletter'`, dados do usuário, temas escolhidos e a URL da página de origem;
3. Envia via `fetch` (POST, `no-cors`) para o Google Apps Script, que grava a linha na planilha do Google Sheets;
4. Exibe mensagem de sucesso e oculta o formulário.

---

##  Popup de captação de leads (`popup.js`)

Popup exibido em todas as páginas do site, com objetivo de captar leads gerais (nome, e-mail e telefone).

**Regras de exibição:**
- Aparece automaticamente após **1 segundo** de carregamento da página;
- Também é disparado por **exit intent** (quando o mouse sai pela borda superior da tela, sinalizando que o usuário pode estar saindo do site);
- Se o usuário já preencheu o formulário com sucesso, o popup **não aparece mais** (`localStorage` com a chave `brb_popup_done`);
- Se o usuário fechou sem preencher, o popup tem um **cooldown de 3 dias** antes de aparecer novamente (`localStorage` com a chave `brb_popup_shown`).

**Validações:** nome completo (mínimo 2 caracteres), e-mail (regex), telefone (mínimo 10 dígitos, com máscara automática `(00) 00000-0000`), e aceite obrigatório da Política de Privacidade (LGPD).

**Fluxo de envio:** idêntico ao da newsletter — `fetch` POST `no-cors` para o mesmo Web App do Google Apps Script, com `origem: 'popup'`. Após o envio, o formulário é substituído pela mensagem de sucesso e o popup fecha automaticamente após 4 segundos.

---

##  Cookies / Banner LGPD (`cookies.js`)

Banner de consentimento de cookies, exibido **4 segundos** após o carregamento, apenas para visitantes que ainda não deram consentimento (ou cuja versão da política mudou).

**Armazenamento local (temporário, no navegador do usuário):**
- A decisão do usuário (aceito/recusado), as categorias escolhidas e a versão da política são salvas no `localStorage`, sob a chave `brb_cookie_consent`;
- Esse armazenamento é o que torna a escolha "lembrada" — o banner não reaparece enquanto a versão da política (`policyVersion`) não mudar;
- Por ser `localStorage`, os dados são **locais ao navegador/dispositivo** do usuário (não é um cookie de sessão de servidor) e persistem até serem apagados manualmente ou pela troca de versão da política.

**Categorias de cookies:**
- **Necessários** — sempre ativos, não podem ser desmarcados;
- **Analíticos** — opcional;
- **Marketing** — opcional.

**Registro de consentimento (auditoria/LGPD):**
Ao aceitar ou recusar, o sistema:
1. Busca o IP público do visitante via API da ipify;
2. Monta um payload com data/hora (fuso de São Paulo), IP, decisão, categorias escolhidas, versão da política e página de origem;
3. Envia via `fetch` POST `no-cors` para o mesmo Google Apps Script, registrando o consentimento na planilha — isso serve como **comprovação de consentimento** exigida pela LGPD.

>  Observação técnica: como o IP é obtido via `localStorage`/chamada de API pública e o registro de consentimento depende de rede, em caso de falha de conexão o consentimento ainda é salvo localmente (`localStorage`), mas pode não ser registrado na planilha. Vale considerar uma fila de reenvio futuramente.

---

##  Como configurar o endpoint do Google Apps Script

Os três arquivos (`newsletter.js`, `popup.js`, `cookies.js`) apontam para a mesma constante `SCRIPT_URL`/`CONFIG.SCRIPT_URL`, que é a URL de implantação (deploy) do Google Apps Script vinculado à planilha de leads.

Caso seja necessário trocar a planilha ou reimplantar o script:
1. Publicar o Apps Script como **Web App** (Implantar → Nova implantação → Aplicativo da Web), com acesso "qualquer pessoa";
2. Copiar a nova URL gerada;
3. Substituir o valor de `SCRIPT_URL` nos três arquivos JS.

---

##  Pontos de atenção / débitos técnicos conhecidos

- O uso de `mode: 'no-cors'` impede a confirmação real de sucesso do envio — o front-end sempre mostra "sucesso" mesmo se o Apps Script falhar silenciosamente;
- Não há validação server-side dos dados (toda validação está no front-end, podendo ser burlada);
- O Google Sheets como banco de dados tem limite de linhas/performance — vale reavaliar para um banco real se o volume de leads crescer muito;


---

##  Autor João Pedro Gomes Barreto

Projeto desenvolvido para BRB Investimentos.
