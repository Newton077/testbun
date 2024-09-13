import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  Bell,
  ChevronDown,
  CreditCard,
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
  { id: "ethereum", name: "Star Network", icon: "🔷" },
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

export default function WalletDashboard() {
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]);
  const currentNetworkData = networkData[selectedNetwork.id];

  // Manejo de conexión con wagmi
  const { address, isConnected } = useAccount();
  const { connect, connectors, isLoading, pendingConnector } = useConnect();
  const { disconnect } = useDisconnect();

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
            <span>Swap</span>
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
              {isConnected ? (
                <>
                  <div className="mb-2">
                    <strong>Status:</strong> Conectado
                  </div>
                  <div className="mb-2">
                    <strong>Address:</strong> {address}
                  </div>
                </>
              ) : (
                <div className="mb-2">
                  <strong>Status:</strong> No conectado
                </div>
              )}
            </div>

            {isConnected ? (
              <Button
                variant="outline"
                onClick={() => disconnect()}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mt-4"
              >
                Desconectar Wallet
              </Button>
            ) : (
              <div>
                {connectors.map((connector) => (
                  <Button
                    key={connector.id}
                    onClick={() => connect({ connector })}
                    disabled={!connector.ready}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-4"
                  >
                    {connector.name}
                    {isLoading &&
                      connector.id === pendingConnector?.id &&
                      " (conectando)"}
                  </Button>
                ))}
              </div>
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
              <span>{address || "Conéctate"}</span>
            </Button>
          </div>
        </div>

        {/* Balance */}
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

        {/* Actions */}
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

        {/* Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Historial de Saldo en {selectedNetwork.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full bg-gradient-to-r from-blue-200 to-blue-100 rounded-md"></div>
          </CardContent>
        </Card>

        {/* Transactions and Crypto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Recent Transactions */}
          <Card>
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
                      <span className="font-semibold">
                        {transaction.amount}
                      </span>
                    </li>
                  )
                )}
              </ul>
            </CardContent>
          </Card>

          {/* Crypto Overview */}
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
        </div>
      </main>
    </div>
  );
}
