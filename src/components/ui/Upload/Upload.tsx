import { Button, Spin, Tooltip, Upload, message } from "antd";
import React, { useState } from "react";
import { DeleteOutlined, DownloadOutlined, UploadOutlined } from "@ant-design/icons";
import confirmService from "../../../utils/services/confirm-service";

interface IUploadProps {
    disabled?: boolean;
}

interface UploadedFile {
    uid: string; // UID của Ant Design
    name: string;
    status: "done" | "error" | "uploading"; // Chỉ nhận giá trị "done" hoặc "error"
    id?: string; // UUID từ server,
    url?: string;
}

export const IUpload: React.FC<IUploadProps> = ({ disabled = false }) => {
    const url = "http://localhost:5110/api/file";
    const [fileList, setFileList] = useState<UploadedFile[]>([]);
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
    const setLoading = (uid: string, value: boolean) => {
        setLoadingMap(prev => ({ ...prev, [uid]: value }));
    };
    // Upload từng file
    const customUpload = async (options: any) => {
        const { file, onSuccess, onError } = options;

        // 👉 thêm file ngay lập tức
        const tempFile: UploadedFile = {
            uid: file.uid,
            name: file.name,
            status: "uploading"
        };

        setFileList(prev => [...prev, tempFile]);
        setLoading(file.uid, true);

        const formData = new FormData();
        formData.append("files", file);

        try {
            const response = await fetch(url, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) throw new Error();

            const result = await response.json();

            // 👉 update thành công
            setFileList(prev =>
                prev.map(f =>
                    f.uid === file.uid
                        ? {
                            ...f,
                            status: "done",
                            id: result.data[0].id,
                            url: result.data[0].file_path
                        }
                        : f
                )
            );

            message.success(`${file.name} tải thành công`);
            onSuccess("ok");
        } catch (error) {
            // ❌ remove nếu fail
            setFileList(prev =>
                prev.filter(f => f.uid !== file.uid)
            );

            message.error(`${file.name} upload thất bại`);
            onError(error);
        } finally {
            setLoading(file.uid, false);
        }
    };

    // Xóa file bằng UUID
    const handleRemove = async (file: UploadedFile) => {
        if (!file.id) return;

        setLoading(file.uid, true);

        try {
            const response = await fetch(`${url}/${file.id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setFileList(prev => prev.filter(x => x.id !== file.id));
                message.success("Xóa thành công");
            } else {
                throw new Error();
            }
        } catch {
            message.error("Xóa thất bại");
        } finally {
            setLoading(file.uid, false);
        }
    };
    const handleDownload = async (file: UploadedFile) => {
        if (!file.id) return;

        setLoading(file.uid, true);

        try {
            const response = await fetch(`${url}/download/${file.id}`);

            if (!response.ok) throw new Error();

            const blob = await response.blob();

            const downloadUrl = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = file.name;
            a.click();

            window.URL.revokeObjectURL(downloadUrl);
        } catch {
            message.error("Download thất bại");
        } finally {
            setLoading(file.uid, false);
        }
    };
    return (
        <Upload
            customRequest={customUpload}
            fileList={fileList}
            disabled={disabled}
            multiple
            onPreview={(file: UploadedFile) => {
                if (file.status === "uploading") return;
                window.open(file.url, "_blank");
            }}
            itemRender={(originNode, file: any) => {
                const f = file as UploadedFile;

                return (
                    <div
                        style={{
                            opacity: f.status === "uploading" ? 0.5 : 1,
                            pointerEvents: f.status === "uploading" ? "none" : "auto"
                        }}
                    >
                        {originNode}
                    </div>
                );
            }}
            showUploadList={{
                showDownloadIcon: !disabled,

                // REMOVE ICON có loading
                removeIcon: (file) => {
                    const isLoading = loadingMap[file.uid];

                    return isLoading ? (
                        <Tooltip title="Đang xử lý...">
                            <Spin size="small" />
                        </Tooltip>
                    ) : (
                        <Tooltip title="Xóa tệp đính kèm">
                            <DeleteOutlined />
                        </Tooltip>
                    );
                },

                // DOWNLOAD ICON
                downloadIcon: (file) => {
                    const isLoading = loadingMap[file.uid];

                    return isLoading ? (
                        <Tooltip title="Đang xử lý...">
                            <Spin size="small" />
                        </Tooltip>
                    ) : (
                        <Tooltip title="Tải xuống">
                            <DownloadOutlined />
                        </Tooltip>
                    );
                }
            }}
            onRemove={async (file) => {
                if (loadingMap[file.uid]) return;
                const result = await confirmService.confirm('Thông báo', 'Bạn có muốn xóa tệp đính kèm này')
                if (result) {
                    handleRemove(file as UploadedFile);
                }
            }}
            onDownload={(file) => {
                if (loadingMap[file.uid]) return;
                handleDownload(file as UploadedFile);
            }}
        >
            <Button icon={<UploadOutlined />} disabled={disabled}>
                Click to Upload
            </Button>
        </Upload>
    );
};