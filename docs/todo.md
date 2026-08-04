# Roadmap

Este arquivo reúne a evolução planejada de `@mat-henriqu/masks`. Cada item deve ser
marcado somente quando estiver implementado, validado e documentado na versão indicada.

**Legenda:** `P0` essencial · `P1` importante · `P2` evolução de ecossistema.

## Em andamento

- [ ] **P1 · Manutenção · Avisar sobre v1.0.0**
  - Objetivo: alertar consumidores sobre a entrada CommonJS incorreta da primeira versão publicada.
  - Estado: bloqueado pelo GitHub Packages; o registry recusou `npm deprecate` para a versão com erro interno de metadados.
  - Conclusão: adotar o recurso se o GitHub passar a suportar a descontinuação por versão, mantendo até lá a orientação para `>=1.0.2` na documentação e nas notas de release.

## Planejado

- [ ] **P0 · v1.0.3+ · Cobertura gradual**
  - Objetivo: medir a cobertura atual e estabelecer metas progressivas para código, branches e funções críticas.
  - Conclusão: relatório no CI e limites definidos a partir de uma linha de base real, sem cobertura artificial.

- [ ] **P1 · v1.1.0 · Valores monetários com `bigint`**
  - Objetivo: oferecer APIs paralelas para centavos acima de `Number.MAX_SAFE_INTEGER`, sem alterar os helpers atuais em `number`.
  - Conclusão: parsing, máscara e formatação em `bigint`, com round-trips e limites testados.

- [ ] **P1 · v1.1.0 · Horário e DateTime de input**
  - Objetivo: complementar datas com `maskTimeBRInput`, `parseTimeBR`, `formatTimeBR` e máscara de data/hora local.
  - Conclusão: entradas parciais, limites de hora, segundos opcionais e separação inequívoca entre data civil, data/hora local e instante ISO.

- [ ] **P1 · v1.1.0+ · Documentos brasileiros adicionais**
  - Objetivo: adicionar PIS/PASEP, Título de Eleitor, CNH e RENAVAM usando a família `mask...Input`, `format...`, `parse...` e `is...Valid`.
  - Conclusão: cada documento tem regras oficiais, limites, testes de valores válidos e inválidos, e exemplos no README.

- [ ] **P2 · Pacotes de adapters · React e Angular**
  - Objetivo: integrar máscara, cursor e campos controlados sem adicionar dependências de framework ao núcleo.
  - Conclusão: adapters publicados em pacotes próprios, por exemplo `@mat-henriqu/masks-react` e `@mat-henriqu/masks-angular`.

## Concluído

- [x] **P0 · v1.0.3 · Qualidade e automação** — CI verde em push, validações completas antes da release e publicação confirmada no GitHub Packages.
- [x] **v1.0.2 · Distribuição ESM e CommonJS** — entradas corrigidas e verificadas em projeto consumidor limpo.
- [x] **v1.0.2 · GitHub Packages público** — publicação e instalação autenticada documentadas.
