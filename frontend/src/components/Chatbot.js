
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Send,
  X,
  Bot,
  User
} from "lucide-react";

function Chatbot() {

  const [isOpen, setIsOpen] = useState(false);

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Hi! I'm your VoltStream AI assistant.",
      timestamp: new Date()
    }
  ]);

  const [qaMessages, setQaMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Ask questions from uploaded documents.",
      timestamp: new Date()
    }
  ]);

  const [agentMessages, setAgentMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Device Agent ready.",
      timestamp: new Date()
    }
  ]);

  const [inputMessage, setInputMessage] = useState("");

  const [isTyping, setIsTyping] = useState(false);

  // NEW MODE STATE
  const [chatMode, setChatMode] = useState("chat");
  const [agentMode, setAgentMode] = useState(false);

  const messages =
    chatMode === "qa"
      ? qaMessages
      : agentMode
        ? agentMessages
        : chatMessages;

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  };

  useEffect(() => {

    scrollToBottom();

  }, [messages]);



  const sendMessage = async () => {

    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    if (chatMode === "qa") {
      setQaMessages((prev) => [...prev, userMessage]);
    }
    else if (agentMode) {
      setAgentMessages((prev) => [...prev, userMessage]);
    }
    else {
      setChatMessages((prev) => [...prev, userMessage]);
    }

    setInputMessage("");

    setIsTyping(true);

    try {

      // MODE-BASED ENDPOINT
      const endpoint =
        chatMode === "qa"
          ? "/api/v1/qa"
          : agentMode
            ? "/api/v1/agent"
            : "/api/v1/chat";

      const response = await fetch(
        `http://127.0.0.1:8000${endpoint}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            message: inputMessage,

            context: {
              current_page: window.location.pathname,

              user_data: {
                dashboard_data: true,
                analytics_data: true,
                devices_data: true,
                billing_data: true
              }
            }
          })
        }
      );

      const data = await response.json();
      if (
        agentMode &&
        !data.response.toLowerCase().includes("error")
      ) {
        window.dispatchEvent(
          new CustomEvent("device-updated")
        );
      }

      const botMessage = {
        id: messages.length + 2,
        type: "bot",
        content: data.response,
        // agent: data.agent,
        sessionId: data.sessionId,
        requestId: data.requestId,
        timestamp: new Date()
      };




      if (chatMode === "qa") {
        setQaMessages((prev) => [...prev, botMessage]);
      }
      else if (agentMode) {
        setAgentMessages((prev) => [...prev, botMessage]);
      }
      else {
        setChatMessages((prev) => [...prev, botMessage]);
      }

    }
    catch (error) {

      console.error("Chat error:", error);

      const errorMessage = {
        id: messages.length + 2,
        type: "bot",
        content:
          "Sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date()
      };

      if (chatMode === "qa") {

        setQaMessages(
          (prev) => [...prev, errorMessage]
        );

      }

      else if (agentMode) {

        setAgentMessages(
          (prev) => [...prev, errorMessage]
        );

      }

      else {

        setChatMessages(
          (prev) => [...prev, errorMessage]
        );

      }

    }
    finally {
      setIsTyping(false);
    }
  };



  const handleKeyPress = (e) => {

    if (e.key === "Enter" && !e.shiftKey) {

      e.preventDefault();

      sendMessage();
    }
  };



  return (
    <>
      {/* CHAT TOGGLE BUTTON */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-6 right-6 z-50
          w-14 h-14 rounded-full
          bg-gradient-to-r from-cyan-500 to-blue-500
          shadow-2xl hover:shadow-cyan-500/30
          flex items-center justify-center
          transition-all duration-300
          ${isOpen ? "rotate-45" : ""}
        `}
      >
        <MessageCircle
          size={24}
          className="text-white"
        />
      </motion.button>



      {/* CHAT WINDOW */}
      <AnimatePresence>

        {isOpen && (

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 20
            }}

            animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }}

            exit={{
              opacity: 0,
              scale: 0.8,
              y: 20
            }}

            transition={{ duration: 0.3 }}

            className="
              fixed bottom-24 right-6 z-40
              w-[26%] h-[500px]
              bg-gradient-to-br from-[#111827]/95 to-[#1E293B]/95
              backdrop-blur-xl
              rounded-3xl
              border border-gray-800/50
              shadow-2xl
              flex flex-col
              overflow-hidden
            "
          >

            {/* HEADER */}
            <div
              className="
                p-4 border-b border-gray-800/50
                bg-gradient-to-r from-cyan-500/10 to-blue-500/10
              "
            >

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div
                    className="
                      w-8 h-8 rounded-full
                      bg-gradient-to-r from-cyan-500 to-blue-500
                      flex items-center justify-center
                    "
                  >
                    <Bot
                      size={16}
                      className="text-white"
                    />
                  </div>

                  <div>

                    <h3 className="text-white font-semibold">
                      VoltStream AI
                    </h3>

                    <p className="text-gray-400 text-sm">
                      Energy Management Assistant
                    </p>

                    {/* MODE SWITCH */}
                    {/* MODE SWITCH */}
                    <div className="flex gap-2 mt-2">

                      <button
                        onClick={() => setChatMode("chat")}
                        className={`
      px-3 py-1 rounded-lg text-xs
      transition-all
      ${chatMode === "chat"
                            ? "bg-cyan-500 text-white"
                            : "bg-gray-700 text-gray-300"
                          }
    `}
                      >
                        General Chat
                      </button>

                      <button
                        onClick={() => setChatMode("qa")}
                        className={`
      px-3 py-1 rounded-lg text-xs
      transition-all
      ${chatMode === "qa"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-700 text-gray-300"
                          }
    `}
                      >
                        Knowledge QA
                      </button>

                    </div>


                  </div>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="
                    text-gray-400
                    hover:text-white
                    transition-colors
                  "
                >
                  <X size={20} />
                </button>

              </div>
            </div>



            {/* MESSAGES */}
            <div
              className="
                flex-1 overflow-y-auto
                p-4 space-y-4
              "
            >

              {messages.map((message) => (

                <motion.div
                  key={message.id}

                  initial={{
                    opacity: 0,
                    y: 10
                  }}

                  animate={{
                    opacity: 1,
                    y: 0
                  }}

                  className={`
                    flex gap-3
                    ${message.type === "user"
                      ? "justify-end"
                      : "justify-start"
                    }
                  `}
                >

                  {message.type === "bot" && (

                    <div
                      className="
                        w-8 h-8 rounded-full
                        bg-gradient-to-r from-cyan-500 to-blue-500
                        flex items-center justify-center
                        flex-shrink-0
                      "
                    >
                      <Bot
                        size={14}
                        className="text-white"
                      />
                    </div>
                  )}

                  <div
                    className={`
                      max-w-[70%]
                      p-3 rounded-2xl
                      ${message.type === "user"
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white"
                        : "bg-[#374151]/50 text-gray-200 border border-gray-700/50"
                      }
                    `}
                  >

                    <p className="text-sm leading-relaxed">
                      {message.content}
                    </p>

                    {
                      agentMode &&
                      message.sessionId && (

                        <div
                          className="
        mt-4
        rounded-xl
        bg-slate-900/50
        border border-cyan-500/20
        p-3
        text-xs
      "
                        >

                          <div
                            className="
          text-cyan-400
          font-semibold
          mb-3
        "
                          >
                            ⚡ Agent Runtime Information
                          </div>


                          <div className="text-gray-400">
                            Session ID
                          </div>

                          <div
                            className="
          text-gray-300
          break-all
          mb-3
        "
                          >
                            {message.sessionId}
                          </div>

                          <div className="text-gray-400">
                            Request ID
                          </div>

                          <div
                            className="
          text-gray-300
          break-all
        "
                          >
                            {message.requestId}
                          </div>

                        </div>
                      )
                    }

                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit"
                        }
                      )}
                    </p>

                  </div>

                  {message.type === "user" && (

                    <div
                      className="
                        w-8 h-8 rounded-full
                        bg-gradient-to-r from-gray-600 to-gray-700
                        flex items-center justify-center
                        flex-shrink-0
                      "
                    >
                      <User
                        size={14}
                        className="text-white"
                      />
                    </div>
                  )}

                </motion.div>
              ))}



              {/* TYPING INDICATOR */}
              {isTyping && (

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 justify-start"
                >

                  <div
                    className="
                      w-8 h-8 rounded-full
                      bg-gradient-to-r from-cyan-500 to-blue-500
                      flex items-center justify-center
                    "
                  >
                    <Bot
                      size={14}
                      className="text-white"
                    />
                  </div>

                  <div
                    className="
                      bg-[#374151]/50
                      p-3 rounded-2xl
                      border border-gray-700/50
                    "
                  >

                    <div className="flex space-x-1">

                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>

                      <div
                        className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>

                      <div
                        className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>

                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />

            </div>



            {/* INPUT */}
            <div
              className="
                pr-5 pl-4 pt-4 pb-4 border-t border-gray-800/50
              "
            >
              <div className="flex gap-2">

                {/* Input */}
                <div className="flex flex-col gap-2">

                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) =>
                      setInputMessage(e.target.value)
                    }
                    onKeyPress={handleKeyPress}
                    placeholder={
                      chatMode === "qa"
                        ? "Ask questions from documents..."
                        : agentMode
                          ? "Control devices..."
                          : "Ask anything about energy..."
                    }
                    className="
        flex-1 px-4 py-2
        bg-[#374151]/50
        border border-gray-700/50
        rounded-xl
        text-white
        w-[10rem]
        placeholder-gray-400
      "
                  />

                </div>

                <div
                  className="
    flex
    bg-[#1F2937]
    border border-gray-700/50
    rounded-xl
    overflow-hidden
    shrink-0
  "
                >
                  <button
                    onClick={() => setAgentMode(false)}
                    className={`
      px-2 py-2
      text-xs
      font-medium
      transition-all
      duration-200
      ${!agentMode
                        ? "bg-cyan-500 text-white"
                        : "text-gray-300 hover:bg-gray-700"
                      }
    `}
                  >
                    🟢 Normal
                  </button>

                  <button
                    onClick={() => setAgentMode(true)}
                    className={`
      px-2 py-2
      text-xs
      font-medium
      transition-all
      duration-200
      ${agentMode
                        ? "bg-purple-500 text-white"
                        : "text-gray-300 hover:bg-gray-700"
                      }
    `}
                  >
                    🤖 Agent
                  </button>
                </div>

                {/* Bottom Row */}
                <div className="flex justify-between items-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={sendMessage}
                    disabled={
                      !inputMessage.trim() ||
                      isTyping
                    }
                    className="
        w-10 h-10 rounded-xl
        bg-gradient-to-r
        from-cyan-500
        to-blue-500
        flex items-center
        justify-center
      "
                  >
                    <Send
                      size={18}
                      className="text-white"
                    />
                  </motion.button>

                </div>

              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Chatbot;

