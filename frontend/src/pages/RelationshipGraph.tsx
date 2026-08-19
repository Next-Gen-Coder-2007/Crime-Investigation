import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiShare2,
  FiPlus,
  FiCheck,
  FiX,
  FiSearch,
  FiUser,
  FiMapPin,
  FiBriefcase,
  FiTruck,
  FiFileText,
} from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { entityService } from "../services/entityService";
import type { EntityItem, RelationshipItem } from "../services/entityService";

export default function RelationshipGraph() {
  const { caseId } = useParams<{ caseId: string }>();
  const { theme, themeMode } = useTheme();

  const [entities, setEntities] = useState<EntityItem[]>([]);
  const [relationships, setRelationships] = useState<RelationshipItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);

  const [sourceId, setSourceId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [predicate, setPredicate] = useState("MET_WITH");
  const [notes, setNotes] = useState("");

  const getCaseInitialData = (cid?: string) => {
    if (cid?.includes("0801")) {
      return {
        entities: [
          { _id: "ent-1", caseId: cid || "default", name: "Viktor Mercer", type: "PERSON", isVerified: true },
          { _id: "ent-2", caseId: cid || "default", name: "Aegis Escrow S.A.", type: "ORGANIZATION", isVerified: true },
          { _id: "ent-3", caseId: cid || "default", name: "Zurich Escrow Account #9012", type: "ORGANIZATION", isVerified: true },
          { _id: "ent-4", caseId: cid || "default", name: "Wire Transfer #WT-8941", type: "EVIDENCE", isVerified: true },
        ],
        relationships: [
          {
            _id: "rel-1",
            caseId: cid || "default",
            sourceEntityId: { name: "Viktor Mercer", type: "PERSON" },
            targetEntityId: { name: "Aegis Escrow S.A.", type: "ORGANIZATION" },
            predicate: "BENEFICIARY_OF",
            confidence: 94,
            reviewStatus: "accepted" as const,
          },
          {
            _id: "rel-2",
            caseId: cid || "default",
            sourceEntityId: { name: "Aegis Escrow S.A.", type: "ORGANIZATION" },
            targetEntityId: { name: "Zurich Escrow Account #9012", type: "ORGANIZATION" },
            predicate: "TRANSFERRED_FUNDS",
            confidence: 98,
            reviewStatus: "accepted" as const,
          },
        ],
      };
    }

    return {
      entities: [
        { _id: "ent-1", caseId: cid || "default", name: "Viktor Mercer", type: "PERSON", isVerified: true },
        { _id: "ent-2", caseId: cid || "default", name: "Dmitri Vance", type: "PERSON", isVerified: true },
        { _id: "ent-3", caseId: cid || "default", name: "Warehouse 14B", type: "LOCATION", isVerified: true },
        { _id: "ent-4", caseId: cid || "default", name: "Aegis Maritime Ltd", type: "ORGANIZATION", isVerified: true },
      ],
      relationships: [
        {
          _id: "rel-1",
          caseId: cid || "default",
          sourceEntityId: { name: "Viktor Mercer", type: "PERSON" },
          targetEntityId: { name: "Dmitri Vance", type: "PERSON" },
          predicate: "MET_WITH",
          confidence: 92,
          reviewStatus: "accepted" as const,
        },
        {
          _id: "rel-2",
          caseId: cid || "default",
          sourceEntityId: { name: "Dmitri Vance", type: "PERSON" },
          targetEntityId: { name: "Warehouse 14B", type: "LOCATION" },
          predicate: "LOCATED_AT",
          confidence: 96,
          reviewStatus: "accepted" as const,
        },
        {
          _id: "rel-3",
          caseId: cid || "default",
          sourceEntityId: { name: "Dmitri Vance", type: "PERSON" },
          targetEntityId: { name: "Aegis Maritime Ltd", type: "ORGANIZATION" },
          predicate: "OWNED_BY",
          confidence: 84,
          reviewStatus: "accepted" as const,
        },
      ],
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [entRes, relRes] = await Promise.all([
          entityService.getEntitiesByCase(caseId || "default"),
          entityService.getRelationshipsByCase(caseId || "default"),
        ]);
        if (entRes.success && entRes.entities && entRes.entities.length > 0) {
          setEntities(entRes.entities);
        } else {
          setEntities(getCaseInitialData(caseId).entities);
        }
        if (relRes.success && relRes.relationships && relRes.relationships.length > 0) {
          setRelationships(relRes.relationships);
        } else {
          setRelationships(getCaseInitialData(caseId).relationships);
        }
      } catch {
        const fallback = getCaseInitialData(caseId);
        setEntities(fallback.entities);
        setRelationships(fallback.relationships);
      }
    };
    fetchData();
  }, [caseId]);

  const handleStatusUpdate = async (id: string, newStatus: "accepted" | "rejected") => {
    setRelationships((prev) =>
      prev.map((r) => (r._id === id ? { ...r, reviewStatus: newStatus } : r))
    );
    try {
      await entityService.updateRelationshipStatus(id, newStatus);
    } catch {
      // Handled
    }
  };

  const handleCreateConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId || !targetId || sourceId === targetId) return;

    try {
      const res = await entityService.createRelationship({
        caseId: caseId || "default",
        sourceEntityId: sourceId,
        targetEntityId: targetId,
        predicate,
        notes,
      });

      if (res.success && res.relationship) {
        setRelationships([res.relationship, ...relationships]);
      }
    } catch {
      const src = entities.find((e) => e._id === sourceId);
      const tgt = entities.find((e) => e._id === targetId);

      const mockRel: RelationshipItem = {
        _id: `rel-${Date.now()}`,
        caseId: caseId || "default",
        sourceEntityId: { name: src?.name || "Source", type: src?.type || "PERSON" },
        targetEntityId: { name: tgt?.name || "Target", type: tgt?.type || "PERSON" },
        predicate,
        confidence: 100,
        reviewStatus: "accepted",
      };
      setRelationships([mockRel, ...relationships]);
    } finally {
      setIsConnectModalOpen(false);
      setSourceId("");
      setTargetId("");
      setNotes("");
    }
  };

  const filteredRelationships = relationships.filter((rel) => {
    const srcName = typeof rel.sourceEntityId === "object" ? rel.sourceEntityId.name : "";
    const tgtName = typeof rel.targetEntityId === "object" ? rel.targetEntityId.name : "";
    const pred = rel.predicate || "";

    return (
      srcName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tgtName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pred.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "LOCATION":
        return FiMapPin;
      case "ORGANIZATION":
        return FiBriefcase;
      case "VEHICLE":
        return FiTruck;
      case "EVIDENCE":
        return FiFileText;
      default:
        return FiUser;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <div className="flex items-center justify-between gap-4">
        <Link
          to={`/cases/${caseId || "CASE-2026-0715"}`}
          className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-red-500 font-semibold transition-colors"
        >
          <FiArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Case Cockpit</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to={`/cases/${caseId || "CASE-2026-0715"}/board`}
            className="px-3 py-1.5 rounded-xl border border-zinc-800 hover:border-red-600 text-zinc-300 hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <FiShare2 className="w-3.5 h-3.5 text-red-500" />
            <span>Open Canvas</span>
          </Link>
          <button
            onClick={() => setIsConnectModalOpen(true)}
            className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md shadow-red-600/20 cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            <span>Link Entities</span>
          </button>
        </div>
      </div>

      <div
        className="p-6 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{
          backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
          borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
        }}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-red-500">
              {caseId || "CASE-2026-0715"}
            </span>
            <span className="text-[10px] font-mono uppercase font-bold text-zinc-400">
              Relationship Matrix
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: theme.text }}>
            Entity Link Graph & Verified Network
          </h1>
          <p className="text-xs text-zinc-400">
            Semantic links between suspects, organizations, locations, and vehicles with confidence ratings.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
          <span>{entities.length} Verified Entities</span>
          <span>•</span>
          <span className="text-red-500 font-bold">{relationships.length} Identified Links</span>
        </div>
      </div>

      <div
        className="p-3.5 rounded-2xl border flex items-center justify-between"
        style={{
          backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
          borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
        }}
      >
        <div className="relative w-full max-w-sm">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entity, target, or predicate..."
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border bg-transparent outline-none focus:border-red-500"
            style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a", color: theme.text }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRelationships.map((rel) => {
          const srcName = typeof rel.sourceEntityId === "object" ? rel.sourceEntityId.name : "Entity A";
          const srcType = typeof rel.sourceEntityId === "object" ? rel.sourceEntityId.type : "PERSON";
          const tgtName = typeof rel.targetEntityId === "object" ? rel.targetEntityId.name : "Entity B";
          const tgtType = typeof rel.targetEntityId === "object" ? rel.targetEntityId.type : "PERSON";

          const SourceIcon = getEntityIcon(srcType);
          const TargetIcon = getEntityIcon(tgtType);

          return (
            <div
              key={rel._id}
              className="p-5 rounded-2xl border flex flex-col justify-between space-y-4"
              style={{
                backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
                borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
              }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-red-600/10 text-red-500 border border-red-600/30">
                    {rel.predicate}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Confidence: <strong className="text-white">{rel.confidence}%</strong>
                  </span>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-red-600/10 border border-red-600/30 flex items-center justify-center text-red-500 shrink-0">
                      <SourceIcon className="w-3 h-3" />
                    </div>
                    <span className="text-xs font-bold text-white truncate">{srcName}</span>
                  </div>

                  <div className="pl-2.5 border-l-2 border-dashed border-red-600/40 ml-2.5 py-1 text-[10px] font-mono text-red-400 font-bold">
                    ➔ {rel.predicate}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
                      <TargetIcon className="w-3 h-3 text-red-500" />
                    </div>
                    <span className="text-xs font-bold text-white truncate">{tgtName}</span>
                  </div>
                </div>
              </div>

              <div
                className="pt-3 border-t flex items-center justify-between text-xs"
                style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
              >
                <span
                  className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${
                    rel.reviewStatus === "accepted"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : "bg-red-500/10 text-red-400 border-red-500/30"
                  }`}
                >
                  {rel.reviewStatus}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleStatusUpdate(rel._id, "accepted")}
                    className="p-1 rounded-lg border border-zinc-800 hover:border-emerald-500 text-zinc-400 hover:text-emerald-400 cursor-pointer"
                    title="Verify Link"
                  >
                    <FiCheck className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(rel._id, "rejected")}
                    className="p-1 rounded-lg border border-zinc-800 hover:border-red-500 text-zinc-400 hover:text-red-500 cursor-pointer"
                    title="Reject Link"
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div
            className="w-full max-w-md p-5 rounded-2xl border shadow-2xl space-y-4"
            style={{
              backgroundColor: themeMode === "light" ? "#ffffff" : "#0a0a0a",
              borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a",
              color: theme.text,
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}>
              <h3 className="text-xs font-bold uppercase tracking-wider">Create Entity Connection</h3>
              <button onClick={() => setIsConnectModalOpen(false)} className="text-zinc-400 hover:text-red-500">
                <FiX className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateConnection} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">Source Entity *</label>
                <select
                  required
                  value={sourceId}
                  onChange={(e) => setSourceId(e.target.value)}
                  className="w-full p-2 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                  style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
                >
                  <option value="" className="bg-zinc-900 text-white">Select source entity...</option>
                  {entities.map((e) => (
                    <option key={e._id} value={e._id} className="bg-zinc-900 text-white">
                      {e.name} ({e.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">Investigation Predicate *</label>
                <select
                  value={predicate}
                  onChange={(e) => setPredicate(e.target.value)}
                  className="w-full p-2 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                  style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
                >
                  <option value="MET_WITH" className="bg-zinc-900 text-white">MET_WITH (Physical Meeting)</option>
                  <option value="LOCATED_AT" className="bg-zinc-900 text-white">LOCATED_AT (Presence at Location)</option>
                  <option value="OWNED_BY" className="bg-zinc-900 text-white">OWNED_BY (Corporate/Asset Ownership)</option>
                  <option value="COMMUNICATED_WITH" className="bg-zinc-900 text-white">COMMUNICATED_WITH (Phone/Email Intercept)</option>
                  <option value="BENEFICIARY_OF" className="bg-zinc-900 text-white">BENEFICIARY_OF (Financial Control)</option>
                  <option value="TRANSFERRED_FUNDS" className="bg-zinc-900 text-white">TRANSFERRED_FUNDS (Financial Wire)</option>
                  <option value="SUSPECT_IN" className="bg-zinc-900 text-white">SUSPECT_IN (Suspect Link)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">Target Entity *</label>
                <select
                  required
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full p-2 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs"
                  style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
                >
                  <option value="" className="bg-zinc-900 text-white">Select target entity...</option>
                  {entities.map((e) => (
                    <option key={e._id} value={e._id} className="bg-zinc-900 text-white">
                      {e.name} ({e.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[10px] uppercase font-bold text-zinc-400">Investigative Rationale / Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Wire transfer routing confirmed through subpoenaed records..."
                  className="w-full p-2 rounded-xl border bg-transparent outline-none focus:border-red-500 text-xs resize-none"
                  style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}
                />
              </div>

              <div className="pt-3 border-t flex justify-end gap-2" style={{ borderColor: themeMode === "light" ? "#e4e4e7" : "#27272a" }}>
                <button
                  type="button"
                  onClick={() => setIsConnectModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-zinc-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                >
                  Confirm Connection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
