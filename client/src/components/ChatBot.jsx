import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2 } from 'lucide-react';
import { chatApi } from '../api/chat.api';

const ChatBot = ({ userId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([
        { sender: 'bot', text: "Namaste! I'm FinBot, your personal finance assistant. How can I help you today?" }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [chatHistory, isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || isLoading) return;

        const userMsg = { sender: 'user', text: message };
        setChatHistory(prev => [...prev, userMsg]);
        setMessage('');
        setIsLoading(true);

        try {
            const response = await chatApi.sendMessage(userId, message, chatHistory);
            const botMsg = { sender: 'bot', text: response.data };
            setChatHistory(prev => [...prev, botMsg]);
        } catch (error) {
            console.error(error);
            setChatHistory(prev => [...prev, { sender: 'bot', text: "I'm sorry, I'm having trouble connecting right now. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group ${isOpen ? 'bg-rose-500 rotate-90' : 'bg-gradient-to-br from-indigo-600 to-purple-600 hover:shadow-indigo-500/50'}`}
            >
                {isOpen ? <X className="text-white" size={32} /> : (
                    <div className="relative">
                        <MessageCircle className="text-white" size={32} />
                        <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                        </span>
                    </div>
                )}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="absolute bottom-24 right-0 w-[380px] sm:w-[420px] h-[600px] max-h-[80vh] bg-slate-900/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-bottom-10 duration-300">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600/90 to-purple-600/90 p-6 flex items-center justify-between border-b border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner group-hover:scale-110 transition-transform">
                                <Bot className="text-white" size={28} />
                            </div>
                            <div>
                                <h3 className="text-white font-black text-lg tracking-tight">FinBot</h3>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                                    <p className="text-indigo-100/70 text-xs font-medium uppercase tracking-widest">AI Financial Guide</p>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/70 hover:text-white"
                        >
                            <Minimize2 size={24} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                        {chatHistory.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                <div className={`max-w-[85%] p-4 rounded-3xl text-sm shadow-xl ${
                                    msg.sender === 'user' 
                                    ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-tr-none border border-indigo-400/30' 
                                    : 'bg-white/5 text-slate-100 border border-white/10 rounded-tl-none backdrop-blur-md'
                                }`}>
                                    <div className="flex items-center gap-2 mb-2 opacity-50 text-[10px] font-black uppercase tracking-widest">
                                        {msg.sender === 'user' ? <><User size={10} /> You</> : <><Bot size={10} /> FinBot</>}
                                    </div>
                                    <div className="whitespace-pre-wrap leading-relaxed font-medium tracking-wide">
                                        {msg.text}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 border border-white/10 p-4 rounded-3xl rounded-tl-none backdrop-blur-md">
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-150"></div>
                                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-300"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-6 bg-white/5 border-t border-white/10 flex gap-3 backdrop-blur-xl">
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-sm font-medium"
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="bg-gradient-to-br from-indigo-500 to-purple-600 hover:shadow-indigo-500/30 shadow-lg p-4 rounded-2xl transition-all active:scale-90 disabled:opacity-50 group"
                        >
                            <Send className="text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" size={24} />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatBot;
