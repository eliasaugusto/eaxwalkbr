# Skill Definitions

Este documento descreve as skills instaladas neste repositório, com foco prático de uso no fluxo de desenvolvimento AEM Edge Delivery Services.

## Visao Geral

| Skill | Objetivo Principal | Momento de Uso |
|---|---|---|
| content-driven-development | Orquestrar o processo completo CDD | Inicio e condução de qualquer mudança de codigo |
| analyze-and-plan | Analisar requisitos e definir criterios de aceite | Etapa 2 do CDD |
| content-modeling | Modelar estrutura de conteudo amigavel para autores | Etapa 3 do CDD |
| building-blocks | Implementar blocos e ajustes de core | Etapa 5 do CDD |
| testing-blocks | Validar funcionalmente e tecnicamente no navegador | Durante/final da Etapa 5 e antes de PR |
| code-review | Fazer auto-review ou review de PR com checklist EDS | Entre implementacao e commit, ou em PR aberto |

## 1) content-driven-development

Fonte: .agents/skills/content-driven-development/SKILL.md

### Finalidade
Orquestra todo o fluxo Content Driven Development. A regra central e: nao comecar codigo sem antes identificar/criar conteudo real para teste.

### Quando usar
Usar para qualquer alteracao de codigo relevante em EDS:
- Novo bloco
- Alteracao de bloco existente
- Bugfix com impacto funcional
- Mudancas em scripts.js, styles, delayed.js etc.

### Fluxo principal (8 etapas)
1. Start dev server
2. Analyze and plan
3. Design content model
4. Identify/create test content
5. Implement
6. Lint and test
7. Final validation
8. Ship it

### Entradas esperadas
- Descricao da tarefa
- URLs de referencia/design quando houver
- Contexto de negocio e cenarios

### Saidas esperadas
- Execucao guiada ponta a ponta
- Criterios de aceite definidos e validados
- Conteudo de teste pronto
- Mudancas validadas para envio em PR

### Skills relacionadas
- Invoca: analyze-and-plan, content-modeling, building-blocks
- Depende de validacao posterior com testing-blocks e code-review

## 2) analyze-and-plan

Fonte: .agents/skills/analyze-and-plan/SKILL.md

### Finalidade
Transformar pedido em requisitos claros e criterios de aceite verificaveis antes da implementacao.

### Quando usar
Etapa 2 do CDD, especialmente quando ha:
- Designs, screenshots ou URL de referencia
- Mudancas com impacto visual/funcional
- Necessidade de explicitar escopo e regressao

### Processo resumido
1. Analise visual (quando aplicavel)
2. Entendimento de requisitos
3. Definicao de criterios de aceite
4. Documentacao em arquivo de analise

### Artefato gerado
- drafts/tmp/{nome}-analysis.md com contexto, requisitos, criterios e premissas

### Valor principal
- Reduz ambiguidade
- Evita iniciar implementacao sem escopo fechado
- Facilita validacao final na Etapa 7 do CDD

## 3) content-modeling

Fonte: .agents/skills/content-modeling/SKILL.md

### Finalidade
Projetar modelos de conteudo orientados a autores, sem sacrificar previsibilidade tecnica.

### Quando usar
Etapa 3 do CDD, para:
- Novos blocos
- Alteracoes estruturais no authoring
- Revisao de modelo existente

### Principios
- Semantico
- Previsivel
- Reutilizavel

### Regras centrais
- Maximo de 4 celulas por linha
- Preferir semantica (heading, bold, italico) em vez de configuracao excessiva
- Preferir variantes de bloco em vez de celulas de configuracao desnecessarias
- Usar defaults inteligentes para reduzir carga do autor

### Referenciais de modelagem
- Standalone
- Collection
- Configuration (somente quando realmente dinamico)
- Auto-Blocked

### Saida esperada
- Estrutura de bloco documentada
- Explicacao de uso para autores
- Diretrizes de variacao e edge cases

## 4) building-blocks

Fonte: .agents/skills/building-blocks/SKILL.md

### Finalidade
Implementar blocos (JS/CSS) e mudancas de core seguindo padroes de EDS.

### Quando usar
Etapa 5 do CDD, apos:
- Conteudo de teste existir
- Modelo de conteudo estar definido (quando aplicavel)

### Cobertura
- Criacao de novos blocos
- Evolucao de blocos existentes
- Ajustes em scripts.js, styles.css, lazy-styles.css, delayed.js

### Fluxo resumido
1. Buscar blocos semelhantes
2. Criar/modificar estrutura do bloco
3. Implementar decoracao JS
4. Estilizar com CSS escopado e responsivo
5. Invocar testing-blocks para validacao

### Boas praticas destacadas
- Reusar elementos de DOM quando possivel
- Escopo CSS estrito por bloco
- Mobile-first
- Uso de custom properties
- Testar impacto de mudancas de core com cuidado

## 5) testing-blocks

Fonte: .agents/skills/testing-blocks/SKILL.md

### Finalidade
Garantir validacao funcional real em navegador e qualidade tecnica antes de PR.

### Quando usar
Apos implementacao de blocos/core e antes de abrir PR.

### Regra obrigatoria
Browser validation e mandatoria. Nao conclui sem prova de teste em navegador.

### Fluxo resumido
1. Rodar lint e corrigir
2. Validacao em navegador (responsividade, console, comportamento)
3. Decidir se precisa de unit tests
4. Rodar testes existentes e verificar regressao

### Evidencias esperadas
- Screenshots
- Confirmacao de ausencia de erros no console
- Confirmacao de criterios de aceite

### Observacoes de estrategia
- Unit tests sao recomendados para logica reutilizavel/complexa
- Testes de browser podem ser temporarios e orientados a validacao da feature

## 6) code-review

Fonte: .agents/skills/code-review/SKILL.md

### Finalidade
Executar revisao estruturada de qualidade, performance, acessibilidade e seguranca.

### Modos de operacao
1. Self-review
- Uso antes de commit/PR
- Foco em arquivos modificados localmente

2. PR review
- Uso em PR aberto
- Valida estrutura de PR, diff, riscos e corretivos

### O que verifica
- Qualidade JS/CSS/HTML
- Padroes EDS
- Performance (incluindo caminho critico)
- Acessibilidade
- Seguranca
- Evidencias visuais (screenshots)

### Diferencial
No modo PR, enfatiza fixes acionaveis:
- Preferencia por GitHub Suggestions
- Guidance para pontos subjetivos
- Commits corretivos em casos complexos

## Sequencia Recomendada no Repo

1. content-driven-development
2. analyze-and-plan
3. content-modeling (se houver mudanca estrutural)
4. building-blocks
5. testing-blocks
6. code-review
7. Commit e PR

## Nota de Manutencao

Este documento descreve as skills atualmente disponiveis em .agents/skills.
Se novas skills forem adicionadas via CLI, atualize este arquivo para manter o playbook do time consistente.
