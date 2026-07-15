# Paysage Lorena — Leads do formulário → Google Sheets

Passo a passo para os leads do formulário da LP caírem numa **planilha do Google
só do Paysage** (separada dos outros meios). Feito uma vez, na conta Google de vocês.

## 1. Criar a planilha
1. Acesse https://sheets.google.com e crie uma planilha nova.
2. Dê o nome, ex.: **Paysage Lorena — Leads**.

## 2. Colar o script
1. Na planilha: menu **Extensões → Apps Script**.
2. Apague qualquer código de exemplo e **cole todo o conteúdo de `Code.gs`**
   (que está nesta mesma pasta).
3. Clique em **Salvar** (ícone de disquete).

## 3. Publicar como App da Web
1. No Apps Script, clique em **Implantar → Nova implantação**.
2. Em "Selecionar tipo" (engrenagem), escolha **App da Web**.
3. Configure:
   - **Executar como:** Eu (sua conta)
   - **Quem pode acessar:** **Qualquer pessoa**
4. Clique **Implantar** e **autorize** o acesso quando pedir
   (é normal aparecer o aviso "Google não verificou o app" → *Avançado → Acessar (não seguro)* → *Permitir*).
5. Copie a **URL do app da Web** — termina em **`/exec`**.

## 4. Ligar no site
Abra `assets/js/main.js` e cole a URL na linha:

```js
var LEAD_ENDPOINT = 'https://script.google.com/macros/s/AKfycb.....a.../exec';
```

Salve e publique o site. Pronto: cada envio do formulário cria uma nova linha na aba **Leads**
com Data/Hora, Nome, E-mail, Telefone, Tipologia, Mensagem e Origem.

> O WhatsApp continua abrindo normalmente após o envio — a planilha é uma captura
> paralela, então nenhum lead se perde mesmo se a pessoa não concluir no WhatsApp.

## Testar
- Abra a URL `/exec` no navegador: deve responder `{"ok":true,"service":"paysage-leads"}`.
- Depois de ligar no site, envie um lead de teste pelo formulário e confira a aba **Leads**.

## Atualizações do script
Se um dia editar o `Code.gs`, use **Implantar → Gerenciar implantações → (lápis) →
Nova versão** para republicar **mantendo a mesma URL** `/exec`.
