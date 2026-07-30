# @mat-henriqu/masks

Biblioteca TypeScript, sem dependências de framework, para máscaras, parsing e validação de dados brasileiros. Ela separa o que o usuário digita do valor que a aplicação armazena: máscaras trabalham com texto de input; parsers devolvem um valor canônico ou `null` (tipo público `ParseResult<T>`).

## Instalação pelo GitHub Packages

No projeto consumidor, crie ou complete o arquivo `.npmrc`:

```ini
@mat-henriqu:registry=https://npm.pkg.github.com
```

Autentique o npm com um Personal Access Token **classic** que tenha o escopo necessário para packages; não versione tokens em `.npmrc`.

```powershell
npm login --scope=@mat-henriqu --auth-type=legacy --registry=https://npm.pkg.github.com
```

Depois instale e importe apenas os helpers necessários:

```powershell
npm install @mat-henriqu/masks
```

```ts
import { maskBRLInput, parseBRLToCents, parseDateBR } from "@mat-henriqu/masks";

maskBRLInput("12345"); // R$ 123,45
parseBRLToCents("R$ 123,45"); // 12345
parseDateBR("29/02/2024"); // 2024-02-29
```

## Contratos principais

| Domínio | Entrada de input | Valor canônico | Exibição |
| --- | --- | --- | --- |
| BRL | `12345` | `12345` centavos | `R$ 123,45` |
| Número | `1.234,56` | `1234.56` | `1.234,56` |
| Data civil | `29/02/2024` | `2024-02-29` | `29/02/2024` |
| Data/hora local | `29/02/2024 10:30` | `2024-02-29T10:30:00` | — |
| Instante ISO | `2024-02-29T13:30:00Z` | ISO com offset | `29/02/2024 10:30` em São Paulo |

## API

### Inputs e documentos

- `maskCPFInput`, `maskCNPJInput`, `maskCPFOrCNPJInput`, `maskCEPInput`, `maskPhoneBRInput`: máscaras parciais para campos controlados.
- `parseCPF`, `parseCNPJ`, `parseCEP`, `parsePhoneBR`: retornam somente valores completos ou `null`.
- `isCPFValid` / `isCNPJValid`: conferem os dígitos verificadores.
- `formatPhoneE164`: converte telefone BR completo para `+55...` ou retorna `null`.
- `onlyDigits` e `unmask`: removem caracteres não numéricos.

`formatCPF`, `formatCNPJ`, `formatCEP`, `formatPhoneBR`, `validateCPF`, `validateCNPJ` e os `unmask...` existentes continuam disponíveis como aliases de compatibilidade.

### Moeda e números

```ts
import {
  formatBRLFromCents,
  maskBRLInput,
  parseBRLToCents,
  formatNumberBR,
  parseNumberBR,
  maskDecimalBRInput,
} from "@mat-henriqu/masks";

formatBRLFromCents(123456); // R$ 1.234,56
maskBRLInput("123456"); // R$ 1.234,56
parseBRLToCents("-R$ 1.234,56"); // -123456
parseBRLToCents("1234.56"); // null: formato ambíguo/inglês recusado

formatNumberBR(1234.5, { minimumFractionDigits: 2 }); // 1.234,50
parseNumberBR("1.234,50"); // 1234.5
maskDecimalBRInput("1234,5", { decimalScale: 2 }); // 1.234,5
```

BRL usa centavos inteiros seguros, evitando erros de arredondamento de `number`. Parsers recusam textos ambíguos e valores fora de `Number.MAX_SAFE_INTEGER`.

### Datas

```ts
import { formatDateBR, formatDateTimeBR, maskDateBRInput, parseDateBR, parseDateTimeBR } from "@mat-henriqu/masks";

maskDateBRInput("29022024"); // 29/02/2024
parseDateBR("29/02/2024"); // 2024-02-29
formatDateBR("2024-02-29"); // 29/02/2024

parseDateTimeBR("29/02/2024 10:30"); // 2024-02-29T10:30:00
formatDateTimeBR("2024-02-29T13:30:00Z"); // 29/02/2024 10:30
formatDateTimeBR("2024-02-29T13:30:00Z", { timeZone: "UTC" }); // 29/02/2024 13:30
```

`parseDateBR` e `formatDateBR` manipulam apenas data civil e nunca usam `Date`, portanto aniversário, vencimento e competência não sofrem deslocamento de fuso. `formatDateTimeBR` aceita somente ISO com `Z` ou offset; para converter uma data/hora local, use `parseDateTimeBR`, que não representa um instante UTC.

## Desenvolvimento e release

```powershell
npm run build
```

O workflow `.github/workflows/publish.yml` publica somente após uma GitHub Release ser marcada como publicada. Ele usa `GITHUB_TOKEN` com `packages: write`; não há segredo de publicação no repositório. O pacote aparece inicialmente privado no GitHub Packages e sua visibilidade pode ser configurada na página do pacote.

## Licença

MIT.
