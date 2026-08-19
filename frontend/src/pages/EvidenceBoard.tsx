import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  BackgroundVariant,
} from "@xyflow/react";
import type { Node, Edge, Connection, NodeChange, EdgeChange } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  FiArrowLeft,
  FiPlus,
  FiSave,
  FiTrash2,
  FiUser,
  FiFileText,
  FiMapPin,
  FiTruck,
  FiBriefcase,
  FiShare2,
  FiCheck,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useSocketContext } from "../context/SocketContext";
import { boardService } from "../services/boardService";

const PersonNode = ({ data }: { data: any }) => (
  <div className="px-4 py-3 rounded-xl border border-red-600/50 bg-zinc-950 text-white min-w-[170px] shadow-lg shadow-red-950/40 font-sans">
    <Handle type="target" position={Position.Top} className="w-2 h-2 bg-red-600 border-none" />
    <div className="flex items-center gap-2 mb-1">
      <div className="w-6 h-6 rounded bg-red-600/20 border border-red-600/40 flex items-center justify-center text-red-500">
        <FiUser className="w-3.5 h-3.5" />
      </div>
      <span className="text-[9px] font-mono uppercase font-bold text-red-400">PERSON</span>
    </div>
    <div className="font-bold text-xs leading-tight truncate">{data.label}</div>
    {data.subtitle && <div className="text-[10px] text-zinc-400 font-mono mt-0.5">{data.subtitle}</div>}
    <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-red-600 border-none" />
  </div>
);

