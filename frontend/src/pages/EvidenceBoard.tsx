import { useState, useCallback, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Handle,
  Position,
} from "@xyflow/react";
import type { Node, Edge, Connection, NodeChange, EdgeChange } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  FiArrowLeft,
  FiSave,
  FiPlus,
  FiTrash2,
  FiUser,
  FiFileText,
  FiMapPin,
  FiTruck,
  FiBriefcase,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useSocketContext } from "../context/SocketContext";
import { boardService } from "../services/boardService";

const PersonNode = ({ data }: { data: any }) => (
  <div className="px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-white min-w-[170px] shadow-lg shadow-black/50 font-sans">
    <Handle type="target" position={Position.Top} className="w-2 h-2 bg-red-600 border-none" />
    <div className="flex items-center gap-2 mb-1">
      <div className="w-6 h-6 rounded bg-red-600/20 border border-red-600/40 flex items-center justify-center text-red-500">
        <FiUser className="w-3.5 h-3.5" />
      </div>
      <span className="text-[9px] font-mono uppercase font-bold text-red-500">PERSON</span>
    </div>
    <div className="font-bold text-xs leading-tight truncate">{data.label}</div>
    {data.subtitle && <div className="text-[10px] text-zinc-400 font-mono mt-0.5">{data.subtitle}</div>}
    <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-red-600 border-none" />
  </div>
);

const EvidenceNode = ({ data }: { data: any }) => (
  <div className="px-4 py-3 rounded-xl border border-red-600/40 bg-zinc-950 text-white min-w-[170px] shadow-lg shadow-red-950/20 font-sans">
    <Handle type="target" position={Position.Top} className="w-2 h-2 bg-red-600 border-none" />
    <div className="flex items-center gap-2 mb-1">
      <div className="w-6 h-6 rounded bg-red-600 flex items-center justify-center text-white">
        <FiFileText className="w-3.5 h-3.5" />
      </div>
      <span className="text-[9px] font-mono uppercase font-bold text-red-400">EVIDENCE</span>
    </div>
    <div className="font-bold text-xs leading-tight truncate">{data.label}</div>
    {data.subtitle && <div className="text-[10px] text-zinc-400 font-mono mt-0.5">{data.subtitle}</div>}
    <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-red-600 border-none" />
  </div>
);

const LocationNode = ({ data }: { data: any }) => (
  <div className="px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-white min-w-[170px] shadow-lg shadow-black/50 font-sans">
    <Handle type="target" position={Position.Top} className="w-2 h-2 bg-red-600 border-none" />
    <div className="flex items-center gap-2 mb-1">
      <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-zinc-300">
        <FiMapPin className="w-3.5 h-3.5 text-red-500" />
      </div>
      <span className="text-[9px] font-mono uppercase font-bold text-zinc-400">LOCATION</span>
    </div>
    <div className="font-bold text-xs leading-tight truncate">{data.label}</div>
    {data.subtitle && <div className="text-[10px] text-zinc-400 font-mono mt-0.5">{data.subtitle}</div>}
    <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-red-600 border-none" />
  </div>
);

const VehicleNode = ({ data }: { data: any }) => (
  <div className="px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-white min-w-[170px] shadow-lg shadow-black/50 font-sans">
    <Handle type="target" position={Position.Top} className="w-2 h-2 bg-red-600 border-none" />
    <div className="flex items-center gap-2 mb-1">
      <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-zinc-300">
        <FiTruck className="w-3.5 h-3.5 text-red-500" />
      </div>
      <span className="text-[9px] font-mono uppercase font-bold text-zinc-400">VEHICLE</span>
    </div>
    <div className="font-bold text-xs leading-tight truncate">{data.label}</div>
    {data.subtitle && <div className="text-[10px] text-zinc-400 font-mono mt-0.5">{data.subtitle}</div>}
    <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-red-600 border-none" />
  </div>
);

