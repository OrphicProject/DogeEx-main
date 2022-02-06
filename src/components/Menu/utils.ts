import { MenuEntry } from '@pancakeswap/uikit'

export const getActiveMenuItem = ({ pathname, menuConfig }: { pathname: string; menuConfig: MenuEntry[] }) =>
  menuConfig.find((menuItem) => pathname.includes(menuItem.href) || getActiveSubMenuItem({ menuItem, pathname }))

export const getActiveSubMenuItem = ({ pathname, menuItem }: { pathname: string; menuItem?: MenuEntry }) =>
  menuItem?.items?.find((subMenuItem) => pathname.includes(subMenuItem.href))