const EvidenceNode = ({ data }: { data: any }) => (
  <div className="px-4 py-3 rounded-xl border border-red-600 bg-red-950/60 text-white min-w-[170px] shadow-lg shadow-red-950/60 font-sans">
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

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newNodeType, setNewNodeType] = useState<"person" | "evidence" | "location" | "vehicle" | "org">("person");
  const [newNodeLabel, setNewNodeLabel] = useState("");
  const [newNodeSubtitle, setNewNodeSubtitle] = useState("");

  useEffect(() => {
    if (caseId) {
      joinCase(caseId, {
        id: user?.id,
        name: user?.name || "Officer",
        badgeNumber: user?.badgeNumber || "INV-0000",
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
      if (!caseId) return;
      try {
        const res = await boardService.getBoardByCase(caseId);
        if (res.success && res.board && res.board.nodes?.length > 0) {
          setNodes(res.board.nodes);
          setEdges(res.board.edges || []);
        } else {
          setNodes([]);
          setEdges([]);
        }
      } catch {
        setNodes([]);
        setEdges([]);
      }
    };
    fetchBoard();
  }, [caseId]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => {
        const updated = applyNodeChanges(changes, nds);
        if (caseId) {
          broadcastBoardUpdate(caseId, updated, edges, user?.name || "Officer");
        }
        return updated;
      });
    },
    [caseId, edges, broadcastBoardUpdate, user]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => {
        const updated = applyEdgeChanges(changes, eds);
        if (caseId) {
          broadcastBoardUpdate(caseId, nodes, updated, user?.name || "Officer");
        }
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
        if (caseId) {
          broadcastBoardUpdate(caseId, nodes, updated, user?.name || "Officer");
        }
        return updated;
      });
    },
    [caseId, nodes, broadcastBoardUpdate, user]
  );

  const handleSaveBoard = async () => {
    if (!caseId) return;
    setIsSaving(true);
    try {
      await boardService.saveBoard(
        caseId,
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
    if (!newNodeLabel.trim() || !caseId) return;

    const newNode: Node = {
      id: `node-${Date.now()}`,
      type: newNodeType,
      position: {
        x: 100 + Math.random() * 300,
        y: 100 + Math.random() * 200,
      },
      data: {
        label: newNodeLabel,
        subtitle: newNodeSubtitle,
      },
    };

    const updatedNodes = [...nodes, newNode];
    setNodes(updatedNodes);
    broadcastBoardUpdate(caseId, updatedNodes, edges, user?.name || "Officer");

    setIsAddModalOpen(false);
    setNewNodeLabel("");
    setNewNodeSubtitle("");
  };

  const handleClearBoard = () => {
    if (!caseId) return;
    setNodes([]);
    setEdges([]);
    broadcastBoardUpdate(caseId, [], [], user?.name || "Officer");
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
            to={`/cases/${caseId || ""}`}
            className="p-2 rounded-xl border border-zinc-800 hover:border-red-600 text-zinc-400 hover:text-white transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-red-500">
                {caseId}
              </span>
              <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">
                Real-Time Evidence Pinboard
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-zinc-800 bg-black/20 text-[10px] font-mono text-zinc-400 mr-2">
            <FiUsers className="w-3.5 h-3.5 text-red-500" />
            <span>Connected:</span>
            <strong className="text-white">{roster.length || 1}</strong>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-red-600/20 cursor-pointer"
          >
            <FiPlus className="w-3.5 h-3.5" />
            <span>Add Node</span>
          </button>

          <button
            onClick={handleSaveBoard}
            disabled={isSaving}
            className="px-3.5 py-1.5 rounded-xl border border-zinc-800 hover:border-zinc-600 text-xs font-bold text-zinc-300 hover:text-white flex items-center gap-1.5 cursor-pointer"
          >
            {saveSuccess ? (
              <>
                <FiCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Saved</span>
              </>
            ) : (
              <>
                <FiSave className="w-3.5 h-3.5 text-red-500" />
                <span>{isSaving ? "Saving..." : "Save Board"}</span>
              </>
            )}
          </button>

          <button
            onClick={handleClearBoard}
            className="p-2 rounded-xl border border-zinc-800 hover:border-red-600 text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
            title="Clear Pinboard"
          >
            <FiTrash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div
        className="flex-1 rounded-3xl border relative overflow-hidden shadow-2xl"
        style={{
          backgroundColor: themeMode === "light" ? "#f1f5f9" : "#050507",
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
            variant={BackgroundVariant.Dots}
            gap={16}
            size={1.5}
            color={themeMode === "light" ? "#cbd5e1" : "#1f1f23"}
          />
          <Controls className="!bg-zinc-900 !border-zinc-800 !text-white !rounded-xl overflow-hidden" />
        </ReactFlow>

        {nodes.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
            <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500 mb-3">
              <FiShare2 className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Canvas Ready for Analysis</h3>
            <p className="text-xs text-zinc-400 max-w-sm">
              Click &quot;Add Node&quot; to place entities, suspects, locations, and evidence artifacts, then drag connectors to link relationships.
            </p>
          </div>
        )}
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
              <h3 className="text-xs font-bold uppercase tracking-wider">Place Pinboard Node</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-zinc-400 hover:text-red-500 cursor-pointer">
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCustomNode} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">Node Type</label>
                <select
                  value={newNodeType}
                  onChange={(e) => setNewNodeType(e.target.value as any)}
                  className="w-full p-2 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                  style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
                >
                  <option value="person" className="bg-zinc-900 text-white">Person / Suspect</option>
                  <option value="evidence" className="bg-zinc-900 text-white">Evidence Artifact</option>
                  <option value="location" className="bg-zinc-900 text-white">Geographic Location</option>
                  <option value="vehicle" className="bg-zinc-900 text-white">Vehicle / Plate</option>
                  <option value="org" className="bg-zinc-900 text-white">Organization / Entity</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">Title / Identifier *</label>
                <input
                  type="text"
                  required
                  value={newNodeLabel}
                  onChange={(e) => setNewNodeLabel(e.target.value)}
                  placeholder="e.g. John Doe / Weapon Recovered"
                  className="w-full p-2 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                  style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">Subtitle / Attribute</label>
                <input
                  type="text"
                  value={newNodeSubtitle}
                  onChange={(e) => setNewNodeSubtitle(e.target.value)}
                  placeholder="e.g. Verified Alibi / Serial #9901"
                  className="w-full p-2 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                  style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2" style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-zinc-700 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <FiPlus className="w-4 h-4" />
                  <span>Place Node</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