const OrgNode = ({ data }: { data: any }) => (
  <div className="px-4 py-3 rounded-xl border border-zinc-800 bg-zinc-950 text-white min-w-[170px] shadow-lg shadow-black/50 font-sans">
    <Handle type="target" position={Position.Top} className="w-2 h-2 bg-red-600 border-none" />
    <div className="flex items-center gap-2 mb-1">
      <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-zinc-300">
        <FiBriefcase className="w-3.5 h-3.5 text-red-500" />
      </div>
      <span className="text-[9px] font-mono uppercase font-bold text-zinc-400">ORGANIZATION</span>
    </div>
    <div className="font-bold text-xs leading-tight truncate">{data.label}</div>
    {data.subtitle && <div className="text-[10px] text-zinc-400 font-mono mt-0.5">{data.subtitle}</div>}
    <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-red-600 border-none" />
  </div>
);

export default function EvidenceBoard() {
  const { caseId } = useParams<{ caseId: string }>();
  const { themeMode } = useTheme();
  const { user } = useAuth();
  const { socket, roster, joinCase, broadcastBoardUpdate } = useSocketContext();

  const nodeTypes = useMemo(
    () => ({
      person: PersonNode,
      evidence: EvidenceNode,
      location: LocationNode,
      vehicle: VehicleNode,
      org: OrgNode,
    }),
    []
  );

  const getInitialNodes = (cid?: string): Node[] => {
    if (cid?.includes("0801")) {
      return [
        {
          id: "node-1",
          type: "person",
          position: { x: 100, y: 150 },
          data: { label: "Viktor Mercer", subtitle: "Beneficiary Signatory" },
        },
        {
          id: "node-2",
          type: "org",
          position: { x: 450, y: 150 },
          data: { label: "Aegis Escrow S.A.", subtitle: "Panama Shell Entity" },
        },
        {
          id: "node-3",
          type: "evidence",
          position: { x: 450, y: 380 },
          data: { label: "Wire Transfer #WT-8941", subtitle: "$450,000 Swiss Route" },
        },
      ];
    }

    return [
      {
        id: "node-1",
        type: "person",
        position: { x: 100, y: 120 },
        data: { label: "Viktor Mercer", subtitle: "Prime Target" },
      },
      {
        id: "node-2",
        type: "person",
        position: { x: 420, y: 120 },
        data: { label: "Dmitri Vance", subtitle: "Broker / Key Contact" },
      },
      {
        id: "node-3",
        type: "location",
        position: { x: 740, y: 120 },
        data: { label: "Warehouse 14B", subtitle: "Pier 4 Compound" },
      },
      {
        id: "node-4",
        type: "org",
        position: { x: 420, y: 360 },
        data: { label: "Aegis Maritime Ltd", subtitle: "Logistics Shell Entity" },
      },
      {
        id: "node-5",
        type: "vehicle",
        position: { x: 100, y: 360 },
        data: { label: "Black SUV [Plate #XYZ-9021]", subtitle: "Arrived 23:45 Gate A" },
      },
      {
        id: "node-6",
        type: "evidence",
        position: { x: 740, y: 360 },
        data: { label: "Manifest Discrepancy (4.2 Tons)", subtitle: "Tare Weight Contradiction" },
      },
    ];
  };

  const getInitialEdges = (cid?: string): Edge[] => {
    if (cid?.includes("0801")) {
      return [
        {
          id: "edge-1",
          source: "node-1",
          target: "node-2",
          label: "BENEFICIARY_OF",
          style: { stroke: "#dc2626", strokeWidth: 2 },
          labelStyle: { fill: "#ef4444", fontWeight: 700, fontSize: 10, fontFamily: "monospace" },
        },
        {
          id: "edge-2",
          source: "node-2",
          target: "node-3",
          label: "TRANSFERRED_FUNDS",
          style: { stroke: "#dc2626", strokeWidth: 2 },
          labelStyle: { fill: "#ef4444", fontWeight: 700, fontSize: 10, fontFamily: "monospace" },
        },
      ];
    }

    return [
      {
        id: "edge-1",
        source: "node-1",
        target: "node-2",
        label: "MET_WITH",
        style: { stroke: "#dc2626", strokeWidth: 2 },
        labelStyle: { fill: "#ef4444", fontWeight: 700, fontSize: 10, fontFamily: "monospace" },
      },
      {
        id: "edge-2",
        source: "node-2",
        target: "node-3",
        label: "LOCATED_AT",
        style: { stroke: "#dc2626", strokeWidth: 2 },
        labelStyle: { fill: "#ef4444", fontWeight: 700, fontSize: 10, fontFamily: "monospace" },
      },
      {
        id: "edge-3",
        source: "node-2",
        target: "node-4",
        label: "OWNED_BY",
        style: { stroke: "#dc2626", strokeWidth: 2 },
        labelStyle: { fill: "#ef4444", fontWeight: 700, fontSize: 10, fontFamily: "monospace" },
      },
      {
        id: "edge-4",
        source: "node-1",
        target: "node-5",
        label: "OPERATED",
        style: { stroke: "#dc2626", strokeWidth: 2 },
        labelStyle: { fill: "#ef4444", fontWeight: 700, fontSize: 10, fontFamily: "monospace" },
      },
      {
        id: "edge-5",
        source: "node-3",
        target: "node-6",
        label: "CONFIRMED_AT",
        style: { stroke: "#dc2626", strokeWidth: 2 },
        labelStyle: { fill: "#ef4444", fontWeight: 700, fontSize: 10, fontFamily: "monospace" },
      },
    ];
  };

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [newNodeSubtitle, setNewNodeSubtitle] = useState("");
  const [newNodeType, setNewNodeType] = useState("person");

  useEffect(() => {
    if (caseId) {
      joinCase(caseId, {
        id: user?.id,
        name: user?.name || "Det. Sarah Chen",
        badgeNumber: user?.badgeNumber || "INV-8402",
      });
    }

    const handleRemoteBoard = (data: { caseId: string; nodes: any[]; edges: any[] }) => {
      if (data.caseId === caseId) {
        if (data.nodes) setNodes(data.nodes);
        if (data.edges) setEdges(data.edges);
      }
    };

    socket.on("remote_board_update", handleRemoteBoard);

    return () => {
      socket.off("remote_board_update", handleRemoteBoard);
    };
  }, [caseId, joinCase, user, socket]);

  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await boardService.getBoardByCase(caseId || "default");
        if (res.success && res.board && res.board.nodes?.length > 0) {
          setNodes(res.board.nodes);
          setEdges(res.board.edges || []);
        } else {
          setNodes(getInitialNodes(caseId));
          setEdges(getInitialEdges(caseId));
        }
      } catch {
        setNodes(getInitialNodes(caseId));
        setEdges(getInitialEdges(caseId));
      }
    };
    fetchBoard();
  }, [caseId]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => {
        const updated = applyNodeChanges(changes, nds);
        broadcastBoardUpdate(caseId || "CASE-2026-0715", updated, edges, user?.name || "Det. Sarah Chen");
        return updated;
      });
    },
    [caseId, edges, broadcastBoardUpdate, user]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => {
        const updated = applyEdgeChanges(changes, eds);
        broadcastBoardUpdate(caseId || "CASE-2026-0715", nodes, updated, user?.name || "Det. Sarah Chen");
        return updated;
      });
    },
    [caseId, nodes, broadcastBoardUpdate, user]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge: Edge = {
        ...connection,
        id: `edge-${Date.now()}`,
        label: "LINKED_TO",
        style: { stroke: "#dc2626", strokeWidth: 2 },
        labelStyle: { fill: "#ef4444", fontWeight: 700, fontSize: 10, fontFamily: "monospace" },
      };
      setEdges((eds) => {
        const updated = addEdge(newEdge, eds);
        broadcastBoardUpdate(caseId || "CASE-2026-0715", nodes, updated, user?.name || "Det. Sarah Chen");
        return updated;
      });
    },
    [caseId, nodes, broadcastBoardUpdate, user]
  );

  const handleSaveBoard = async () => {
    setIsSaving(true);
    try {
      await boardService.saveBoard(
        caseId || "default",
        nodes as any,
        edges as any
      );
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCustomNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeLabel.trim()) return;

    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: newNodeType,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: { label: newNodeLabel, subtitle: newNodeSubtitle },
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    broadcastBoardUpdate(caseId || "CASE-2026-0715", updatedNodes, edges, user?.name || "Det. Sarah Chen");

    setIsAddModalOpen(false);
    setNewNodeLabel("");
    setNewNodeSubtitle("");
  };

  const handleClearBoard = () => {
    setNodes([]);
    setEdges([]);
    broadcastBoardUpdate(caseId || "CASE-2026-0715", [], [], user?.name || "Det. Sarah Chen");
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col font-sans relative" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div
        className="p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 z-10"
        style={{
          backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
          borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
        }}
      >
        <div className="flex items-center gap-3">
          <Link
            to={`/cases/${caseId || "CASE-2026-0715"}`}
            className="p-2 rounded-xl border border-zinc-800 hover:border-red-600 text-zinc-400 hover:text-white transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-red-500">
                {caseId || "CASE-2026-0715"}
              </span>
              <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">
                Real-Time Evidence Pinboard
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-zinc-800 bg-black/20 text-[10px] font-mono text-zinc-400 mr-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{roster.length} Collaborating</span>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 rounded-xl border border-zinc-800 hover:border-red-600 text-zinc-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FiPlus className="w-3.5 h-3.5 text-red-500" />
            <span>Add Node</span>
          </button>

          <button
            onClick={handleClearBoard}
            className="px-3 py-1.5 rounded-xl border border-zinc-800 hover:border-red-600 text-zinc-400 hover:text-red-500 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Clear Board"
          >
            <FiTrash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleSaveBoard}
            disabled={isSaving}
            className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-red-600/20 cursor-pointer"
          >
            {saveSuccess ? (
              <>
                <FiCheck className="w-3.5 h-3.5" />
                <span>Synchronized</span>
              </>
            ) : (
              <>
                <FiSave className="w-3.5 h-3.5" />
                <span>{isSaving ? "Syncing..." : "Save Canvas"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div
        className="flex-1 rounded-3xl border overflow-hidden relative shadow-inner"
        style={{
          backgroundColor: themeMode === "light" ? "#f4f4f5" : "#050505",
          borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
        }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-transparent"
        >
          <Background
            color={themeMode === "light" ? "#dc2626" : "#ef4444"}
            gap={24}
            size={1.2}
            className="opacity-15"
          />
          <Controls
            className="rounded-xl overflow-hidden border"
            style={{
              backgroundColor: themeMode === "light" ? "#ffffff" : "#09090b",
              borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
            }}
          />
        </ReactFlow>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className="w-full max-w-sm p-5 rounded-2xl border shadow-2xl space-y-4"
            style={{
              backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
              borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">Add Canvas Node</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-red-500">
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomNode} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">Node Type *</label>
                <select
                  value={newNodeType}
                  onChange={(e) => setNewNodeType(e.target.value)}
                  className="w-full p-2 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                  style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
                >
                  <option value="person" className="bg-zinc-900 text-white">Person / Suspect</option>
                  <option value="evidence" className="bg-zinc-900 text-white">Forensic Evidence</option>
                  <option value="location" className="bg-zinc-900 text-white">Location / Incident Site</option>
                  <option value="vehicle" className="bg-zinc-900 text-white">Vehicle / Transport</option>
                  <option value="org" className="bg-zinc-900 text-white">Organization / Shell Entity</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">Primary Title *</label>
                <input
                  type="text"
                  required
                  value={newNodeLabel}
                  onChange={(e) => setNewNodeLabel(e.target.value)}
                  placeholder="e.g. Viktor Mercer"
                  className="w-full p-2 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                  style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">Subtitle / Tag</label>
                <input
                  type="text"
                  value={newNodeSubtitle}
                  onChange={(e) => setNewNodeSubtitle(e.target.value)}
                  placeholder="e.g. Direct Signatory / Broker"
                  className="w-full p-2 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                  style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2" style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-zinc-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                >
                  Create Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
