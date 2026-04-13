import { useEffect, useRef, useState } from "react";
import CafeIcon from "./CafeIcon";
import {
  analyzeUploadedPhoto,
  generateAssistantReply,
  getBudgetRecommendations,
} from "../lib/assistant";
import { apiGet } from "../lib/api";

const starterSuggestions = [
  "Suggest me something cold under Rs200",
  "I want something sweet but low sugar",
  "What goes well with coffee?",
  "Show me healthy options",
];

function AIAssistant({ open, onClose }) {
  const fileInputRef = useRef(null);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        'Hi! I\'m your AI food assistant. Ask me anything like "Suggest something cold under Rs200" or "I want something sweet but low sugar".',
    },
  ]);
  const [draft, setDraft] = useState("");
  const [photoPreview, setPhotoPreview] = useState("");
  const [budgetChooserOpen, setBudgetChooserOpen] = useState(false);
  const [catalog, setCatalog] = useState({ restaurants: [], items: [] });

  useEffect(() => {
    if (!open) return;
    apiGet("/catalog")
      .then((data) => setCatalog({
        restaurants: Array.isArray(data.restaurants) ? data.restaurants : [],
        items: Array.isArray(data.items) ? data.items : [],
      }))
      .catch(() => {});
  }, [open]);

  if (!open) return null;

  const pushAssistantReply = (text) => {
    setMessages((current) => [...current, { role: "assistant", text }]);
  };

  const sendQuery = (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setMessages((current) => [...current, { role: "user", text: trimmed }]);
    pushAssistantReply(generateAssistantReply(trimmed, catalog));
    setDraft("");
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
    setMessages((current) => [...current, { role: "user", text: `Uploaded photo: ${file.name}` }]);
    pushAssistantReply(analyzeUploadedPhoto(file, catalog));
  };

  const applyBudget = (amount) => {
    setMessages((current) => [...current, { role: "user", text: `Budget under Rs${amount}` }]);
    pushAssistantReply(getBudgetRecommendations(amount, catalog));
    setBudgetChooserOpen(false);
  };

  return (
    <div className="assistant-panel">
      <div className="assistant-panel__header">
        <div>
          <h3><CafeIcon kind="spark" /> AI Food Assistant</h3>
          <p><span className="assistant-panel__online-dot" /> Online now</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close assistant">
          x
        </button>
      </div>

      <div className="assistant-panel__body">
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} className={`assistant-message assistant-message--${message.role}`}>
            <p>{message.text}</p>
          </div>
        ))}

        {photoPreview ? (
          <div className="assistant-panel__preview">
            <img src={photoPreview} alt="Uploaded food preview" />
          </div>
        ) : null}

        <div className="assistant-panel__suggestions">
          {starterSuggestions.map((prompt) => (
            <button key={prompt} type="button" onClick={() => sendQuery(prompt)}>
              <span>Tip</span>
              <span>{prompt}</span>
            </button>
          ))}
        </div>
      </div>

      {budgetChooserOpen ? (
        <div className="assistant-panel__budget-sheet">
          {[150, 200, 300, 500].map((amount) => (
            <button key={amount} type="button" onClick={() => applyBudget(amount)}>
              Under Rs{amount}
            </button>
          ))}
        </div>
      ) : null}

      <div className="assistant-panel__actions">
        <button type="button" onClick={() => fileInputRef.current?.click()}>
          <CafeIcon kind="gift" /> Upload Photo
        </button>
        <button type="button" onClick={() => setBudgetChooserOpen((value) => !value)}>
          <CafeIcon kind="wallet" /> Budget Filter
        </button>
      </div>

      <div className="assistant-panel__composer">
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              sendQuery(draft);
            }
          }}
          placeholder="Ask me anything..."
        />
        <button type="button" onClick={() => sendQuery(draft)}>
          <CafeIcon kind="send" />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handlePhotoUpload}
      />
    </div>
  );
}

export default AIAssistant;
