/**
 * @file legatum-wireframe.tsx
 * @description Componente principal da aplicação Legatum, que gerencia a interface
 * de uma plataforma de herança digital. Inclui navegação, visualização
 * de dashboards, gerenciamento de bens, herdeiros e mensagens póstumas.
 */

"use client"; // Necessário no Next.js para componentes com estado que usam hooks (ex: useState).

// Importações de hooks e componentes do React e bibliotecas externas.
import { useState } from "react";
import { Button } from "@/components/ui/button"; // Componente de botão reutilizável
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Componentes para criar cards de exibição de conteúdo
import { Input } from "@/components/ui/input"; // Componente de campo de texto
import { Label } from "@/components/ui/label"; // Componente de rótulo para formulários
import { Textarea } from "@/components/ui/textarea"; // Componente de área de texto
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Componentes para caixas de seleção
import { Badge } from "@/components/ui/badge"; // Componente para exibir pequenos emblemas de status
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Componente para criar diálogos/modais
import {
  Shield,
  Plus,
  Users,
  FileText,
  Settings,
  Key,
  Mail,
  Folder,
  Bitcoin,
  Clock,
  Bell,
  Trash2,
  Edit,
  Eye,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react"; // Biblioteca de ícones SVG

// Definição de tipos TypeScript para garantir a consistência dos dados na aplicação.

// Tipos para navegação entre as diferentes telas da aplicação.
type Screen = "dashboard" | "assets" | "heirs" | "messages" | "protocol";
// Tipos para as categorias de bens digitais.
type AssetType = "password" | "crypto" | "file" | "account";
// Tipos para as permissões que um herdeiro pode ter.
type HeirPermission = "passwords" | "crypto" | "files" | "accounts";

// Interface que define a estrutura de um "Bem Digital".
interface Asset {
  id: number;
  type: AssetType;
  name: string;
  details: string;
  status: "active" | "pending";
}

// Interface que define a estrutura de um "Herdeiro".
interface Heir {
  id: number;
  name: string;
  email: string;
  permissions: HeirPermission[];
  status: "verified" | "pending";
}

// Interface que define a estrutura de uma "Mensagem Póstuma".
interface Message {
  id: number;
  recipientId: number;
  recipientName: string;
  content: string;
  createdAt: string;
}

/**
 * Componente principal da aplicação Legatum.
 * @returns {JSX.Element} A interface completa da aplicação.
 */
export default function LegatumWireframe() {
  // Estado que controla qual tela está sendo exibida no momento. Inicia com 'dashboard'.
  const [currentScreen, setCurrentScreen] = useState<Screen>("dashboard");

  // Estados para armazenar os dados da aplicação (bens, herdeiros, mensagens).
  // Estes dados são "mockados" (fictícios) para fins de demonstração.
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: 1,
      type: "password",
      name: "Gmail Account",
      details: "personal@gmail.com",
      status: "active",
    },
    {
      id: 2,
      type: "crypto",
      name: "Bitcoin Wallet",
      details: "0.5 BTC",
      status: "active",
    },
    {
      id: 3,
      type: "file",
      name: "Family Photos",
      details: "Google Drive folder",
      status: "pending",
    },
  ]);
  const [heirs, setHeirs] = useState<Heir[]>([
    {
      id: 1,
      name: "Maria Silva",
      email: "maria@email.com",
      permissions: ["passwords", "files"],
      status: "verified",
    },
    {
      id: 2,
      name: "João Santos",
      email: "joao@email.com",
      permissions: ["crypto"],
      status: "pending",
    },
  ]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      recipientId: 1,
      recipientName: "Maria Silva",
      content: "Querida Maria, estas são as instruções para acessar...",
      createdAt: "15/01/2024",
    },
  ]);

  // Estados para controlar a visibilidade (aberto/fechado) dos modais de adição.
  const [isAddAssetModalOpen, setAddAssetModalOpen] = useState(false);
  const [isAddHeirModalOpen, setAddHeirModalOpen] = useState(false);
  const [isAddMessageModalOpen, setAddMessageModalOpen] = useState(false);

  // Funções "Handler" para manipular a lógica de negócio (adição de novos itens).

  /**
   * Adiciona um novo bem digital à lista de bens.
   * @param {Omit<Asset, "id" | "status">} newAsset - O novo bem a ser adicionado.
   */
  const handleAddAsset = (newAsset: Omit<Asset, "id" | "status">) => {
    // Adiciona o novo bem à lista, gerando um ID único com base no tempo atual.
    setAssets([...assets, { ...newAsset, id: Date.now(), status: "active" }]);
    setAddAssetModalOpen(false); // Fecha o modal após a adição.
  };

  /**
   * Adiciona um novo herdeiro à lista de herdeiros.
   * @param {Omit<Heir, "id" | "status">} newHeir - O novo herdeiro a ser adicionado.
   */
  const handleAddHeir = (newHeir: Omit<Heir, "id" | "status">) => {
    // Adiciona o novo herdeiro à lista com status inicial "pending".
    setHeirs([...heirs, { ...newHeir, id: Date.now(), status: "pending" }]);
    setAddHeirModalOpen(false); // Fecha o modal.
  };

  /**
   * Adiciona uma nova mensagem póstuma à lista de mensagens.
   * @param {Omit<Message, "id" | "createdAt">} newMessage - A nova mensagem a ser adicionada.
   */
  const handleAddMessage = (newMessage: Omit<Message, "id" | "createdAt">) => {
    // Encontra o herdeiro destinatário para obter o nome.
    const recipient = heirs.find((h) => h.id === newMessage.recipientId);
    if (recipient) {
      // Adiciona a mensagem com os dados completos (ID, nome do destinatário, data).
      setMessages([
        ...messages,
        {
          ...newMessage,
          recipientName: recipient.name,
          id: Date.now(),
          createdAt: new Date().toLocaleDateString("pt-BR"),
        },
      ]);
      setAddMessageModalOpen(false); // Fecha o modal.
    }
  };

  /**
   * Componente de modal para adicionar um novo bem digital.
   */
  const AddAssetModal = () => {
    // Estado local para controlar os dados do formulário do novo bem.
    const [newAssetData, setNewAssetData] = useState({
      type: "" as AssetType,
      name: "",
      details: "",
    });

    // Função chamada ao submeter o formulário do modal.
    const handleSubmit = () => {
      // Validação simples para garantir que os campos foram preenchidos.
      if (newAssetData.type && newAssetData.name && newAssetData.details) {
        handleAddAsset(newAssetData);
        setNewAssetData({ type: "" as AssetType, name: "", details: "" }); // Limpa o formulário.
      }
    };

    return (
      <Dialog open={isAddAssetModalOpen} onOpenChange={setAddAssetModalOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Bem Digital</DialogTitle>
            <DialogDescription>
              Cadastre um novo item para sua herança digital.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="asset-type">Tipo de Bem</Label>
              <Select
                onValueChange={(value: AssetType) =>
                  setNewAssetData({ ...newAssetData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="password">Senha/Conta</SelectItem>
                  <SelectItem value="crypto">Criptoativo</SelectItem>
                  <SelectItem value="file">Arquivo</SelectItem>
                  <SelectItem value="account">Conta Online</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="asset-name">Nome do Bem</Label>
              <Input
                id="asset-name"
                placeholder="Ex: Conta Gmail"
                value={newAssetData.name}
                onChange={(e) =>
                  setNewAssetData({ ...newAssetData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="asset-details">Detalhes</Label>
              <Textarea
                id="asset-details"
                placeholder="Informações importantes sobre este bem"
                value={newAssetData.details}
                onChange={(e) =>
                  setNewAssetData({ ...newAssetData, details: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddAssetModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Salvar Bem Digital</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  /**
   * Componente de modal para adicionar um novo herdeiro.
   */
  const AddHeirModal = () => {
    // Estado local para os dados do formulário do novo herdeiro.
    const [newHeirData, setNewHeirData] = useState({
      name: "",
      email: "",
      permissions: [] as HeirPermission[],
    });

    // Controla a seleção de permissões (checkboxes).
    const handlePermissionChange = (
      permission: HeirPermission,
      checked: boolean
    ) => {
      setNewHeirData((prev) => ({
        ...prev,
        permissions: checked
          ? [...prev.permissions, permission] // Adiciona permissão se marcado
          : prev.permissions.filter((p) => p !== permission), // Remove se desmarcado
      }));
    };

    // Submete o formulário do novo herdeiro.
    const handleSubmit = () => {
      if (newHeirData.name && newHeirData.email) {
        handleAddHeir(newHeirData);
        setNewHeirData({ name: "", email: "", permissions: [] }); // Limpa o formulário.
      }
    };

    return (
      <Dialog open={isAddHeirModalOpen} onOpenChange={setAddHeirModalOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Herdeiro</DialogTitle>
            <DialogDescription>
              Configure um novo herdeiro e suas permissões.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="heir-name">Nome Completo</Label>
              <Input
                id="heir-name"
                placeholder="Nome do herdeiro"
                value={newHeirData.name}
                onChange={(e) =>
                  setNewHeirData({ ...newHeirData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="heir-email">E-mail</Label>
              <Input
                id="heir-email"
                type="email"
                placeholder="email@exemplo.com"
                value={newHeirData.email}
                onChange={(e) =>
                  setNewHeirData({ ...newHeirData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Permissões de Acesso</Label>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    "passwords",
                    "crypto",
                    "files",
                    "accounts",
                  ] as HeirPermission[]
                ).map((permission) => (
                  <label
                    key={permission}
                    className="flex items-center space-x-2 p-2 border rounded-md cursor-pointer has-[:checked]:bg-muted has-[:checked]:border-primary transition-colors"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      checked={newHeirData.permissions.includes(permission)}
                      onChange={(e) =>
                        handlePermissionChange(permission, e.target.checked)
                      }
                    />
                    <span className="text-sm capitalize">{permission}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddHeirModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Adicionar Herdeiro</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  /**
   * Componente de modal para adicionar uma nova mensagem póstuma.
   */
  const AddMessageModal = () => {
    // Estado local para o formulário da nova mensagem.
    const [newMessageData, setNewMessageData] = useState({
      recipientId: 0,
      recipientName: "",
      content: "",
    });

    // Submete o formulário da nova mensagem.
    const handleSubmit = () => {
      if (newMessageData.recipientId && newMessageData.content) {
        handleAddMessage(newMessageData);
        setNewMessageData({ recipientId: 0, recipientName: "", content: "" }); // Limpa o formulário.
      }
    };

    return (
      <Dialog
        open={isAddMessageModalOpen}
        onOpenChange={setAddMessageModalOpen}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Criar Nova Mensagem Póstuma</DialogTitle>
            <DialogDescription>
              Escreva uma mensagem para ser entregue a um herdeiro.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message-recipient">Destinatário</Label>
              <Select
                onValueChange={(value) =>
                  setNewMessageData({
                    ...newMessageData,
                    recipientId: Number(value),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um herdeiro" />
                </SelectTrigger>
                <SelectContent>
                  {heirs.map((heir) => (
                    <SelectItem key={heir.id} value={String(heir.id)}>
                      {heir.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message-content">Mensagem</Label>
              <Textarea
                id="message-content"
                placeholder="Escreva sua mensagem póstuma aqui..."
                rows={6}
                value={newMessageData.content}
                onChange={(e) =>
                  setNewMessageData({
                    ...newMessageData,
                    content: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddMessageModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Salvar Mensagem</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  /**
   * Componente de Navegação principal, exibido no topo da página.
   */
  const Navigation = () => (
    <nav className="glass-effect sticky top-0 z-50 border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="h-10 w-10 text-primary drop-shadow-sm" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full flex items-center justify-center">
                <CheckCircle className="h-2.5 w-2.5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-heading font-black text-black">
                Legatum
              </h1>
              <p className="text-xs text-muted-foreground font-body">
                Herança Digital Segura
              </p>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            {[
              { id: "dashboard", label: "Dashboard", icon: Shield },
              { id: "assets", label: "Bens Digitais", icon: Key },
              { id: "heirs", label: "Herdeiros", icon: Users },
              { id: "messages", label: "Mensagens", icon: Mail },
              { id: "protocol", label: "Protocolo", icon: Settings },
            ].map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={currentScreen === id ? "default" : "ghost"}
                onClick={() => setCurrentScreen(id as Screen)}
                className="flex items-center gap-2 font-body font-medium transition-all duration-200 hover:scale-105"
              >
                <Icon className="h-4 w-4" />
                <span className="hidden xl:inline">{label}</span>
              </Button>
            ))}
          </div>
          <div className="lg:hidden">
            <Select
              value={currentScreen}
              onValueChange={(value) => setCurrentScreen(value as Screen)}
            >
              <SelectTrigger className="w-[150px] font-body">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dashboard">Dashboard</SelectItem>
                <SelectItem value="assets">Bens Digitais</SelectItem>
                <SelectItem value="heirs">Herdeiros</SelectItem>
                <SelectItem value="messages">Mensagens</SelectItem>
                <SelectItem value="protocol">Protocolo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </nav>
  );

  /**
   * Componente que renderiza a tela de Dashboard/Visão Geral.
   */
  const DashboardScreen = () => (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-heading font-black text-balance mb-2">
            Visão Geral
          </h2>
          <p className="text-lg text-muted-foreground font-body">
            Gerencie sua herança digital com segurança e tranquilidade
          </p>
        </div>
        <Button
          size="lg"
          className="flex items-center gap-2 font-body font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          onClick={() => setAddAssetModalOpen(true)}
        >
          <Plus className="h-5 w-5" />
          Adicionar Bem Digital
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-hover border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-body font-semibold text-muted-foreground uppercase tracking-wide">
              Bens Digitais
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Key className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-black text-foreground">
              {assets.length}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <p className="text-sm text-muted-foreground font-body">
                cadastrados e protegidos
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover border-l-4 border-l-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-body font-semibold text-muted-foreground uppercase tracking-wide">
              Herdeiros
            </CardTitle>
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Users className="h-5 w-5 text-secondary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-black text-foreground">
              {heirs.length}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle className="h-4 w-4 text-secondary" />
              <p className="text-sm text-muted-foreground font-body">
                designados e verificados
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-body font-semibold text-muted-foreground uppercase tracking-wide">
              Status do Sistema
            </CardTitle>
            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
              <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-heading font-black text-green-600 dark:text-green-400">
              Ativo
            </div>
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <p className="text-sm text-muted-foreground font-body">
                protocolo configurado
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  /**
   * Componente que renderiza a tela de gerenciamento de Bens Digitais.
   */
  const AssetsScreen = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-balance">Bens Digitais</h2>
        <Button
          className="flex items-center gap-2"
          onClick={() => setAddAssetModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Adicionar Bem
        </Button>
      </div>
      <div className="grid gap-4">
        {assets.map((asset) => (
          <Card key={asset.id} className="card-hover">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="hidden sm:block p-2 rounded-lg bg-muted">
                    {asset.type === "password" && (
                      <Mail className="h-8 w-8 text-primary" />
                    )}
                    {asset.type === "crypto" && (
                      <Bitcoin className="h-8 w-8 text-secondary" />
                    )}
                    {asset.type === "file" && (
                      <Folder className="h-8 w-8 text-muted-foreground" />
                    )}
                    {asset.type === "account" && (
                      <Users className="h-8 w-8 text-green-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{asset.name}</h3>
                    <p className="text-muted-foreground">{asset.details}</p>
                    <Badge variant="secondary" className="mt-2 capitalize">
                      {asset.type}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2 self-end sm:self-center">
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  /**
   * Componente que renderiza a tela de gerenciamento de Herdeiros.
   */
  const HeirsScreen = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-balance">Herdeiros</h2>
        <Button
          className="flex items-center gap-2"
          onClick={() => setAddHeirModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Adicionar Herdeiro
        </Button>
      </div>
      <div className="grid gap-6">
        {heirs.map((heir) => (
          <Card key={heir.id} className="card-hover">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex-shrink-0 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{heir.name}</h3>
                    <p className="text-muted-foreground">{heir.email}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {heir.permissions.map((permission) => (
                        <Badge
                          key={permission}
                          variant="outline"
                          className="capitalize"
                        >
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 self-end sm:self-center">
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  /**
   * Componente que renderiza a tela de gerenciamento de Mensagens Póstumas.
   */
  const MessagesScreen = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-3xl font-bold text-balance">Mensagens Póstumas</h2>
        <Button
          className="flex items-center gap-2"
          onClick={() => setAddMessageModalOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Nova Mensagem
        </Button>
      </div>
      <div className="grid gap-4">
        {messages.map((message) => (
          <Card key={message.id} className="card-hover">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-grow">
                  <h3 className="font-semibold">
                    Mensagem para {message.recipientName}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Criada em {message.createdAt}
                  </p>
                  <p className="mt-2 text-sm italic">
                    "{message.content.substring(0, 60)}..."
                  </p>
                </div>
                <div className="flex gap-2 self-end sm:self-center">
                  <Button variant="outline" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  /**
   * Componente que renderiza a tela de configuração do Protocolo de Sucessão.
   */
  const ProtocolScreen = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-balance">Protocolo de Sucessão</h2>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Configuração de Inatividade
          </CardTitle>
          <CardDescription>
            Defina por quanto tempo o sistema deve aguardar antes de ativar o
            protocolo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Label>Período de Inatividade</Label>
          <Select defaultValue="6">
            <SelectTrigger className="w-full md:w-1/2 lg:w-1/3">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 meses</SelectItem>
              <SelectItem value="6">6 meses</SelectItem>
              <SelectItem value="12">12 meses</SelectItem>
              <SelectItem value="24">24 meses</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  );

  /**
   * Função para renderizar a tela correta com base no estado `currentScreen`.
   * @returns {JSX.Element} O componente da tela ativa.
   */
  const renderScreen = () => {
    switch (currentScreen) {
      case "dashboard":
        return <DashboardScreen />;
      case "assets":
        return <AssetsScreen />;
      case "heirs":
        return <HeirsScreen />;
      case "messages":
        return <MessagesScreen />;
      case "protocol":
        return <ProtocolScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  // Renderização principal do componente.
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderScreen()}
      </main>

      {/* Os modais são renderizados aqui, no nível principal, para estarem
          sempre disponíveis, independentemente da tela ativa, corrigindo o bug. */}
      <AddAssetModal />
      <AddHeirModal />
      <AddMessageModal />
    </div>
  );
}
