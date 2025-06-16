markdown
# Horizon - Digital Twin Platform

![App Screenshot](https://via.placeholder.com/800x500/1e3a8a/ffffff?text=Sensor+Monitoring+App)
*(Substitua por screenshot real do aplicativo)*

Aplicativo de monitoramento de sensores pneumáticos com visualização em tempo real, histórico de dados e interface intuitiva.

## 🚀 Pré-requisitos

Antes de começar, verifique se possui instalado:

- [Node.js](https://nodejs.org/) (v18+)
- [Git](https://git-scm.com/)
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (globalmente)

```bash
npm install -g expo-cli
📥 Instalação
Siga estes passos para configurar o projeto:

Clone o repositório:

bash
git clone https://github.com/seu-usuario/horizon-app.git
cd horizon-app
Instale as dependências:

bash
npm install
# ou
yarn install
Inicie o servidor de desenvolvimento:

bash
expo start
▶️ Executando o Aplicativo
Após iniciar o Expo, escolha uma das opções:

Android: Pressione a no terminal ou escaneie o QR code com o app Expo Go

iOS: Pressione i no terminal ou escaneie o QR code com a câmera do iPhone

Web: Pressione w no terminal ou acesse http://localhost:19006

📂 Estrutura de Arquivos
text
horizon-app/
├── src/
│   ├── screen/
│   │   ├── tela_splash.tsx    # Tela inicial com animações
│   │   └── tela_flatlist.tsx   # Lista de sensores com detalhes
│   └── mock/
│       └── sensors.json        # Dados dos sensores
├── App.tsx                     # Configuração de navegação
├── package.json                # Dependências e scripts
└── tsconfig.json               # Configuração TypeScript (se existir)
🔧 Dependências Principais
React Native (0.79.3)

React Navigation (v7)

Expo (v53)

TypeScript (v5.8)

🛠️ Comandos Úteis
Comando	Descrição
npm start	Inicia servidor de desenvolvimento
npm run android	Executa no Android
npm run ios	Executa no iOS (macOS apenas)
npm run web	Executa versão web
🧪 Testando o Aplicativo
Tela inicial com animação de splash

Toque em "COMEÇAR" para acessar os sensores

Role a lista de sensores

Toque em qualquer sensor para ver detalhes e histórico

Use o botão "Atualizar Dados" para recarregar

Puxe a lista para baixo para atualizar (pull-to-refresh)

⚠️ Solução de Problemas
Erro ao carregar sensores
Verifique se o arquivo src/mock/sensors.json existe e tem estrutura válida

Problemas de navegação
Certifique-se que todas as telas estão registradas no App.tsx

Erros de dependências
Execute:

bash
npm install
rm -rf node_modules/.cache
expo start -c
Problemas no iOS Simulator
Se usar Xcode:

bash
npx pod-install
📄 Licença
Este projeto está sob licença MIT - veja o arquivo LICENSE para detalhes.

text

### Para usar este README:

1. Crie um arquivo `README.md` na raiz do seu projeto
2. Copie e cole todo o conteúdo acima
3. Personalize com suas informações:
   - Substitua `https://github.com/seu-usuario/horizon-app.git` pelo URL real do seu repositório
   - Adicione screenshots reais do aplicativo
   - Atualize a seção de licença se necessário

### Passos recomendados após criar o README:

1. Crie um arquivo LICENSE com o conteúdo da licença MIT
2. Adicione ao repositório:
```bash
git add README.md LICENSE
git commit -m "Adiciona README e LICENSE"
git push
