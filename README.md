# ClipMaker

O ClipMaker é uma aplicação web focada em transformar vídeos longos em cortes curtos com potencial viral usando inteligência artificial. Este projeto foi desenvolvido durante o **evento NLW 22 da Rocketseat**, com a proposta de explorar um fluxo moderno de criação de conteúdo combinando upload de vídeo, transcrição automatizada e análise por IA para encontrar os melhores momentos de um conteúdo.

## Sobre o projeto

A ideia central do projeto é simples: permitir que uma pessoa envie um vídeo, aguarde a geração da transcrição e, em seguida, utilize um modelo de IA para identificar automaticamente o trecho mais interessante, surpreendente, engraçado ou envolvente do conteúdo.

Na prática, o sistema tenta resolver um problema muito comum de quem trabalha com conteúdo para internet: assistir materiais longos manualmente para descobrir qual trecho vale virar corte para redes sociais. Em vez de fazer isso manualmente, o ClipMaker automatiza esse processo e devolve um recorte já pronto para visualização.

## Contexto do NLW 22

Este projeto foi criado durante o **Next Level Week 22**, evento da **Rocketseat**, conhecido por propor experiências práticas de desenvolvimento com tecnologias atuais e aplicações orientadas a problemas reais. Dentro desse contexto, o ClipMaker representa uma solução experimental e didática que demonstra como conectar serviços externos e IA generativa em uma aplicação front-end simples, direta e funcional.

Mais do que apenas uma interface bonita, o projeto mostra uma arquitetura leve no navegador capaz de orquestrar diferentes etapas de processamento de mídia com apoio de plataformas especializadas.

## O que a aplicação faz

O fluxo principal da aplicação funciona assim:

1. A pessoa usuária informa sua chave da API do Gemini.
2. Clica no botão para iniciar o upload do vídeo.
3. O widget da Cloudinary é aberto para selecionar e enviar o arquivo.
4. Após o upload, a aplicação aguarda a disponibilidade da transcrição gerada para o vídeo.
5. Quando a transcrição fica pronta, ela é enviada ao Gemini com um prompt específico.
6. O Gemini analisa o texto e retorna apenas o intervalo de tempo mais promissor para um corte viral.
7. A aplicação monta uma URL da Cloudinary já com os parâmetros de corte.
8. O vídeo recortado é exibido diretamente na interface.

## Objetivo do ClipMaker

O objetivo do projeto é demonstrar como IA pode ser usada de maneira prática para acelerar tarefas criativas e operacionais, especialmente na produção de conteúdo digital.

Com isso, o ClipMaker serve como exemplo de:

- automação de seleção de trechos relevantes em vídeos;
- integração entre serviços de mídia e modelos generativos;
- construção de protótipos de IA sem necessidade de back-end complexo;
- uso de front-end puro para validar uma ideia de produto rapidamente.

## Tecnologias utilizadas

O projeto é propositalmente enxuto e utiliza apenas os recursos necessários para entregar a experiência.

- **HTML5** para estrutura da página.
- **JavaScript puro** para a lógica da aplicação.
- **Tailwind CSS via CDN** para estilização rápida e responsiva.
- **GSAP** para animações de entrada e transições visuais.
- **Lucide Icons** para os ícones da interface.
- **Cloudinary Upload Widget** para upload do vídeo.
- **Cloudinary** para armazenamento, transcrição e manipulação do vídeo.
- **Google Gemini API** para identificar o trecho mais viral com base na transcrição.

## Estrutura do projeto

O projeto possui uma estrutura simples:

```bash
.
├── index.html
└── script.js
```

### index.html

Responsável por:

- montar a interface principal;
- carregar bibliotecas externas via CDN;
- exibir o campo da API Key;
- renderizar o botão de upload;
- mostrar o estado de carregamento;
- exibir o player de vídeo com o corte gerado;
- apresentar mensagens de erro quando necessário.

### script.js

Responsável por:

- inicializar os ícones do Lucide;
- executar animações de entrada com GSAP;
- controlar os elementos da interface;
- configurar o widget de upload da Cloudinary;
- aguardar a disponibilidade da transcrição;
- buscar o conteúdo transcrito;
- enviar a transcrição para o Gemini;
- interpretar o retorno com os tempos de início e fim;
- montar a URL final do vídeo cortado;
- atualizar a UI com sucesso, loading ou erro.

## Como a lógica funciona internamente

### 1. Upload do vídeo

O projeto usa o **Cloudinary Upload Widget**, o que elimina a necessidade de criar um formulário manual de upload. Quando o envio termina com sucesso, a aplicação recebe o `public_id` do arquivo enviado.

Esse identificador é essencial porque ele será usado nas próximas etapas para localizar a transcrição e gerar a URL final do vídeo recortado.

### 2. Espera pela transcrição

Após o upload, a aplicação não assume que a transcrição estará pronta imediatamente. Em vez disso, ela faz tentativas periódicas de acessar o arquivo de transcrição associado ao vídeo.

Esse processo acontece em loop, com limite máximo de tentativas e um intervalo entre cada verificação. Quando a transcrição finalmente fica disponível, a URL é armazenada para ser consumida pela próxima etapa.

### 3. Leitura da transcrição

Com a URL pronta, a aplicação baixa o conteúdo textual da transcrição. Esse texto representa o que foi falado no vídeo e serve como matéria-prima para o modelo de IA analisar o conteúdo.

### 4. Análise do “momento viral”

A transcrição é enviada para o modelo **Gemini 2.5 Flash** com um prompt bem restritivo. O prompt orienta o modelo a:

