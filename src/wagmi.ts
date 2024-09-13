import { http, createConfig } from "wagmi";
import { Chain } from "wagmi/chains";
import { coinbaseWallet } from "wagmi/connectors";

// Define la cadena zKyoto con su respectiva configuración
export const zKyoto: Chain = {
  id: 6038361, // Chain ID correcto para zKyoto
  name: "zKyoto",
  network: "zKyoto (zkEVM testnet)",
  rpcUrls: {
    default: {
      http: ["https://rpc.startale.com/zkyoto"], // RPC de Startale Labs
    },
    public: {
      http: ["https://astar-zkyoto-rpc.dwellir.com"], // RPC de Dwellir
    },
  },
  nativeCurrency: {
    name: "Ethereum",
    symbol: "ETH", // Símbolo de la moneda nativa en zKyoto
    decimals: 18,
  },
  blockExplorers: {
    default: {
      name: "zKyoto Explorer",
      url: "https://explorer.zkyoto.network",
    }, // Explorador de bloques
  },
  parentChain: {
    name: "Sepolia", // Cadena padre de zKyoto
  },
};

// Define la cadena Core Blockchain Testnet con su respectiva configuración
export const coreTestnet: Chain = {
  id: 1115, // Chain ID de Core Blockchain Testnet
  name: "Core Blockchain Testnet",
  network: "core-testnet",
  rpcUrls: {
    default: {
      http: ["https://rpc.test.btcs.network"], // RPC de la red Core Blockchain Testnet
    },
  },
  nativeCurrency: {
    name: "Core Test Token",
    symbol: "tCORE", // Símbolo de la moneda nativa en Core Testnet
    decimals: 18,
  },
  blockExplorers: {
    default: {
      name: "Core Testnet Explorer",
      url: "https://explorer.test.btcs.network", // Explorador de bloques de Core Testnet
    },
  },
};

// Configuración con ambas cadenas zKyoto y Core Testnet
export const config = createConfig({
  chains: [zKyoto, coreTestnet], // Añade las dos redes
  connectors: [
    coinbaseWallet({ appName: "Create Wagmi", preference: "smartWalletOnly" }),
  ],
  transports: {
    [zKyoto.id]: http(),
    [coreTestnet.id]: http(), // Añade transporte HTTP para Core Testnet
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
