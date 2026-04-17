import { useEffect } from "react";
import { message } from "antd";
import messageService from "../../../utils/services/message-service";

export const GlobalMessage = () => {
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        const sub = messageService.message$.subscribe((state) => {
            if (!state?.content) return;

            messageApi[state.type](state.content);
        });

        return () => sub.unsubscribe();
    }, []);

    return <>{contextHolder}</>;
};