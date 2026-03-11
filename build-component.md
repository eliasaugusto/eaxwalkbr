# Build Component Guide

Este guia mostra o passo a passo para criar um novo componente (bloco) neste projeto AEM XWalk/Edge Delivery.

## 1) Pre requisitos

- Node.js instalado (versao compativel com o projeto)
- Dependencias instaladas:

```sh
npm i
```

## 2) Entenda a arquitetura de componentes

Neste projeto, um componente de bloco normalmente tem 3 partes:

- `blocks/<nome>/<nome>.js`: logica de decoracao do bloco
- `blocks/<nome>/<nome>.css`: estilos do bloco
- `blocks/<nome>/_<nome>.json`: definicao para authoring (definitions/models/filters)

Os JSON agregadores sao gerados por build:

- `component-definition.json`
- `component-models.json`
- `component-filters.json`

Importante: prefira editar os fontes em `blocks/*/_*.json` e `models/*`. Depois rode `npm run build:json`.

## 3) Criar a pasta do novo bloco

Exemplo de bloco chamado `testimonial`:

```text
blocks/
  testimonial/
    _testimonial.json
    testimonial.css
    testimonial.js
```

## 4) Criar o JS do bloco

Crie `blocks/testimonial/testimonial.js` com um `decorate(block)`.

Exemplo inicial:

```js
export default function decorate(block) {
  const rows = [...block.children];
  const ul = document.createElement('ul');

  rows.forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    ul.append(li);
  });

  block.replaceChildren(ul);
}
```

## 5) Criar o CSS do bloco

Crie `blocks/testimonial/testimonial.css`.

Exemplo inicial:

```css
.testimonial > ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 16px;
}

.testimonial > ul > li {
  border: 1px solid #dadada;
  padding: 16px;
  background: var(--background-color);
}
```

## 6) Criar o _json de authoring

Crie `blocks/testimonial/_testimonial.json` com:

- `definitions`: como o componente aparece na paleta do editor
- `models`: campos editaveis
- `filters`: composicao interna (opcional)

Exemplo:

```json
{
  "definitions": [
    {
      "title": "Testimonial",
      "id": "testimonial",
      "plugins": {
        "xwalk": {
          "page": {
            "resourceType": "core/franklin/components/block/v1/block",
            "template": {
              "name": "Testimonial",
              "model": "testimonial"
            }
          }
        }
      }
    }
  ],
  "models": [
    {
      "id": "testimonial",
      "fields": [
        {
          "component": "text",
          "name": "author",
          "label": "Author",
          "valueType": "string"
        },
        {
          "component": "richtext",
          "name": "quote",
          "label": "Quote",
          "valueType": "string",
          "value": ""
        }
      ]
    }
  ],
  "filters": []
}
```

## 7) Gerar JSON consolidado

Rode:

```sh
npm run build:json
```

Isso atualiza automaticamente:

- `component-definition.json`
- `component-models.json`
- `component-filters.json`

## 8) Validar codigo

Rode lint:

```sh
npm run lint
```

Se quiser auto-fix:

```sh
npm run lint:fix
```

## 9) Testar no ambiente local/preview

Fluxo recomendado:

1. Subir/proxy local conforme processo do projeto (AEM CLI).
2. Abrir a pagina com Sidekick/preview.
3. Inserir o bloco no authoring.
4. Preencher campos do model.
5. Validar renderizacao, responsividade e acessibilidade.

## 10) Checklist rapido

- Pasta do bloco criada em `blocks/<nome>`
- JS com `export default function decorate(block)`
- CSS com namespace `. <nome>` (ex.: `.testimonial`)
- `_nome.json` com `definitions/models/filters`
- `npm run build:json` executado
- `npm run lint` sem erros
- Bloco aparece no editor e renderiza corretamente

## Erros comuns

- Editar direto os arquivos `component-*.json` e perder alteracoes no proximo build.
- Esquecer `build:json` e nao ver o componente no editor.
- Definir `id` diferente entre `definitions` e `models`.
- Usar estrutura HTML no JS sem considerar o markup gerado pelo authoring.
- Nao usar classes com namespace do bloco e causar conflito de estilo.

---

Se quiser, o proximo passo pode ser criar um bloco real (ex.: `testimonial`) com JS/CSS/_JSON prontos neste repositorio.