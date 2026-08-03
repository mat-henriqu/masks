# Guia de desenvolvimento e publicação

Este guia descreve o ciclo de manutenção de `@mat-henriqu/masks`: desenvolvimento local, validações, commits, versionamento, GitHub Release e publicação no GitHub Packages.

## Visão geral do fluxo

```text
alterar src/ e testes
  → validar localmente
  → commit e push
  → criar GitHub Release
  → GitHub Actions valida e publica
  → validar instalação da versão publicada
```

O Git não publica packages. O package é enviado ao GitHub Packages somente quando uma GitHub Release é publicada e o workflow `.github/workflows/publish.yml` termina com sucesso.

## 1. Preparar o ambiente

Requisitos:

- Node.js 18 ou superior;
- npm;
- Git;
- acesso de escrita ao repositório `mat-henriqu/masks`.

Clone o repositório e instale as dependências:

```powershell
git clone https://github.com/mat-henriqu/masks.git
```

```powershell
Set-Location 'D:\Projetos Pessoais\masks'; npm install
```

As dependências exatas usadas pela automação estão fixadas em `package-lock.json`. Não altere esse arquivo manualmente; ele deve acompanhar mudanças no `package.json` feitas pelo npm.

## 2. Entender a estrutura

| Caminho | Responsabilidade |
| --- | --- |
| `src/` | Implementação TypeScript pública e interna. |
| `src/index.ts` | Ponto único de exports públicos da biblioteca. |
| `test/` | Testes unitários Vitest e smoke test do pacote gerado. |
| `dist/` | Saída gerada pelo build; não deve ser editada manualmente. |
| `package.json` | Nome, versão, scripts, exports e destino da publicação. |
| `tsup.config.ts` | Configuração do bundle ESM, CommonJS e tipos. |
| `.github/workflows/publish.yml` | Validação e publicação após GitHub Release. |

O build gera:

- `dist/index.mjs`: entrada ESM para `import`;
- `dist/index.js`: entrada CommonJS para `require`;
- `dist/index.d.ts` e `dist/index.d.mts`: tipos TypeScript.

O `package.json` mapeia esses arquivos em `main`, `module` e `exports`. A propriedade `files` limita o tarball publicado a `dist/`, `README.md` e `LICENSE`.

## 3. Desenvolver uma alteração

1. Atualize sua cópia local de `main`.
2. Crie uma branch para a alteração.
3. Altere o código em `src/` e adicione ou ajuste testes em `test/`.
4. Atualize o README se a API pública, a instalação ou o comportamento visível mudar.

Exemplo de criação de branch:

```powershell
git switch main; git pull --ff-only; git switch -c feat/mascara-rg
```

Convenções de branch recomendadas:

- `feat/nome-da-funcionalidade` para funcionalidade nova;
- `fix/descricao-do-defeito` para correção;
- `docs/descricao-da-documentacao` para documentação;
- `chore/descricao-da-manutencao` para manutenção técnica.

## 4. Validar localmente

Execute as validações nesta ordem após desenvolver:

```powershell
npm run build
```

Gera ESM, CommonJS e declarações TypeScript em `dist/`.

```powershell
npm test
```

Executa os testes unitários de regras de máscara, conversão, validação de documentos e datas.

```powershell
npm run test:package
```

Executa o smoke test sobre os arquivos reais gerados em `dist/`, confirmando os caminhos de `import` e `require`. Execute-o sempre depois do build.

```powershell
npm run test:coverage
```

Gera cobertura dos testes quando for necessário avaliar caminhos ainda não exercitados.

```powershell
npm audit --json
```

Verifica vulnerabilidades conhecidas nas dependências instaladas.

```powershell
npm pack --dry-run --ignore-scripts
```

Lista o conteúdo do tarball sem criá-lo e sem executar scripts. Confirme que somente `dist/`, `README.md`, `LICENSE` e `package.json` entrarão no package.

### Lint e formatação

O projeto ainda não possui script de lint ou formatter configurado. Portanto, `npm run lint` não faz parte do fluxo atual e não deve ser documentado como validação existente.

Enquanto não houver ESLint/Prettier, mantenha o estilo dos arquivos próximos, use TypeScript estrito e deixe o build e os testes como critérios técnicos obrigatórios. Quando um linter for adotado, ele deve ser adicionado ao `package.json`, executado localmente e incluído no workflow antes da publicação.

## 5. Criar um commit correto

Antes de commitar, revise o que pertence à mudança:

```powershell
git status --short
```

```powershell
git diff
```

Adicione somente os arquivos relacionados:

```powershell
git add src\documents.ts test\masks.test.ts README.md
```

Use mensagens no padrão Conventional Commits, em português, com título curto e objetivo:

