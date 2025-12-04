import { useState, useEffect, useCallback, useRef } from 'react';

const WS_URL = "ws://localhost:8080/ws/debate"; // Placeholder for the actual WebSocket server address

const useDebateSocket = (debateId) => {
    const [isConnected, setIsConnected] = useState(false);
    const [latestMessage, setLatestMessage] = useState(null);
    const [error, setError] = useState(null);
    const socketRef = useRef(null);

    const initializeSocket = useCallback(() => {
        if (socketRef.current) {
            socketRef.current.close();
        }

        const socket = new WebSocket(`${WS_URL}/${debateId}`);
        socketRef.current = socket;

        socket.onopen = () => {
            console.log(`WebSocket connected for debate ${debateId}`);
            setIsConnected(true);
            setError(null);
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setLatestMessage(data);
            } catch (e) {
                console.error("Error parsing message:", e);
                setLatestMessage({ type: 'error', payload: 'Invalid message format' });
            }
        };

        socket.onclose = (event) => {
            console.log(`WebSocket disconnected for debate ${debateId}:`, event.code, event.reason);
            setIsConnected(false);
            // Attempt to reconnect after a delay if it wasn't closed intentionally by the hook cleanup
            if (!socketRef.current.isClosing) {
                setTimeout(initializeSocket, 3000); 
            }
        };

        socket.onerror = (err) => {
            console.error("WebSocket error:", err);
            setError(err);
            socket.close();
        };

    }, [debateId]);

    // Effect to manage connection lifecycle
    useEffect(() => {
        if (!debateId) {
            if (socketRef.current) {
                socketRef.current.close();
            }
            return;
        }
        
        initializeSocket();

        // Cleanup function
        return () => {
            if (socketRef.current) {
                // Mark socket as intentionally closing so reconnect logic is skipped in onclose
                socketRef.current.isClosing = true; 
                socketRef.current.close();
            }
        };
    }, [debateId, initializeSocket]);

    // Function to send data (e.g., user votes, comments)
    const sendMessage = useCallback((message) => {
        if (socketRef.current && isConnected) {
            try {
                const payload = JSON.stringify(message);
                socketRef.current.send(payload);
                return true;
            } catch (e) {
                console.error("Failed to send message:", e);
                return false;
            }
        }
        console.warn("Socket not connected, cannot send message.");
        return false;
    }, [isConnected]);

    return { isConnected, latestMessage, error, sendMessage, close: () => {
        if (socketRef.current) {
            socketRef.current.isClosing = true;
            socketRef.current.close();
        }
    } };
};

export default useDebateSocket;