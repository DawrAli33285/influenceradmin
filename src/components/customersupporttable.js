import avatar from "../avatar.webp";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { MoonLoader } from "react-spinners";
import { useEffect, useRef, useState } from "react";
import { BASE_URL } from "../base_url";
import io from "socket.io-client";

export default function Inbox() {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessage] = useState([]);
  const [currentBuyerId, setCurrentBuyerId] = useState();
  const [loading, setLoading] = useState(true);
  const [buyerList, setBuyerList] = useState([]);
  const [currentBuyer, setCurrentBuyer] = useState();
  const socketRef = useRef();

  const sendMessage = async () => {
    try {
      let response = await axios.post(`${BASE_URL}/create-messages`, {
        message: inputMessage,
        sendBy: "Admin",
        buyer_id: currentBuyerId,
      });
      setInputMessage("");
      socketRef.current.emit("adminmessage", { currentBuyerId, inputMessage });
      setLoading(false);
      setMessage((prev) => [...prev, { sendBy: "Admin", message: inputMessage }]);
    } catch (e) {
      const errorMsg =
        e?.response?.data?.error || "Client error, please try again.";
      toast.error(errorMsg, { containerId: "inboxToast" });
    }
  };

  useEffect(() => {
    getBuyerList();
  }, []);

  const getBuyerList = async () => {
    try {
      let response = await axios.get(`${BASE_URL}/getBuyerList`);
      setBuyerList(response.data.buyersList);
      setLoading(false);
    } catch (e) {
      const errorMsg =
        e?.response?.data?.error || "Client error, please try again.";
      toast.error(errorMsg, { containerId: "inboxToast" });
    }
  };

  useEffect(() => {
    let socket = new io(`http://localhost:5000`);
    socketRef.current = socket;
    socket.emit("adminconnected", { role: "admin" });
    socket.on("message", (data) => {
      setMessage((prev) => [
        ...prev,
        { sendBy: "Buyer", message: data.data.inputMessage },
      ]);
    });
  }, []);

  useEffect(() => {
    if (currentBuyerId) {
      getMessages();
      socketRef?.current?.emit("updateCurrentBuyerId", currentBuyerId);
    }
  }, [currentBuyerId]);

  const getMessages = async () => {
    try {
      let response = await axios.get(
        `${BASE_URL}/get-messages/${currentBuyerId}`
      );
      setMessage(response.data.messages);
      setLoading(false);
    } catch (e) {
      const errorMsg =
        e?.response?.data?.error || "Client error, please try again.";
      toast.error(errorMsg, { containerId: "inboxToast" });
    }
  };

  return (
    <>
      <ToastContainer containerId={"inboxToast"} />
      <div className="w-full flex h-screen">
       
        <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto border-r">
          {buyerList.map((buyer, i) => (
            <div
              key={buyer._id}
              className="cursor-pointer p-2 border-b hover:bg-gray-200"
              onClick={() => {
                setCurrentBuyerId(buyer._id);
                setCurrentBuyer(buyer);
              }}
            >
              <p>{buyer?.user_id?.username}</p>
            </div>
          ))}
        </div>

    
        <div className="w-3/4 flex flex-col">
          {loading ? (
            <div className="flex justify-center items-center flex-1">
              <MoonLoader color="#6B33E3" size={100} />
            </div>
          ) : (
            <>
            
              {currentBuyer && (
                <div className="flex items-center gap-5 border-b p-4">
                  <img
                    src={avatar}
                    alt="img"
                    className="rounded-full w-10 h-10 object-cover"
                  />
                  <h2 className="text-lg font-bold">
                    {currentBuyer?.user_id?.username}
                  </h2>
                </div>
              )}

             
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                {messages?.length>0?messages?.map((message, i) => (
                  <div key={i} className="space-y-4">
                    {message?.sendBy === "Admin" ? (
                      <div className="flex justify-end">
                        <div className="bg-green-500 text-white p-3 rounded-lg max-w-[75%]">
                          <p>{message?.message}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-start items-start space-x-3">
                        <img
                          src={avatar}
                          alt="Support Avatar"
                          className="rounded-full w-8 h-8 object-cover"
                        />
                        <div className="bg-gray-200 text-gray-800 p-3 rounded-lg max-w-[75%]">
                          <p>{message?.message}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )):<div className="w-full flex justify-center items-center">
                    <p>No messages found</p>
                    </div>}
              </div>

             
              <div className="flex items-center bg-gray-100 p-4 border-t">
                <input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-white border rounded-full px-4 py-2 outline-none"
                />
                <button
                  onClick={sendMessage}
                  className="bg-green-500 text-white px-4 py-2 rounded-full ml-2"
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
