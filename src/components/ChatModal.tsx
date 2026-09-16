import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Tag, 
  ShieldCheck, 
  CheckCheck, 
  Sparkles, 
  DollarSign, 
  Check, 
  XCircle,
  RefreshCw
} from 'lucide-react';
import { ChatConversation, ChatMessage, ListingItem } from '../types';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeItem: ListingItem | null;
  currency: 'USD' | 'KES';
  onOpenCheckout: (item: ListingItem) => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  isOpen,
  onClose,
  activeItem,
  currency,
  onOpenCheckout,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [showOfferInput, setShowOfferInput] = useState(false);
  const [offerAmount, setOfferAmount] = useState<number>(0);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeItem) {
      setOfferAmount(Math.round(activeItem.priceUSD * 0.9));
      // Load or simulate chat messages for this item
      loadChatForCurrentItem(activeItem.id);
    }
  }, [activeItem]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatForCurrentItem = async (itemId: string) => {
    try {
      const res = await fetch(`/api/chats/${itemId}`);
      const json = await res.json();
      if (json.success && json.chat?.messages) {
        setMessages(json.chat.messages);
      } else {
        // Initial welcome messages
        setMessages([
          {
            id: 'msg-init-1',
            senderId: activeItem?.seller.id || 'seller-1',
            senderName: activeItem?.seller.name || 'Seller',
            text: `Hi there! Thanks for your interest in ${activeItem?.title}. Let me know if you want to inspect it or arrange safe zone pickup!`,
            createdAt: 'Just now',
            isRead: true,
          },
        ]);
      }
    } catch (err) {
      console.warn('Failed to load chat from server', err);
    }
  };

  if (!isOpen || !activeItem) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText.trim();
    if (!text) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'current-user',
      senderName: 'You',
      text,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setIsSending(true);

    try {
      await fetch(`/api/chats/${activeItem.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: 'current-user',
          senderName: 'Alex Kiprono',
          text,
        }),
      });

      // Simulate realistic quick response from verified seller
      setTimeout(() => {
        setIsSending(false);
        const autoReplies = [
          "Sounds great! I'm available for safe meetup at Sarit Centre today, or I can ship it with tracking within 2 hours.",
          "Yes, it's 100% available and in flawless shape! You can purchase directly through Invictus Escrow and I'll package it immediately.",
          "I can accept that offer! Feel free to click 'Buy with Escrow' to lock the transaction.",
        ];
        const replyText = autoReplies[Math.floor(Math.random() * autoReplies.length)];

        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now() + 1}`,
            senderId: activeItem.seller.id,
            senderName: activeItem.seller.name,
            text: replyText,
            createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: true,
          },
        ]);
      }, 1400);
    } catch (err) {
      setIsSending(false);
    }
  };

  // Submit an official Offer card
  const handleSendOffer = () => {
    if (!offerAmount || offerAmount <= 0) return;

    const offerMsg: ChatMessage = {
      id: `offer-${Date.now()}`,
      senderId: 'current-user',
      senderName: 'You',
      text: `Made an official offer of $${offerAmount} (Ksh ${(offerAmount * 130).toLocaleString()})`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
      offerDetails: {
        amountUSD: offerAmount,
        amountKES: offerAmount * 130,
        status: 'pending',
      },
    };

    setMessages((prev) => [...prev, offerMsg]);
    setShowOfferInput(false);

    // Simulated Seller acceptance after 2 seconds
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now() + 2}`,
          senderId: activeItem.seller.id,
          senderName: activeItem.seller.name,
          text: `I accept your offer of $${offerAmount}! Go ahead and complete the escrow hold so I can reserve the item for you.`,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: true,
        },
      ]);
    }, 2000);
  };

  const quickReplies = [
    'Is this item still available?',
    'Can you do local pickup today?',
    'Does it come with the original box?',
    'What is your best price?',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden h-[94vh] flex flex-col animate-in slide-in-from-bottom-6 duration-200">
        
        {/* Top Header */}
        <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/95 sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img
                src={activeItem.seller.avatar}
                alt={activeItem.seller.name}
                className="w-10 h-10 rounded-full object-cover border border-emerald-500"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-slate-900"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white">{activeItem.seller.name}</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-semibold">
                  Verified
                </span>
              </div>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <span>★ {activeItem.seller.rating}</span> • <span>Replies in &lt;15m</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Item Floating Summary Bar */}
        <div className="px-4 py-2 bg-slate-800/80 border-b border-slate-700/60 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={activeItem.images[0]}
              alt={activeItem.title}
              className="w-9 h-9 rounded-lg object-cover border border-slate-700"
            />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{activeItem.title}</p>
              <span className="text-[11px] font-bold text-emerald-400">
                {currency === 'KES' ? `Ksh ${activeItem.priceKES.toLocaleString()}` : `$${activeItem.priceUSD}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowOfferInput(!showOfferInput)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-bold transition flex items-center gap-1"
            >
              <Tag className="w-3 h-3 text-amber-400" />
              <span>Offer</span>
            </button>
            <button
              onClick={() => onOpenCheckout(activeItem)}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-black transition flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Buy</span>
            </button>
          </div>
        </div>

        {/* Offer Input Drawer */}
        {showOfferInput && (
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-xs font-bold text-slate-300">Make an Offer:</span>
              <div className="relative flex-1 max-w-[140px]">
                <span className="absolute left-2.5 top-1.5 text-slate-400 text-xs">$</span>
                <input
                  type="number"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-6 pr-2 py-1 text-xs text-white font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
              <span className="text-[10px] text-slate-400">
                (Ksh {(offerAmount * 130).toLocaleString()})
              </span>
            </div>
            <button
              onClick={handleSendOffer}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs px-3 py-1.5 rounded-lg shadow transition"
            >
              Send Offer
            </button>
          </div>
        )}

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Safe Meeting Warning */}
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-2.5 text-center text-[11px] text-slate-300 space-y-0.5">
            <p className="font-semibold text-emerald-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Invictus In-App Protection
            </p>
            <p className="text-slate-400">
              Never share bank details or pay outside the app. Use safe public zones or tracked delivery.
            </p>
          </div>

          {messages.map((msg) => {
            const isMe = msg.senderId === 'current-user';

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs shadow-sm ${
                    isMe
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-xs'
                      : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-bl-xs'
                  }`}
                >
                  {/* If this is an offer message card */}
                  {msg.offerDetails ? (
                    <div className="space-y-2 py-1">
                      <div className="flex items-center gap-1.5 font-bold text-amber-300">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Official Price Offer</span>
                      </div>
                      <div className="text-base font-black">
                        ${msg.offerDetails.amountUSD}{' '}
                        <span className="text-xs font-normal opacity-80">
                          (Ksh {msg.offerDetails.amountKES.toLocaleString()})
                        </span>
                      </div>
                      <div className="pt-1.5 border-t border-white/20 flex items-center justify-between text-[10px]">
                        <span className="uppercase font-bold tracking-wider">
                          Status: {msg.offerDetails.status}
                        </span>
                        <button
                          onClick={() => onOpenCheckout(activeItem)}
                          className="bg-white text-slate-900 font-bold px-2 py-0.5 rounded shadow"
                        >
                          Checkout Now
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  )}
                </div>

                <span className="text-[9px] text-slate-500 px-1 flex items-center gap-1">
                  <span>{msg.createdAt}</span>
                  {isMe && <CheckCheck className="w-3 h-3 text-emerald-400" />}
                </span>
              </div>
            );
          })}

          {isSending && (
            <div className="flex items-center gap-1 text-[11px] text-slate-400 italic">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
              <span>{activeItem.seller.name} is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-1.5 bg-slate-900 border-t border-slate-800/80 flex gap-1.5 overflow-x-auto no-scrollbar">
          {quickReplies.map((qr, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(qr)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap border border-slate-700 transition flex-shrink-0"
            >
              {qr}
            </button>
          ))}
        </div>

        {/* Bottom Input Field */}
        <div className="p-3 bg-slate-900/95 border-t border-slate-800 flex items-center gap-2 sticky bottom-0">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 disabled:opacity-40 transition active:scale-95 shadow-md flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
