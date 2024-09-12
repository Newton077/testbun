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
    }, // Explorador de bloques (reemplázalo con el correcto si lo conoces)
  },
  parentChain: {
    name: "Sepolia", // Cadena padre de zKyoto
  },
};

// Configuración con zKyoto
export const config = createConfig({
  chains: [zKyoto],
  connectors: [
    coinbaseWallet({ appName: "Create Wagmi", preference: "smartWalletOnly" }),
  ],
  transports: {
    [zKyoto.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