| Tipo | Uso | Exemplo |
| --- | --- | --- |
| `feat` | Nova capacidade pública | `feat: adiciona máscara de RG` |
| `fix` | Correção compatível | `fix: corrige parsing de BRL negativo` |
| `docs` | Apenas documentação | `docs: detalha fluxo de publicação` |
| `test` | Apenas testes | `test: cobre data bissexta` |
| `chore` | Manutenção técnica | `chore: atualiza dependências de desenvolvimento` |
| `refactor` | Reorganização sem alterar contrato | `refactor: separa helpers de número` |

Exemplo:

```powershell
git commit -m "feat: adiciona máscara de RG"
```

Envie a branch:

```powershell
git push -u origin feat/mascara-rg
```

Abra uma Pull Request para `main` quando a alteração precisar de revisão. Em manutenção individual, só envie diretamente a `main` depois de executar as validações locais.

## 6. Versionar uma nova release

O projeto segue versionamento semântico:

- `MAJOR` (`2.0.0`): quebra contrato público ou exige migração;
- `MINOR` (`1.1.0`): adiciona funcionalidade compatível;
- `PATCH` (`1.0.3`): corrige defeito sem quebrar consumidores.

Antes da release, atualize a versão em `package.json` e `package-lock.json`. Use o npm para manter os dois arquivos consistentes, sem criar tag local automaticamente:

```powershell
npm version patch --no-git-tag-version
```

Para uma funcionalidade compatível, use:

```powershell
npm version minor --no-git-tag-version
```

Para uma quebra de contrato público, use:

```powershell
npm version major --no-git-tag-version
```

Depois do bump, execute novamente build, testes, smoke test, auditoria e `npm pack --dry-run`. Faça commit do `package.json` e `package-lock.json` junto da alteração de código.

Exemplo de commit de release:

```powershell
git add package.json package-lock.json; git commit -m "chore: prepara release v1.0.3"; git push
```

A versão do manifesto é `1.0.3`; a tag/release usa `v1.0.3`. Uma versão já publicada é imutável. Se houver defeito, publique uma nova versão patch em vez de tentar sobrescrever a anterior.

## 7. Criar a GitHub Release

Depois que o commit de versão estiver em `main`:

1. Abra o repositório no GitHub.
2. Acesse **Releases**, na lateral direita da página principal do repositório.
3. Clique em **Draft a new release**.
4. Em **Choose a tag**, informe uma nova tag, por exemplo `v1.0.3`.
5. Defina `main` como target.
6. Use `v1.0.3` como título e escreva notas objetivas sobre o que mudou.
7. Clique em **Publish release**.

Não crie a release antes de enviar o commit de versão: a tag precisa apontar para o commit que contém o `package.json` com a mesma versão.

## 8. O que o GitHub Actions faz

A publicação é acionada somente pelo evento `release.published`. O workflow executa:

1. checkout do commit marcado pela release;
2. configuração do Node 20 e do registry `npm.pkg.github.com`;
3. `npm ci` com o lockfile;
4. `npm run build`;
5. `npm test`;
6. `npm run test:package`;
7. `npm publish`.

O job recebe um `GITHUB_TOKEN` temporário com `contents: read` e `packages: write`. Ele é usado apenas no runner para autenticar a publicação; nenhum PAT de publicação é salvo no repositório.

Se build ou qualquer teste falhar, `npm publish` não é executado. Corrija o problema, incremente a versão e crie uma nova release. Não reutilize uma versão ou tag que já tenha sido publicada ou usada em uma tentativa de release.

## 9. Confirmar a publicação

Após o workflow ficar verde em **Actions**, confirme a versão no registry:

```powershell
npm view @mat-henriqu/masks@1.0.3 version --registry=https://npm.pkg.github.com
```

Para uma validação completa, instale a versão em um projeto limpo, com o scope configurado no `.npmrc`:

```ini
@mat-henriqu:registry=https://npm.pkg.github.com
```

Valide os dois formatos distribuídos:

```powershell
node --input-type=module -e "import { parseBRLToCents } from '@mat-henriqu/masks'; console.log(parseBRLToCents('R$ 1,00'))"
```

```powershell
node -e "const { parseBRLToCents } = require('@mat-henriqu/masks'); console.log(parseBRLToCents('R$ 1,00'))"
```

Ambos devem imprimir `100`.

## 10. Consumo e autenticação

O package é distribuído como `@mat-henriqu/masks` pelo GitHub Packages. Projetos consumidores devem mapear o escopo para o registry:

```ini
@mat-henriqu:registry=https://npm.pkg.github.com
```

O GitHub Packages requer autenticação npm. Para consumo, use um Personal Access Token classic com a menor permissão necessária, normalmente `read:packages`, configurado no `.npmrc` de usuário. Não registre tokens em arquivos do projeto, no Git ou na documentação.
