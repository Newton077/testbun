import { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { CoinbaseWalletSDK } from "@coinbase/wallet-sdk";
import { ethers } from "ethers";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Bell,
  ChevronDown,
  DollarSign,
  LineChart,
  Network,
  Plus,
  Send,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Definir el tipo para los datos de la red
interface NetworkData {
  balance: string;
  usdBalance: string;
  recentTransactions: {
    type: string;
    description: string;
    amount: string;
  }[];
  cryptoOverview: {
    name: string;
    price: string;
    change: string;
  }[];
}

// Datos del dashboard
const networks = [
  { id: "ethereum", name: "Astar Network", icon: "🔷" },
  { id: "bsc", name: "CoreDAO", icon: "🟨" },
  { id: "polygon", name: "Polygon", icon: "🟣" },
];

const networkData: Record<string, NetworkData> = {
  ethereum: {
    balance: "1.5 ASTR",
    usdBalance: "$0.05846",
    recentTransactions: [
      { type: "in", description: "Recibido de 0x1234...", amount: "+0.5 ETH" },
      { type: "out", description: "Enviado a 0x5678...", amount: "-0.2 ETH" },
    ],
    cryptoOverview: [
      { name: "ASTR", price: "$0.05846", change: "+2.5%" },
      { name: "CORE", price: "$0.9", change: "-1.2%" },
      { name: "UNI", price: "$22.30", change: "+3.7%" },
    ],
  },
  bsc: {
    balance: "1 CORE",
    usdBalance: "$0.9255",
    recentTransactions: [
      { type: "in", description: "Swap Astar to Core", amount: "+2 CORE" },
      { type: "out", description: "Pancakeswap liquidity", amount: "-1 CORE" },
    ],
    cryptoOverview: [
      { name: "CORE", price: "$380.00", change: "+1.8%" },
      { name: "CAKE", price: "$18.20", change: "+4.5%" },
      { name: "ASTR", price: "$1.00", change: "0%" },
    ],
  },
  polygon: {
    balance: "1000 MATIC",
    usdBalance: "$2,200.00",
    recentTransactions: [
      { type: "in", description: "Aave interest", amount: "+50 MATIC" },
      { type: "out", description: "QuickSwap trade", amount: "-100 MATIC" },
    ],
    cryptoOverview: [
      { name: "MATIC", price: "$2.20", change: "+5.7%" },
      { name: "AAVE", price: "$320.00", change: "-0.8%" },
      { name: "QUICK", price: "$450.00", change: "+2.3%" },
    ],
  },
};

// Configuración de Coinbase Wallet SDK
const APP_NAME = "BUN Wallet";
const APP_LOGO_URL = "https://example.com/logo.png"; // Cambia esto por tu logo
const DEFAULT_ETH_JSONRPC_URL =
  "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID";
const DEFAULT_CHAIN_ID = 1;

export default function WalletDashboard() {
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]);
  const currentNetworkData = networkData[selectedNetwork.id];

  const { address, isConnected } = useAccount();
  const { connect, connectors, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();

  // Configuración de Coinbase Wallet SDK
  const [coinbaseProvider, setCoinbaseProvider] = useState<any>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isCoinbaseConnected, setIsCoinbaseConnected] =
    useState<boolean>(false);

  useEffect(() => {
    const coinbaseWallet = new CoinbaseWalletSDK({
      appName: APP_NAME,
      appLogoUrl: APP_LOGO_URL,
      darkMode: false,
    });

    const ethereum = coinbaseWallet.makeWeb3Provider(
      DEFAULT_ETH_JSONRPC_URL,
      DEFAULT_CHAIN_ID
    );

    setCoinbaseProvider(ethereum);
  }, []);

  // Conectar Coinbase Wallet
  const connectCoinbaseWallet = async () => {
    if (coinbaseProvider) {
      try {
        const accounts = await coinbaseProvider.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        setIsCoinbaseConnected(true);
      } catch (error) {
        console.error("Error al conectar con Coinbase Wallet", error);
      }
    }
  };

  // Desconectar Coinbase Wallet
  const disconnectCoinbaseWallet = () => {
    setWalletAddress(null);
    setIsCoinbaseConnected(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">BUN</h2>
        </div>
        <nav className="space-y-2">
          <Link
            to="#"
            className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 rounded p-2"
          >
            <DollarSign className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="#"
            className="flex items-center space-x-2 text-gray-700 hover:bg-gray-100 rounded p-2"
          >
            <LineChart className="h-5 w-5" />
            <span> Swap </span>
          </Link>
        </nav>

        {/* Network Dropdown */}
        <div className="mt-8">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center">
                  <Network className="mr-2 h-4 w-4" />
                  <span>
                    {selectedNetwork.icon} {selectedNetwork.name}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {networks.map((network) => (
                <DropdownMenuItem
                  key={network.id}
                  onClick={() => setSelectedNetwork(network)}
                >
                  {network.icon} {network.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Wagmi Account Information */}
        <div className="mt-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Account</h2>
            <div className="text-gray-700">
              {isCoinbaseConnected ? (
                <>
                  <div className="mb-2">
                    <strong>Status:</strong> Conectado a Coinbase Wallet
                  </div>
                  <div className="mb-2">
                    <strong>Address:</strong> {walletAddress}
                  </div>
                </>
              ) : (
                <div className="mb-2">
                  <strong>Status:</strong> No conectado
                </div>
              )}
            </div>

            {isCoinbaseConnected ? (
              <Button
                variant="outline"
                onClick={disconnectCoinbaseWallet}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mt-4"
              >
                Desconectar Coinbase Wallet
              </Button>
            ) : (
              <Button
                onClick={connectCoinbaseWallet}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-4"
              >
                Conectar Coinbase Wallet
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold"> BUN - {selectedNetwork.name}</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>{walletAddress || "Wallet"}</span>
            </Button>
          </div>
        </div>

        {/* Saldo total */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Saldo Total en {selectedNetwork.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {currentNetworkData.balance}
            </div>
            <p className="text-sm text-muted-foreground">
              ≈ {currentNetworkData.usdBalance} USD
            </p>
          </CardContent>
        </Card>

        {/* Acciones */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <Button className="flex items-center justify-center space-x-2">
            <Send className="h-4 w-4" />
            <span>Enviar {selectedNetwork.name.split(" ")[0]}</span>
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Recibir {selectedNetwork.name.split(" ")[0]}</span>
          </Button>
        </div>

        {/* Transacciones Recientes */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              Transacciones Recientes en {selectedNetwork.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {currentNetworkData.recentTransactions.map(
                (transaction, index) => (
                  <li key={index} className="flex items-center">
                    {transaction.type === "in" ? (
                      <ArrowUpIcon className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 text-red-500 mr-2" />
                    )}
                    <span className="flex-1">{transaction.description}</span>
                    <span className="font-semibold">{transaction.amount}</span>
                  </li>
                )
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Resumen de Criptomonedas */}
        <Card>
          <CardHeader>
            <CardTitle>
              Resumen de Criptomonedas en {selectedNetwork.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue={currentNetworkData.cryptoOverview[0].name.toLowerCase()}
              className="w-full"
            >
              <TabsList>
                {currentNetworkData.cryptoOverview.map((crypto) => (
                  <TabsTrigger
                    key={crypto.name}
                    value={crypto.name.toLowerCase()}
                  >
                    {crypto.name}
                  </TabsTrigger>
                ))}
              </TabsList>
              {currentNetworkData.cryptoOverview.map((crypto) => (
                <TabsContent
                  key={crypto.name}
                  value={crypto.name.toLowerCase()}
                >
                  <div className="mt-4">
                    <div className="text-2xl font-bold">{crypto.price}</div>
                    <p className="text-sm text-muted-foreground">
                      1 {crypto.name} = {crypto.price}
                    </p>
                    <p
                      className={`text-sm ${
                        crypto.change.startsWith("+")
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {crypto.change} (24h)
                    </p>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
