import { Menu, type MenuProps } from "antd";
import type { MenuResponse } from "../../../types/AuthType";
import { useAppSelector } from "../../../redux/hooks";
import { useEffect } from "react";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { Icon } from "../Icon";

export const MenuComponent = () => {
    const menu = useAppSelector(state => state.auth.menu);
    const navigate = useNavigate();
    useEffect(() => {
    }, [menu]);
    const mapMenuToAntd = (
        menus: MenuResponse[]
    ): MenuProps["items"] => {
        return (_.orderBy(menus, ['so_thu_tu'], ['asc']).map((item) => ({
            key: item.duong_dan,
            label: item.ten,
            icon: item.icon ? <Icon icon={item.icon} /> : undefined,
            children: item.children?.length
                ? mapMenuToAntd(item.children)
                : undefined
        })));
    };
    return (
        <Menu
            theme="light"
            defaultSelectedKeys={['1']}
            mode="inline"
            items={mapMenuToAntd(menu)}
            onClick={(e) => {
                navigate(e.key);
            }}
        />
    )
}