- agir como um editor profissional de vídeos virais;
- encontrar o trecho mais interessante do conteúdo;
- respeitar um intervalo entre 30 e 60 segundos;
- devolver somente uma string no formato esperado pela Cloudinary.

O formato retornado é algo como:

```text
so_12.5,eo_47.8
```

Nesse padrão:

- `so` significa o segundo de início do corte;
- `eo` significa o segundo final do corte.

### 5. Geração do corte

Depois de receber esse intervalo, a aplicação monta uma URL de transformação da Cloudinary usando o `public_id` do vídeo original. Com isso, a própria Cloudinary entrega o vídeo já recortado no trecho indicado pela IA, sem necessidade de processar mídia localmente no navegador.

### 6. Exibição do resultado

Por fim, o player de vídeo é atualizado com a URL final. O placeholder inicial desaparece, o vídeo aparece com animação e a pessoa usuária pode assistir ao recorte gerado automaticamente.

## Interface e experiência

A interface foi desenhada com um visual moderno e tecnológico, com foco em uma experiência limpa e direta.

Entre os destaques:

- fundo com gradientes e efeito visual mais imersivo;
- painel com efeito glassmorphism;
- animações suaves de entrada usando GSAP;
- feedback visual durante o processamento;
- player de vídeo destacado no centro da experiência;
- tratamento visual para mensagens de erro.

Mesmo sendo um projeto pequeno, existe uma preocupação clara com percepção de qualidade, fluidez e compreensão do fluxo pela pessoa usuária.

## Configurações importantes

Atualmente, alguns dados estão definidos diretamente no código JavaScript:

- `cloudName`: nome da conta Cloudinary usada pelo projeto;
- `uploadPreset`: preset de upload configurado na Cloudinary.

Além disso, a aplicação depende de uma **Gemini API Key**, que deve ser informada manualmente na interface antes do upload.

## Como executar o projeto

Como este projeto é totalmente front-end, não há etapa obrigatória de build ou instalação de dependências locais.

### Opção 1: abrir diretamente no navegador

Basta abrir o arquivo `index.html` no navegador.

### Opção 2: usar um servidor local

Também é recomendável servir o projeto com uma extensão como Live Server no VS Code, ou qualquer servidor HTTP simples, para melhorar a experiência de desenvolvimento.

## Como usar

1. Abra a aplicação no navegador.
2. Insira sua chave da API do Gemini.
3. Clique em **Começar Upload**.
4. Envie um vídeo pelo widget da Cloudinary.
5. Aguarde a transcrição ser localizada.
6. Aguarde a IA identificar o melhor trecho.
7. Assista ao corte gerado na própria página.

## Requisitos para funcionamento

Para que tudo funcione corretamente, é necessário:

- uma chave válida da API do Gemini;
- uma conta Cloudinary com a configuração usada no projeto;
- suporte à geração e leitura da transcrição do vídeo no fluxo configurado;
- conexão com a internet, já que todas as bibliotecas e serviços são externos.

## Tratamento de erros

O projeto já contempla alguns cenários de falha, como:

- ausência da API Key do Gemini;
- demora excessiva para a transcrição ficar disponível;
- erro inesperado durante a análise do vídeo;
- falhas na comunicação com serviços externos.

Quando isso acontece, a interface mostra uma mensagem de erro para informar que o processamento não foi concluído corretamente.

## Pontos fortes do projeto

- prova de conceito simples, clara e funcional;
- integração prática entre IA generativa e processamento de vídeo;
- experiência visual bem trabalhada para um projeto pequeno;
- arquitetura enxuta, fácil de entender e estudar;
- ótimo exemplo educacional para eventos, workshops e portfólio.

## Limitações atuais

Como este é um projeto de estudo e demonstração, existem algumas limitações importantes:

- não há back-end próprio para proteger credenciais ou centralizar chamadas;
- a chave da API do Gemini é informada no front-end;
- o fluxo depende de serviços externos estarem disponíveis;
- o critério de “momento viral” depende da interpretação do modelo de IA;
- não existe histórico de uploads ou gerenciamento de usuários;
- não há edição manual fina do trecho sugerido.

## Possíveis evoluções

Este projeto pode crescer bastante a partir da base atual. Algumas melhorias possíveis:

- criação de um back-end para ocultar credenciais e controlar chamadas à IA;
- autenticação de usuários;
- histórico de vídeos processados;
- geração de múltiplos cortes por vídeo;
- escolha entre formatos para TikTok, Reels e Shorts;
- edição manual do intervalo antes da exportação;
- legendas automáticas embutidas no vídeo;
- painel com métricas e sugestões de títulos ou descrições.

## Valor educacional

O ClipMaker é um excelente projeto para estudar:

- integração com APIs externas;
- manipulação de fluxo assíncrono com JavaScript;
- construção de interfaces modernas sem framework;
- uso de IA generativa aplicada a um caso real;
- composição de serviços especializados para criar produtos digitais rapidamente.

## Conclusão

O ClipMaker mostra como é possível transformar uma ideia atual e relevante em um produto funcional com poucas camadas, boa experiência visual e alto valor demonstrativo. Como projeto desenvolvido no **NLW 22 da Rocketseat**, ele representa bem a proposta de aprender construindo algo prático, moderno e conectado às tendências mais fortes do mercado, como automação criativa, vídeo e inteligência artificial.

É um projeto enxuto, mas com excelente potencial de expansão, seja para estudo, portfólio ou evolução para um produto mais robusto.