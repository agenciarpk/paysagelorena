# Paysage Lorena — Landing Page

Landing page do lançamento **Paysage Lorena** (Teixeira Pinto Construtora), construída a partir do
*Book de corretores v13* e com referência de conteúdo/botões em `auraaparecida.com.br`.

Site estático, sem build e sem dependências externas em runtime (fontes e imagens auto-hospedadas).

## Como visualizar

```bash
cd site
python3 -m http.server 8000
# abra http://localhost:8000
```

Ou suba a pasta `site/` em qualquer hospedagem estática (Vercel, Netlify, S3, Hostinger, etc.).

## Estrutura

```
site/
├── index.html              # página completa (uma seção por âncora do menu)
├── README.md
└── assets/
    ├── css/styles.css      # design system + responsivo
    ├── js/main.js          # header, menu, reveal, tabs, lightbox, formulário
    ├── fonts/              # DasluDisplay, Gotham, Cormorant Garamond (woff2 auto-hospedado)
    └── img/                # imagens .webp otimizadas + logos + favicon/og
```

### Seções (na ordem)
Hero · Manifesto/Conceito · O Empreendimento (ficha técnica) · Localização (POIs) ·
Lazer (galeria + lightbox) · Plantas/Tipologias (abas) · Diferenciais (Facilites) ·
Construtora · Contato (formulário + WhatsApp) · Rodapé. Botão flutuante de WhatsApp.

## Identidade visual
- **Cores:** taupe `#A69788` (primária), ivory `#F4F1EC`/`#FAF8F4`, carvão quente `#3A332C`.
- **Tipografia:** DasluDisplay (títulos em caixa-alta / logo) · Gotham Medium (labels, menu, botões) ·
  Cormorant Garamond (corpo de texto, serifada editorial).

## ⚠️ Itens para confirmar / personalizar antes de publicar
1. **WhatsApp comercial** — está usando `(12) 99789-7215` / `wa.me/5512997897215` (mesmo da Aura).
   Trocar pelo número do time comercial do Paysage, se for diferente. Ajustar em:
   `assets/js/main.js` (`WHATS_NUMBER`) e nos links `wa.me` do `index.html`.
2. **Integração do formulário (CRM)** — o envio já: (a) salva o lead em `localStorage` como salvaguarda,
   (b) tem um ponto único de configuração `LEAD_ENDPOINT` em `main.js` para POST a um CRM/RD Station/serverless,
   e (c) faz o handoff via WhatsApp já preenchido (com fallback clicável se o popup for bloqueado).
   **Defina `LEAD_ENDPOINT`** para registrar os leads num backend/inbox antes de publicar.
3. **Endereço** — o book diverge: ficha técnica diz "Oswaldo Aranha", texto de localização diz "Osvaldo Aranha".
   Usamos "Oswaldo Aranha" (como na ficha técnica oficial). **Confirmar a grafia correta** — afeta texto,
   schema.org e o link "Ver no mapa".
4. **Planta de implantação** — a página de "Implantação Lazer" do book v13 está sem o desenho (placeholder).
   Quando o material chegar, adicionar em uma figura na seção Lazer ou Localização. Hoje usamos a foto aérea.
5. **Política de Privacidade (LGPD)** — página real criada em `privacidade.html` e linkada no formulário/rodapé.
   **Preencher** razão social completa, CNPJ, endereço do controlador e e-mail do Encarregado/DPO (ver nota na página).
6. **Instagram** — link aponta para `instagram.com/teixeirapintoconstrutora`; confirmar o handle/perfil do Paysage.
7. **Domínio/OG** — URLs canônicas/OG/Twitter usam `https://www.paysagelorena.com.br/`. Ajustar se mudar.

## ✔️ Qualidade
Passou por **duas rodadas de revisão multi-agente**:

**Rodada 1 — código/conteúdo (34 correções):** contraste WCAG AA (taupe acessível `#776857`),
`<main>`/skip-link, abas WAI-ARIA, lightbox com foco-trap, menu mobile com Esc, `aria-invalid`,
remoção de "duplex" (não consta no book), POIs completos, render de terraço no rooftop, `<picture>`
mobile, OG/Twitter absolutos, JSON-LD `@graph`.

**Rodada 2 — QA visual multi-dispositivo (25 correções)**, auditado em 320/360/390/414/768/1024/1440/1920px:
- **Menu mobile** agora cobre 100% da tela (corrigido o *containing-block* do `backdrop-filter`) e oculta o float.
- **Header** vira drawer já em ≤1080px (antes o CTA "Agende sua visita" era cortado entre ~861–1080px).
- **Reveals** com fallback sem-JS (classe `.js`) — conteúdo visível para crawlers/print mesmo sem JavaScript.
- **Botão WhatsApp flutuante** menor no mobile, com `safe-area`, e some sobre Contato/Rodapé (que já têm CTA próprio).
- **Facilites** com grid flexível centralizado (sem célula órfã no tablet; 2 colunas uniformes no mobile).
- **Legibilidade do hero** reforçada (overlay + sombras), legendas da galeria sempre visíveis no toque,
  alvos de toque ≥44px, títulos sem "órfãs" no mobile, logo da construtora sem corte, nota de Memorial
  Descritivo nas plantas.

**Seção interativa:** os números da ficha técnica (96, 19, 147, 03, 01, 2.250 m²) animam com *count-up* ao
entrar na tela (respeitando `prefers-reduced-motion`), somando-se às interações já existentes
(abas de plantas, galeria com lightbox, menu, animações de scroll).

> Sobre **Remotion**: é uma ferramenta para gerar *vídeo* por código (MP4/WebM), não seções web interativas —
> exigiria um pipeline Node/React e um vídeo embutido (peso extra no mobile). Por isso a interatividade foi
> feita de forma nativa (mais leve e responsiva). Se quiserem, posso produzir à parte um vídeo-manifesto curto
> da marca com Remotion para o hero/Instagram.

> Observação de conteúdo: o rótulo **"Facilites"** foi mantido exatamente como no book (pág. 74). Há também
> renders de uma tipologia **"APTO 152 – Garden"** no pack que **não aparecem no book v13** — não incluída;
> confirmar se é uma tipologia real do Paysage.

## Notas
- Todas as imagens são perspectivas artísticas (aviso legal já no rodapé).
- Imagens convertidas para WebP (compatível com todos os navegadores atuais).
- Acessível: navegação por teclado, ARIA em abas/lightbox/menu, respeito a `prefers-reduced-motion`.
