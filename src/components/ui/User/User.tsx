import { Avatar, Dropdown, type MenuProps } from "antd"
import { useAppSelector } from "../../../redux/hooks";
const items: MenuProps['items'] = [
    {
        label: 'Thông tin tài khoản',
        key: '0',
    },
    {
        label: 'Cài đặt',
        key: '1',
    },
    {
        type: 'divider',
    },
    {
        label: 'Đăng xuất',
        key: '3',
    },
];
export const User = () => {
    const user = useAppSelector(x => x.user);
    const { isAuthenticated } = useAppSelector(x => x.auth);
    return (
        <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    cursor: 'pointer',
                    maxWidth: 200,
                }}
            >
                <Avatar
                    size={42}
                    src={
                        <img
                            draggable={false}
                            src={
                                user.anh_dai_dien ? user.anh_dai_dien :
                                    'https://res.cloudinary.com/drhdgw1xx/image/upload/v1775572508/624160754_1571978107342366_7527978856429040370_n_wftvvn.jpg'
                            }
                            alt="avatar"
                        />
                    }
                />

                <div
                    style={{
                        flex: 1,
                        minWidth: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        lineHeight: 1.2,
                    }}
                >
                    <span
                        style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            fontWeight: 600,
                        }}
                    >
                        {user.ten_day_du}
                        {/* Phạm Khắc Huy */}
                    </span>

                    <span
                        style={{
                            fontSize: 12,
                            color: '#8c8c8c',
                        }}
                    >
                        {isAuthenticated ? <>🟢 Online</> : <>🔴 Offline</>}
                    </span>
                </div>
            </div>
        </Dropdown>
    )
}