import { useState } from "react";

const useChatID = () => {
    const [newChatID, setNewChatID] = useState<string>('');

    const generateChatID = (id1: string, id2: string) => {
        const firstId = id1.localeCompare(id2) < 0 ? id1 : id2;
        const secondId = id1.localeCompare(id2) < 0 ? id2 : id1;
        setNewChatID(`${firstId}${secondId}`);
    };

    return { newChatID, generateChatID };
};

export default useChatID;