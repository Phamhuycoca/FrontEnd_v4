import { Button, Spin, Tooltip, Upload, message } from "antd";
import React, { useEffect, useState } from "react";
import {
    DeleteOutlined,
    DownloadOutlined,
    UploadOutlined
} from "@ant-design/icons";
import confirmService from "../../../utils/services/confirm-service";

interface IUploadProps {
    disabled?: boolean;
    multiple?: boolean;
    editMode?: boolean;
    value?: UploadedFile[];
    onChange?: (value: string | string[] | null) => void;
}

interface UploadedFile {
    uid: string;
    name: string;
    status: "done" | "error" | "uploading";
    id?: string;
    url?: string;
}

export const IUpload: React.FC<IUploadProps> = ({
    disabled = false,
    multiple = false,
    editMode = false,
    value = [],
    onChange
}) => {
    const url = "http://localhost:5110/api/file";

    const [fileList, setFileList] = useState<UploadedFile[]>([]);
    const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

    // ================= SYNC EDIT MODE =================
    useEffect(() => {
        if (editMode && value?.length) {
            const normalized = value.map((f, index) => ({
                uid: f.uid || f.id || `${index}`,
                name: f.name || "file",
                status: "done" as const,
                id: f.id,
                url: f.url
            }));
            setFileList(normalized);
        }
    }, [editMode, value]);

    const emitChange = (list: UploadedFile[]) => {
        const newList = multiple ? list : list.slice(0, 1);

        setFileList(newList);

        const result = multiple
            ? newList.map(x => x.id).filter(Boolean)
            : newList[0]?.id || null;

        onChange?.(result);
    };

    const setLoading = (uid: string, val: boolean) => {
        setLoadingMap(prev => ({ ...prev, [uid]: val }));
    };

    // ================= UPLOAD =================
    const customUpload = async (options: any) => {
        const { file, onSuccess, onError } = options;

        const tempFile: UploadedFile = {
            uid: file.uid,
            name: file.name,
            status: "uploading"
        };

        const newList = multiple ? [...fileList, tempFile] : [tempFile];
        emitChange(newList);

        setLoading(file.uid, true);

        const formData = new FormData();
        formData.append("files", file);

        try {
            const res = await fetch(url, {
                method: "POST",
                body: formData
            });

            if (!res.ok) throw new Error();

            const result = await res.json();

            const updated = newList.map(f =>
                f.uid === file.uid
                    ? {
                        ...f,
                        status: "done" as const,
                        id: result.data[0].id,
                        url: result.data[0].file_path
                    }
                    : f
            );

            emitChange(updated);

            message.success(`${file.name} upload thành công`);
            onSuccess("ok");
        } catch (err) {
            const failed = multiple
                ? newList.filter(f => f.uid !== file.uid)
                : [];

            emitChange(failed);

            message.error(`${file.name} upload thất bại`);
            onError(err);
        } finally {
            setLoading(file.uid, false);
        }
    };

    // ================= REMOVE =================
    const handleRemove = async (file: UploadedFile) => {
        if (!file.id) return;

        setLoading(file.uid, true);

        try {
            const res = await fetch(`${url}/${file.id}`, {
                method: "DELETE"
            });

            if (!res.ok) throw new Error();

            const newList = fileList.filter(x => x.id !== file.id);
            emitChange(newList);

            message.success("Xóa thành công");
        } catch {
            message.error("Xóa thất bại");
        } finally {
            setLoading(file.uid, false);
        }
    };

    // ================= DOWNLOAD =================
    const handleDownload = async (file: UploadedFile) => {
        if (!file.id) return;

        setLoading(file.uid, true);

        try {
            const res = await fetch(`${url}/download/${file.id}`);
            if (!res.ok) throw new Error();

            const blob = await res.blob();
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

    // ================= UI =================
    return (
        <Upload
            customRequest={customUpload}
            fileList={fileList}
            disabled={disabled}
            multiple={multiple}
            maxCount={multiple ? undefined : 1}
            onPreview={(file: UploadedFile) => {
                if (file.status === "uploading") return;
                if (file.url) window.open(file.url, "_blank");
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

                removeIcon: (file) => {
                    const loading = loadingMap[file.uid];

                    return loading ? (
                        <Spin size="small" />
                    ) : (
                        <Tooltip title="Xóa">
                            <DeleteOutlined />
                        </Tooltip>
                    );
                },

                downloadIcon: (file) => {
                    const loading = loadingMap[file.uid];

                    return loading ? (
                        <Spin size="small" />
                    ) : (
                        <Tooltip title="Tải xuống">
                            <DownloadOutlined />
                        </Tooltip>
                    );
                }
            }}
            onRemove={async (file) => {
                if (loadingMap[file.uid]) return;

                const ok = await confirmService.confirm(
                    "Thông báo",
                    "Bạn có muốn xóa file này?"
                );

                if (ok) {
                    await handleRemove(file as UploadedFile);
                }
            }}
            onDownload={(file) => {
                if (loadingMap[file.uid]) return;
                handleDownload(file as UploadedFile);
            }}
        >
            {!disabled ?
                <Button icon={<UploadOutlined />}>
                    Tải tệp đính kèm
                </Button> : null
            }
        </Upload>
    );
};